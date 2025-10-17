import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Exist from '../../assets/images/1.svg';
import DropDownIcon from '../../assets/images/downarrow.svg';
import UpDownIcon from '../../assets/images/arrowup.svg';
import {styles} from '../Global/Global';
import SaveImg from '../../assets/images/save.svg';
import RadioButton from './RadioButton';
import {useSelector} from 'react-redux';
import Photo from '../../assets/images/photo.svg';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import NetInfo from '@react-native-community/netinfo';
import {
  createOfflineRemoveTable,
  getExistingSignAuditImagesByKey,
  insertExistingSignAuditImagesOnly,
  insertOfflineRemove,
  updateExistingSignAudit,
} from '../Db/LocalData.tsx';
import {
  openEditorforUpdate,
  showPhotoOptions,
} from '../Functions/ImagePickFunctions.tsx';
import {
  deleteFolders,
  getBase64Array,
  getPath,
} from '../Functions/FSfunctions.tsx';

const ExistingAuditProject = ({handleFetchData}) => {
  const projectTitle = useSelector(state => state.projecttitle.value);
  const baseUrl = useSelector(state => state.baseUrl.value);
  const loginData = useSelector(state => state.login.value);
  const signProjectData = useSelector(state => state.signProject.value);
  const [loadingImage, setLoadingImage] = useState(false);
  const [active, setActive] = useState('');
  const [existingSignAuditSummaryNotes, setExistingSignAuditSummaryNotes] =
    useState(
      signProjectData?.existing_sign_audit?.existingSignAuditSummaryNotes,
    );
  const [existingSignAuditTodoPunchList, setExistingSignAuditTodoPunchList] =
    useState(
      signProjectData?.existing_sign_audit?.existingSignAuditTodoPunchList,
    );

  const [
    existingSignAuditDocumentSignCondition,
    setExistingSignAuditDocumentSignCondition,
  ] = useState(
    signProjectData?.existing_sign_audit
      ?.existingSignAuditDocumentSignCondition,
  );

  const [selectedOptions, setSelectedOptions] = useState({
    existingSignAuditPhotos:
      signProjectData?.existing_sign_audit?.existingSignAuditPhotos,
    Id:
      signProjectData?.existing_sign_audit?.id ||
      signProjectData?.existing_sign_audit?.Id,
    projectId: signProjectData?.existing_sign_audit?.projectId,
    signId: signProjectData?.existing_sign_audit?.signId,
    optionId: signProjectData?.existing_sign_audit?.optionId,
    teamId: loginData?.userId,
    adminId: loginData?.userId,
    customerName: signProjectData?.existing_sign_audit?.customerName,
    surveyModule: '',
    existingSignAuditTodoPunchList: existingSignAuditTodoPunchList,
    existingSignAuditPhoto:
      signProjectData?.existing_sign_audit?.existingSignAuditPhoto || [],
    existingSignAuditDocumentSignCondition:
      signProjectData?.existing_sign_audit
        ?.existingSignAuditDocumentSignCondition,
    isThisReplacementSign:
      signProjectData?.existing_sign_audit?.isThisReplacementSign,
    oldSignStillPresent:
      signProjectData?.existing_sign_audit?.oldSignStillPresent,
    electricSubcontractor:
      signProjectData?.existing_sign_audit?.electricSubcontractor,
    isElectricalPresentSign:
      signProjectData?.existing_sign_audit?.isElectricalPresentSign,
    removalScheduled: signProjectData?.existing_sign_audit?.removalScheduled,
    isTheSignIlluminated:
      signProjectData?.existing_sign_audit?.isTheSignIlluminated,
    existingSignAuditSummaryNotes: existingSignAuditSummaryNotes,
  });

  const data = [
    {
      question: 'Is this a replacement sign?',
      options: ['Yes', 'No'],
      value: 'isThisReplacementSign',
      selectedValue:
        signProjectData?.existing_sign_audit?.isThisReplacementSign,
    },
    {
      question: 'Old Sugn Still Present Y/N',
      options: ['Yes', 'No'],
      value: 'oldSignStillPresent',
      selectedValue: signProjectData?.existing_sign_audit?.oldSignStillPresent,
    },
    {
      question: 'is This Sign Illuminated?',
      options: ['Yes', 'No'],
      value: 'isTheSignIlluminated',
      selectedValue: signProjectData?.existing_sign_audit?.isTheSignIlluminated,
    },
    {
      question: 'Removal Scheduled (Y/N)',
      options: ['Yes', 'No'],
      value: 'removalScheduled',
      selectedValue: signProjectData?.existing_sign_audit?.removalScheduled,
    },
  ];

  const handleRemoveImage = async (
    imageId1,
    fieldName1,
    actualKey,
    path,
    isLocalImageRemove,
  ) => {
    try {
      setLoadingImage(true);
      if (isLocalImageRemove) {
        const updatedArray = selectedOptions?.[fieldName1]?.filter(
          item => item.ImageId !== imageId1,
        );
        // console.log('IMAGESSSARRAYY', imagesArray);
        await insertExistingSignAuditImagesOnly(
          signProjectData?.signTableId,
          fieldName1,
          updatedArray,
          0,
        );
        const imagesaRRAY = await getExistingSignAuditImagesByKey(
          signProjectData?.signTableId,
          fieldName1,
        );
        setSelectedOptions(prev => ({
          ...prev,
          [fieldName1]: imagesaRRAY || [],
        }));
        const fullPath = await getPath(path);
        await RNFS.unlink(
          fullPath.startsWith('file://')
            ? fullPath.replace('file://', '')
            : fullPath,
        );
        return;
      }
      const data = {
        imageId: imageId1,
        Id:
          signProjectData?.existing_sign_audit?.id ||
          signProjectData?.existing_sign_audit?.Id,
        fieldName: fieldName1,
        surveyModule: 'existing_sign_audit',
        moduleId: signProjectData?.signId,
      };
      const netState = await NetInfo.fetch();
      const isConnected = netState.isConnected;
      if (isConnected) {
        const token = loginData?.tokenNumber;
        const response = await axios.post(`${baseUrl}/removeFile`, data, {
          headers: {Authorization: `Bearer ${token}`},
        });

        if (response.data.status) {
          const previousImages = selectedOptions?.[actualKey] || [];
          for (const item of previousImages) {
            try {
              if (item?.path) {
                const storedPath = await getPath(item.path);
                const cleanedPath = storedPath.startsWith('file://')
                  ? storedPath.replace('file://', '')
                  : storedPath;
                await RNFS.unlink(cleanedPath);
                console.log('image removeddd', item.path);
              }
            } catch (err) {
              console.log('FILE REMOVEDDD', err);
            }
          }
          const imagesArray = response?.data?.data[actualKey] || [];
          // console.log('IMAGESSSARRAYY', imagesArray);
          await insertExistingSignAuditImagesOnly(
            signProjectData?.signTableId,
            actualKey,
            imagesArray,
            1,
          );
          const imagesaRRAY = await getExistingSignAuditImagesByKey(
            signProjectData?.signTableId,
            actualKey,
          );
          // console.log('IMAGESARRAYAFTERINSERT', imagesaRRAY);
          setSelectedOptions(prev => {
            return {
              ...prev,
              [actualKey]: imagesaRRAY || [],
            };
          });
        }
      } else {
        createOfflineRemoveTable();
        const imagesArray = selectedOptions?.[actualKey]?.filter(
          item => item.imageId !== imageId1,
        );
        // console.log('IMAGESSSARRAYY', imagesArray);
        await insertExistingSignAuditImagesOnly(
          signProjectData?.signTableId,
          actualKey,
          imagesArray,
          0,
        );
        const imagesaRRAY = await getExistingSignAuditImagesByKey(
          signProjectData?.signTableId,
          actualKey,
        );
        // console.log('IMAGESARRAYAFTERINSERT', imagesaRRAY);
        setSelectedOptions(prev => {
          return {
            ...prev,
            [actualKey]: imagesaRRAY || [],
          };
        });
        insertOfflineRemove(data);
        const fullPath = await getPath(path);
        console.log('full path', fullPath);
        await RNFS.unlink(`file://${fullPath}`);
      }
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);

      console.log('Failed to remove online: stored offline for sync');
    } finally {
      setTimeout(() => setLoadingImage(false), 1000);
    }
  };

  const handleSave = async () => {
    setLoadingImage(true);
    let base64s = [];
    const netState = await NetInfo.fetch();
    const isConnected = netState.isConnected;
    if (isConnected) {
      base64s = await getBase64Array(
        selectedOptions?.existingSignAuditPhoto || [],
      );
    } else {
      base64s = selectedOptions?.existingSignAuditPhoto || [];
    }
    const bodyData = {
      ...selectedOptions,
      existingSignAuditPhoto: base64s,
      existingSignAuditSummaryNotes,
      existingSignAuditTodoPunchList,
      existingSignAuditDocumentSignCondition,
      signAliasName: signProjectData?.signAliasName,
      signType: signProjectData?.signType,
    };
    // console.log('EXISTING BODY DATA::::', bodyData);
    try {
      if (isConnected) {
        const token = loginData?.tokenNumber;
        const response = await axios.post(
          `${baseUrl}/updateExistingSignAudit`,
          bodyData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        // console.log('EXISITING SIGN API RESPONSE:::', response.data);
        if (response?.data?.status) {
          await deleteFolders();
          const existingCachePhotos =
            selectedOptions?.existingSignAuditPhoto || [];
          for (const file of existingCachePhotos) {
            try {
              const fileExists = await RNFS.exists(file.path);
              if (fileExists) {
                await RNFS.unlink(file.path);
                console.log('FILE REMOVED');
              }
              console.log(file.path, 'exists?', fileExists);
            } catch (err) {
              console.log('Error checking file:', file.path, err);
            }
          }
          handleFetchData(null, signProjectData);
          Toast.show({
            type: 'success',
            text1: response?.data?.message || 'Audit saved successfully.',
            visibilityTime: 3000,
            position: 'top',
          });
        } else {
          throw new Error('Sync failed with unknown server response.');
        }
      } else {
        updateExistingSignAudit(bodyData, 0);
        handleFetchData(null, signProjectData);
        Toast.show({
          type: 'info',
          text1: 'Saved Offline. Will sync later.',
          visibilityTime: 3000,
          position: 'top',
        });
      }
    } catch (error) {
      console.log(' API Sync failed. Will still save locally.');
      console.log('Error:', error?.response?.data || error?.message);
    } finally {
      if (isConnected) {
        setLoadingImage(false);
      } else {
        setTimeout(() => {
          setLoadingImage(false);
        }, 1200);
      }
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (active === '') {
            setActive('Audit');
          } else {
            setActive('');
          }
        }}
        style={styles.container}>
        <View style={styles.iconWrapper}>
          <Exist width={30} height={30} />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.projectName}>
            {projectTitle || 'Project Name'}
          </Text>
          <Text style={styles.auditTitle}>Exist Sign Audit</Text>
          <Text style={styles.projectName}>
            {signProjectData?.existing_sign_audit?.signType ||
              'Digital indoor free standing'}
          </Text>
        </View>
        <View style={styles.dropdownIconWrapper}>
          {active === 'Audit' ? (
            <UpDownIcon width={39} height={39} />
          ) : (
            <DropDownIcon width={39} height={39} />
          )}
        </View>
      </TouchableOpacity>
      <View style={{marginTop: -8}}>
        {active === 'Audit' && (
          <View style={[styles.card, {borderColor: '#4E525F'}]}>
            <View style={[styles.headerSection, {backgroundColor: '#F7F9FC'}]}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  borderBottomWidth: 0.5,
                  borderColor: '#B3B7BE',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  paddingBottom: 8,
                }}>
                <View style={styles.titleSection}>
                  <Text style={styles.titleText}>Existing sign audit</Text>
                  <Text style={styles.subTitleText}>Special instructions</Text>
                </View>
                <Text style={styles.authorText}>
                  {signProjectData?.existing_sign_audit?.adminName}
                </Text>
              </View>
              <View style={styles.instructionsSection}>
                <Text style={styles.instructionText}>
                  Be sure to document the condition of this replacement sign.
                </Text>
                <Text style={styles.dateText}>
                  {signProjectData?.existing_sign_audit?.createdDate?.slice(
                    0,
                    10,
                  )}
                </Text>
              </View>
            </View>
            <View style={styles.radioSection}>
              <Text style={styles.radioQuestionText}>{data[0].question}</Text>
              <View style={styles.radioGroup}>
                {data[0].options.map((option, index) => (
                  <RadioButton
                    key={index}
                    label={option}
                    value={option}
                    selected={selectedOptions[data[0].value] ?? ''}
                    onPress={value1 => {
                      setSelectedOptions(prev => {
                        const current =
                          prev?.[data[0].value]?.toLowerCase?.() || '';
                        const incoming = value1.toLowerCase();
                        return {
                          ...prev,
                          [data[0].value]: current === incoming ? '' : value1,
                        };
                      });
                    }}
                  />
                ))}
              </View>
            </View>
            {(selectedOptions[data[0].value] === 'yes' ||
              selectedOptions[data[0].value] === 'Yes') && (
              <View>
                <FlatList
                  data={data.slice(1)}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <View>
                      <View style={styles.radioSection}>
                        <Text style={styles.radioQuestionText}>
                          {item.question}
                        </Text>
                        <View style={styles.radioGroup}>
                          {item.options.map((option, index) => (
                            <RadioButton
                              key={index}
                              label={option}
                              value={option}
                              selected={selectedOptions[item.value] ?? ''}
                              onPress={value1 => {
                                setSelectedOptions(prev => {
                                  const current =
                                    prev?.[item?.value]?.toLowerCase?.() || '';
                                  const incoming = value1.toLowerCase();
                                  return {
                                    ...prev,
                                    [item?.value]:
                                      current === incoming ? '' : value1,
                                  };
                                });
                              }}
                            />
                          ))}
                        </View>
                      </View>
                      {item.question === 'is This Sign Illuminated?' && (
                        <View style={{marginBottom: 12}}>
                          <TextInput
                            placeholder="Document Sign Condition"
                            style={{
                              fontSize: 16,
                              fontFamily: 'Barlow-Regular',
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              borderWidth: 1,
                              borderColor: '#E0E3E7',
                              borderRadius: 4,
                              marginBottom: 24,
                              height: 50,
                            }}
                            value={existingSignAuditDocumentSignCondition || ''}
                            onChangeText={
                              setExistingSignAuditDocumentSignCondition
                            }
                          />
                          <TouchableOpacity
                            style={styles.imageCon}
                            onPress={() => {
                              showPhotoOptions(
                                setSelectedOptions,
                                'existingSignAuditPhoto',
                                'ExistingAudit',
                                false,
                              );
                            }}>
                            <View style={styles.photoButton}>
                              <Text style={styles.photoText}>add photo</Text>
                              <Photo />
                            </View>
                            <View style={styles.fileNameContainer}>
                              <Text style={styles.fileNameText}>
                                {selectedOptions?.existingSignAuditPhoto
                                  ?.length > 0
                                  ? `${selectedOptions?.existingSignAuditPhoto?.length} File Choosen`
                                  : 'No File Choosen'}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginVertical: 15,
                              gap: 15,
                              flexWrap: 'wrap',
                            }}>
                            {loadingImage ? (
                              <ActivityIndicator size="small" color="#FF9239" />
                            ) : (
                              (() => {
                                const mergedImages = [
                                  ...(selectedOptions?.existingSignAuditPhoto?.map(
                                    item => ({...item, isLocal: true}),
                                  ) || []),
                                  ...(selectedOptions?.existingSignAuditPhotos?.map(
                                    item => ({...item, isLocal: false}),
                                  ) || []),
                                ];
                                console.log('MERGED ARRAYS', mergedImages);
                                if (mergedImages.length === 0) return null;
                                return mergedImages.map((item, index) => (
                                  <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                      if (item.isLocal) {
                                        openEditorforUpdate(
                                          item.path,
                                          setSelectedOptions,
                                          'existingSignAuditPhoto',
                                          'ExistingAudit',
                                          true,
                                          item.ImageId,
                                          baseUrl,
                                          loginData?.tokenNumber,
                                          true,
                                          signProjectData?.existing_sign_audit
                                            ?.id ||
                                            signProjectData?.existing_sign_audit
                                              ?.Id,
                                          'existing_sign_audit',
                                          true,
                                          selectedOptions,
                                        );
                                      } else {
                                        openEditorforUpdate(
                                          item.path,
                                          setSelectedOptions,
                                          'existingSignAuditPhotos',
                                          'ExistingAudit',
                                          true,
                                          item.imageId,
                                          baseUrl,
                                          loginData?.tokenNumber,
                                          true,
                                          signProjectData?.existing_sign_audit
                                            ?.id ||
                                            signProjectData?.existing_sign_audit
                                              ?.Id,
                                          'existing_sign_audit',
                                          false,
                                          selectedOptions,
                                        );
                                      }
                                    }}>
                                    <View style={styles.imageContainer}>
                                      <Image
                                        source={{
                                          uri: item?.path?.startsWith('file://')
                                            ? item?.path
                                            : `file://${item?.path}`,
                                        }}
                                        style={styles.image}
                                      />
                                      <TouchableOpacity
                                        onPress={() => {
                                          if (!item.isLocal) {
                                            handleRemoveImage(
                                              item.imageId,
                                              'existingSignAuditPhoto',
                                              'existingSignAuditPhotos',
                                              item.path,
                                              false,
                                            );
                                          } else {
                                            handleRemoveImage(
                                              item.ImageId,
                                              'existingSignAuditPhoto',
                                              'existingSignAuditPhotos',
                                              item.path,
                                              true,
                                            );
                                          }
                                        }}
                                        style={styles.removeButton}>
                                        <Text style={styles.removeButtonText}>
                                          ×
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </TouchableOpacity>
                                ));
                              })()
                            )}
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                />
              </View>
            )}
            <View>
              <View style={styles.section}>
                <Text style={styles.label}>To do / punch list</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, {height: 100}]}
                  maxLength={300}
                  placeholder="To do / punch list"
                  multiline={true}
                  textAlignVertical="top"
                  value={existingSignAuditTodoPunchList}
                  onChangeText={setExistingSignAuditTodoPunchList}
                />
                <Text style={{textAlign: 'right', marginTop: 5}}>
                  {existingSignAuditTodoPunchList?.length}/300
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.label}>Summary Notes</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, {height: 100}]}
                  multiline={true}
                  textAlignVertical="top"
                  placeholder="Notes"
                  value={existingSignAuditSummaryNotes}
                  onChangeText={setExistingSignAuditSummaryNotes}
                />
                <Text style={{textAlign: 'right', marginTop: 5}}>
                  {existingSignAuditSummaryNotes?.length}/300
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.saveButton, loadingImage && {opacity: 0.6}]}
              onPress={handleSave}
              disabled={loadingImage}>
              {loadingImage ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <SaveImg width={28} height={28} />
                  <Text style={styles.saveButtonText}>Save Section</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dropdownIconWrapper,
                {alignSelf: 'flex-end', marginTop: 34},
              ]}
              onPress={() => setActive('')}>
              <UpDownIcon width={39} height={39} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default ExistingAuditProject;
