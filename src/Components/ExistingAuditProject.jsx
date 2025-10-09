import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Exist from '../../assets/images/1.svg';
import DropDownIcon from '../../assets/images/downarrow.svg';
import UpDownIcon from '../../assets/images/arrowup.svg';
import {styles} from '../Global/Global';
import SaveImg from '../../assets/images/save.svg';
import RadioButton from './RadioButton';
import {useSelector} from 'react-redux';
import Photo from '../../assets/images/photo.svg';
import axios from 'axios';
import {handleAddPhoto, useNetworkStatus} from '../Functions/functions.js';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import NetInfo from '@react-native-community/netinfo';
import {
  createOfflineRemoveTable,
  insertExistingSignAudit,
  insertOfflineRemove,
  updateExistingSignAudit,
} from '../Db/LocalData.tsx';
import {
  openEditor,
  openEditorforUpdate,
  showPhotoOptions,
} from '../Functions/ImagePickFunctions.tsx';
import {
  deleteFolders,
  getBase64Array,
  getPath,
} from '../Functions/FSfunctions.tsx';

const ExistingAuditProject = ({handleFetchData}) => {
  const allData = useSelector(state => state.allData.value);
  const status = useNetworkStatus();
  const baseUrl = useSelector(state => state.baseUrl.value);
  const loginData = useSelector(state => state.login.value);
  const signProjectData = useSelector(state => state.signProject.value);
  const [loadingImage, setLoadingImage] = useState(true);
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

  // console.log('selectedOptions', selectedOptions);

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

  const handleRemoveImage = async (imageId1, fieldName1, dummy, path) => {
    console.log('REMOVINGGGGGGGG');
    try {
      setLoadingImage(true);
      const data = {
        imageId: imageId1,
        Id:
          signProjectData?.existing_sign_audit?.id ||
          signProjectData?.existing_sign_audit?.Id,
        fieldName: fieldName1,
        surveyModule: 'existing_sign_audit',
        moduleId: signProjectData?.existing_sign_audit?.id,
      };

      const netState = await NetInfo.fetch();
      const isConnected = netState.isConnected;

      if (isConnected) {
        const token = loginData?.tokenNumber;
        const response = await axios.post(`${baseUrl}/removeFile`, data, {
          headers: {Authorization: `Bearer ${token}`},
        });

        if (response.data.status) {
          setSelectedOptions(prev => ({
            ...prev,
            existingSignAuditPhotos:
              response.data.data?.existingSignAuditPhotos,
          }));
          const fullPath = await getPath(path);
          await RNFS.unlink(fullPath);
          await handleFetchData(null, signProjectData);
          setActive('Audit');
        }
      } else {
        createOfflineRemoveTable();
        insertOfflineRemove(data);
        const fullPath = await getPath(path);
        console.log('FULLLPATHHH:::', fullPath);
        await RNFS.unlink(`file://${fullPath}`);
        console.log('Device offline: remove request stored locally');
      }
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
      createOfflineRemoveTable();
      insertOfflineRemove(data);
      const fullPath = await getPath(path);
      await RNFS.unlink(fullPath);
      console.log('Failed to remove online: stored offline for sync');
    } finally {
      setTimeout(() => setLoadingImage(false), 1000);
    }
  };

  const handleSave = async () => {
    console.log('savinggg....');
    setLoadingImage(true);

    const base64s = await getBase64Array(
      selectedOptions.existingSignAuditPhoto,
    );

    const bodyData = {
      ...selectedOptions,
      existingSignAuditPhoto: base64s,
      existingSignAuditSummaryNotes,
      existingSignAuditTodoPunchList,
      existingSignAuditDocumentSignCondition,
      signAliasName: signProjectData?.signAliasName,
      signType: signProjectData?.signType,
    };
    console.log('EXISTING BODY DATA::::', bodyData);
    try {
      if (status) {
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
        console.log('EXISITING SIGN API RESPONSE:::', response.data);
        if (response?.data?.status) {
          await deleteFolders();
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
      if (status) {
        setLoadingImage(false);
      } else {
        setTimeout(() => {
          setLoadingImage(false);
        }, 1200);
      }
    }
  };

  const fetchData = () => {
    // console.log('FETCHINGGGG');
    // insertExistingSignAudit(allData);
    // console.log('ALL DATA', allData);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoadingImage(false);
    }, 800);
  }, [loadingImage]);
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (active === '') {
            setActive('Audit');
            fetchData();
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
            {signProjectData?.existing_sign_audit?.projectTitle ||
              'Project Name'}
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
                              selectedOptions?.existingSignAuditPhotos?.length >
                                0 &&
                              selectedOptions?.existingSignAuditPhotos?.map(
                                (item, index) => {
                                  console.log(
                                    'arrayimages',
                                    selectedOptions?.existingSignAuditPhotos,
                                  );
                                  console.log('itemitemitemitem', item);
                                  console.log(
                                    'FINAL URI:',
                                    item.path.startsWith('file://')
                                      ? item.path
                                      : `file://${item.path}`,
                                  );
                                  return (
                                    <TouchableOpacity
                                      key={index}
                                      onPress={() => {
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
                                          selectedOptions?.signId,
                                        );
                                      }}>
                                      <View
                                        key={index}
                                        style={styles.imageContainer}>
                                        <Image
                                          source={{
                                            uri: item.path.startsWith('file://')
                                              ? item.path
                                              : `file://${item.path}`,
                                          }}
                                          style={styles.image}
                                        />
                                        <TouchableOpacity
                                          onPress={() =>
                                            handleRemoveImage(
                                              item.imageId,
                                              'electricalAuditPhoto',
                                              'electricalAuditPhotos',
                                              item.path,
                                            )
                                          }
                                          style={styles.removeButton}>
                                          <Text style={styles.removeButtonText}>
                                            ×
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                    </TouchableOpacity>
                                  );
                                },
                              )
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
