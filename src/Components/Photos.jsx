import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from '../Global/Global';
import Exist from '../../assets/images/5.svg';
import DropDownIcon from '../../assets/images/downarrow.svg';
import UpDownIcon from '../../assets/images/arrowup.svg';
import SaveImg from '../../assets/images/save.svg';
import Photo from '../../assets/images/photo.svg';
import Down from '../../assets/images/down.svg';
import Up from '../../assets/images/arrow.svg';
import {useSelector} from 'react-redux';
import Collapsible from 'react-native-collapsible';
import {Image} from 'react-native-animatable';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {handleAddPhoto} from '../Functions/functions';
import RadioButton from './RadioButton';
const Photos = ({handleFetchData}) => {
  const projectTitle = useSelector(state => state.projecttitle.value);

  const [active, setActive] = useState('');
  const baseUrl = useSelector(state => state.baseUrl.value);
  const loginData = useSelector(state => state.login.value);
  const signProjectData = useSelector(state => state.signProject.value);
  const [loadingImage, setLoadingImage] = useState(true);
  const signName = signProjectData?.signName;
  const [signDimentionsState, setSignDimensionsState] = useState(false);
  const [measureChannel, setMeasureChannel] = useState(false);
  const [footage, setFootage] = useState(false);
  const [measureGround, setMeasureGround] = useState(false);
  const [otherPhotos, setOtherPhotos] = useState(false);

  const [
    photosAndMeasurementsTodoPunchList,
    setPhotosAndMeasurementsTodoPunchList,
  ] = useState(
    signProjectData?.outdoor_photos_and_measurements
      ?.photosAndMeasurementsTodoPunchList || '',
  );
  const [
    photosAndMeasurementsSummaryNotes,
    SetPhotosAndMeasurementsSummaryNotes,
  ] = useState(
    signProjectData?.outdoor_photos_and_measurements
      ?.photosAndMeasurementsSummaryNotes || '',
  );
  // const selectedOptions = {
  //   Id: signProjectData?.sign_general_audit?.id,
  //   projectId: signProjectData?.sign_general_audit?.projectId,
  //   signId: signProjectData?.sign_general_audit?.signId,
  //   optionId: signProjectData?.sign_general_audit?.optionId,
  //   teamId: loginData?.userId,
  //   adminId: loginData?.userId,
  //   squareFootageFeet: '',
  //   customerName: 'chris ronan',
  //   signDimensionsHeightFT: '',
  //   signDimensionsHeightIN: '',
  //   signDimensionsWidthFT: '',
  //   signDimensionsWidthIN: '',
  //   signDimensionsDepthFT: '',
  //   signDimensionsDepthIN: '',
  //   wallDimensionsLengthFT: '',
  //   wallDimensionsLengthIN: '',
  //   wallDimensionsWidthFT: '',
  //   wallDimensionsWidthIN: '',
  //   squareFootageCalculationRequired: null,
  //   squareFootageLengthIN: '',
  //   squareFootageWidthIN: '',
  //   squareFootage: '',
  //   squareFootageNotes: '',
  //   photoOfWallOrFloor: '',
  //   measureDistanceLength1FT: '',
  //   measureDistanceLength1IN: '',
  //   measureDistanceLength2FT: '',
  //   measureDistanceLength2IN: '',
  //   measureDistanceLength3FT: '',
  //   measureDistanceLength3IN: '',
  //   measureDistanceLength4FT: '',
  //   measureDistanceLength4IN: '',
  //   areThereAnyVisibleOpenings: null,
  //   visibleOpeningsLengthFT: '',
  //   visibleOpeningsLengthIN: '',
  //   visibleOpeningsWidthFT: '',
  //   visibleOpeningsWidthIN: '',
  //   visibleOpeningsNotes: '',
  //   measureDistanceFromSignToFloorLengthFT: '',
  //   measureDistanceFromSignToFloorLengthIN: '',
  //   areMullionsPresent: null,
  //   mullionsLengthFT: '',
  //   mullionsLengthIN: '',
  //   mullionsWidthFT: '',
  //   mullionsWidthIN: '',
  //   mullionsDepthFT: '',
  //   mullionsDepthIN: '',
  //   mullionsNotes: '',
  //   indoorMeasurement: '',
  //   otherPhotosAndMeasurementsLengthFT: '',
  //   otherPhotosAndMeasurementsLengthIN: '',
  //   otherPhotosAndMeasurementsWidthFT: '',
  //   otherPhotosAndMeasurementsWidthIN: '',
  //   otherPhotosAndMeasurementsDepthFT: '',
  //   otherPhotosAndMeasurementsDepthIN: '',
  //   photosAndMeasurementsTodoPunchList: '',
  //   photosAndMeasurementsSummaryNotes: '',
  //   surveyModule: 'Photos & Measurements',
  //   signDimensionsPhoto: [],
  //   signDimensionsSpikePhoto: [],
  //   photoCloseUpOfSign: [],
  //   wallDimensionsPhoto: [],
  //   wallDimensionsSpikePhoto: [],
  //   squareFootagePhoto: [],
  //   squareFootageSpikePhoto: [],
  //   photoOfWallOrFloorPhoto: [],
  //   visibleOpeningsPhoto: [],
  //   visibleOpeningsSpike: [],
  //   mullionsPhoto: [],
  //   mullionsSpike: [],
  //   otherPhotosImage: [],
  //   otherPhotosSpike: [],
  // };
  const [selectedOptions, setSelectedOptions] = useState({
    Id: signProjectData?.sign_general_audit?.id,
    projectId: signProjectData?.sign_general_audit?.projectId,
    signId: signProjectData?.sign_general_audit?.signId,
    optionId: signProjectData?.sign_general_audit?.optionId,
    teamId: loginData?.userId,
    adminId: loginData?.userId,
    signDimensionsDepthFT:
      signProjectData?.outdoor_photos_and_measurements?.signDimensionsDepthFT ||
      '',
    signDimensionsDepthIN:
      signProjectData?.outdoor_photos_and_measurements?.signDimensionsDepthIN ||
      '',
    signDimensionsHeightFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.signDimensionsHeightFT || '',
    signDimensionsHeightIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.signDimensionsHeightIN || '',
    signDimensionsWidthFT:
      signProjectData?.outdoor_photos_and_measurements?.signDimensionsWidthFT ||
      '',
    signDimensionsWidthIN:
      signProjectData?.outdoor_photos_and_measurements?.signDimensionsWidthIN ||
      '',
    measureChannelLettersDepthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureChannelLettersDepthIN || '',
    measureChannelLettersHeightFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureChannelLettersHeightFT || '',
    measureChannelLettersHeightIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureChannelLettersHeightIN || '',
    measureChannelLettersWidthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureChannelLettersWidthFT || '',
    measureChannelLettersWidthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureChannelLettersWidthIN || '',
    measureChannelLettersDepthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureChannelLettersDepthFT || '',
    measureCutSizeDepthFT:
      signProjectData?.outdoor_photos_and_measurements?.measureCutSizeDepthFT ||
      '',
    measureDistanceLength2IN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureDistanceLength2IN || '',
    measureCutSizeDepthIN:
      signProjectData?.outdoor_photos_and_measurements?.measureCutSizeDepthIN ||
      '',
    measureCutSizeHeightFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureCutSizeHeightFT || '',
    measureCutSizeHeightIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureCutSizeHeightIN || '',
    measureCutSizeWidthFT:
      signProjectData?.outdoor_photos_and_measurements?.measureCutSizeWidthFT ||
      '',
    measureCutSizeWidthIN:
      signProjectData?.outdoor_photos_and_measurements?.measureCutSizeWidthIN ||
      '',
    otherPhotosAndMeasurementsDepthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.otherPhotosAndMeasurementsDepthFT || '',
    measureRetainerSizeDepthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureRetainerSizeDepthFT || '',
    measureRetainerSizeDepthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureRetainerSizeDepthIN || '',
    measureRetainerSizeHeightFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureRetainerSizeHeightFT || '',
    measureDistanceLength3FT:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureDistanceLength3FT || '',
    measureDistanceLength3IN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureDistanceLength3IN || '',
    measureDistanceLength4IN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureDistanceLength4IN || '',
    measureDistanceLength4FT:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureDistanceLength4FT || '',
    measureRetainerSizeHeightIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureRetainerSizeHeightIN || '',
    measureRetainerSizeWidthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureRetainerSizeWidthFT || '',
    measureRetainerSizeWidthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureRetainerSizeWidthIN || '',

    visibleOpeningsHeightFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.visibleOpeningsHeightFT || '',
    visibleOpeningsHeightIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.visibleOpeningsHeightIN || '',
    visibleOpeningsWidthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.visibleOpeningsWidthFT || '',
    visibleOpeningsWidthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.visibleOpeningsWidthIN || '',
    visibleOpeningsNotes:
      signProjectData?.outdoor_photos_and_measurements?.visibleOpeningsNotes ||
      '',
    nameofMeasurement:
      signProjectData?.indoor_photos_and_measurements?.nameofMeasurement || '',
    squareFootageFeet:
      signProjectData?.outdoor_photos_and_measurements?.squareFootageFeet || '',
    squareFootageLengthIN:
      signProjectData?.outdoor_photos_and_measurements?.squareFootageLengthIN ||
      '',
    squareFootageLengthFT:
      signProjectData?.outdoor_photos_and_measurements?.squareFootageLengthFT ||
      '',
    squareFootageWidthIN:
      signProjectData?.outdoor_photos_and_measurements?.squareFootageWidthIN ||
      '',
    measureDistanceLength3IN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureDistanceLength3IN || '',
    squareFootageWidthFT:
      signProjectData?.outdoor_photos_and_measurements?.squareFootageWidthFT ||
      '',
    squareFootageDepthIN:
      signProjectData?.outdoor_photos_and_measurements?.squareFootageDepthIN ||
      '',
    squareFootageDepthFT:
      signProjectData?.outdoor_photos_and_measurements?.squareFootageDepthFT ||
      '',
    squareFootageNotes:
      signProjectData?.outdoor_photos_and_measurements?.squareFootageNotes ||
      '',
    squareFootageCalculationRequired:
      signProjectData?.outdoor_photos_and_measurements
        ?.squareFootageCalculationRequired || '',
    measureDistanceLength1FT:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureDistanceLength1FT || '',
    measureDistanceLength1IN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureDistanceLength1IN || '',
    squareFootage:
      signProjectData?.outdoor_photos_and_measurements?.squareFootage || '',
    mullionsLengthFT:
      signProjectData?.outdoor_photos_and_measurements?.mullionsLengthFT || '',
    mullionsLengthIN:
      signProjectData?.outdoor_photos_and_measurements?.mullionsLengthIN || '',
    mullionsWidthFT:
      signProjectData?.outdoor_photos_and_measurements?.mullionsWidthFT || '',
    mullionsWidthIN:
      signProjectData?.outdoor_photos_and_measurements?.mullionsWidthIN || '',
    mullionsDepthFT:
      signProjectData?.outdoor_photos_and_measurements?.mullionsDepthFT || '',
    mullionsDepthIN:
      signProjectData?.outdoor_photos_and_measurements?.mullionsDepthIN || '',
    mullionsNotes:
      signProjectData?.outdoor_photos_and_measurements?.mullionsNotes || '',
    otherPhotosAndMeasurementsLengthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.otherPhotosAndMeasurementsLengthFT || '',
    measureGroundToSignHeightFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureGroundToSignHeightFT || '',
    measureGroundToSignHeightIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureGroundToSignHeightIN || '',

    measureCellingWallSurfaceAreaDepthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureCellingWallSurfaceAreaDepthFT || '',
    measureCellingWallSurfaceAreaDepthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureCellingWallSurfaceAreaDepthIN || '',
    measureCellingWallSurfaceAreaHeightFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureCellingWallSurfaceAreaHeightFT || '',
    measureCellingWallSurfaceAreaHeightIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureCellingWallSurfaceAreaHeightIN || '',
    measureCellingWallSurfaceAreaWidthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureCellingWallSurfaceAreaWidthFT || '',
    measureCellingWallSurfaceAreaWidthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureCellingWallSurfaceAreaWidthIN || '',

    ifPanMeasurePanDimensionWidthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.ifPanMeasurePanDimensionWidthFT || '',
    ifPanMeasurePanDimensionWidthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.ifPanMeasurePanDimensionWidthIN || '',
    ifPanMeasurePanDimensionHeightFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.ifPanMeasurePanDimensionHeightFT || '',
    ifPanMeasurePanDimensionHeightIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.ifPanMeasurePanDimensionHeightIN || '',
    ifPanMeasurePanDimensionDepthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.ifPanMeasurePanDimensionDepthFT || '',
    ifPanMeasurePanDimensionDepthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.ifPanMeasurePanDimensionDepthIN || '',

    otherPhotosMeasurementsMarkupsWidthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsWidthFT || '',
    otherPhotosMeasurementsMarkupsWidthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsWidthIN || '',
    otherPhotosMeasurementsMarkupsHeightFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsHeightFT || '',
    otherPhotosMeasurementsMarkupsHeightIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsHeightIN || '',
    otherPhotosMeasurementsMarkupsDepthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsDepthFT || '',
    otherPhotosMeasurementsMarkupsDepthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsDepthIN || '',
    measureDistanceLength2FT:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureDistanceLength2FT || '',
    areMullionsPresent:
      signProjectData?.outdoor_photos_and_measurements?.areMullionsPresent ||
      '',
    areThereAnyVisibleOpenings:
      signProjectData?.outdoor_photos_and_measurements
        ?.areThereAnyVisibleOpenings || '',
    nameOfMeasurement:
      signProjectData?.outdoor_photos_and_measurements?.nameOfMeasurement || '',
    customerName:
      signProjectData?.outdoor_photos_and_measurements?.customerName || '',
    signOrientation:
      signProjectData?.outdoor_photos_and_measurements?.signOrientation || '',
    surveyModule: '',
    measureDistanceFromSignToFloorLengthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureDistanceFromSignToFloorLengthFT || '',
    measureDistanceFromSignToFloorLengthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureDistanceFromSignToFloorLengthIN || '',
    visibleOpeningsLengthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.visibleOpeningsLengthFT || '',
    visibleOpeningsLengthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.visibleOpeningsLengthIN || '',
    measureChannelLettersPhotos:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureChannelLettersPhotos,
    measureChannelLettersPhoto:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureChannelLettersPhoto,

    // All image arrays or strings without width/height/depth
    signDimensionsPhoto:
      signProjectData?.outdoor_photos_and_measurements?.signDimensionsPhoto ||
      [],
    signDimensionsSpikePhoto:
      signProjectData?.outdoor_photos_and_measurements
        ?.signDimensionsSpikePhoto || [],
    measureChannelLettersPhoto:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureChannelLettersPhoto || [],
    squareFootagePhoto:
      signProjectData?.outdoor_photos_and_measurements?.squareFootagePhoto ||
      [],
    squareFootageSpikePhoto:
      signProjectData?.outdoor_photos_and_measurements
        ?.squareFootageSpikePhoto || [],
    photoCloseUpOfSign:
      signProjectData?.outdoor_photos_and_measurements?.photoCloseUpOfSign ||
      [],
    visibleOpeningsPhoto:
      signProjectData?.outdoor_photos_and_measurements?.visibleOpeningsPhoto ||
      [],
    visibleOpeningsSpike:
      signProjectData?.outdoor_photos_and_measurements?.visibleOpeningsSpike ||
      [],
    mullionsPhoto:
      signProjectData?.outdoor_photos_and_measurements?.mullionsPhoto || [],
    mullionsSpike:
      signProjectData?.outdoor_photos_and_measurements?.mullionsSpike || '',
    otherPhotosMeasurementsMarkupsPhoto:
      signProjectData?.outdoor_photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsPhoto || [],
    otherPhotosMeasurementsMarkupsSpike:
      signProjectData?.outdoor_photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsSpike || '',
    photoFullFrontalOfWholeSignStructurePhoto:
      signProjectData?.outdoor_photos_and_measurements
        ?.photoFullFrontalOfWholeSignStructurePhoto || [],
    measureCellingWallSurfaceAreaPhoto:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureCellingWallSurfaceAreaPhoto || [],
    measureRetainerSizePhoto:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureRetainerSizePhoto || [],
    measureCutSizePhoto:
      signProjectData?.outdoor_photos_and_measurements?.measureCutSizePhoto ||
      [],
    ifPanMeasurePanDimensionPhoto:
      signProjectData?.outdoor_photos_and_measurements
        ?.ifPanMeasurePanDimensionPhoto || [],
    wallDimensionsPhoto:
      signProjectData?.outdoor_photos_and_measurements?.wallDimensionsPhoto ||
      [],
    otherPhotosImage:
      signProjectData?.outdoor_photos_and_measurements?.otherPhotosImage || [],
    wallDimensionsSpikePhoto:
      signProjectData?.outdoor_photos_and_measurements
        ?.wallDimensionsSpikePhoto || [],
    photoOfWallOrFloorPhoto:
      signProjectData?.outdoor_photos_and_measurements
        ?.photoOfWallOrFloorPhoto || [],
    photoOfWallOrFloor:
      signProjectData?.outdoor_photos_and_measurements?.photoOfWallOrFloor ||
      [],
    otherPhotosSpike:
      signProjectData?.outdoor_photos_and_measurements?.otherPhotosSpike || [],
    wallDimensionsLengthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.wallDimensionsLengthFT || '',
    wallDimensionsLengthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.wallDimensionsLengthIN || '',
    wallDimensionsWidthFT:
      signProjectData?.outdoor_photos_and_measurements?.wallDimensionsWidthFT ||
      '',
    otherPhotosAndMeasurementsDepthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.otherPhotosAndMeasurementsDepthIN || '',
    wallDimensionsWidthIN:
      signProjectData?.outdoor_photos_and_measurements?.wallDimensionsWidthIN ||
      '',
    otherPhotosAndMeasurementsWidthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.otherPhotosAndMeasurementsWidthFT || '',

    wallDimensionsLengthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.wallDimensionsLengthFT || '',
    ifPanMeasurePanDimensionPhotos:
      signProjectData?.outdoor_photos_and_measurements
        ?.ifPanMeasurePanDimensionPhotos,
    measureRetainerSizePhotos:
      signProjectData?.outdoor_photos_and_measurements
        ?.measureRetainerSizePhotos,
    photoCloseUpOfSigns:
      signProjectData?.outdoor_photos_and_measurements?.photoCloseUpOfSigns,
    photoFullFrontalOfWholeSignStructurePhotos:
      signProjectData?.outdoor_photos_and_measurements
        ?.photoFullFrontalOfWholeSignStructurePhotos,
    signDimensionsPhotos:
      signProjectData?.outdoor_photos_and_measurements?.signDimensionsPhotos,
    squareFootageSpikePhotos:
      signProjectData?.outdoor_photos_and_measurements
        ?.squareFootageSpikePhotos,
    visibleOpeningsPhotos:
      signProjectData?.outdoor_photos_and_measurements?.visibleOpeningsPhotos,
    otherPhotosImages:
      signProjectData?.outdoor_photos_and_measurements?.otherPhotosImages,
    squareFootage:
      signProjectData?.outdoor_photos_and_measurements?.squareFootage || '',
    photosAndMeasurementsTodoPunchList:
      signProjectData?.outdoor_photos_and_measurements
        ?.photosAndMeasurementsTodoPunchList || '',
    photosAndMeasurementsSummaryNotes:
      signProjectData?.outdoor_photos_and_measurements
        ?.photosAndMeasurementsSummaryNotes || '',
    heightOfPoleLengthFT:
      signProjectData?.outdoor_photos_and_measurements?.heightOfPoleLengthFT ||
      '',
    heightOfPoleLengthIN:
      signProjectData?.outdoor_photos_and_measurements?.heightOfPoleLengthIN ||
      '',
    otherPhotosAndMeasurementsWidthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.otherPhotosAndMeasurementsWidthIN || '',
    otherPhotosAndMeasurementsLengthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.otherPhotosAndMeasurementsLengthIN || '',
    circumferenceOfPoleLengthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.circumferenceOfPoleLengthFT || '',
    circumferenceOfPoleLengthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.circumferenceOfPoleLengthIN || '',
    distanceBetweenPolesLengthFT:
      signProjectData?.outdoor_photos_and_measurements
        ?.distanceBetweenPolesLengthFT || '',
    distanceBetweenPolesLengthIN:
      signProjectData?.outdoor_photos_and_measurements
        ?.distanceBetweenPolesLengthIN || '',
    otherPhotosMeasurementsMarkupsPhotos:
      signProjectData?.outdoor_photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsPhotos || [],
    indoorWallHeightFT:
      signProjectData?.indoor_photos_and_measurements?.indoorWallHeightFT || '',
    indoorWallHeightIN:
      signProjectData?.indoor_photos_and_measurements?.indoorWallHeightIN || '',
    indoorWallWidthFT:
      signProjectData?.indoor_photos_and_measurements?.indoorWallWidthFT || '',
    indoorWallWidthIN:
      signProjectData?.indoor_photos_and_measurements?.indoorWallWidthIN || '',
    indoorWallPhoto:
      signProjectData?.indoor_photos_and_measurements?.indoorWallPhoto || [],

    // Ceiling Measurements
    ceilingHeightFT:
      signProjectData?.indoor_photos_and_measurements?.ceilingHeightFT || '',
    ceilingHeightIN:
      signProjectData?.indoor_photos_and_measurements?.ceilingHeightIN || '',
    ceilingSurfacePhoto:
      signProjectData?.indoor_photos_and_measurements?.ceilingSurfacePhoto ||
      [],
    indoorMeasurementNotes:
      signProjectData?.indoor_photos_and_measurements?.indoorMeasurementNotes ||
      '',
    indoorMeasurement:
      signProjectData?.indoor_photos_and_measurements?.indoorMeasurement || '',
    indoorTodoPunchList:
      signProjectData?.indoor_photos_and_measurements?.indoorTodoPunchList ||
      '',
    indoorSummaryNotes:
      signProjectData?.indoor_photos_and_measurements?.indoorSummaryNotes || '',
  });
  const data = [
    {
      question: 'Square Footage calculation Required?',
      options: ['Yes', 'No'],
      value: 'squareFootageCalculationRequired',
      selectedValue:
        signProjectData?.permitting_assessment
          ?.squareFootageCalculationRequired,
    },
  ];

  const handleSave = async () => {
    try {
      const DoorData = {
        ...selectedOptions,
        photosAndMeasurementsSummaryNotes,
        photosAndMeasurementsTodoPunchList,
      };
      setLoadingImage(true);
      const token = loginData?.tokenNumber;
      const responce = await axios.post(
        `${baseUrl}/update${signName}PhotosAudit`,
        DoorData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (responce.data.status) {
        Toast.show({
          type: 'success',
          text1: responce?.data?.message,
          visibilityTime: 3000,
          position: 'top',
        });
        handleFetchData(null, signProjectData);
        setLoadingImage(true);
      }
    } catch (error) {
      console.log('API ERRORRRRRRRRRRRRRR', error.response.data);
      setLoadingImage(true);
    }
  };
  const handleRemoveImage = async (imageId1, fieldName1, actualKey) => {
    try {
      setLoadingImage(true);
      const data = {
        imageId: imageId1,
        Id: signProjectData?.outdoor_photos_and_measurements?.id,
        fieldName: fieldName1,
        surveyModule: 'outdoor_photos_and_measurements',
      };
      const token = loginData?.tokenNumber;
      const responce = await axios.post(`${baseUrl}/removeFile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (responce.data.status) {
        setSelectedOptions(prev => {
          return {
            ...prev,
            [actualKey]: responce?.data?.data[actualKey],
          };
        });
        setTimeout(() => {
          setLoadingImage(false);
        }, 1000);
      }
    } catch (error) {
      console.log('Error response data:', error.response);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setLoadingImage(false);
    }, 800);
  }, []);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (active === '') {
            setActive('Photos');
          } else {
            setActive('');
          }
        }}
        style={[styles.container, {borderColor: '#5C5CE8'}]}>
        <View style={[styles.iconWrapper, {backgroundColor: '#5C5CE8'}]}>
          <Exist width={30} height={30} />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.projectName}>
            {projectTitle || 'Project Name'}
          </Text>
          <Text style={styles.auditTitle}>Photos & Measurements</Text>
          <Text style={styles.projectName}>
            {signProjectData?.outdoor_photos_and_measurements?.signType ||
              'Digital indoor free standing'}
          </Text>
        </View>
        <View style={styles.dropdownIconWrapper}>
          {active === 'Photos' ? (
            <UpDownIcon width={39} height={39} />
          ) : (
            <DropDownIcon width={39} height={39} />
          )}
        </View>
      </TouchableOpacity>
      <View style={{marginTop: -8}}>
        {active === 'Photos' && (
          <View style={[styles.card, {borderColor: '#5C5CE8'}]}>
            <View>
              <TouchableOpacity
                style={[styles.containerDrop]}
                onPress={() => setSignDimensionsState(prev => !prev)}>
                <Text style={styles.label}>Sign dimensions</Text>
                <View style={styles.iconButton}>
                  {signDimentionsState ? (
                    <Down width={18} height={18} />
                  ) : (
                    <Up width={18} height={18} />
                  )}
                </View>
              </TouchableOpacity>
              <View style={{marginBottom: signDimentionsState ? 0 : 16}}>
                <Collapsible
                  duration={300}
                  easing="easeInOutQuad"
                  collapsed={!signDimentionsState}>
                  <View style={styles.sectionContainer}>
                    <View style={styles.row}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.signDimensionsHeightIN?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Height (in)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Height (in)"
                          keyboardType="number-pad"
                          value={selectedOptions?.signDimensionsHeightIN}
                          onChangeText={text =>
                            setSelectedOptions(prev => ({
                              ...prev,
                              signDimensionsHeightIN: text,
                            }))
                          }
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.signDimensionsHeightFT?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Height (ft)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Height (ft)"
                          keyboardType="number-pad"
                          value={selectedOptions?.signDimensionsHeightFT}
                          onChangeText={text =>
                            setSelectedOptions(prev => ({
                              ...prev,
                              signDimensionsHeightFT: text,
                            }))
                          }
                        />
                      </View>
                    </View>

                    <View style={styles.row}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.signDimensionsWidthIN?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Width (in)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Width (in)"
                          keyboardType="number-pad"
                          value={selectedOptions?.signDimensionsWidthIN}
                          onChangeText={text =>
                            setSelectedOptions(prev => ({
                              ...prev,
                              signDimensionsWidthIN: text,
                            }))
                          }
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.signDimensionsWidthFT?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Width (ft)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Width (ft)"
                          keyboardType="number-pad"
                          value={selectedOptions?.signDimensionsWidthFT}
                          onChangeText={text =>
                            setSelectedOptions(prev => ({
                              ...prev,
                              signDimensionsWidthFT: text,
                            }))
                          }
                        />
                      </View>
                    </View>

                    <View style={styles.row}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.signDimensionsDepthIN?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Depth (in)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Depth (in)"
                          keyboardType="number-pad"
                          value={selectedOptions?.signDimensionsDepthIN}
                          onChangeText={text =>
                            setSelectedOptions(prev => ({
                              ...prev,
                              signDimensionsDepthIN: text,
                            }))
                          }
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.signDimensionsDepthFT?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Depth (ft)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Depth (ft)"
                          keyboardType="number-pad"
                          value={selectedOptions?.signDimensionsDepthFT}
                          onChangeText={text =>
                            setSelectedOptions(prev => ({
                              ...prev,
                              signDimensionsDepthFT: text,
                            }))
                          }
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        handleAddPhoto(
                          setSelectedOptions,
                          'signDimensionsPhoto',
                        )
                      }
                      style={styles.imageCon}>
                      <View style={styles.photoButton}>
                        <Text style={styles.photoText}>add photo</Text>
                        <Photo />
                      </View>
                      <View style={styles.fileNameContainer}>
                        <Text style={styles.fileNameText}></Text>
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
                        selectedOptions?.signDimensionsPhotos?.length > 0 &&
                        selectedOptions?.signDimensionsPhotos?.map(
                          (data, index) => {
                            return (
                              <View key={index} style={styles.imageContainer}>
                                <Image
                                  source={{uri: data.url}}
                                  style={styles.image}
                                />
                                <TouchableOpacity
                                  onPress={() =>
                                    handleRemoveImage(
                                      data.imageId,
                                      'signDimensionsPhoto',
                                      'signDimensionsPhotos',
                                    )
                                  }
                                  style={styles.removeButton}>
                                  <Text style={styles.removeButtonText}>×</Text>
                                </TouchableOpacity>
                              </View>
                            );
                          },
                        )
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() => setSignDimensionsState(prev => !prev)}
                      style={[
                        styles.iconButton,
                        {alignSelf: 'flex-end', marginVertical: 15},
                      ]}>
                      <Down width={18} height={18} />
                    </TouchableOpacity>
                  </View>
                </Collapsible>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={[styles.containerDrop]}
                onPress={() => setMeasureChannel(prev => !prev)}>
                <Text style={styles.label}>Measure Channel Letters</Text>
                <View style={styles.iconButton}>
                  {measureChannel ? (
                    <Down width={18} height={18} />
                  ) : (
                    <Up width={18} height={18} />
                  )}
                </View>
              </TouchableOpacity>
              <View style={{marginBottom: !measureChannel ? 16 : 0}}>
                <Collapsible
                  duration={300}
                  easing="easeInOutQuad"
                  collapsed={!measureChannel}>
                  <View style={styles.sectionContainer}>
                    <View style={styles.row}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.measureChannelLettersHeightIN?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Height (in)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Height (in)"
                          keyboardType="number-pad"
                          value={selectedOptions?.measureChannelLettersHeightIN}
                          onChangeText={text =>
                            setSelectedOptions(prev => ({
                              ...prev,
                              measureChannelLettersHeightIN: text,
                            }))
                          }
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.measureChannelLettersHeightFT?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Height (ft)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Height (ft)"
                          keyboardType="number-pad"
                          value={selectedOptions?.measureChannelLettersHeightFT}
                          onChangeText={text =>
                            setSelectedOptions(prev => ({
                              ...prev,
                              measureChannelLettersHeightFT: text,
                            }))
                          }
                        />
                      </View>
                    </View>

                    <View style={styles.row}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.measureChannelLettersWidthIN?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Width (in)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Width (in)"
                          keyboardType="number-pad"
                          value={selectedOptions?.measureChannelLettersWidthIN}
                          onChangeText={text =>
                            setSelectedOptions(prev => ({
                              ...prev,
                              measureChannelLettersWidthIN: text,
                            }))
                          }
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.measureChannelLettersWidthFT?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Width (ft)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Width (ft)"
                          keyboardType="number-pad"
                          value={selectedOptions?.measureChannelLettersWidthFT}
                          onChangeText={text =>
                            setSelectedOptions(prev => ({
                              ...prev,
                              measureChannelLettersWidthFT: text,
                            }))
                          }
                        />
                      </View>
                    </View>

                    <View style={styles.row}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.measureChannelLettersDepthIN?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Depth (in)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Depth (in)"
                          keyboardType="number-pad"
                          value={selectedOptions?.measureChannelLettersDepthIN}
                          onChangeText={text =>
                            setSelectedOptions(prev => ({
                              ...prev,
                              measureChannelLettersDepthIN: text,
                            }))
                          }
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.measureChannelLettersDepthFT?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Depth (ft)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Depth (ft)"
                          keyboardType="number-pad"
                          value={selectedOptions?.measureChannelLettersDepthFT}
                          onChangeText={text =>
                            setSelectedOptions(prev => ({
                              ...prev,
                              measureChannelLettersDepthFT: text,
                            }))
                          }
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => setMeasureChannel(prev => !prev)}
                      style={[
                        styles.iconButton,
                        {alignSelf: 'flex-end', marginVertical: 15},
                      ]}>
                      <Down width={18} height={18} />
                    </TouchableOpacity>
                  </View>
                </Collapsible>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={[styles.containerDrop]}
                onPress={() => setFootage(prev => !prev)}>
                <Text style={styles.label}>Square footage calculation</Text>
                <View style={styles.iconButton}>
                  {footage === 'footage' ? (
                    <Down width={18} height={18} />
                  ) : (
                    <Up width={18} height={18} />
                  )}
                </View>
              </TouchableOpacity>
              <View style={{marginBottom: !footage ? 16 : 0}}>
                <Collapsible
                  duration={300}
                  easing="easeInOutQuad"
                  collapsed={!footage}>
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
                        <View style={[styles.row, {marginBottom: 15}]}>
                          <View style={{flex: 1}}>
                            <Text
                              style={{
                                marginBottom: 4,
                                opacity:
                                  selectedOptions?.squareFootageLengthIN?.trim() !==
                                  ''
                                    ? 1
                                    : 0,
                              }}>
                              Length (in)
                            </Text>
                            <TextInput
                              style={[styles.input]}
                              placeholder="Length (In)"
                              keyboardType="number-pad"
                              value={selectedOptions?.squareFootageLengthIN}
                              onChangeText={text =>
                                setSelectedOptions(prev => ({
                                  ...prev,
                                  squareFootageLengthIN: text,
                                }))
                              }
                            />
                          </View>
                          <View style={{flex: 1}}>
                            <Text
                              style={{
                                marginBottom: 4,
                                opacity:
                                  selectedOptions?.squareFootageWidthIN?.trim() !==
                                  ''
                                    ? 1
                                    : 0,
                              }}>
                              Width (in)
                            </Text>
                            <TextInput
                              style={[styles.input]}
                              placeholder="Width (in)"
                              keyboardType="number-pad"
                              value={selectedOptions?.squareFootageWidthIN}
                              onChangeText={text => {
                                setSelectedOptions(prev => {
                                  return {
                                    ...prev,
                                    squareFootageWidthIN: text,
                                  };
                                });
                              }}
                            />
                          </View>
                        </View>

                        <View style={[styles.row, {marginBottom: 15}]}>
                          <View style={{flex: 1}}>
                            <Text
                              style={{
                                marginBottom: 4,
                                opacity:
                                  selectedOptions?.squareFootageDepthIN?.trim() !==
                                  ''
                                    ? 1
                                    : 0,
                              }}>
                              Square inches
                            </Text>
                            <TextInput
                              style={[styles.input]}
                              placeholder="Square inches"
                              keyboardType="number-pad"
                              value={selectedOptions?.squareFootageDepthIN}
                              onChangeText={text => {
                                setSelectedOptions(prev => {
                                  return {
                                    ...prev,
                                    squareFootageDepthIN: text,
                                  };
                                });
                              }}
                            />
                          </View>
                        </View>
                        <View style={[styles.row, {marginBottom: 15}]}>
                          <View style={{flex: 1}}>
                            <Text
                              style={{
                                marginBottom: 4,
                                opacity:
                                  selectedOptions?.squareFootage?.trim() !== ''
                                    ? 1
                                    : 0,
                              }}>
                              Square Footage
                            </Text>
                            <TextInput
                              style={[styles.input]}
                              placeholder="Square Footage"
                              value={selectedOptions?.squareFootage}
                              onChangeText={text => {
                                setSelectedOptions(prev => {
                                  return {
                                    ...prev,
                                    squareFootage: text,
                                  };
                                });
                              }}
                            />
                          </View>
                        </View>
                        <View style={[styles.row, {marginBottom: 15}]}>
                          <View style={{flex: 1}}>
                            <Text
                              style={{
                                marginBottom: 4,
                                opacity:
                                  selectedOptions?.squareFootageNotes?.trim() !==
                                  ''
                                    ? 1
                                    : 0,
                              }}>
                              Notes
                            </Text>
                            <TextInput
                              style={[styles.input]}
                              placeholder="Notes"
                              value={selectedOptions?.squareFootageNotes}
                              onChangeText={text => {
                                setSelectedOptions(prev => {
                                  return {
                                    ...prev,
                                    squareFootageNotes: text,
                                  };
                                });
                              }}
                            />
                          </View>
                        </View>

                        <TouchableOpacity
                          style={styles.imageCon}
                          onPress={() =>
                            handleAddPhoto(
                              setSelectedOptions,
                              'squareFootageSpikePhoto',
                            )
                          }>
                          <View style={styles.photoButton}>
                            <Text style={styles.photoText}>add photo</Text>
                            <Photo />
                          </View>
                          <View style={styles.fileNameContainer}>
                            <Text style={styles.fileNameText}>{''}</Text>
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
                            selectedOptions?.squareFootageSpikePhotos?.length >
                              0 &&
                            selectedOptions?.squareFootageSpikePhotos?.map(
                              (data, index) => {
                                return (
                                  <View
                                    key={index}
                                    style={styles.imageContainer}>
                                    <Image
                                      source={{uri: data.url}}
                                      style={styles.image}
                                    />
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleRemoveImage(
                                          data.imageId,
                                          'squareFootageSpikePhoto',
                                          'squareFootageSpikePhotos',
                                        )
                                      }
                                      style={styles.removeButton}>
                                      <Text style={styles.removeButtonText}>
                                        ×
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                );
                              },
                            )
                          )}
                        </View>
                        <TouchableOpacity
                          onPress={() => setFootage(prev => !prev)}
                          style={[
                            styles.iconButton,
                            {alignSelf: 'flex-end', marginVertical: 15},
                          ]}>
                          <Down width={18} height={18} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </Collapsible>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={[styles.containerDrop]}
                onPress={() => setMeasureGround(prev => !prev)}>
                <Text style={styles.label}>Measure ground to sign</Text>
                <View style={styles.iconButton}>
                  {measureGround ? (
                    <Down width={18} height={18} />
                  ) : (
                    <Up width={18} height={18} />
                  )}
                </View>
              </TouchableOpacity>
              <View style={{marginBottom: !measureGround ? 16 : 0}}>
                <Collapsible
                  duration={300}
                  easing="easeInOutQuad"
                  collapsed={!measureGround}>
                  <View style={styles.sectionContainer}>
                    <View style={styles.row}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.measureGroundToSignHeightIN?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Height (in)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Height (in)"
                          keyboardType="number-pad"
                          value={selectedOptions?.measureGroundToSignHeightIN}
                          onChangeText={text =>
                            setSelectedOptions(prev => ({
                              ...prev,
                              measureGroundToSignHeightIN: text,
                            }))
                          }
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.measureGroundToSignHeightFT?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Height (ft)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Height (ft)"
                          keyboardType="number-pad"
                          value={selectedOptions?.measureGroundToSignHeightFT}
                          onChangeText={text =>
                            setSelectedOptions(prev => ({
                              ...prev,
                              measureGroundToSignHeightFT: text,
                            }))
                          }
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => setMeasureGround(prev => !prev)}
                      style={[
                        styles.iconButton,
                        {alignSelf: 'flex-end', marginVertical: 15},
                      ]}>
                      <Down width={18} height={18} />
                    </TouchableOpacity>
                  </View>
                </Collapsible>
              </View>
            </View>
            <View style={{marginVertical: 13}}>
              <View style={styles.section}>
                <Text style={styles.label}>
                  Photo - full frontal of whole sign structure
                </Text>
              </View>
              <TouchableOpacity
                style={styles.imageCon}
                onPress={() =>
                  handleAddPhoto(
                    setSelectedOptions,
                    'photoFullFrontalOfWholeSignStructurePhoto',
                  )
                }>
                <View style={styles.photoButton}>
                  <Text style={styles.photoText}>add photo</Text>
                  <Photo />
                </View>

                <View style={styles.fileNameContainer}>
                  <Text style={styles.fileNameText}>{''}</Text>
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
                  selectedOptions?.photoFullFrontalOfWholeSignStructurePhotos
                    ?.length > 0 &&
                  selectedOptions?.photoFullFrontalOfWholeSignStructurePhotos?.map(
                    (data, index) => {
                      return (
                        <View key={index} style={styles.imageContainer}>
                          <Image
                            source={{uri: data.url}}
                            style={styles.image}
                          />
                          <TouchableOpacity
                            onPress={() =>
                              handleRemoveImage(
                                data.imageId,
                                'photoFullFrontalOfWholeSignStructurePhoto',
                                'photoFullFrontalOfWholeSignStructurePhotos',
                              )
                            }
                            style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>×</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    },
                  )
                )}
              </View>
            </View>
            <View style={{marginVertical: 13}}>
              <View style={styles.section}>
                <Text style={styles.label}>Photo - close-up of sign</Text>
              </View>
              <TouchableOpacity
                style={styles.imageCon}
                onPress={() =>
                  handleAddPhoto(setSelectedOptions, 'photoCloseUpOfSign')
                }>
                <View style={styles.photoButton}>
                  <Text style={styles.photoText}>add photo</Text>
                  <Photo />
                </View>

                <View style={styles.fileNameContainer}>
                  <Text style={styles.fileNameText}>{''}</Text>
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
                  selectedOptions?.photoCloseUpOfSigns?.length > 0 &&
                  selectedOptions?.photoCloseUpOfSigns?.map((data, index) => {
                    return (
                      <View key={index} style={styles.imageContainer}>
                        <Image source={{uri: data.url}} style={styles.image} />
                        <TouchableOpacity
                          onPress={() =>
                            handleRemoveImage(
                              data.imageId,
                              'photoCloseUpOfSign',
                              'photoCloseUpOfSigns',
                            )
                          }
                          style={styles.removeButton}>
                          <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })
                )}
              </View>
            </View>
            {/* <View>
              <TouchableOpacity
                style={[styles.containerDrop]}
                onPress={() => handleState('visible')}>
                <Text style={styles.label}>Measure visible opening</Text>
                <View style={styles.iconButton}>
                  {state === 'visible' ? (
                    <Down width={18} height={18} />
                  ) : (
                    <Up width={18} height={18} />
                  )}
                </View>
              </TouchableOpacity>
              <View style={{marginBottom: state !== 'visible' ? 16 : 0}}>
                <Collapsible
                  duration={300}
                  easing="easeInOutQuad"
                  collapsed={state !== 'visible'}>
                  <View style={styles.sectionContainer}>
                    <View style={styles.row}>
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Height(in)"
                        keyboardType="number-pad"
                        value={selectedOptions?.visibleOpeningsHeightIN}
                        onChangeText={text =>
                          setSelectedOptions(prev => ({
                            ...prev,
                            visibleOpeningsHeightIN: text,
                          }))
                        }
                      />
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Height(ft)"
                        keyboardType="number-pad"
                        value={selectedOptions?.visibleOpeningsHeightFT}
                        onChangeText={text =>
                          setSelectedOptions(prev => ({
                            ...prev,
                            visibleOpeningsHeightFT: text,
                          }))
                        }
                      />
                    </View>

                    <View style={styles.row}>
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Width(in)"
                        keyboardType="number-pad"
                        value={selectedOptions?.visibleOpeningsWidthIN}
                        onChangeText={text =>
                          setSelectedOptions(prev => ({
                            ...prev,
                            visibleOpeningsWidthIN: text,
                          }))
                        }
                      />
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Width(ft)"
                        keyboardType="number-pad"
                        value={selectedOptions?.visibleOpeningsWidthFT}
                        onChangeText={text =>
                          setSelectedOptions(prev => ({
                            ...prev,
                            visibleOpeningsWidthFT: text,
                          }))
                        }
                      />
                    </View>

                    <View style={styles.row}>
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Depth(in)"
                        keyboardType="number-pad"
                        // onChangeText={text =>
                        //   setSelectedOptions(prev => ({
                        //     ...prev,
                        //     measureGroundToSignDeFT: text,
                        //   }))
                        // }
                      />
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Depth(ft)"
                        keyboardType="number-pad"
                        // onChangeText={text =>
                        //   setSelectedOptions(prev => ({
                        //     ...prev,
                        //     measureGroundToSignHeightFT: text,
                        //   }))
                        // }
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.imageCon}
                      onPress={() =>
                        handleAddPhoto(
                          setSelectedOptions,
                          'visibleOpeningsPhoto',
                        )
                      }>
                      <View
                        style={styles.photoButton}
                        // onPress={() => imagePicker1()}
                      >
                        <Text style={styles.photoText}>add photo</Text>
                        <Photo />
                      </View>

                      <View style={styles.fileNameContainer}>
                        <Text style={styles.fileNameText}>{''}</Text>
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
                        selectedOptions?.visibleOpeningsPhotos?.length > 0 &&
                        selectedOptions?.visibleOpeningsPhotos?.map(
                          (data, index) => {
                            return (
                              <View key={index} style={styles.imageContainer}>
                                <Image
                                  source={{uri: data.url}}
                                  style={styles.image}
                                />
                                <TouchableOpacity
                                  onPress={() =>
                                    handleRemoveImage(
                                      data.imageId,
                                      'visibleOpeningsPhoto',
                                      'visibleOpeningsPhotos',
                                    )
                                  }
                                  style={styles.removeButton}>
                                  <Text style={styles.removeButtonText}>×</Text>
                                </TouchableOpacity>
                              </View>
                            );
                          },
                        )
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => handleState('visible')}
                      style={[
                        styles.iconButton,
                        {alignSelf: 'flex-end', marginVertical: 15},
                      ]}>
                      <Down width={18} height={18} />
                    </TouchableOpacity>
                  </View>
                </Collapsible>
              </View>
            </View> */}
            {/* <View>
              <TouchableOpacity
                style={[styles.containerDrop]}
                onPress={() => handleState('retainer')}>
                <Text style={styles.label}>Measure retainer size</Text>
                <View style={styles.iconButton}>
                  {state === 'retainer' ? (
                    <Down width={18} height={18} />
                  ) : (
                    <Up width={18} height={18} />
                  )}
                </View>
              </TouchableOpacity>
              <View style={{marginBottom: state !== 'retainer' ? 16 : 0}}>
                <Collapsible
                  duration={300}
                  easing="easeInOutQuad"
                  collapsed={state !== 'retainer'}>
                  <View style={styles.sectionContainer}>
                    <View style={styles.row}>
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Height(in)"
                        keyboardType="number-pad"
                        value={selectedOptions?.measureRetainerSizeWidthIN}
                        onChangeText={text => {
                          setSelectedOptions(prev => {
                            return {
                              ...prev,
                              measureRetainerSizeWidthIN: text,
                            };
                          });
                        }}
                      />
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Height(ft)"
                        keyboardType="number-pad"
                        value={selectedOptions?.measureRetainerSizeHeightFT}
                        onChangeText={text => {
                          setSelectedOptions(prev => {
                            return {
                              ...prev,
                              measureRetainerSizeHeightFT: text,
                            };
                          });
                        }}
                      />
                    </View>
                    <View style={styles.row}>
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Width(in)"
                        keyboardType="number-pad"
                        value={selectedOptions?.measureRetainerSizeWidthIN}
                        onChangeText={text => {
                          setSelectedOptions(prev => {
                            return {
                              ...prev,
                              measureRetainerSizeWidthIN: text,
                            };
                          });
                        }}
                      />
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Width(ft)"
                        keyboardType="number-pad"
                        value={selectedOptions?.measureRetainerSizeWidthFT}
                        onChangeText={text => {
                          setSelectedOptions(prev => {
                            return {
                              ...prev,
                              measureRetainerSizeWidthFT: text,
                            };
                          });
                        }}
                      />
                    </View>
                    <View style={styles.row}>
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Depth(in)"
                        keyboardType="number-pad"
                        value={selectedOptions?.measureRetainerSizeDepthIN}
                        onChangeText={text => {
                          setSelectedOptions(prev => {
                            return {
                              ...prev,
                              measureRetainerSizeDepthIN: text,
                            };
                          });
                        }}
                      />
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Depth(ft)"
                        keyboardType="number-pad"
                        value={selectedOptions?.measureRetainerSizeDepthFT}
                        onChangeText={text => {
                          setSelectedOptions(prev => {
                            return {
                              ...prev,
                              measureRetainerSizeDepthFT: text,
                            };
                          });
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.imageCon}
                      onPress={() =>
                        handleAddPhoto(
                          setSelectedOptions,
                          'measureRetainerSizePhoto',
                        )
                      }>
                      <View
                        style={styles.photoButton}
                        // onPress={() => imagePicker1()}s
                      >
                        <Text style={styles.photoText}>add photo</Text>
                        <Photo />
                      </View>

                      <View style={styles.fileNameContainer}>
                        <Text style={styles.fileNameText}>{''}</Text>
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
                        selectedOptions?.measureRetainerSizePhotos?.length >
                          0 &&
                        selectedOptions?.measureRetainerSizePhotos?.map(
                          (data, index) => {
                            return (
                              <View key={index} style={styles.imageContainer}>
                                <Image
                                  source={{uri: data.url}}
                                  style={styles.image}
                                />
                                <TouchableOpacity
                                  onPress={() =>
                                    handleRemoveImage(
                                      data.imageId,
                                      'measureRetainerSizePhoto',
                                      'measureRetainerSizePhotos',
                                    )
                                  }
                                  style={styles.removeButton}>
                                  <Text style={styles.removeButtonText}>×</Text>
                                </TouchableOpacity>
                              </View>
                            );
                          },
                        )
                      )}
                    </View>
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
            </View> */}
            {/* <View>
              <TouchableOpacity
                style={[styles.containerDrop]}
                onPress={() => handleState('pan')}>
                <Text style={styles.label}>If pan, measure pan dimensions</Text>
                <View style={styles.iconButton}>
                  {state === 'pan' ? (
                    <Down width={18} height={18} />
                  ) : (
                    <Up width={18} height={18} />
                  )}
                </View>
              </TouchableOpacity>
              <View style={{marginBottom: state !== 'pan' ? 16 : 0}}>
                <Collapsible
                  duration={300}
                  easing="easeInOutQuad"
                  collapsed={state !== 'pan'}>
                  <View style={styles.sectionContainer}>
                    <View style={styles.row}>
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Height(in)"
                        keyboardType="number-pad"
                        value={
                          selectedOptions?.ifPanMeasurePanDimensionHeightIN
                        }
                        onChangeText={text => {
                          setSelectedOptions(prev => {
                            return {
                              ...prev,
                              ifPanMeasurePanDimensionHeightIN: text,
                            };
                          });
                        }}
                      />
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Height(ft)"
                        keyboardType="number-pad"
                        value={
                          selectedOptions?.ifPanMeasurePanDimensionHeightFT
                        }
                        onChangeText={text => {
                          setSelectedOptions(prev => {
                            return {
                              ...prev,

                              ifPanMeasurePanDimensionHeightFT: text,
                            };
                          });
                        }}
                      />
                    </View>
                    <View style={styles.row}>
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Width(in)"
                        keyboardType="number-pad"
                        value={selectedOptions?.ifPanMeasurePanDimensionWidthFT}
                        onChangeText={text => {
                          setSelectedOptions(prev => {
                            return {
                              ...prev,
                              ifPanMeasurePanDimensionWidthFT: text,
                            };
                          });
                        }}
                      />
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Width(ft)"
                        keyboardType="number-pad"
                        value={selectedOptions?.measureRetainerSizeDepthFT}
                        onChangeText={text => {
                          setSelectedOptions(prev => {
                            return {
                              ...prev,
                              measureRetainerSizeDepthFT: text,
                            };
                          });
                        }}
                      />
                    </View>

                    <View style={styles.row}>
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Depth(in)"
                        keyboardType="number-pad"
                        value={selectedOptions?.ifPanMeasurePanDimensionDepthIN}
                        onChangeText={text => {
                          setSelectedOptions(prev => {
                            return {
                              ...prev,
                              ifPanMeasurePanDimensionDepthIN: text,
                            };
                          });
                        }}
                      />
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Depth(ft)"
                        keyboardType="number-pad"
                        value={selectedOptions?.ifPanMeasurePanDimensionDepthFT}
                        onChangeText={text => {
                          setSelectedOptions(prev => {
                            return {
                              ...prev,
                              ifPanMeasurePanDimensionDepthFT: text,
                            };
                          });
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.imageCon}
                      onPress={() =>
                        handleAddPhoto(
                          setSelectedOptions,
                          'ifPanMeasurePanDimensionPhoto',
                        )
                      }>
                      <View style={styles.photoButton}>
                        <Text style={styles.photoText}>add photo</Text>
                        <Photo />
                      </View>

                      <View style={styles.fileNameContainer}>
                        <Text style={styles.fileNameText}>{''}</Text>
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
                        selectedOptions?.ifPanMeasurePanDimensionPhotos
                          ?.length > 0 &&
                        selectedOptions?.ifPanMeasurePanDimensionPhotos?.map(
                          (data, index) => {
                            return (
                              <View key={index} style={styles.imageContainer}>
                                <Image
                                  source={{uri: data.url}}
                                  style={styles.image}
                                />
                                <TouchableOpacity
                                  onPress={() =>
                                    handleRemoveImage(
                                      data.imageId,
                                      'ifPanMeasurePanDimensionPhoto',
                                      'ifPanMeasurePanDimensionPhotos',
                                    )
                                  }
                                  style={styles.removeButton}>
                                  <Text style={styles.removeButtonText}>×</Text>
                                </TouchableOpacity>
                              </View>
                            );
                          },
                        )
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => handleState('pan')}
                      style={[
                        styles.iconButton,
                        {alignSelf: 'flex-end', marginVertical: 15},
                      ]}>
                      <Down width={18} height={18} />
                    </TouchableOpacity>
                  </View>
                </Collapsible>
              </View>
            </View> */}

            <View>
              <TouchableOpacity
                style={[styles.containerDrop]}
                onPress={() => setOtherPhotos(prev => !prev)}>
                <Text style={styles.label} numberOfLines={1}>
                  Other photos, measurements
                </Text>
                <View style={styles.iconButton}>
                  {otherPhotos ? (
                    <Down width={18} height={18} />
                  ) : (
                    <Up width={18} height={18} />
                  )}
                </View>
              </TouchableOpacity>
              <View style={{marginBottom: !otherPhotos ? 16 : 0}}>
                <Collapsible
                  duration={300}
                  easing="easeInOutQuad"
                  collapsed={!otherPhotos}>
                  <View style={styles.sectionContainer}>
                    <View style={styles.row}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.nameOfMeasurement?.trim() !== ''
                                ? 1
                                : 0,
                          }}>
                          Name of measurement
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Name of measurement"
                          value={selectedOptions?.nameOfMeasurement}
                          onChangeText={text => {
                            setSelectedOptions(prev => {
                              return {
                                ...prev,
                                nameOfMeasurement: text,
                              };
                            });
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.otherPhotosMeasurementsMarkupsHeightIN?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Height (in)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Height (in)"
                          keyboardType="number-pad"
                          value={
                            selectedOptions?.otherPhotosMeasurementsMarkupsHeightIN
                          }
                          onChangeText={text => {
                            setSelectedOptions(prev => {
                              return {
                                ...prev,
                                otherPhotosMeasurementsMarkupsHeightIN: text,
                              };
                            });
                          }}
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.otherPhotosMeasurementsMarkupsHeightFT?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Height (ft)
                        </Text>
                        <TextInput
                          style={[styles.input, {flex: 1}]}
                          placeholder="Height (ft)"
                          keyboardType="number-pad"
                          value={
                            selectedOptions?.otherPhotosMeasurementsMarkupsHeightFT
                          }
                          onChangeText={text => {
                            setSelectedOptions(prev => {
                              return {
                                ...prev,
                                otherPhotosMeasurementsMarkupsHeightFT: text,
                              };
                            });
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.otherPhotosMeasurementsMarkupsWidthIN?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Width (in)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Width (in)"
                          keyboardType="number-pad"
                          value={
                            selectedOptions?.otherPhotosMeasurementsMarkupsWidthIN
                          }
                          onChangeText={text => {
                            setSelectedOptions(prev => {
                              return {
                                ...prev,
                                otherPhotosMeasurementsMarkupsWidthIN: text,
                              };
                            });
                          }}
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.otherPhotosMeasurementsMarkupsWidthFT?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Width (ft)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Width (ft)"
                          keyboardType="number-pad"
                          value={
                            selectedOptions?.otherPhotosMeasurementsMarkupsWidthFT
                          }
                          onChangeText={text => {
                            setSelectedOptions(prev => {
                              return {
                                ...prev,
                                otherPhotosMeasurementsMarkupsWidthFT: text,
                              };
                            });
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.otherPhotosMeasurementsMarkupsDepthIN?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Depth (in)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Depth (in)"
                          keyboardType="number-pad"
                          value={
                            selectedOptions?.otherPhotosMeasurementsMarkupsDepthIN
                          }
                          onChangeText={text => {
                            setSelectedOptions(prev => {
                              return {
                                ...prev,
                                otherPhotosMeasurementsMarkupsDepthIN: text,
                              };
                            });
                          }}
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            marginBottom: 4,
                            opacity:
                              selectedOptions?.otherPhotosMeasurementsMarkupsDepthFT?.trim() !==
                              ''
                                ? 1
                                : 0,
                          }}>
                          Depth (ft)
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          placeholder="Depth (ft)"
                          keyboardType="number-pad"
                          value={
                            selectedOptions?.otherPhotosMeasurementsMarkupsDepthFT
                          }
                          onChangeText={text => {
                            setSelectedOptions(prev => {
                              return {
                                ...prev,
                                otherPhotosMeasurementsMarkupsDepthFT: text,
                              };
                            });
                          }}
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.imageCon}
                      onPress={() =>
                        handleAddPhoto(
                          setSelectedOptions,
                          'otherPhotosMeasurementsMarkupsPhoto',
                        )
                      }>
                      <View style={styles.photoButton}>
                        <Text style={styles.photoText}>add photo</Text>
                        <Photo />
                      </View>

                      <View style={styles.fileNameContainer}>
                        <Text style={styles.fileNameText}>{''}</Text>
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
                      ) : selectedOptions?.otherPhotosMeasurementsMarkupsPhotos &&
                        selectedOptions.otherPhotosMeasurementsMarkupsPhotos
                          .length > 0 ? (
                        selectedOptions.otherPhotosMeasurementsMarkupsPhotos.map(
                          (data, index) => (
                            <View key={index} style={styles.imageContainer}>
                              <Image
                                source={{uri: data.url}}
                                style={styles.image}
                              />
                              <TouchableOpacity
                                onPress={() =>
                                  handleRemoveImage(
                                    data.imageId,
                                    'otherPhotosMeasurementsMarkupsPhoto',
                                    'otherPhotosMeasurementsMarkupsPhotos',
                                  )
                                }
                                style={styles.removeButton}>
                                <Text style={styles.removeButtonText}>×</Text>
                              </TouchableOpacity>
                            </View>
                          ),
                        )
                      ) : (
                        <Text style={{color: '#888'}}>
                          No images to display
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => setOtherPhotos(prev => !prev)}
                      style={[
                        styles.iconButton,
                        {alignSelf: 'flex-end', marginVertical: 15},
                      ]}>
                      <Down width={18} height={18} />
                    </TouchableOpacity>
                  </View>
                </Collapsible>
              </View>
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
                  value={photosAndMeasurementsTodoPunchList}
                  onChangeText={setPhotosAndMeasurementsTodoPunchList}
                />
                <Text style={{textAlign: 'right', marginTop: 5}}>
                  {photosAndMeasurementsTodoPunchList.length}/300
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
                  value={photosAndMeasurementsSummaryNotes}
                  onChangeText={SetPhotosAndMeasurementsSummaryNotes}
                />
                <Text style={{textAlign: 'right', marginTop: 5}}>
                  {photosAndMeasurementsSummaryNotes.length}/300
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
export default Photos;
