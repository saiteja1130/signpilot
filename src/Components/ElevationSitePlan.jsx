import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import NetInfo from '@react-native-community/netinfo';

// Import SVG icons (update paths as needed)
import ElevationIcon from '../../assets/images/elevation.svg';
import DropDownIcon from '../../assets/images/downarrow.svg';
import UpDownIcon from '../../assets/images/arrowup.svg';
import SaveImg from '../../assets/images/save.svg';
import Photo from '../../assets/images/photo.svg';
import RadioButton from './RadioButton';

// Import database functions (create similar ones for elevation audit)
import {
  createOfflineRemoveTable,
  getElevationAuditImagesByKey,
  insertElevationAuditImagesOnly,
  insertOfflineRemove,
  updateElevationAudit,
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

import {styles} from '../Global/Global';

const ElevationSitePlan = ({handleFetchData}) => {
  const projectTitle = useSelector(state => state.projecttitle.value);
  const baseUrl = useSelector(state => state.baseUrl.value);
  const loginData = useSelector(state => state.login.value);
  const signProjectData = useSelector(state => state.signProject.value);

  const [loadingImage, setLoadingImage] = useState(false);
  const [active, setActive] = useState('');
  const [userData, setUserData] = useState(null);

  // Form state
  const [
    elevationAndSitePlanTodoPunchList,
    setElevationAndSitePlanTodoPunchList,
  ] = useState(
    signProjectData?.elevation_audit?.elevationAndSitePlanTodoPunchList,
  );
  const [
    elevationAndSitePlanSummaryNotes,
    setElevationAndSitePlanSummaryNotes,
  ] = useState(
    signProjectData?.elevation_audit?.elevationAndSitePlanSummaryNotes,
  );

  // Main form data state
  const [selectedOptions, setSelectedOptions] = useState({
    // Basic info
    Id:
      signProjectData?.elevation_audit?.id ||
      signProjectData?.elevation_audit?.Id,
    projectId: signProjectData?.elevation_audit?.projectId,
    signId: signProjectData?.elevation_audit?.signId,
    optionId: signProjectData?.elevation_audit?.optionId,
    teamId: loginData?.userId,
    adminId: loginData?.userId,
    customerName: signProjectData?.elevation_audit?.customerName,
    surveyModule: 'Elevation & Site Plan',

    // Storefront measurements
    storefrontHeightFT:
      signProjectData?.elevation_audit?.storefrontHeightFT || '',
    storefrontHeightIN:
      signProjectData?.elevation_audit?.storefrontHeightIN || '',
    storefrontWidthFT:
      signProjectData?.elevation_audit?.storefrontWidthFT || '',
    storefrontWidthIN:
      signProjectData?.elevation_audit?.storefrontWidthIN || '',
    storefrontPhoto: signProjectData?.elevation_audit?.storefrontPhoto || [],

    // Survey
    hasCustomerSuppliedPlottedSurvey:
      signProjectData?.elevation_audit?.hasCustomerSuppliedPlottedSurvey || '',
    hasCustomerSuppliedPlottedSurveyPhoto:
      signProjectData?.elevation_audit?.hasCustomerSuppliedPlottedSurveyPhoto ||
      [],
    hasCustomerSuppliedPlottedSurveyFile:
      signProjectData?.elevation_audit?.hasCustomerSuppliedPlottedSurveyFile ||
      [],

    // Distance measurements
    measureDistanceSignToStoreDistFT:
      signProjectData?.elevation_audit?.measureDistanceSignToStoreDistFT || '',
    measureDistanceSignToStoreDistIN:
      signProjectData?.elevation_audit?.measureDistanceSignToStoreDistIN || '',
    measureDistanceSignToStoreImage:
      signProjectData?.elevation_audit?.measureDistanceSignToStoreImage || [],

    measureDistanceSignToStreetDistFT:
      signProjectData?.elevation_audit?.measureDistanceSignToStreetDistFT || '',
    measureDistanceSignToStreetDistIN:
      signProjectData?.elevation_audit?.measureDistanceSignToStreetDistIN || '',
    measureDistanceSignToStreetImage:
      signProjectData?.elevation_audit?.measureDistanceSignToStreetImage || [],

    // Signband measurements
    measureSignBandHeightFT:
      signProjectData?.elevation_audit?.measureSignBandHeightFT || '',
    measureSignBandHeightIN:
      signProjectData?.elevation_audit?.measureSignBandHeightIN || '',
    measureSignBandWidthFT:
      signProjectData?.elevation_audit?.measureSignBandWidthFT || '',
    measureSignBandWidthIN:
      signProjectData?.elevation_audit?.measureSignBandWidthIN || '',
    measureSignBandPhoto:
      signProjectData?.elevation_audit?.measureSignBandPhoto || [],
    documentCompositionOfSignband:
      signProjectData?.elevation_audit?.documentCompositionOfSignband || '',

    // Electrical safety
    electricLinesWithinWorkZone:
      signProjectData?.elevation_audit?.electricLinesWithinWorkZone || '',
    electricLinesDistFT:
      signProjectData?.elevation_audit?.electricLinesDistFT || '',
    electricLinesDistIN:
      signProjectData?.elevation_audit?.electricLinesDistIN || '',
    documentElectricSafety:
      signProjectData?.elevation_audit?.documentElectricSafety || '',
    electricLinesPhoto:
      signProjectData?.elevation_audit?.electricLinesPhoto || [],
    isContactingACallBeforeYouDigRequired:
      signProjectData?.elevation_audit?.isContactingACallBeforeYouDigRequired ||
      '',
    hasCallBeforeYouDigBeenContacted:
      signProjectData?.elevation_audit?.hasCallBeforeYouDigBeenContacted || '',
    callNotes: signProjectData?.elevation_audit?.callNotes || '',

    // Photos
    frontofsignPhoto: signProjectData?.elevation_audit?.frontofsignPhoto || [],
    streetStoreFrontPhoto:
      signProjectData?.elevation_audit?.streetStoreFrontPhoto || [],
    streetViewOfSign: signProjectData?.elevation_audit?.streetViewOfSign || [],
    otherSignPhoto: signProjectData?.elevation_audit?.otherSignPhoto || [],

    // Summary
    elevationAndSitePlanTodoPunchList: elevationAndSitePlanTodoPunchList,
    elevationAndSitePlanSummaryNotes: elevationAndSitePlanSummaryNotes,
  });

//   useEffect(() => {
//     getUserData();
//   }, []);

//   const getUserData = async () => {
//     try {
//       const userDataString = await AsyncStorage.getItem('userData');
//       if (userDataString) {
//         const userDataObject = JSON.parse(userDataString);
//         setUserData(userDataObject);
//       }
//     } catch (err) {
//       console.error('Error fetching user data from AsyncStorage:', err);
//     }
//   };

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
        await insertElevationAuditImagesOnly(
          signProjectData?.signTableId,
          fieldName1,
          updatedArray,
          0,
        );
        const imagesArray = await getElevationAuditImagesByKey(
          signProjectData?.signTableId,
          fieldName1,
        );
        setSelectedOptions(prev => ({
          ...prev,
          [fieldName1]: imagesArray || [],
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
          signProjectData?.elevation_audit?.id ||
          signProjectData?.elevation_audit?.Id,
        fieldName: fieldName1,
        surveyModule: 'elevation_audit',
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
              }
            } catch (err) {
              console.log('FILE REMOVEDDD', err);
            }
          }
          const imagesArray = response?.data?.data[actualKey] || [];
          await insertElevationAuditImagesOnly(
            signProjectData?.signTableId,
            actualKey,
            imagesArray,
            1,
          );
          const imagesArrayAfter = await getElevationAuditImagesByKey(
            signProjectData?.signTableId,
            actualKey,
          );
          setSelectedOptions(prev => ({
            ...prev,
            [actualKey]: imagesArrayAfter || [],
          }));
        }
      } else {
        createOfflineRemoveTable();
        const imagesArray = selectedOptions?.[actualKey]?.filter(
          item => item.imageId !== imageId1,
        );
        await insertElevationAuditImagesOnly(
          signProjectData?.signTableId,
          actualKey,
          imagesArray,
          0,
        );
        const imagesArrayAfter = await getElevationAuditImagesByKey(
          signProjectData?.signTableId,
          actualKey,
        );
        setSelectedOptions(prev => ({
          ...prev,
          [actualKey]: imagesArrayAfter || [],
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

  const handleSave = async () => {
    setLoadingImage(true);
    let base64s = [];
    const netState = await NetInfo.fetch();
    const isConnected = netState.isConnected;

    // Convert images to base64 for online sync
    if (isConnected) {
      base64s = await getBase64Array(selectedOptions?.storefrontPhoto || []);
    } else {
      base64s = selectedOptions?.storefrontPhoto || [];
    }

    const bodyData = {
      ...selectedOptions,
      storefrontPhoto: base64s,
      elevationAndSitePlanTodoPunchList,
      elevationAndSitePlanSummaryNotes,
      signAliasName: signProjectData?.signAliasName,
      signType: signProjectData?.signType,
    };

    try {
      if (isConnected) {
        const token = loginData?.tokenNumber;
        const response = await axios.post(
          `${baseUrl}/updateElevationAudit`,
          bodyData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response?.data?.status) {
          await deleteFolders();
          const cachePhotos = selectedOptions?.storefrontPhoto || [];
          for (const file of cachePhotos) {
            try {
              const fileExists = await RNFS.exists(file.path);
              if (fileExists) {
                await RNFS.unlink(file.path);
              }
            } catch (err) {
              console.log('Error checking file:', file.path, err);
            }
          }
          handleFetchData(null, signProjectData);
          Toast.show({
            type: 'success',
            text1:
              response?.data?.message || 'Elevation audit saved successfully.',
            visibilityTime: 3000,
            position: 'top',
          });
        } else {
          throw new Error('Sync failed with unknown server response.');
        }
      } else {
        updateElevationAudit(bodyData, 0);
        handleFetchData(null, signProjectData);
        Toast.show({
          type: 'info',
          text1: 'Saved Offline. Will sync later.',
          visibilityTime: 3000,
          position: 'top',
        });
      }
    } catch (error) {
      console.log('API Sync failed. Will still save locally.');
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

  // Radio button questions data
  const radioQuestions = [
    {
      question: 'Has Customer Supplied Plotted Survey?',
      options: ['Yes', 'No'],
      value: 'hasCustomerSuppliedPlottedSurvey',
      selectedValue: selectedOptions.hasCustomerSuppliedPlottedSurvey,
    },
    {
      question: 'Electric lines within work zone?',
      options: ['Yes', 'No'],
      value: 'electricLinesWithinWorkZone',
      selectedValue: selectedOptions.electricLinesWithinWorkZone,
    },
    {
      question: 'Is contacting a "call before you dig" required?',
      options: ['Yes', 'No'],
      value: 'isContactingACallBeforeYouDigRequired',
      selectedValue: selectedOptions.isContactingACallBeforeYouDigRequired,
    },
    {
      question: 'Has "call before you dig" been contacted?',
      options: ['Yes', 'No'],
      value: 'hasCallBeforeYouDigBeenContacted',
      selectedValue: selectedOptions.hasCallBeforeYouDigBeenContacted,
      condition:
        selectedOptions.isContactingACallBeforeYouDigRequired === 'Yes',
    },
  ];

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (active === '') {
            setActive('Elevation');
          } else {
            setActive('');
          }
        }}
        style={styles.container}>
        <View style={styles.iconWrapper}>
          <ElevationIcon width={30} height={30} />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.projectName}>
            {projectTitle || 'Project Name'}
          </Text>
          <Text style={styles.auditTitle}>Elevation & Site Plan</Text>
          <Text style={styles.projectName}>
            {signProjectData?.elevation_audit?.signType ||
              'Digital indoor free standing'}
          </Text>
        </View>
        <View style={styles.dropdownIconWrapper}>
          {active === 'Elevation' ? (
            <UpDownIcon width={39} height={39} />
          ) : (
            <DropDownIcon width={39} height={39} />
          )}
        </View>
      </TouchableOpacity>
      <View style={{marginTop: -8}}>
        {active === 'Elevation' && (
          <View style={[styles.card, {borderColor: '#b63c3c'}]}>
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
                  <Text style={styles.titleText}>Elevation & Site Plan</Text>
                  <Text style={styles.subTitleText}>Special instructions</Text>
                </View>
                <Text style={styles.authorText}>
                  {signProjectData?.elevation_audit?.adminName}
                </Text>
              </View>
              <View style={styles.instructionsSection}>
                <Text style={styles.instructionText}>
                  Complete all elevation and site plan measurements and
                  documentation.
                </Text>
                <Text style={styles.dateText}>
                  {signProjectData?.elevation_audit?.createdDate?.slice(0, 10)}
                </Text>
              </View>
            </View>

            {/* Storefront Measurements */}
            <View style={styles.section}>
              <Text style={styles.label}>Storefront Measurements</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <TextInput
                    style={styles.input}
                    placeholder="Height (ft)"
                    value={selectedOptions.storefrontHeightFT}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        storefrontHeightFT: text,
                      }))
                    }
                  />
                </View>
                <View style={styles.inputGroup}>
                  <TextInput
                    style={styles.input}
                    placeholder="Height (in)"
                    value={selectedOptions.storefrontHeightIN}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        storefrontHeightIN: text,
                      }))
                    }
                  />
                </View>
              </View>
              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <TextInput
                    style={styles.input}
                    placeholder="Width (ft)"
                    value={selectedOptions.storefrontWidthFT}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        storefrontWidthFT: text,
                      }))
                    }
                  />
                </View>
                <View style={styles.inputGroup}>
                  <TextInput
                    style={styles.input}
                    placeholder="Width (in)"
                    value={selectedOptions.storefrontWidthIN}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        storefrontWidthIN: text,
                      }))
                    }
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.imageCon}
                onPress={() => {
                  showPhotoOptions(
                    setSelectedOptions,
                    'storefrontPhoto',
                    'ElevationAudit',
                    false,
                  );
                }}>
                <View style={styles.photoButton}>
                  <Text style={styles.photoText}>add photo</Text>
                  <Photo />
                </View>
                <View style={styles.fileNameContainer}>
                  <Text style={styles.fileNameText}>
                    {selectedOptions?.storefrontPhoto?.length > 0
                      ? `${selectedOptions?.storefrontPhoto?.length} File Choosen`
                      : 'No File Choosen'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Display Images */}
              <View style={styles.imagesContainer}>
                {loadingImage ? (
                  <ActivityIndicator size="small" color="#FF9239" />
                ) : (
                  (selectedOptions?.storefrontPhoto || []).map(
                    (item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          openEditorforUpdate(
                            item.path,
                            setSelectedOptions,
                            'storefrontPhoto',
                            'ElevationAudit',
                            true,
                            item.ImageId,
                            baseUrl,
                            loginData?.tokenNumber,
                            true,
                            signProjectData?.elevation_audit?.id ||
                              signProjectData?.elevation_audit?.Id,
                            'elevation_audit',
                            true,
                            selectedOptions,
                          );
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
                              handleRemoveImage(
                                item.ImageId,
                                'storefrontPhoto',
                                'storefrontPhoto',
                                item.path,
                                true,
                              );
                            }}
                            style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>×</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ),
                  )
                )}
              </View>
            </View>

            {/* Radio Questions */}
            <FlatList
              data={radioQuestions.filter(
                q => !q.condition || (q.condition && q.condition),
              )}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View style={styles.radioSection}>
                  <Text style={styles.radioQuestionText}>{item.question}</Text>
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
                              prev?.[item.value]?.toLowerCase?.() || '';
                            const incoming = value1.toLowerCase();
                            return {
                              ...prev,
                              [item.value]: current === incoming ? '' : value1,
                            };
                          });
                        }}
                      />
                    ))}
                  </View>

                  {/* Conditional fields based on radio selection */}
                  {item.value === 'electricLinesWithinWorkZone' &&
                    selectedOptions[item.value] === 'Yes' && (
                      <View>
                        <View style={styles.inputRow}>
                          <View style={styles.inputGroup}>
                            <TextInput
                              style={styles.input}
                              placeholder="Distance (ft)"
                              value={selectedOptions.electricLinesDistFT}
                              onChangeText={text =>
                                setSelectedOptions(prev => ({
                                  ...prev,
                                  electricLinesDistFT: text,
                                }))
                              }
                            />
                          </View>
                          <View style={styles.inputGroup}>
                            <TextInput
                              style={styles.input}
                              placeholder="Distance (in)"
                              value={selectedOptions.electricLinesDistIN}
                              onChangeText={text =>
                                setSelectedOptions(prev => ({
                                  ...prev,
                                  electricLinesDistIN: text,
                                }))
                              }
                            />
                          </View>
                        </View>
                        <TextInput
                          style={[styles.input, {marginBottom: 12}]}
                          placeholder="Document electric safety"
                          value={selectedOptions.documentElectricSafety}
                          onChangeText={text =>
                            setSelectedOptions(prev => ({
                              ...prev,
                              documentElectricSafety: text,
                            }))
                          }
                        />
                      </View>
                    )}

                  {item.value === 'hasCallBeforeYouDigBeenContacted' &&
                    selectedOptions[item.value] === 'Yes' && (
                      <TextInput
                        style={[styles.input, {marginBottom: 12}]}
                        placeholder="Call notes"
                        value={selectedOptions.callNotes}
                        onChangeText={text =>
                          setSelectedOptions(prev => ({
                            ...prev,
                            callNotes: text,
                          }))
                        }
                      />
                    )}
                </View>
              )}
            />

            {/* Additional Photo Sections */}
            <View style={styles.section}>
              <Text style={styles.label}>Additional Photos</Text>

              {/* Street View of Storefront */}
              <TouchableOpacity
                style={styles.imageCon}
                onPress={() => {
                  showPhotoOptions(
                    setSelectedOptions,
                    'streetStoreFrontPhoto',
                    'ElevationAudit',
                    false,
                  );
                }}>
                <View style={styles.photoButton}>
                  <Text style={styles.photoText}>
                    Street View of Storefront
                  </Text>
                  <Photo />
                </View>
                <View style={styles.fileNameContainer}>
                  <Text style={styles.fileNameText}>
                    {selectedOptions?.streetStoreFrontPhoto?.length > 0
                      ? `${selectedOptions?.streetStoreFrontPhoto?.length} File Choosen`
                      : 'No File Choosen'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Street View of Sign */}
              <TouchableOpacity
                style={styles.imageCon}
                onPress={() => {
                  showPhotoOptions(
                    setSelectedOptions,
                    'streetViewOfSign',
                    'ElevationAudit',
                    false,
                  );
                }}>
                <View style={styles.photoButton}>
                  <Text style={styles.photoText}>Street View of Sign</Text>
                  <Photo />
                </View>
                <View style={styles.fileNameContainer}>
                  <Text style={styles.fileNameText}>
                    {selectedOptions?.streetViewOfSign?.length > 0
                      ? `${selectedOptions?.streetViewOfSign?.length} File Choosen`
                      : 'No File Choosen'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* To Do / Punch List */}
            <View style={styles.section}>
              <Text style={styles.label}>To do / punch list</Text>
              <TextInput
                style={[styles.input, {height: 100}]}
                maxLength={300}
                placeholder="To do / punch list"
                multiline={true}
                textAlignVertical="top"
                value={elevationAndSitePlanTodoPunchList}
                onChangeText={setElevationAndSitePlanTodoPunchList}
              />
              <Text style={{textAlign: 'right', marginTop: 5}}>
                {elevationAndSitePlanTodoPunchList?.length}/300
              </Text>
            </View>

            {/* Summary Notes */}
            <View style={styles.section}>
              <Text style={styles.label}>Summary Notes</Text>
              <TextInput
                style={[styles.input, {height: 100}]}
                multiline={true}
                textAlignVertical="top"
                placeholder="Notes"
                value={elevationAndSitePlanSummaryNotes}
                onChangeText={setElevationAndSitePlanSummaryNotes}
              />
              <Text style={{textAlign: 'right', marginTop: 5}}>
                {elevationAndSitePlanSummaryNotes?.length}/300
              </Text>
            </View>

            {/* Save Button */}
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

export default ElevationSitePlan;
