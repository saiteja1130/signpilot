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
// import ElevationIcon from '../../assets/images/elevation.svg';
import DropDownIcon from '../../assets/images/downarrow.svg';
import UpDownIcon from '../../assets/images/arrowup.svg';
import SaveImg from '../../assets/images/save.svg';
import Photo from '../../assets/images/photo.svg';
import RadioButton from './RadioButton';

// Import database functions (create similar ones for elevation audit)
import {
  createOfflineRemoveTable,
  getElevationAndSiteImagesByKey,
  insertElevationAndSiteImagesOnly,
  insertOfflineRemove,
  updateElevationAndSitePlan,
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
import Exist from '../../assets/images/5.svg';

import {styles} from '../Global/Global';

const ElevationSitePlan = ({handleFetchData}) => {
  const projectTitle = useSelector(state => state.projecttitle.value);
  const baseUrl = useSelector(state => state.baseUrl.value);
  const loginData = useSelector(state => state.login.value);
  const signProjectData = useSelector(state => state.signProject.value);
  const [loadingImage, setLoadingImage] = useState(false);
  const [active, setActive] = useState('');

  const [
    elevationAndSitePlanTodoPunchList,
    setElevationAndSitePlanTodoPunchList,
  ] = useState(
    signProjectData?.elevation_and_siteplan?.elevationAndSitePlanTodoPunchList,
  );
  const [
    elevationAndSitePlanSummaryNotes,
    setElevationAndSitePlanSummaryNotes,
  ] = useState(
    signProjectData?.elevation_and_siteplan?.elevationAndSitePlanSummaryNotes,
  );

  console.log('signProjectData?.elevation_and_siteplan', signProjectData);

  const [selectedOptions, setSelectedOptions] = useState({
    Id:
      signProjectData?.elevation_and_siteplan?.id ||
      signProjectData?.elevation_and_siteplan?.Id,
    projectId: signProjectData?.elevation_and_siteplan?.projectId || '',
    signId: signProjectData?.elevation_and_siteplan?.signId || '',
    optionId: signProjectData?.elevation_and_siteplan?.optionId || '',
    signType: signProjectData?.elevation_and_siteplan?.signType || '',
    customerName: signProjectData?.elevation_and_siteplan?.customerName || '',
    teamId: loginData?.userId,
    adminId: loginData?.userId || '',
    adminName: loginData?.userName || '',
    storefrontHeightFT:
      signProjectData?.elevation_and_siteplan?.storefrontHeightFT || '',
    storefrontHeightIN:
      signProjectData?.elevation_and_siteplan?.storefrontHeightIN || '',
    storefrontWidthFT:
      signProjectData?.elevation_and_siteplan?.storefrontWidthFT || '',
    storefrontWidthIN:
      signProjectData?.elevation_and_siteplan?.storefrontWidthIN || '',
    storefrontPhoto:
      signProjectData?.elevation_and_siteplan?.storefrontPhoto || [],
    hasCustomerSuppliedPlottedSurvey:
      signProjectData?.elevation_and_siteplan
        ?.hasCustomerSuppliedPlottedSurvey || '',
    hasCustomerSuppliedPlottedSurveyPhoto:
      signProjectData?.elevation_and_siteplan
        ?.hasCustomerSuppliedPlottedSurveyPhoto || [],
    hasCustomerSuppliedPlottedSurveyFile:
      signProjectData?.elevation_and_siteplan
        ?.hasCustomerSuppliedPlottedSurveyFile || [],
    measureDistanceDistFT:
      signProjectData?.elevation_and_siteplan?.measureDistanceDistFT || '',
    measureDistanceDistIN:
      signProjectData?.elevation_and_siteplan?.measureDistanceDistIN || '',
    measureDistanceLengthFT:
      signProjectData?.elevation_and_siteplan?.measureDistanceLengthFT || '',
    measureDistanceLengthIN:
      signProjectData?.elevation_and_siteplan?.measureDistanceLengthIN || '',
    measureDistanceSignToStoreDistFT:
      signProjectData?.elevation_and_siteplan
        ?.measureDistanceSignToStoreDistFT || '',
    measureDistanceSignToStoreDistIN:
      signProjectData?.elevation_and_siteplan
        ?.measureDistanceSignToStoreDistIN || '',
    measureDistanceSignToStoreImage:
      signProjectData?.elevation_and_siteplan
        ?.measureDistanceSignToStoreImage || [],
    measureDistanceSignToStreetDistFT:
      signProjectData?.elevation_and_siteplan
        ?.measureDistanceSignToStreetDistFT || '',
    measureDistanceSignToStreetDistIN:
      signProjectData?.elevation_and_siteplan
        ?.measureDistanceSignToStreetDistIN || '',
    measureDistanceSignToStreetImage:
      signProjectData?.elevation_and_siteplan
        ?.measureDistanceSignToStreetImage || [],
    measureSignBandHeightFT:
      signProjectData?.elevation_and_siteplan?.measureSignBandHeightFT || '',
    measureSignBandHeightIN:
      signProjectData?.elevation_and_siteplan?.measureSignBandHeightIN || '',
    measureSignBandWidthFT:
      signProjectData?.elevation_and_siteplan?.measureSignBandWidthFT || '',
    measureSignBandWidthIN:
      signProjectData?.elevation_and_siteplan?.measureSignBandWidthIN || '',
    measureSignBandPhoto:
      signProjectData?.elevation_and_siteplan?.measureSignBandPhoto || [],
    documentCompositionOfSignband:
      signProjectData?.elevation_and_siteplan?.documentCompositionOfSignband ||
      '',
    electricLinesWithinWorkZone:
      signProjectData?.elevation_and_siteplan?.electricLinesWithinWorkZone ||
      '',
    electricLinesDistFT:
      signProjectData?.elevation_and_siteplan?.electricLinesDistFT || '',
    electricLinesDistIN:
      signProjectData?.elevation_and_siteplan?.electricLinesDistIN || '',
    documentElectricSafety:
      signProjectData?.elevation_and_siteplan?.documentElectricSafety || '',
    electricLinesPhoto:
      signProjectData?.elevation_and_siteplan?.electricLinesPhoto || [],
    isContactingACallBeforeYouDigRequired:
      signProjectData?.elevation_and_siteplan
        ?.isContactingACallBeforeYouDigRequired || '',
    hasCallBeforeYouDigBeenContacted:
      signProjectData?.elevation_and_siteplan
        ?.hasCallBeforeYouDigBeenContacted || '',
    callNotes: signProjectData?.elevation_and_siteplan?.callNotes || '',
    measureDoorsHeightFT1:
      signProjectData?.elevation_and_siteplan?.measureDoorsHeightFT1 || '',
    measureDoorsHeightFT2:
      signProjectData?.elevation_and_siteplan?.measureDoorsHeightFT2 || '',
    measureDoorsHeightIN1:
      signProjectData?.elevation_and_siteplan?.measureDoorsHeightIN1 || '',
    measureDoorsHeightIN2:
      signProjectData?.elevation_and_siteplan?.measureDoorsHeightIN2 || '',
    measureDoorsWidthFT1:
      signProjectData?.elevation_and_siteplan?.measureDoorsWidthFT1 || '',
    measureDoorsWidthFT2:
      signProjectData?.elevation_and_siteplan?.measureDoorsWidthFT2 || '',
    measureDoorsWidthIN1:
      signProjectData?.elevation_and_siteplan?.measureDoorsWidthIN1 || '',
    measureDoorsWidthIN2:
      signProjectData?.elevation_and_siteplan?.measureDoorsWidthIN2 || '',
    measureLinearFrontageDistFT:
      signProjectData?.elevation_and_siteplan?.measureLinearFrontageDistFT ||
      '',
    measureLinearFrontageDistIN:
      signProjectData?.elevation_and_siteplan?.measureLinearFrontageDistIN ||
      '',
    measureLinearFrontageLengthFT:
      signProjectData?.elevation_and_siteplan?.measureLinearFrontageLengthFT ||
      '',
    measureLinearFrontageLengthIN:
      signProjectData?.elevation_and_siteplan?.measureLinearFrontageLengthIN ||
      '',
    measureWidthOfEasementWidthFT:
      signProjectData?.elevation_and_siteplan?.measureWidthOfEasementWidthFT ||
      '',
    measureWidthOfEasementWidthIN:
      signProjectData?.elevation_and_siteplan?.measureWidthOfEasementWidthIN ||
      '',
    measureWindowsHeightFT1:
      signProjectData?.elevation_and_siteplan?.measureWindowsHeightFT1 || '',
    measureWindowsHeightFT3:
      signProjectData?.elevation_and_siteplan?.measureWindowsHeightFT3 || '',
    measureWindowsHeightIN1:
      signProjectData?.elevation_and_siteplan?.measureWindowsHeightIN1 || '',
    measureWindowsHeightIN3:
      signProjectData?.elevation_and_siteplan?.measureWindowsHeightIN3 || '',
    measureWindowsWidthFT2:
      signProjectData?.elevation_and_siteplan?.measureWindowsWidthFT2 || '',
    measureWindowsWidthFT4:
      signProjectData?.elevation_and_siteplan?.measureWindowsWidthFT4 || '',
    measureWindowsWidthIN2:
      signProjectData?.elevation_and_siteplan?.measureWindowsWidthIN2 || '',
    measureWindowsWidthIN4:
      signProjectData?.elevation_and_siteplan?.measureWindowsWidthIN4 || '',
    measurement: signProjectData?.elevation_and_siteplan?.measurement || '',
    outdoorOtherPhotosDepthFT:
      signProjectData?.elevation_and_siteplan?.outdoorOtherPhotosDepthFT || '',
    outdoorOtherPhotosDepthIN:
      signProjectData?.elevation_and_siteplan?.outdoorOtherPhotosDepthIN || '',
    outdoorOtherPhotosHeightFT:
      signProjectData?.elevation_and_siteplan?.outdoorOtherPhotosHeightFT || '',
    outdoorOtherPhotosHeightIN:
      signProjectData?.elevation_and_siteplan?.outdoorOtherPhotosHeightIN || '',
    outdoorOtherPhotosWidthFT:
      signProjectData?.elevation_and_siteplan?.outdoorOtherPhotosWidthFT || '',
    outdoorOtherPhotosWidthIN:
      signProjectData?.elevation_and_siteplan?.outdoorOtherPhotosWidthIN || '',
    frontofsignPhoto:
      signProjectData?.elevation_and_siteplan?.frontofsignPhoto || [],
    streetStoreFrontPhoto:
      signProjectData?.elevation_and_siteplan?.streetStoreFrontPhoto || [],
    streetStoreFrontPhotos:
      signProjectData?.elevation_and_siteplan?.streetStoreFrontPhotos || [],
    streetViewOfSign:
      signProjectData?.elevation_and_siteplan?.streetViewOfSign || [],
    streetViewOfSigns:
      signProjectData?.elevation_and_siteplan?.streetViewOfSigns || [],
    otherSignPhoto:
      signProjectData?.elevation_and_siteplan?.otherSignPhoto || [],
    elevationAndSitePlanTodoPunchList: elevationAndSitePlanTodoPunchList || '',
    elevationAndSitePlanSummaryNotes: elevationAndSitePlanSummaryNotes || '',
    storefrontSpikePhoto:
      signProjectData?.elevation_and_siteplan?.storefrontSpikePhoto || [],
    storefrontSpikePhotos:
      signProjectData?.elevation_and_siteplan?.storefrontSpikePhotos || [],
    measureLinearFrontagePhoto:
      signProjectData?.elevation_and_siteplan?.measureLinearFrontagePhoto || [],
    measureLinearFrontagePhotos:
      signProjectData?.elevation_and_siteplan?.measureLinearFrontagePhotos ||
      [],
    measureLinearFrontageSpikePhoto:
      signProjectData?.elevation_and_siteplan
        ?.measureLinearFrontageSpikePhoto || [],
    measureLinearFrontageSpikePhotos:
      signProjectData?.elevation_and_siteplan
        ?.measureLinearFrontageSpikePhotos || [],
    electricLinesSpikePhoto:
      signProjectData?.elevation_and_siteplan?.electricLinesSpikePhoto || [],
    oneOftwoSidesBuildingPhoto:
      signProjectData?.elevation_and_siteplan?.oneOftwoSidesBuildingPhoto || [],
    backOfStorefrontPhoto:
      signProjectData?.elevation_and_siteplan?.backOfStorefrontPhoto || [],
    twoOfTwoSideOfBuilding:
      signProjectData?.elevation_and_siteplan?.twoOfTwoSideOfBuilding || '',
    outdoorOtherPhotoImage:
      signProjectData?.elevation_and_siteplan?.outdoorOtherPhotoImage || [],
    videoWalkthrough:
      signProjectData?.elevation_and_siteplan?.videoWalkthrough || [],
    measureSignBandSpike:
      signProjectData?.elevation_and_siteplan?.measureSignBandSpike || [],
    measureDistanceSignToStoreSpike:
      signProjectData?.elevation_and_siteplan
        ?.measureDistanceSignToStoreSpike || '',
    measureWidthOfEasementImage:
      signProjectData?.elevation_and_siteplan?.measureWidthOfEasementImage ||
      [],
    measureWidthOfEasementImages:
      signProjectData?.elevation_and_siteplan?.measureWidthOfEasementImages ||
      [],
    measureWidthOfEasementSpike:
      signProjectData?.elevation_and_siteplan?.measureWidthOfEasementSpike ||
      '',
    photoStoreViewOfSignImage:
      signProjectData?.elevation_and_siteplan?.photoStoreViewOfSignImage || [],
    measureDistanceImage:
      signProjectData?.elevation_and_siteplan?.measureDistanceImage || [],
    measureDistanceSpike:
      signProjectData?.elevation_and_siteplan?.measureDistanceSpike || '',
    surveyModule: '',

    storefrontPhotos:
      signProjectData?.elevation_and_siteplan?.storefrontPhotos || [],
  });

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
        await insertElevationAndSiteImagesOnly(
          signProjectData?.signTableId,
          fieldName1,
          updatedArray,
          0,
        );
        const imagesArray = await getElevationAndSiteImagesByKey(
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
          signProjectData?.elevation_and_siteplan?.id ||
          signProjectData?.elevation_and_siteplan?.Id,
        fieldName: fieldName1,
        surveyModule: 'elevation_and_siteplan',
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
          await insertElevationAndSiteImagesOnly(
            signProjectData?.signTableId,
            actualKey,
            imagesArray,
            1,
          );
          const imagesArrayAfter = await getElevationAndSiteImagesByKey(
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
        const imagesArrayAfter = await getElevationAndSiteImagesByKey(
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
    const netState = await NetInfo.fetch();
    const isConnected = netState.isConnected;
    let base64storefrontPhoto = [];
    let base64measureLinearFrontagePhoto = [];
    let base64measureWidthOfEasementImage = [];
    let base64otherPhotosMeasurementsMarkupsPhoto = [];
    let base64storefrontSpikePhoto = [];
    let base64streetStoreFrontPhoto = [];
    let base64streetViewOfSign = [];
    if (isConnected) {
      base64storefrontPhoto = await getBase64Array(
        selectedOptions?.storefrontPhoto || [],
      );
      base64measureLinearFrontagePhoto = await getBase64Array(
        selectedOptions?.measureLinearFrontagePhoto || [],
      );
      base64measureWidthOfEasementImage = await getBase64Array(
        selectedOptions?.measureWidthOfEasementImage || [],
      );
      base64otherPhotosMeasurementsMarkupsPhoto = await getBase64Array(
        selectedOptions?.otherPhotosMeasurementsMarkupsPhoto || [],
      );
      base64storefrontSpikePhoto = await getBase64Array(
        selectedOptions?.storefrontSpikePhoto || [],
      );
      base64streetStoreFrontPhoto = await getBase64Array(
        selectedOptions?.streetStoreFrontPhoto || [],
      );
      base64streetViewOfSign = await getBase64Array(
        selectedOptions?.streetViewOfSign || [],
      );
    } else {
      base64storefrontPhoto = selectedOptions?.storefrontPhoto || [];
      base64measureLinearFrontagePhoto =
        selectedOptions?.measureLinearFrontagePhoto || [];
      base64measureWidthOfEasementImage =
        selectedOptions?.measureWidthOfEasementImage || [];
      base64otherPhotosMeasurementsMarkupsPhoto =
        selectedOptions?.otherPhotosMeasurementsMarkupsPhoto || [];
      base64storefrontSpikePhoto = selectedOptions?.storefrontSpikePhoto || [];
      base64streetStoreFrontPhoto =
        selectedOptions?.streetStoreFrontPhoto || [];
      base64streetViewOfSign = selectedOptions?.streetViewOfSign || [];
    }

    const bodyData = {
      ...selectedOptions,
      storefrontPhoto: base64storefrontPhoto,
      elevationAndSitePlanTodoPunchList,
      elevationAndSitePlanSummaryNotes,
      signAliasName: signProjectData?.signAliasName,
      signType: signProjectData?.signType,
      measureLinearFrontagePhoto: base64measureLinearFrontagePhoto,
      measureWidthOfEasementImage: base64measureWidthOfEasementImage,
      otherPhotosMeasurementsMarkupsPhoto:
        base64otherPhotosMeasurementsMarkupsPhoto,
      storefrontSpikePhoto: base64storefrontSpikePhoto,
      streetStoreFrontPhoto: base64streetStoreFrontPhoto,
      streetViewOfSign: base64streetViewOfSign,
    };

    // console.log('PAYLOADD', bodyData);

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
          const cachePhotos = [
            ...(selectedOptions?.storefrontPhoto || []),
            selectedOptions?.measureLinearFrontagePhoto || [],
            selectedOptions?.measureWidthOfEasementImage || [],
            selectedOptions?.otherPhotosMeasurementsMarkupsPhoto || [],
            selectedOptions?.storefrontSpikePhoto || [],
            selectedOptions?.streetViewOfSign || [],
            ,
            selectedOptions?.streetStoreFrontPhoto || [],
          ];
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
        updateElevationAndSitePlan(bodyData, 0);
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
        style={[styles.container, {borderColor: '#b63c3c'}]}>
        <View style={[styles.iconWrapper, {backgroundColor: '#b63c3c'}]}>
          <Exist width={30} height={30} />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.projectName}>
            {projectTitle || 'Project Name'}
          </Text>
          <Text style={styles.auditTitle}>Elevation & Site Plan</Text>
          <Text style={styles.projectName}>
            {signProjectData?.elevation_and_siteplan?.signType ||
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
            {/* <View style={[styles.headerSection, {backgroundColor: '#F7F9FC'}]}>
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
                  {signProjectData?.elevation_and_siteplan?.adminName}
                </Text>
              </View>
              <View style={styles.instructionsSection}>
                <Text style={styles.instructionText}>
                  Complete all elevation and site plan measurements and
                  documentation.
                </Text>
                <Text style={styles.dateText}>
                  {signProjectData?.elevation_and_siteplan?.createdDate?.slice(
                    0,
                    10,
                  )}
                </Text>
              </View>
            </View> */}

            {/* Storefront Measurements */}
            <View
              style={[
                styles.section,
                {borderBottomWidth: 0, marginBottom: 16},
              ]}>
              <Text style={styles.label}>Storefront Measurements</Text>
              <View style={styles.row}>
                <View style={{flex: 1}}>
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
                <View style={{flex: 1}}>
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
              <View style={styles.row}>
                <View style={{flex: 1}}>
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
                <View style={{flex: 1}}>
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
                    const mergedStorefrontImages = [
                      ...(selectedOptions?.storefrontPhoto?.map(item => ({
                        ...item,
                        isLocal: true,
                      })) || []),
                      ...(selectedOptions?.storefrontPhotos?.map(item => ({
                        ...item,
                        isLocal: false,
                      })) || []),
                    ];

                    console.log(
                      'MERGED STOREFRONT IMAGES',
                      mergedStorefrontImages,
                    );

                    if (mergedStorefrontImages.length === 0) return null;

                    return mergedStorefrontImages.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          openEditorforUpdate(
                            item.path,
                            setSelectedOptions,
                            item.isLocal
                              ? 'storefrontPhoto'
                              : 'storefrontPhotos',
                            'ElevationAudit',
                            true,
                            item.isLocal ? item.ImageId : item.imageId,
                            baseUrl,
                            loginData?.tokenNumber,
                            true,
                            signProjectData?.elevation_and_siteplan?.id ||
                              signProjectData?.elevation_and_siteplan?.Id,
                            'elevation_and_siteplan',
                            item.isLocal,
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
                                item.isLocal ? item.ImageId : item.imageId,
                                'storefrontPhoto',
                                'storefrontPhotos',
                                item.path,
                                item.isLocal,
                              );
                            }}
                            style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>×</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ));
                  })()
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
                    (selectedOptions[item.value] === 'Yes' ||
                      selectedOptions[item.value] === 'yes') && (
                      <View>
                        <View style={styles.row}>
                          <View style={{flex: 1}}>
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
                          <View style={{flex: 1}}>
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

            {/* Doors Measurements */}
            <View
              style={[
                styles.section,
                {borderBottomWidth: 0, marginBottom: 16},
              ]}>
              <Text style={styles.label}>Doors Measurements</Text>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Height 1 (ft)"
                    value={selectedOptions.measureDoorsHeightFT1}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureDoorsHeightFT1: text,
                      }))
                    }
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Height 1 (in)"
                    value={selectedOptions.measureDoorsHeightIN1}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureDoorsHeightIN1: text,
                      }))
                    }
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Height 2 (ft)"
                    value={selectedOptions.measureDoorsHeightFT2}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureDoorsHeightFT2: text,
                      }))
                    }
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Height 2 (in)"
                    value={selectedOptions.measureDoorsHeightIN2}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureDoorsHeightIN2: text,
                      }))
                    }
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Width 1 (ft)"
                    value={selectedOptions.measureDoorsWidthFT1}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureDoorsWidthFT1: text,
                      }))
                    }
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Width 1 (in)"
                    value={selectedOptions.measureDoorsWidthIN1}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureDoorsWidthIN1: text,
                      }))
                    }
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Width 2 (ft)"
                    value={selectedOptions.measureDoorsWidthFT2}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureDoorsWidthFT2: text,
                      }))
                    }
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Width 2 (in)"
                    value={selectedOptions.measureDoorsWidthIN2}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureDoorsWidthIN2: text,
                      }))
                    }
                  />
                </View>
              </View>
            </View>

            {/* Linear Frontage Measurements */}
            <View
              style={[
                styles.section,
                {borderBottomWidth: 0, marginBottom: 16},
              ]}>
              <Text style={styles.label}>Linear Frontage</Text>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Distance (ft)"
                    value={selectedOptions.measureLinearFrontageDistFT}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureLinearFrontageDistFT: text,
                      }))
                    }
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Distance (in)"
                    value={selectedOptions.measureLinearFrontageDistIN}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureLinearFrontageDistIN: text,
                      }))
                    }
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Length (ft)"
                    value={selectedOptions.measureLinearFrontageLengthFT}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureLinearFrontageLengthFT: text,
                      }))
                    }
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Length (in)"
                    value={selectedOptions.measureLinearFrontageLengthIN}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureLinearFrontageLengthIN: text,
                      }))
                    }
                  />
                </View>
              </View>
              {/* Photo Upload */}
              <TouchableOpacity
                style={styles.imageCon}
                onPress={() => {
                  showPhotoOptions(
                    setSelectedOptions,
                    'measureLinearFrontagePhoto',
                    'ElevationAudit',
                    false,
                  );
                }}>
                <View style={styles.photoButton}>
                  <Text style={styles.photoText}>Upload Photos</Text>
                  <Photo />
                </View>
                <View style={styles.fileNameContainer}>
                  <Text style={styles.fileNameText}>
                    {selectedOptions?.measureLinearFrontagePhoto?.length > 0
                      ? `${selectedOptions?.measureLinearFrontagePhoto?.length} File Choosen`
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
                    const mergedLinearFrontageImages = [
                      ...(selectedOptions?.measureLinearFrontagePhoto?.map(
                        item => ({
                          ...item,
                          isLocal: true,
                        }),
                      ) || []),
                      ...(selectedOptions?.measureLinearFrontagePhotos?.map(
                        item => ({
                          ...item,
                          isLocal: false,
                        }),
                      ) || []),
                    ];

                    if (mergedLinearFrontageImages.length === 0) return null;

                    return mergedLinearFrontageImages.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          openEditorforUpdate(
                            item.path,
                            setSelectedOptions,
                            item.isLocal
                              ? 'measureLinearFrontagePhoto'
                              : 'measureLinearFrontagePhotos',
                            'ElevationAudit',
                            true,
                            item.isLocal ? item.ImageId : item.imageId,
                            baseUrl,
                            loginData?.tokenNumber,
                            true,
                            signProjectData?.elevation_and_siteplan?.id ||
                              signProjectData?.elevation_and_siteplan?.Id,
                            'elevation_and_siteplan',
                            item.isLocal,
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
                                item.isLocal ? item.ImageId : item.imageId,
                                'measureLinearFrontagePhoto',
                                'measureLinearFrontagePhotos',
                                item.path,
                                item.isLocal,
                              );
                            }}
                            style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>×</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ));
                  })()
                )}
              </View>
            </View>

            {/* Easement Measurements */}
            <View
              style={[
                styles.section,
                {borderBottomWidth: 0, marginBottom: 16},
              ]}>
              <Text style={styles.label}>Easement Measurements</Text>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Width (ft)"
                    value={selectedOptions.measureWidthOfEasementWidthFT}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureWidthOfEasementWidthFT: text,
                      }))
                    }
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Width (in)"
                    value={selectedOptions.measureWidthOfEasementWidthIN}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureWidthOfEasementWidthIN: text,
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
                    'measureWidthOfEasementImage',
                    'ElevationAudit',
                    false,
                  );
                }}>
                <View style={styles.photoButton}>
                  <Text style={styles.photoText}>Upload Photos</Text>
                  <Photo />
                </View>
                <View style={styles.fileNameContainer}>
                  <Text style={styles.fileNameText}>
                    {selectedOptions?.measureWidthOfEasementImage?.length > 0
                      ? `${selectedOptions?.measureWidthOfEasementImage?.length} File Choosen`
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
                    const mergedEasementImages = [
                      ...(selectedOptions?.measureWidthOfEasementImage?.map(
                        item => ({
                          ...item,
                          isLocal: true,
                        }),
                      ) || []),
                      ...(selectedOptions?.measureWidthOfEasementImages?.map(
                        item => ({
                          ...item,
                          isLocal: false,
                        }),
                      ) || []),
                    ];

                    if (mergedEasementImages.length === 0) return null;

                    return mergedEasementImages.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          openEditorforUpdate(
                            item.path,
                            setSelectedOptions,
                            item.isLocal
                              ? 'measureWidthOfEasementImage'
                              : 'measureWidthOfEasementImages',
                            'ElevationAudit',
                            true,
                            item.isLocal ? item.ImageId : item.imageId,
                            baseUrl,
                            loginData?.tokenNumber,
                            true,
                            signProjectData?.elevation_and_siteplan?.id ||
                              signProjectData?.elevation_and_siteplan?.Id,
                            'elevation_and_siteplan',
                            item.isLocal,
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
                                item.isLocal ? item.ImageId : item.imageId,
                                'measureWidthOfEasementImage',
                                'measureWidthOfEasementImages',
                                item.path,
                                item.isLocal,
                              );
                            }}
                            style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>×</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ));
                  })()
                )}
              </View>
            </View>

            {/* Windows Measurements */}
            <View
              style={[
                styles.section,
                {borderBottomWidth: 0, marginBottom: 16},
              ]}>
              <Text style={styles.label}>Windows Measurements</Text>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Height 1 (ft)"
                    value={selectedOptions.measureWindowsHeightFT1}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureWindowsHeightFT1: text,
                      }))
                    }
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Height 1 (in)"
                    value={selectedOptions.measureWindowsHeightIN1}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureWindowsHeightIN1: text,
                      }))
                    }
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Height 3 (ft)"
                    value={selectedOptions.measureWindowsHeightFT3}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureWindowsHeightFT3: text,
                      }))
                    }
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Height 3 (in)"
                    value={selectedOptions.measureWindowsHeightIN3}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureWindowsHeightIN3: text,
                      }))
                    }
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Width 2 (ft)"
                    value={selectedOptions.measureWindowsWidthFT2}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureWindowsWidthFT2: text,
                      }))
                    }
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Width 2 (in)"
                    value={selectedOptions.measureWindowsWidthIN2}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureWindowsWidthIN2: text,
                      }))
                    }
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Width 4 (ft)"
                    value={selectedOptions.measureWindowsWidthFT4}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureWindowsWidthFT4: text,
                      }))
                    }
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Width 4 (in)"
                    value={selectedOptions.measureWindowsWidthIN4}
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        measureWindowsWidthIN4: text,
                      }))
                    }
                  />
                </View>
              </View>
            </View>

            {/* Other Outdoor Photos */}
            <View
              style={[
                styles.section,
                {borderBottomWidth: 0, marginBottom: 16},
              ]}>
              <Text style={styles.label}>Other Outdoor Photos</Text>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Height (ft)"
                    value={
                      selectedOptions.otherPhotosMeasurementsMarkupsHeightFT
                    }
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        otherPhotosMeasurementsMarkupsHeightFT: text,
                      }))
                    }
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Height (in)"
                    value={
                      selectedOptions.otherPhotosMeasurementsMarkupsHeightIN
                    }
                    onChangeText={text =>
                      setSelectedOptions(prev => ({
                        ...prev,
                        otherPhotosMeasurementsMarkupsHeightIN: text,
                      }))
                    }
                  />
                </View>
              </View>
              {/* <TouchableOpacity
                style={styles.imageCon}
                onPress={() => {
                  showPhotoOptions(
                    setSelectedOptions,
                    'otherPhotosMeasurementsMarkupsPhoto',
                    'ElevationAudit',
                    false,
                  );
                }}>
                <View style={styles.photoButton}>
                  <Text style={styles.photoText}>Upload Photos</Text>
                  <Photo />
                </View>
                <View style={styles.fileNameContainer}>
                  <Text style={styles.fileNameText}>
                    {selectedOptions?.otherPhotosMeasurementsMarkupsPhoto
                      ?.length > 0
                      ? `${selectedOptions?.otherPhotosMeasurementsMarkupsPhoto?.length} File Choosen`
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
                    const mergedMarkupImages = [
                      ...(selectedOptions?.otherPhotosMeasurementsMarkupsPhoto?.map(
                        item => ({
                          ...item,
                          isLocal: true,
                        }),
                      ) || []),
                      ...(selectedOptions?.otherPhotosMeasurementsMarkupsPhotos?.map(
                        item => ({
                          ...item,
                          isLocal: false,
                        }),
                      ) || []),
                    ];

                    if (mergedMarkupImages.length === 0) return null;

                    return mergedMarkupImages.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          openEditorforUpdate(
                            item.path,
                            setSelectedOptions,
                            item.isLocal
                              ? 'otherPhotosMeasurementsMarkupsPhoto'
                              : 'otherPhotosMeasurementsMarkupsPhotos',
                            'PhotosAndMeasurements',
                            true,
                            item.isLocal ? item.ImageId : item.imageId,
                            baseUrl,
                            loginData?.tokenNumber,
                            true,
                            signProjectData?.photos_and_measurements?.id ||
                              signProjectData?.photos_and_measurements?.Id,
                            signName === 'Outdoor'
                              ? 'outdoor_photos_and_measurements'
                              : 'indoor_photos_and_measurements',
                            item.isLocal,
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
                                item.isLocal ? item.ImageId : item.imageId,
                                'otherPhotosMeasurementsMarkupsPhoto',
                                'otherPhotosMeasurementsMarkupsPhotos',
                                item.path,
                                item.isLocal,
                              );
                            }}
                            style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>×</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ));
                  })()
                )}
              </View> */}
            </View>

            {/* Spike Photos */}
            <View
              style={[
                styles.section,
                {borderBottomWidth: 0, marginBottom: 16},
              ]}>
              <Text style={[styles.label, {marginBottom: 8}]}>
                Spike Photos
              </Text>
              <TouchableOpacity
                style={styles.imageCon}
                onPress={() => {
                  showPhotoOptions(
                    setSelectedOptions,
                    'storefrontSpikePhoto',
                    'ElevationAudit',
                    false,
                  );
                }}>
                <View style={styles.photoButton}>
                  <Text style={[styles.photoText]}>Spike Photos</Text>
                  <Photo />
                </View>
                <View style={[styles.fileNameContainer]}>
                  <Text style={styles.fileNameText}>
                    {selectedOptions?.storefrontSpikePhoto?.length > 0
                      ? `${selectedOptions?.storefrontSpikePhoto?.length} File Choosen`
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
                    const mergedSpikeImages = [
                      ...(selectedOptions?.storefrontSpikePhoto?.map(item => ({
                        ...item,
                        isLocal: true,
                      })) || []),
                      ...(selectedOptions?.storefrontSpikePhotos?.map(item => ({
                        ...item,
                        isLocal: false,
                      })) || []),
                    ];

                    if (mergedSpikeImages.length === 0) return null;

                    return mergedSpikeImages.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          openEditorforUpdate(
                            item.path,
                            setSelectedOptions,
                            item.isLocal
                              ? 'storefrontSpikePhoto'
                              : 'storefrontSpikePhotos',
                            'ElevationAudit',
                            true,
                            item.isLocal ? item.ImageId : item.imageId,
                            baseUrl,
                            loginData?.tokenNumber,
                            true,
                            signProjectData?.elevation_and_siteplan?.id ||
                              signProjectData?.elevation_and_siteplan?.Id,
                            'elevation_and_siteplan',
                            item.isLocal,
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
                                item.isLocal ? item.ImageId : item.imageId,
                                'storefrontSpikePhoto',
                                'storefrontSpikePhotos',
                                item.path,
                                item.isLocal,
                              );
                            }}
                            style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>×</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ));
                  })()
                )}
              </View>
            </View>

            {/* Video Walkthrough */}
            {/* <View
              style={[
                styles.section,
                {borderBottomWidth: 0, marginBottom: 16},
              ]}>
              <Text style={[styles.label, {marginBottom: 8}]}>
                Video Walkthrough
              </Text>
              <TouchableOpacity
                style={styles.imageCon}
                onPress={() => {
                  showPhotoOptions(
                    setSelectedOptions,
                    'videoWalkthrough',
                    'ElevationAudit',
                    true,
                  );
                }}>
                <View style={styles.photoButton}>
                  <Text style={styles.photoText}>Upload Video</Text>
                </View>
                <View style={styles.fileNameContainer}>
                  <Text style={styles.fileNameText}>
                    {selectedOptions?.videoWalkthrough
                      ? 'Video Selected'
                      : 'No Video Chosen'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View> */}

            <View
              style={[
                styles.section,
                {borderBottomWidth: 0, marginBottom: 16},
              ]}>
              <Text style={[styles.label, {marginBottom: 12}]}>
                Additional Photos
              </Text>
              <TouchableOpacity
                style={[styles.imageCon, {marginBottom: 12}]}
                onPress={() => {
                  showPhotoOptions(
                    setSelectedOptions,
                    'streetStoreFrontPhoto',
                    'ElevationAudit',
                    false,
                  );
                }}>
                <View style={styles.photoButton}>
                  <Text style={styles.photoText}>Storefront</Text>
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
                    const mergedStreetImages = [
                      ...(selectedOptions?.streetStoreFrontPhoto?.map(item => ({
                        ...item,
                        isLocal: true,
                      })) || []),
                      ...(selectedOptions?.streetStoreFrontPhotos?.map(
                        item => ({
                          ...item,
                          isLocal: false,
                        }),
                      ) || []),
                    ];

                    if (mergedStreetImages.length === 0) return null;

                    return mergedStreetImages.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          openEditorforUpdate(
                            item.path,
                            setSelectedOptions,
                            item.isLocal
                              ? 'streetStoreFrontPhoto'
                              : 'streetStoreFrontPhotos',
                            'ElevationAudit',
                            true,
                            item.isLocal ? item.ImageId : item.imageId,
                            baseUrl,
                            loginData?.tokenNumber,
                            true,
                            signProjectData?.elevation_and_siteplan?.id ||
                              signProjectData?.elevation_and_siteplan?.Id,
                            'elevation_and_siteplan',
                            item.isLocal,
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
                                item.isLocal ? item.ImageId : item.imageId,
                                'streetStoreFrontPhoto',
                                'streetStoreFrontPhotos',
                                item.path,
                                item.isLocal,
                              );
                            }}
                            style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>×</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ));
                  })()
                )}
              </View>

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
                  <Text style={styles.photoText}>View Sign</Text>
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
                    const mergedStreetViewImages = [
                      ...(selectedOptions?.streetViewOfSign?.map(item => ({
                        ...item,
                        isLocal: true,
                      })) || []),
                      ...(selectedOptions?.streetViewOfSigns?.map(item => ({
                        ...item,
                        isLocal: false,
                      })) || []),
                    ];

                    if (mergedStreetViewImages.length === 0) return null;

                    return mergedStreetViewImages.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          openEditorforUpdate(
                            item.path,
                            setSelectedOptions,
                            item.isLocal
                              ? 'streetViewOfSign'
                              : 'streetViewOfSigns',
                            'ElevationAudit',
                            true,
                            item.isLocal ? item.ImageId : item.imageId,
                            baseUrl,
                            loginData?.tokenNumber,
                            true,
                            signProjectData?.elevation_and_siteplan?.id ||
                              signProjectData?.elevation_and_siteplan?.Id,
                            'elevation_and_siteplan',
                            item.isLocal,
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
                                item.isLocal ? item.ImageId : item.imageId,
                                'streetViewOfSign',
                                'streetViewOfSigns',
                                item.path,
                                item.isLocal,
                              );
                            }}
                            style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>×</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ));
                  })()
                )}
              </View>
            </View>

            <View
              style={[
                styles.section,
                {borderBottomWidth: 0, marginBottom: 16},
              ]}>
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
            <View
              style={[
                styles.section,
                {borderBottomWidth: 0, marginBottom: 16},
              ]}>
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
