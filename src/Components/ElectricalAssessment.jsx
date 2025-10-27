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
import Exist from '../../assets/images/2.svg';
import DropDownIcon from '../../assets/images/downarrow.svg';
import Photo from '../../assets/images/photo.svg';
import {styles} from '../Global/Global';
import SaveImg from '../../assets/images/save.svg';
import UpDownIcon from '../../assets/images/arrowup.svg';
import RadioButton from './RadioButton';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';

import {
  createOfflineRemoveTable,
  getElectricalAuditImagesByKey,
  insertElectricalAuditImagesOnly,
  insertOfflineRemove,
  updateElectricalAudit,
} from '../Db/LocalData';
import {
  openEditorforUpdate,
  showPhotoOptions,
} from '../Functions/ImagePickFunctions.tsx';
import {
  deleteFolders,
  getBase64Array,
  getPath,
} from '../Functions/FSfunctions.tsx';
import RNFS from 'react-native-fs';
import {setActiveState} from '../Redux/Slices/Active.js';

const ElectricalAssessment = ({handleFetchData}) => {
  const dispatch = useDispatch();
  const globalActive = useSelector(state => state.active.values);
  const projectTitle = useSelector(state => state.projecttitle.value);
  const baseUrl = useSelector(state => state.baseUrl.value);
  const signProjectData = useSelector(state => state.signProject.value);
  const loginData = useSelector(state => state.login.value);
  const [loadingImage, setLoadingImage] = useState(false);
  const [electricalAuditTodoPunchList, setElectricalAuditTodoPunchList] =
    useState(signProjectData?.electrical_audit?.electricalAuditTodoPunchList);
  const [electricalAuditSummaryNotes, setElectricalAuditSummaryNotes] =
    useState(signProjectData?.electrical_audit?.electricalAuditSummaryNotes);
  const [selectedOptions, setSelectedOptions] = useState({
    adminName: signProjectData?.electrical_audit?.adminName,
    anyAccessibilityIssues:
      signProjectData?.electrical_audit?.anyAccessibilityIssues,
    anyKnownRepairorMaintenanceToElectricalEquipmentRequired:
      signProjectData?.electrical_audit
        ?.anyKnownRepairorMaintenanceToElectricalEquipmentRequired,
    customerName: signProjectData?.electrical_audit?.customerName,
    doesTheExistingSignIlluminate:
      signProjectData?.electrical_audit?.doesTheExistingSignIlluminate,
    electric120Vor220V: signProjectData?.electrical_audit?.electric120Vor220V,
    electricSubcontractorNeeded:
      signProjectData?.electrical_audit?.electricSubcontractorNeeded,
    electricTagsPhotoFromAdmin:
      signProjectData?.electrical_audit?.electricTagsPhotoFromAdmin,
    electricTagsPhoto:
      signProjectData?.electrical_audit?.electricTagsPhoto || [],
    electricTagsPhotos: signProjectData?.electrical_audit?.electricTagsPhotos,
    electricTagsorCertificationsPresent:
      signProjectData?.electrical_audit?.electricTagsorCertificationsPresent,
    electricalAuditDocumentAccessibilityIssues:
      signProjectData?.electrical_audit
        ?.electricalAuditDocumentAccessibilityIssues,
    electricalAuditPhotoFromAdmin:
      signProjectData?.electrical_audit?.electricalAuditPhotoFromAdmin,
    electricalAuditPhoto:
      signProjectData?.electrical_audit?.electricalAuditPhoto || [],
    electricalAuditPhotos:
      signProjectData?.electrical_audit?.electricalAuditPhotos,
    electricalAuditSummaryNotes:
      signProjectData?.electrical_audit?.electricalAuditSummaryNotes,
    electricalAuditTodoPunchList:
      signProjectData?.electrical_audit?.electricalAuditTodoPunchList,
    electricalAuditspecialInstructions:
      signProjectData?.electrical_audit?.electricalAuditspecialInstructions,
    Id:
      signProjectData?.electrical_audit?.id ||
      signProjectData?.electrical_audit?.Id,
    isElectricPresentAtTheSign:
      signProjectData?.electrical_audit?.isElectricPresentAtTheSign,
    isPowerLiveAtSignLocation:
      signProjectData?.electrical_audit?.isPowerLiveAtSignLocation,
    optionId: signProjectData?.electrical_audit?.optionId,
    powerWithinNeededDistance:
      signProjectData?.electrical_audit?.powerWithinNeededDistance,
    projectId: signProjectData?.electrical_audit?.projectId,
    projectTitle: signProjectData?.electrical_audit?.projectTitle,
    signAliasName: signProjectData?.electrical_audit?.signAliasName,
    signId: signProjectData?.electrical_audit?.signId,
    signType: signProjectData?.electrical_audit?.signType,
    sign_order: signProjectData?.electrical_audit?.sign_order,
    typeOfIlluminationInside:
      signProjectData?.electrical_audit?.typeOfIlluminationInside || '',
    teamId: loginData?.userId,
    adminId: loginData?.userId,
    surveyModule: 'elevation_and_siteplan',
    electricalAuditspecialInstructions:
      signProjectData?.electrical_audit?.electricalAuditspecialInstructions,
  });
  const [signImageName, setSignImageName] = useState('No File Choosen');
  const [anyAccessibilityIssues, setAnyAccessibilityIssues] = useState(
    signProjectData?.electrical_audit?.anyAccessibilityIssues || '',
  );
  const [typeOfIlluminationInside, setTypeOfIlluminationInside] = useState(
    signProjectData?.electrical_audit?.typeOfIlluminationInside || '',
  );

  const data = [
    {
      question: 'Is electric present at the sign?',
      value: 'isElectricPresentAtTheSign',
      options: ['Yes', 'No'],
      selectedValue:
        signProjectData?.electrical_audit?.isElectricPresentAtTheSign || '',
    },
    {
      question: 'Electric Subcontractor Needed?',
      options: ['Yes', 'No'],
      value: 'electricSubcontractorNeeded',
      selectedValue:
        signProjectData?.electrical_audit?.electricSubcontractorNeeded || '',
    },
    {
      question: 'Any accessibility issues?',
      options: ['Yes', 'No'],
      value: 'anyAccessibilityIssues',
      selectedValue:
        signProjectData?.electrical_audit?.anyAccessibilityIssues || '',
    },
    {
      question: 'Is power live at sign location?',
      options: ['Yes', 'No', "Don't Know"],
      value: 'isPowerLiveAtSignLocation',
      selectedValue:
        signProjectData?.electrical_audit?.isPowerLiveAtSignLocation || '',
    },
    {
      question: 'Power within needed distance?',
      options: ['Yes', 'No'],
      value: 'powerWithinNeededDistance',
      selectedValue:
        signProjectData?.electrical_audit?.powerWithinNeededDistance || '',
    },
    {
      question: 'Does the existing sign illuminate?',
      options: ['Yes', 'No'],
      value: 'doesTheExistingSignIlluminate',
      selectedValue:
        signProjectData?.electrical_audit?.doesTheExistingSignIlluminate || '',
    },
    {
      question: 'Electric 120V or 220V?',
      options: ['120V', '220V', "Don't Know"],
      value: 'electric120Vor220V',
      selectedValue:
        signProjectData?.electrical_audit?.electric120Vor220V || '',
    },
    {
      question: 'Electric Tags or Certifications Present?',
      options: ['Yes', 'No'],
      value: 'electricTagsorCertificationsPresent',
      selectedValue:
        signProjectData?.electrical_audit
          ?.electricTagsorCertificationsPresent || '',
    },
    {
      question:
        'Any known repair or maintenance to electrical equipment required? Y/N',
      options: ['Yes', 'No'],
      value: 'anyKnownRepairorMaintenanceToElectricalEquipmentRequired',
      selectedValue:
        signProjectData?.electrical_audit
          ?.anyKnownRepairorMaintenanceToElectricalEquipmentRequired || '',
    },
  ];

  const handleSave = async () => {
    const netState = await NetInfo.fetch();
    const isConnected = netState.isConnected;
    setLoadingImage(true);
    let base64ELectricalAuditPhoto = [];
    let base64ElectricalTagsPhoto = [];
    if (isConnected) {
      base64ELectricalAuditPhoto = await getBase64Array(
        selectedOptions?.electricalAuditPhoto || [],
      );
      base64ElectricalTagsPhoto = await getBase64Array(
        selectedOptions?.electricTagsPhoto,
      );
    } else {
      base64ELectricalAuditPhoto = selectedOptions?.electricalAuditPhoto || [];
      base64ElectricalTagsPhoto = selectedOptions?.electricTagsPhoto || [];
    }

    const bodyData = {
      ...selectedOptions,
      typeOfIlluminationInside,
      electricalAuditTodoPunchList,
      electricalAuditSummaryNotes,
      signAliasName: signProjectData?.signAliasName,
      signType: signProjectData?.signType,
      electricalAuditPhoto: base64ELectricalAuditPhoto,
      electricTagsPhoto: base64ElectricalTagsPhoto,
    };
    // console.log('BODY DATAAA', bodyData);

    try {
      if (isConnected) {
        const token = loginData?.tokenNumber;
        const response = await axios.post(
          `${baseUrl}/updateElectricalAudit`,
          bodyData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response?.data?.status) {
          await deleteFolders();
          const existingCachePhotos =
            selectedOptions?.electricalAuditPhoto || [];
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
        updateElectricalAudit(bodyData, 0);
        handleFetchData(null, signProjectData);
        Toast.show({
          type: 'info',
          text1: 'Saved Offline. Will sync later.',
          visibilityTime: 3000,
          position: 'top',
        });
      }
    } catch (error) {
      if (
        error?.message?.data.includes('Network Error') ||
        error?.response === undefined
      ) {
        updateElectricalAudit(bodyData, 0);
        handleFetchData(null, signProjectData);
        Toast.show({
          type: 'info',
          text1: 'No network. Saved offline & will sync later.',
          visibilityTime: 3000,
          position: 'top',
        });
      } else {
        console.log('Error:', error?.response?.data || error?.message);
        Toast.show({
          type: 'error',
          text1: 'Sync failed. Try again.',
          visibilityTime: 3000,
          position: 'top',
        });
      }
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
    setLoadingImage(true);
    const netState = await NetInfo.fetch();
    const isConnected = netState.isConnected;
    if (isLocalImageRemove) {
      const updatedArray = selectedOptions?.[fieldName1]?.filter(
        item => item.ImageId !== imageId1,
      );
      // console.log('IMAGESSSARRAYY', imagesArray);
      await insertElectricalAuditImagesOnly(
        signProjectData?.signTableId,
        fieldName1,
        updatedArray,
        0,
      );
      const imagesaRRAY = await getElectricalAuditImagesByKey(
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
    try {
      const data = {
        imageId: imageId1,
        Id:
          signProjectData?.electrical_audit?.id ||
          signProjectData?.electrical_audit?.Id,
        fieldName: fieldName1,
        surveyModule: 'electrical_audit',
        moduleId: signProjectData?.signId,
      };
      const token = loginData?.tokenNumber;
      if (isConnected) {
        const responce = await axios.post(`${baseUrl}/removeFile`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(responce.data, 'resssssss');
        if (responce.data.status) {
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
          const imagesArray = responce?.data?.data[actualKey] || [];
          // console.log('IMAGESSSARRAYY', imagesArray);
          await insertElectricalAuditImagesOnly(
            signProjectData?.signTableId,
            actualKey,
            imagesArray,
            1,
          );
          // console.log('ONLINE -- Image removed successfully');
          const imagesaRRAY = await getElectricalAuditImagesByKey(
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
        await insertElectricalAuditImagesOnly(
          signProjectData?.signTableId,
          actualKey,
          imagesArray,
          0,
        );
        const imagesaRRAY = await getElectricalAuditImagesByKey(
          signProjectData?.signTableId,
          actualKey,
        );
        console.log('/IMAGESARRAYAFTERINSERT', imagesaRRAY);
        setSelectedOptions(prev => {
          return {
            ...prev,
            [actualKey]: imagesaRRAY || [],
          };
        });
        insertOfflineRemove(data);
        const fullPath = await getPath(path);
        await RNFS.unlink(`file://${fullPath}`);
      }
    } catch (error) {
      console.log('Error response data:', error);
    } finally {
      setTimeout(() => setLoadingImage(false), 1000);
    }
  };

  const optionIds = ['2', '3', '5', '7', '13', '14', '21'];
  if (
    optionIds.includes(signProjectData?.electrical_audit?.optionId) ||
    signProjectData?.electrical_audit?.optionId === undefined
  ) {
    return <View></View>;
  }

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          dispatch(setActiveState('Electrical'));
        }}
        style={[styles.container, {borderColor: '#FF9239'}]}>
        <View style={[styles.iconWrapper, {backgroundColor: '#FF9239'}]}>
          <Exist width={30} height={30} />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.projectName}>
            {projectTitle || 'Project Name'}
          </Text>
          <Text style={styles.auditTitle}>Electrical Assessment</Text>
          <Text style={styles.projectName}>
            {signProjectData?.electrical_audit?.signType ||
              'Digital indoor free standing'}
          </Text>
        </View>
        <View style={styles.dropdownIconWrapper}>
          {globalActive?.includes('Electrical') ? (
            <UpDownIcon width={39} height={39} />
          ) : (
            <DropDownIcon width={39} height={39} />
          )}
        </View>
      </TouchableOpacity>
      <View style={{marginTop: -8}}>
        {globalActive?.includes('Electrical') && (
          <View style={styles.card}>
            <View style={styles.headerSection}>
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
                  <Text style={styles.titleText}>Electrical assessment</Text>
                  <Text style={styles.subTitleText}>Special instructions</Text>
                </View>
                <Text style={styles.authorText}>
                  {signProjectData?.electrical_audit?.adminName}
                </Text>
              </View>
              <View style={styles.instructionsSection}>
                <Text style={styles.instructionText}>
                  Be sure to take a picture of the electric box.
                </Text>
                <Text style={styles.dateText}>April 10 2024</Text>
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
                      {(selectedOptions[item.value] === 'yes' ||
                        selectedOptions[item.value] === 'Yes') &&
                        item.question === 'Any accessibility issues?' && (
                          <View>
                            <TextInput
                              style={[
                                styles.input,
                                {marginVertical: 10, height: 80},
                              ]}
                              placeholder="Please provide more details"
                              multiline
                              textAlignVertical="top"
                              value={anyAccessibilityIssues}
                              onChangeText={setAnyAccessibilityIssues}
                            />
                            <TouchableOpacity
                              onPress={() =>
                                showPhotoOptions(
                                  setSelectedOptions,
                                  'electricalAuditPhoto',
                                  'Electrical',
                                  false,
                                )
                              }
                              style={styles.imageCon}>
                              <View style={styles.photoButton}>
                                <Text style={styles.photoText}>add photo</Text>
                                <Photo />
                              </View>
                              <View style={styles.fileNameContainer}>
                                <Text style={styles.fileNameText}>
                                  {selectedOptions?.electricalAuditPhoto
                                    ?.length > 0
                                    ? `${selectedOptions?.electricalAuditPhoto?.length} file choosen`
                                    : signImageName}
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
                                <ActivityIndicator
                                  size="small"
                                  color="#FF9239"
                                />
                              ) : (
                                (() => {
                                  const mergedImages = [
                                    ...(selectedOptions?.electricalAuditPhoto?.map(
                                      item => ({
                                        ...item,
                                        isLocal: true,
                                      }),
                                    ) || []),
                                    ...(selectedOptions?.electricalAuditPhotos?.map(
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
                                            'electricalAuditPhoto',
                                            'ElectricalAudit',
                                            true,
                                            item.ImageId,
                                            baseUrl,
                                            loginData?.tokenNumber,
                                            true,
                                            signProjectData?.electrical_audit
                                              ?.id ||
                                              signProjectData?.electrical_audit
                                                ?.Id,
                                            'electrical_audit',
                                            true,
                                            selectedOptions,
                                          );
                                        } else {
                                          openEditorforUpdate(
                                            item.path,
                                            setSelectedOptions,
                                            'electricalAuditPhotos',
                                            'ElectricalAudit',
                                            true,
                                            item.imageId,
                                            baseUrl,
                                            loginData?.tokenNumber,
                                            true,
                                            signProjectData?.electrical_audit
                                              ?.id ||
                                              signProjectData?.electrical_audit
                                                ?.Id,
                                            'electrical_audit',
                                            false,
                                            selectedOptions,
                                          );
                                        }
                                      }}>
                                      <View style={styles.imageContainer}>
                                        <Image
                                          source={{
                                            uri: item?.path?.startsWith(
                                              'file://',
                                            )
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
                                                'electricalAuditPhoto',
                                                'electricalAuditPhotos',
                                                item.path,
                                                false,
                                              );
                                            } else {
                                              handleRemoveImage(
                                                item.ImageId,
                                                'electricalAuditPhoto',
                                                'electricalAuditPhotos',
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
                      {(selectedOptions[item.value] === 'yes' ||
                        selectedOptions[item.value] === 'Yes') &&
                        item.question ===
                          'Does the existing sign illuminate?' && (
                          <TextInput
                            style={[styles.input, {marginTop: 10, height: 80}]}
                            placeholder="Type of illumination Inside"
                            multiline
                            textAlignVertical="top"
                            value={typeOfIlluminationInside}
                            onChangeText={setTypeOfIlluminationInside}
                          />
                        )}
                      {(selectedOptions[item.value] === 'yes' ||
                        selectedOptions[item.value] === 'Yes') &&
                        item.question ===
                          'Electric Tags or Certifications Present?' && (
                          <View>
                            <TouchableOpacity
                              onPress={() =>
                                showPhotoOptions(
                                  setSelectedOptions,
                                  'electricTagsPhoto',
                                  '',
                                  false,
                                )
                              }
                              style={styles.imageCon}>
                              <View style={styles.photoButton}>
                                <Text style={styles.photoText}>add photo</Text>
                                <Photo />
                              </View>
                              <View style={styles.fileNameContainer}>
                                <Text style={styles.fileNameText}>
                                  {selectedOptions?.electricTagsPhoto?.length >
                                  0
                                    ? `${selectedOptions?.electricTagsPhoto?.length} Files Choosen`
                                    : signImageName}
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
                                <ActivityIndicator
                                  size="small"
                                  color="#FF9239"
                                />
                              ) : (
                                (() => {
                                  const mergedImages = [
                                    ...(selectedOptions?.electricTagsPhoto?.map(
                                      item => ({
                                        ...item,
                                        isLocal: true,
                                      }),
                                    ) || []),
                                    ...(selectedOptions?.electricTagsPhotos?.map(
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
                                            'electricTagsPhoto',
                                            'ElectricalTag',
                                            true,
                                            item.ImageId,
                                            baseUrl,
                                            loginData?.tokenNumber,
                                            true,
                                            signProjectData?.electrical_audit
                                              ?.id ||
                                              signProjectData?.electrical_audit
                                                ?.Id,
                                            'electrical_audit',
                                            true,
                                            selectedOptions,
                                          );
                                        } else {
                                          openEditorforUpdate(
                                            item.path,
                                            setSelectedOptions,
                                            'electricTagsPhotos',
                                            'ElectricalTag',
                                            true,
                                            item.imageId,
                                            baseUrl,
                                            loginData?.tokenNumber,
                                            true,
                                            signProjectData?.electrical_audit
                                              ?.id ||
                                              signProjectData?.electrical_audit
                                                ?.Id,
                                            'electrical_audit',
                                            false,
                                            selectedOptions,
                                          );
                                        }
                                      }}>
                                      <View style={styles.imageContainer}>
                                        <Image
                                          source={{
                                            uri: item?.path?.startsWith(
                                              'file://',
                                            )
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
                                                'electricTagsPhoto',
                                                'electricTagsPhotos',
                                                item.path,
                                                false,
                                              );
                                            } else {
                                              handleRemoveImage(
                                                item.ImageId,
                                                'electricTagsPhoto',
                                                'electricTagsPhotos',
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
                      value={electricalAuditTodoPunchList}
                      onChangeText={setElectricalAuditTodoPunchList}
                    />
                    <Text style={{textAlign: 'right', marginTop: 5}}>
                      {electricalAuditTodoPunchList?.length}/300
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
                      value={electricalAuditSummaryNotes}
                      onChangeText={setElectricalAuditSummaryNotes}
                    />
                    <Text style={{textAlign: 'right', marginTop: 5}}>
                      {electricalAuditSummaryNotes?.length}/300
                    </Text>
                  </View>
                </View>
              </View>
            )}
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
              onPress={() => {
                dispatch(setActiveState('Electrical'));
              }}>
              <UpDownIcon width={39} height={39} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default ElectricalAssessment;
