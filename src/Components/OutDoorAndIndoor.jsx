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
import {styles} from '../Global/Global';
import Photo from '../../assets/images/photo.svg';
import Exist from '../../assets/images/4.svg';
import DropDownIcon from '../../assets/images/downarrow.svg';
import UpDownIcon from '../../assets/images/arrowup.svg';
import RadioButton from './RadioButton';
import SaveImg from '../../assets/images/save.svg';
import {useSelector} from 'react-redux';
import Collapsible from 'react-native-collapsible';
import Down from '../../assets/images/down.svg';
import Up from '../../assets/images/arrow.svg';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {handleAddPhoto, useNetworkStatus} from '../Functions/functions';
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';

import {
  createOfflineRemoveTable,
  getSignGeneralAuditImagesByKey,
  insertOfflineRemove,
  insertSignGeneralAuditImagesOnly,
  updateSignGeneralAudit,
} from '../Db/LocalData';
import {
  openEditorforUpdate,
  showPhotoOptions,
} from '../Functions/ImagePickFunctions';
import {deleteFolders, getBase64Array, getPath} from '../Functions/FSfunctions';
const OutDoor = ({handleFetchData}) => {
  const projectTitle = useSelector(state => state.projecttitle.value);
  const status = useNetworkStatus();
  const baseUrl = useSelector(state => state.baseUrl.value);
  const loginData = useSelector(state => state.login.value);
  const signProjectData = useSelector(state => state.signProject.value);
  const [active, setActive] = useState('');
  const [state, setState] = useState(null);
  const [signGeneralAuditTodoPunchList, setSignGeneralAuditTodoPunchList] =
    useState(
      signProjectData?.sign_general_audit?.signGeneralAuditTodoPunchList,
    );
  const [signGeneralAuditSummaryNotes, setSignGeneralAuditSummaryNotes] =
    useState(signProjectData?.sign_general_audit?.signGeneralAuditSummaryNotes);
  const [
    signGeneralAuditDocumentAccessibilityIssues,
    setSignGeneralAuditDocumentAccessibilityIssues,
  ] = useState(
    signProjectData?.sign_general_audit
      ?.signGeneralAuditDocumentAccessibilityIssues,
  );

  console.log(
    'signProjectData?.sign_general_audit',
    signProjectData.sign_general_audit,
  );

  const [inputFields, setInputFields] = useState([
    {
      placeholder: 'General Description of placement of sign',
      value:
        signProjectData?.sign_general_audit
          ?.generalDescriptionOfPlacementOfSign || '',
      setToValue: 'generalDescriptionOfPlacementOfSign',
    },
    {
      placeholder: 'Channel Letter Material',
      value: signProjectData?.sign_general_audit?.channelLetterMaterial || '',
      setToValue: 'channelLetterMaterial',
    },
    {
      placeholder: 'Color or Existing Color Match',
      value:
        signProjectData?.sign_general_audit?.colorOrExistingColorMatch || '',
      setToValue: 'colorOrExistingColorMatch',
    },
    {
      placeholder: 'Copy Type or Style?',
      value: signProjectData?.sign_general_audit?.copyTypeOrStyle || '',
      setToValue: 'copyTypeOrStyle',
    },
    {
      placeholder: 'Material Thickness',
      value: signProjectData?.sign_general_audit?.materialThickness || '',
      setToValue: 'materialThickness',
    },
    {
      placeholder: 'Wall or Substrate Type',
      value: signProjectData?.sign_general_audit?.wallOrSubstrateType || '',
      setToValue: 'wallOrSubstrateType',
    },
    {
      placeholder: 'Document Substrate Condition',
      value:
        signProjectData?.sign_general_audit?.documentSubstrateCondition || '',
      setToValue: 'documentSubstrateCondition',
    },
    {
      placeholder: 'Attachment Type?',
      value: signProjectData?.sign_general_audit?.attachmentType || '',
      setToValue: 'attachmentType',
    },
    {
      placeholder: 'Size of Ladder or Lift',
      value: signProjectData?.sign_general_audit?.sizeOfLadderOrLift || '',
      setToValue: 'sizeOfLadderOrLift',
    },
  ]);

  const data = [
    {
      question: 'Any Accessibility Obstructions?',
      options: ['Yes', 'No'],
      selectedValue:
        signProjectData?.sign_general_audit?.anyAccessibilityObstructions,
      value: 'anyAccessibilityObstructions',
    },
    {
      question: 'RaceWay or Flush?',
      options: ['RaceWay', 'Flush'],
      selectedValue: signProjectData?.sign_general_audit?.racewayOrFlush,
      value: 'racewayOrFlush',
    },
    {
      question: 'Site covered?',
      options: ['Covered', 'Not covered'],
      selectedValue: signProjectData?.sign_general_audit?.siteCovered,
      value: 'siteCovered',
    },
    {
      question: 'Any Potential safety issues?',
      options: ['Yes', 'No'],
      selectedValue:
        signProjectData?.sign_general_audit?.anyPotentialSafetyIssues,
      value: 'anyPotentialSafetyIssues',
    },
    {
      question: 'Ladder or Lift Required?',
      options: ['Yes', 'No'],
      selectedValue: signProjectData?.sign_general_audit?.ladderOrLiftRequired,
      value: 'ladderOrLiftRequired',
    },
  ];
  const [loadingImage, setLoadingImage] = useState(false);

  const [sizeOfLadderOrLift, setSizeOfLadderOrLift] = useState(
    signProjectData?.sign_general_audit?.sizeOfLadderOrLift || '',
  );

  const [selectedOptions, setSelectedOptions] = useState({
    Id:
      signProjectData?.sign_general_audit?.id ||
      signProjectData?.sign_general_audit?.Id,
    projectId: signProjectData?.sign_general_audit?.projectId,
    signId: signProjectData?.sign_general_audit?.signId,
    optionId: signProjectData?.sign_general_audit?.optionId,
    teamId: loginData?.userId,
    adminId: loginData?.userId,
    facilityDiagramOrSketchProvided:
      signProjectData?.sign_general_audit?.facilityDiagramOrSketchProvided,
    generalDescriptionOfPlacementOfSign:
      signProjectData?.sign_general_audit?.generalDescriptionOfPlacementOfSign,
    colorOrExistingColorMatch:
      signProjectData?.sign_general_audit?.colorOrExistingColorMatch,
    bannerOrSignMaterial:
      signProjectData?.sign_general_audit?.bannerOrSignMaterial,
    materialThickness: signProjectData?.sign_general_audit?.materialThickness,
    attachmentType: signProjectData?.sign_general_audit?.attachmentType,
    wallOrSubstrateType:
      signProjectData?.sign_general_audit?.wallOrSubstrateType,
    documentSubstrateCondition:
      signProjectData?.sign_general_audit?.documentSubstrateCondition,
    adhesionTestRequired:
      signProjectData?.sign_general_audit?.adhesionTestRequired,
    adhesionTestResult: signProjectData?.sign_general_audit?.adhesionTestResult,
    recentlyPainted: signProjectData?.sign_general_audit?.recentlyPainted,
    anyAccessibilityObstructions:
      signProjectData?.sign_general_audit?.anyAccessibilityObstructions,
    signGeneralAuditDocumentAccessibilityIssues:
      signProjectData?.sign_general_audit
        ?.signGeneralAuditDocumentAccessibilityIssues,
    anyPotentialSafetyIssues:
      signProjectData?.sign_general_audit?.anyPotentialSafetyIssues,
    signGeneralAuditdocumentPotentialSafetyIssues:
      signProjectData?.sign_general_audit
        ?.signGeneralAuditdocumentPotentialSafetyIssues,
    rgbOrMonochrome: signProjectData?.sign_general_audit?.rgbOrMonochrome,
    numberOfScreens: signProjectData?.sign_general_audit?.numberOfScreens,
    resolution: signProjectData?.sign_general_audit?.resolution,
    attachedOrHanging: signProjectData?.sign_general_audit?.attachedOrHanging,
    interactiveDisplay: signProjectData?.sign_general_audit?.interactiveDisplay,
    communicationsType: signProjectData?.sign_general_audit?.communicationsType,
    contentManagementSoftwareRequired:
      signProjectData?.sign_general_audit?.contentManagementSoftwareRequired,
    ladderOrLiftRequired:
      signProjectData?.sign_general_audit?.ladderOrLiftRequired,
    sizeOfLadderOrLift:
      signProjectData?.sign_general_audit?.sizeOfLadderOrLift || '',
    signGeneralAuditTodoPunchList: signGeneralAuditTodoPunchList,
    signGeneralAuditSummaryNotes: signGeneralAuditSummaryNotes,
    typeOfAwning: signProjectData?.sign_general_audit?.typeOfAwning,
    racewayOrFlush: signProjectData?.sign_general_audit?.racewayOrFlush,
    singleOrDoubleFaced:
      signProjectData?.sign_general_audit?.singleOrDoubleFaced,
    replaceOrUseExisting:
      signProjectData?.sign_general_audit?.replaceOrUseExisting,
    copyTypeOrStyle: signProjectData?.sign_general_audit?.copyTypeOrStyle,
    siteCovered: signProjectData?.sign_general_audit?.siteCovered,
    siteWeatherDependent:
      signProjectData?.sign_general_audit?.siteWeatherDependent,
    faceMaterialsData: signProjectData?.sign_general_audit?.faceMaterialsData,
    surfaceQualityData: signProjectData?.sign_general_audit?.surfaceQualityData,
    extMaterialThickness:
      signProjectData?.sign_general_audit?.extMaterialThickness,
    panFlatCarvedOrSandblastedLetterData:
      signProjectData?.sign_general_audit?.panFlatCarvedOrSandblastedLetterData,
    channelLetterMaterial:
      signProjectData?.sign_general_audit?.channelLetterMaterial,
    material: signProjectData?.sign_general_audit?.material,
    contentManagementNotes:
      signProjectData?.sign_general_audit?.contentManagementNotes,
    facilityDiagramOrSketchProvidedPhoto:
      signProjectData?.sign_general_audit
        ?.facilityDiagramOrSketchProvidedPhoto || [],
    anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto:
      signProjectData?.sign_general_audit
        ?.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto || [],
    anyPotentialSafetyIssuesPhoto:
      signProjectData?.sign_general_audit?.anyPotentialSafetyIssuesPhoto || [],
    facilityDiagramOrSketchProvidedFile:
      signProjectData?.sign_general_audit
        ?.facilityDiagramOrSketchProvidedFile || '',
    customerName: signProjectData?.sign_general_audit?.customerName,
    surveyModule: '',
    anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos:
      signProjectData?.sign_general_audit
        ?.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos,
    anyPotentialSafetyIssuesPhotos:
      signProjectData?.sign_general_audit?.anyPotentialSafetyIssuesPhotos,
  });

  const handleState = value => {
    if (value === state) {
      setState(null);
    } else {
      setState(value);
    }
  };

  const handleInputChange = (text, index) => {
    const key = inputFields[index].setToValue;
    setSelectedOptions(prev => ({
      ...prev,
      [key]: text,
    }));
  };

  const handleSave = async () => {
    // console.log('--- Save Button Pressed ---');
    setLoadingImage(true);
    let base64AnyObstructionsPhotos = [];
    let base64anyPotentialIssuesPhotos = [];
    const netState = await NetInfo.fetch();
    const isConnected = netState.isConnected;
    if (isConnected) {
      base64AnyObstructionsPhotos = await getBase64Array(
        selectedOptions?.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto ||
          [],
      );
      base64anyPotentialIssuesPhotos = await getBase64Array(
        selectedOptions?.anyPotentialSafetyIssuesPhoto || [],
      );
    } else {
      base64AnyObstructionsPhotos =
        selectedOptions?.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto ||
        [];
      base64anyPotentialIssuesPhotos =
        selectedOptions?.anyPotentialSafetyIssuesPhoto || [];
    }

    const signGeneralData = {
      ...selectedOptions,
      signGeneralAuditSummaryNotes,
      signGeneralAuditTodoPunchList,
      signAliasName: signProjectData?.signAliasName,
      signType: signProjectData?.signType,
      anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto:
        base64AnyObstructionsPhotos,
      anyPotentialSafetyIssuesPhoto: base64anyPotentialIssuesPhotos,
    };

    try {
      if (isConnected) {
        const token = loginData?.tokenNumber;
        const response = await axios.post(
          `${baseUrl}/updateSignGeneralAudit`,
          signGeneralData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response?.data?.status) {
          await deleteFolders();
          const imagesCache = [
            ...(selectedOptions?.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto ||
              []),
            ...(selectedOptions?.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto ||
              []),
          ];
          for (const file of imagesCache) {
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
          Toast.show({
            type: 'success',
            text1: response?.data?.message || 'Audit saved successfully.',
            visibilityTime: 3000,
            position: 'top',
          });

          handleFetchData(null, signProjectData);
        } else {
          throw new Error('Sync failed with unknown server response.');
        }
      } else {
        updateSignGeneralAudit(signGeneralData, 0);
        handleFetchData(null, signProjectData);
        Toast.show({
          type: 'info',
          text1: 'Saved Offline. Will sync later.',
          visibilityTime: 3000,
          position: 'top',
        });
      }
    } catch (error) {
      console.log('❌ API Sync failed. Will still save locally.');
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
        await insertSignGeneralAuditImagesOnly(
          signProjectData?.signTableId,
          fieldName1,
          updatedArray,
          0,
        );
        const imagesaRRAY = await getSignGeneralAuditImagesByKey(
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
          signProjectData?.sign_general_audit?.id ||
          signProjectData?.sign_general_audit?.Id,
        fieldName: fieldName1,
        surveyModule: 'sign_general_audit',
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
          const imagesArray = response?.data?.data?.[actualKey] || [];
          await insertSignGeneralAuditImagesOnly(
            signProjectData?.signTableId,
            actualKey,
            imagesArray,
            1,
          );
          const updated = await getSignGeneralAuditImagesByKey(
            signProjectData?.signTableId,
            actualKey,
          );
          setSelectedOptions(prev => ({
            ...prev,
            [actualKey]: updated || [],
          }));
        }
      } else {
        createOfflineRemoveTable();
        const imagesArray = selectedOptions?.[actualKey]?.filter(
          item => item.imageId !== imageId1,
        );
        await insertSignGeneralAuditImagesOnly(
          signProjectData?.signTableId,
          actualKey,
          imagesArray,
          0,
        );
        const updated = await getSignGeneralAuditImagesByKey(
          signProjectData?.signTableId,
          actualKey,
        );
        setSelectedOptions(prev => ({
          ...prev,
          [actualKey]: updated || [],
        }));
        insertOfflineRemove(data);
        const fullPath = await getPath(path);
        await RNFS.unlink(`file://${fullPath}`);
      }
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
      console.log('Failed to remove online: stored offline for sync');
    } finally {
      setTimeout(() => setLoadingImage(false), 1000);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (active === '') {
            setActive('Outdoor');
          } else {
            setActive('');
          }
        }}
        style={[styles.container, {borderColor: '#2B92F0'}]}>
        <View style={[styles.iconWrapper, {backgroundColor: '#2B92F0'}]}>
          <Exist width={30} height={30} />
        </View>

        <View style={styles.textContent}>
          <Text style={styles.projectName}>
            {projectTitle || 'Project Name'}
          </Text>
          <Text style={styles.auditTitle}>
            {signProjectData?.signId === '1'
              ? 'Indoor Sign General Audit'
              : 'Outdoor Sign General Audit'}
          </Text>
          <Text style={styles.projectName}>
            {signProjectData?.sign_general_audit?.signType ||
              'Digital indoor free standing'}
          </Text>
        </View>

        <View style={styles.dropdownIconWrapper}>
          {active === 'Outdoor' ? (
            <UpDownIcon width={39} height={39} />
          ) : (
            <DropDownIcon width={39} height={39} />
          )}
        </View>
      </TouchableOpacity>
      <View style={{marginTop: -8}}>
        {active === 'Outdoor' && (
          <View style={[styles.card, {borderColor: '#2B92F0'}]}>
            {inputFields[0] && (
              <TextInput
                placeholder={inputFields[0].placeholder}
                style={[styles.input, {height: 50}]}
                value={selectedOptions[inputFields[0].setToValue] || ''}
                onChangeText={text => handleInputChange(text, 0)}
              />
            )}
            <View style={{marginVertical: 6}}>
              <TouchableOpacity
                style={[styles.containerDrop]}
                onPress={() => handleState('retainer')}>
                <Text style={styles.label}>{data[0].question}</Text>
                <View style={styles.iconButton}>
                  {state !== 'retainer' ? (
                    <Up width={18} height={18} />
                  ) : (
                    <Down width={18} height={18} />
                  )}
                </View>
              </TouchableOpacity>
              <Collapsible
                collapsed={state !== 'retainer'}
                duration={300}
                easing="easeInOutQuad">
                <View style={styles.sectionContainer}>
                  <View style={styles.radioSection}>
                    <Text style={styles.radioQuestionText}>
                      {data[0].question}
                    </Text>
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
                                [data[0].value]:
                                  current === incoming ? '' : value1,
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
                      {/* <TextInput
                        placeholder="General description of placement of sign"
                        style={[styles.input, {height: 50}]}
                        value={signGeneralAuditDocumentAccessibilityIssues}
                        onChangeText={
                          setSignGeneralAuditDocumentAccessibilityIssues
                        }
                      /> */}
                      <TouchableOpacity
                        style={styles.imageCon}
                        onPress={() =>
                          showPhotoOptions(
                            setSelectedOptions,
                            'anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto',
                            'SignGeneralAudit',
                            false,
                          )
                        }>
                        <View style={styles.photoButton}>
                          <Text style={styles.photoText}>add photo</Text>
                          <Photo />
                        </View>
                        <View style={styles.fileNameContainer}>
                          <Text style={styles.fileNameText}>
                            {selectedOptions
                              ?.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto
                              ?.length > 0
                              ? `${selectedOptions?.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto?.length} File Chosen`
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
                              ...(selectedOptions?.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto?.map(
                                item => ({
                                  ...item,
                                  isLocal: true,
                                }),
                              ) || []),
                              ...(selectedOptions?.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos?.map(
                                item => ({
                                  ...item,
                                  isLocal: false,
                                }),
                              ) || []),
                            ];

                            if (mergedImages.length === 0) return null;

                            return mergedImages.map((item, index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() => {
                                  openEditorforUpdate(
                                    item.path,
                                    setSelectedOptions,
                                    item.isLocal
                                      ? 'anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto'
                                      : 'anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos',
                                    'SignGeneralAudit',
                                    true,
                                    item.isLocal ? item.ImageId : item.imageId,
                                    baseUrl,
                                    loginData?.tokenNumber,
                                    true,
                                    signProjectData?.sign_general_audit?.id ||
                                      signProjectData?.sign_general_audit?.Id,
                                    'sign_general_audit',
                                    item.isLocal,
                                    selectedOptions,
                                  );
                                }}>
                                <View style={styles.imageContainer}>
                                  <Image
                                    source={{
                                      uri: item.path.startsWith('file://')
                                        ? item.path
                                        : `file://${item.path}`,
                                    }}
                                    style={styles.image}
                                  />
                                  <TouchableOpacity
                                    onPress={() => {
                                      handleRemoveImage(
                                        item.isLocal
                                          ? item.ImageId
                                          : item.imageId,
                                        'anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto',
                                        'anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos',
                                        item.path,
                                        item.isLocal,
                                      );
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

                  <TouchableOpacity
                    onPress={() => handleState('retainer')}
                    style={[
                      styles.iconButton,
                      {alignSelf: 'flex-end', marginVertical: 15},
                    ]}>
                    <Down width={18} height={18} />
                  </TouchableOpacity>
                </View>
              </Collapsible>
            </View>
            <View>
              <FlatList
                data={data.slice(1, 4)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
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
                )}
              />
            </View>
            <FlatList
              data={inputFields.slice(1, 8)}
              keyExtractor={item => item.placeholder}
              renderItem={({item, index}) => (
                <TextInput
                  placeholder={item.placeholder}
                  value={selectedOptions[item.setToValue] || ''}
                  onChangeText={text => handleInputChange(text, index + 1)}
                  style={[styles.input, {height: 50}]}
                />
              )}
            />
            <View style={{marginVertical: 6}}>
              <TouchableOpacity
                style={[styles.containerDrop]}
                onPress={() => handleState('Potential')}>
                <Text style={styles.label}>{data[4].question}</Text>
                <View style={styles.iconButton}>
                  {state !== 'Potential' ? (
                    <Up width={18} height={18} />
                  ) : (
                    <Down width={18} height={18} />
                  )}
                </View>
              </TouchableOpacity>
              <Collapsible
                duration={300}
                easing="easeInOutQuad"
                collapsed={state !== 'Potential'}>
                <View style={styles.sectionContainer}>
                  <View style={styles.radioSection}>
                    <Text style={styles.radioQuestionText}>
                      {data[4].question}
                    </Text>
                    <View style={styles.radioGroup}>
                      {data[4].options.map((option, index) => (
                        <RadioButton
                          key={index}
                          label={option}
                          value={option}
                          selected={selectedOptions[data[4].value] ?? ''}
                          onPress={value1 => {
                            setSelectedOptions(prev => {
                              const current =
                                prev?.[data[4].value]?.toLowerCase?.() || '';
                              const incoming = value1.toLowerCase();

                              return {
                                ...prev,
                                [data[4].value]:
                                  current === incoming ? '' : value1,
                              };
                            });
                          }}
                        />
                      ))}
                    </View>
                  </View>
                  {(selectedOptions[data[4].value] === 'yes' ||
                    selectedOptions[data[4].value] === 'Yes') && (
                    <View>
                      <FlatList
                        data={inputFields.slice(8, 9)}
                        keyExtractor={item => item.placeholder}
                        renderItem={({item, index}) => (
                          <TextInput
                            placeholder={item.placeholder}
                            value={selectedOptions[item.setToValue] || ''}
                            onChangeText={text => handleInputChange(text, 8)}
                            style={[styles.input, {height: 50}]}
                          />
                        )}
                      />
                      <TouchableOpacity
                        style={styles.imageCon}
                        onPress={() =>
                          showPhotoOptions(
                            setSelectedOptions,
                            'anyPotentialSafetyIssuesPhoto',
                            'SignGeneralAudit',
                            false,
                          )
                        }>
                        <View style={styles.photoButton}>
                          <Text style={styles.photoText}>add photo</Text>
                          <Photo />
                        </View>
                        <View style={styles.fileNameContainer}>
                          <Text style={styles.fileNameText}>
                            {selectedOptions?.anyPotentialSafetyIssuesPhoto
                              ?.length > 0
                              ? `${selectedOptions?.anyPotentialSafetyIssuesPhoto?.length} File Chosen`
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
                          <ActivityIndicator size="large" color="#FF9239" />
                        ) : (
                          (() => {
                            const mergedImages = [
                              ...(selectedOptions?.anyPotentialSafetyIssuesPhoto?.map(
                                item => ({
                                  ...item,
                                  isLocal: true,
                                }),
                              ) || []),
                              ...(selectedOptions?.anyPotentialSafetyIssuesPhotos?.map(
                                item => ({
                                  ...item,
                                  isLocal: false,
                                }),
                              ) || []),
                            ];

                            if (mergedImages.length === 0) return null;

                            return mergedImages.map((item, index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() => {
                                  if (item.isLocal) {
                                    openEditorforUpdate(
                                      item.path,
                                      setSelectedOptions,
                                      'anyPotentialSafetyIssuesPhoto',
                                      'SignGeneralAudit', // or SignGeneralAudit? You decide
                                      true,
                                      item.ImageId,
                                      baseUrl,
                                      loginData?.tokenNumber,
                                      true,
                                      signProjectData?.sign_general_audit?.id ||
                                        signProjectData?.sign_general_audit?.Id,
                                      'sign_general_audit',
                                      true,
                                      selectedOptions,
                                    );
                                  } else {
                                    openEditorforUpdate(
                                      item.path,
                                      setSelectedOptions,
                                      'anyPotentialSafetyIssuesPhotos',
                                      'SignGeneralAudit', // or SignGeneralAudit?
                                      true,
                                      item.imageId,
                                      baseUrl,
                                      loginData?.tokenNumber,
                                      true,
                                      signProjectData?.sign_general_audit?.id ||
                                        signProjectData?.sign_general_audit?.Id,
                                      'sign_general_audit',
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
                                          'anyPotentialSafetyIssuesPhoto',
                                          'anyPotentialSafetyIssuesPhotos',
                                          item.path,
                                          false,
                                        );
                                      } else {
                                        handleRemoveImage(
                                          item.ImageId,
                                          'anyPotentialSafetyIssuesPhoto',
                                          'anyPotentialSafetyIssuesPhotos',
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
                  <TouchableOpacity
                    onPress={() => handleState('retainer')}
                    style={[
                      styles.iconButton,
                      {alignSelf: 'flex-end', marginVertical: 15},
                    ]}>
                    <Down width={18} height={18} />
                  </TouchableOpacity>
                </View>
              </Collapsible>
            </View>
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
                  value={signGeneralAuditTodoPunchList}
                  onChangeText={setSignGeneralAuditTodoPunchList}
                />
                <Text style={{textAlign: 'right', marginTop: 5}}>
                  {signGeneralAuditTodoPunchList?.length}/300
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
                  value={signGeneralAuditSummaryNotes}
                  onChangeText={setSignGeneralAuditSummaryNotes}
                />
                <Text style={{textAlign: 'right', marginTop: 5}}>
                  {signGeneralAuditSummaryNotes?.length}/300
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

export default OutDoor;
