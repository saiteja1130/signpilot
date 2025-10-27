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
import {useDispatch, useSelector} from 'react-redux';
import Collapsible from 'react-native-collapsible';
import {Image} from 'react-native-animatable';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {handleAddPhoto} from '../Functions/functions';
import RadioButton from './RadioButton';
import NetInfo from '@react-native-community/netinfo';
import {deleteFolders, getBase64Array, getPath} from '../Functions/FSfunctions';
import RNFS from 'react-native-fs';
import {
  createOfflineRemoveTable,
  getPhotosAndMeasurementsImagesByKey,
  insertOfflineRemove,
  insertPhotosAndMeasurementsImagesOnly,
  updatePhotosAndMeasurements,
} from '../Db/LocalData';
import {
  openEditorforUpdate,
  showPhotoOptions,
} from '../Functions/ImagePickFunctions';
import {setActiveState} from '../Redux/Slices/Active';

const Photos = ({handleFetchData}) => {
  const dispatch = useDispatch();
  const globalActive = useSelector(state => state.active.values);
  const projectTitle = useSelector(state => state.projecttitle.value);
  const baseUrl = useSelector(state => state.baseUrl.value);
  const loginData = useSelector(state => state.login.value);
  const signProjectData = useSelector(state => state.signProject.value);
  const [loadingImage, setLoadingImage] = useState(false);
  const signName = signProjectData?.signName;
  const [signDimentionsState, setSignDimensionsState] = useState(false);
  const [measureChannel, setMeasureChannel] = useState(false);
  const [footage, setFootage] = useState(false);
  const [measureGround, setMeasureGround] = useState(false);
  const [otherPhotos, setOtherPhotos] = useState(false);
  const [pansState, setPanstate] = useState(false);
  const [visible, setVisible] = useState(false);
  const [retainer, setRetainer] = useState(false);

  useEffect(() => {
    setSignDimensionsState(false);
    setMeasureChannel(false);
    setFootage(false);
    setMeasureGround(false);
    setOtherPhotos(false);
  }, [globalActive]);

  const [
    photosAndMeasurementsTodoPunchList,
    setPhotosAndMeasurementsTodoPunchList,
  ] = useState(
    signProjectData?.photos_and_measurements
      ?.photosAndMeasurementsTodoPunchList || '',
  );
  const [
    photosAndMeasurementsSummaryNotes,
    SetPhotosAndMeasurementsSummaryNotes,
  ] = useState(
    signProjectData?.photos_and_measurements
      ?.photosAndMeasurementsSummaryNotes || '',
  );

  const [selectedOptions, setSelectedOptions] = useState({
    Id:
      signProjectData?.photos_and_measurements?.id ||
      signProjectData?.photos_and_measurements?.Id,
    projectId: signProjectData?.photos_and_measurements?.projectId,
    signId: signProjectData?.photos_and_measurements?.signId,
    optionId: signProjectData?.photos_and_measurements?.optionId,
    teamId: loginData?.userId,
    adminId: loginData?.userId,
    signDimensionsDepthFT:
      signProjectData?.photos_and_measurements?.signDimensionsDepthFT || '',
    signDimensionsDepthIN:
      signProjectData?.photos_and_measurements?.signDimensionsDepthIN || '',
    signDimensionsHeightFT:
      signProjectData?.photos_and_measurements?.signDimensionsHeightFT || '',
    signDimensionsHeightIN:
      signProjectData?.photos_and_measurements?.signDimensionsHeightIN || '',
    signDimensionsWidthFT:
      signProjectData?.photos_and_measurements?.signDimensionsWidthFT || '',
    signDimensionsWidthIN:
      signProjectData?.photos_and_measurements?.signDimensionsWidthIN || '',
    measureChannelLettersDepthIN:
      signProjectData?.photos_and_measurements?.measureChannelLettersDepthIN ||
      '',
    measureChannelLettersHeightFT:
      signProjectData?.photos_and_measurements?.measureChannelLettersHeightFT ||
      '',
    measureChannelLettersHeightIN:
      signProjectData?.photos_and_measurements?.measureChannelLettersHeightIN ||
      '',
    measureChannelLettersWidthFT:
      signProjectData?.photos_and_measurements?.measureChannelLettersWidthFT ||
      '',
    measureChannelLettersWidthIN:
      signProjectData?.photos_and_measurements?.measureChannelLettersWidthIN ||
      '',
    measureChannelLettersDepthFT:
      signProjectData?.photos_and_measurements?.measureChannelLettersDepthFT ||
      '',
    measureCutSizeDepthFT:
      signProjectData?.photos_and_measurements?.measureCutSizeDepthFT || '',
    measureDistanceLength2IN:
      signProjectData?.photos_and_measurements?.measureDistanceLength2IN || '',
    measureCutSizeDepthIN:
      signProjectData?.photos_and_measurements?.measureCutSizeDepthIN || '',
    measureCutSizeHeightFT:
      signProjectData?.photos_and_measurements?.measureCutSizeHeightFT || '',
    measureCutSizeHeightIN:
      signProjectData?.photos_and_measurements?.measureCutSizeHeightIN || '',
    measureCutSizeWidthFT:
      signProjectData?.photos_and_measurements?.measureCutSizeWidthFT || '',
    measureCutSizeWidthIN:
      signProjectData?.photos_and_measurements?.measureCutSizeWidthIN || '',
    otherPhotosAndMeasurementsDepthFT:
      signProjectData?.photos_and_measurements
        ?.otherPhotosAndMeasurementsDepthFT || '',
    measureRetainerSizeDepthFT:
      signProjectData?.photos_and_measurements?.measureRetainerSizeDepthFT ||
      '',
    measureRetainerSizeDepthIN:
      signProjectData?.photos_and_measurements?.measureRetainerSizeDepthIN ||
      '',
    measureRetainerSizeHeightFT:
      signProjectData?.photos_and_measurements?.measureRetainerSizeHeightFT ||
      '',
    measureDistanceLength3FT:
      signProjectData?.photos_and_measurements?.measureDistanceLength3FT || '',
    measureDistanceLength3IN:
      signProjectData?.photos_and_measurements?.measureDistanceLength3IN || '',
    measureDistanceLength4IN:
      signProjectData?.photos_and_measurements?.measureDistanceLength4IN || '',
    measureDistanceLength4FT:
      signProjectData?.photos_and_measurements?.measureDistanceLength4FT || '',
    measureRetainerSizeHeightIN:
      signProjectData?.photos_and_measurements?.measureRetainerSizeHeightIN ||
      '',
    measureRetainerSizeWidthFT:
      signProjectData?.photos_and_measurements?.measureRetainerSizeWidthFT ||
      '',
    measureRetainerSizeWidthIN:
      signProjectData?.photos_and_measurements?.measureRetainerSizeWidthIN ||
      '',

    visibleOpeningsHeightFT:
      signProjectData?.photos_and_measurements?.visibleOpeningsHeightFT || '',
    visibleOpeningsHeightIN:
      signProjectData?.photos_and_measurements?.visibleOpeningsHeightIN || '',
    visibleOpeningsWidthFT:
      signProjectData?.photos_and_measurements?.visibleOpeningsWidthFT || '',
    visibleOpeningsWidthIN:
      signProjectData?.photos_and_measurements?.visibleOpeningsWidthIN || '',
    visibleOpeningsNotes:
      signProjectData?.photos_and_measurements?.visibleOpeningsNotes || '',
    nameofMeasurement:
      signProjectData?.photos_and_measurements?.nameofMeasurement || '',
    nameOfMeasurement:
      signProjectData?.photos_and_measurements?.nameOfMeasurement || '',
    squareFootageFeet:
      signProjectData?.photos_and_measurements?.squareFootageFeet || '',
    squareFootageLengthIN:
      signProjectData?.photos_and_measurements?.squareFootageLengthIN || '',
    squareFootageLengthFT:
      signProjectData?.photos_and_measurements?.squareFootageLengthFT || '',
    squareFootageWidthIN:
      signProjectData?.photos_and_measurements?.squareFootageWidthIN || '',
    measureDistanceLength3IN:
      signProjectData?.photos_and_measurements?.measureDistanceLength3IN || '',
    squareFootageWidthFT:
      signProjectData?.photos_and_measurements?.squareFootageWidthFT || '',
    squareFootageDepthIN:
      signProjectData?.photos_and_measurements?.squareFootageDepthIN || '',
    squareFootageDepthFT:
      signProjectData?.photos_and_measurements?.squareFootageDepthFT || '',
    squareFootageNotes:
      signProjectData?.photos_and_measurements?.squareFootageNotes || '',
    squareFootageCalculationRequired:
      signProjectData?.photos_and_measurements
        ?.squareFootageCalculationRequired || '',
    measureDistanceLength1FT:
      signProjectData?.photos_and_measurements?.measureDistanceLength1FT || '',
    measureDistanceLength1IN:
      signProjectData?.photos_and_measurements?.measureDistanceLength1IN || '',
    squareFootage:
      signProjectData?.photos_and_measurements?.squareFootage || '',
    mullionsLengthFT:
      signProjectData?.photos_and_measurements?.mullionsLengthFT || '',
    mullionsLengthIN:
      signProjectData?.photos_and_measurements?.mullionsLengthIN || '',
    mullionsWidthFT:
      signProjectData?.photos_and_measurements?.mullionsWidthFT || '',
    mullionsWidthIN:
      signProjectData?.photos_and_measurements?.mullionsWidthIN || '',
    mullionsDepthFT:
      signProjectData?.photos_and_measurements?.mullionsDepthFT || '',
    mullionsDepthIN:
      signProjectData?.photos_and_measurements?.mullionsDepthIN || '',
    mullionsNotes:
      signProjectData?.photos_and_measurements?.mullionsNotes || '',
    otherPhotosAndMeasurementsLengthFT:
      signProjectData?.photos_and_measurements
        ?.otherPhotosAndMeasurementsLengthFT || '',
    measureGroundToSignHeightFT:
      signProjectData?.photos_and_measurements?.measureGroundToSignHeightFT ||
      '',
    measureGroundToSignHeightIN:
      signProjectData?.photos_and_measurements?.measureGroundToSignHeightIN ||
      '',

    measureCellingWallSurfaceAreaDepthFT:
      signProjectData?.photos_and_measurements
        ?.measureCellingWallSurfaceAreaDepthFT || '',
    measureCellingWallSurfaceAreaDepthIN:
      signProjectData?.photos_and_measurements
        ?.measureCellingWallSurfaceAreaDepthIN || '',
    measureCellingWallSurfaceAreaHeightFT:
      signProjectData?.photos_and_measurements
        ?.measureCellingWallSurfaceAreaHeightFT || '',
    measureCellingWallSurfaceAreaHeightIN:
      signProjectData?.photos_and_measurements
        ?.measureCellingWallSurfaceAreaHeightIN || '',
    measureCellingWallSurfaceAreaWidthFT:
      signProjectData?.photos_and_measurements
        ?.measureCellingWallSurfaceAreaWidthFT || '',
    measureCellingWallSurfaceAreaWidthIN:
      signProjectData?.photos_and_measurements
        ?.measureCellingWallSurfaceAreaWidthIN || '',

    ifPanMeasurePanDimensionWidthFT:
      signProjectData?.photos_and_measurements
        ?.ifPanMeasurePanDimensionWidthFT || '',
    ifPanMeasurePanDimensionWidthIN:
      signProjectData?.photos_and_measurements
        ?.ifPanMeasurePanDimensionWidthIN || '',
    ifPanMeasurePanDimensionHeightFT:
      signProjectData?.photos_and_measurements
        ?.ifPanMeasurePanDimensionHeightFT || '',
    ifPanMeasurePanDimensionHeightIN:
      signProjectData?.photos_and_measurements
        ?.ifPanMeasurePanDimensionHeightIN || '',
    ifPanMeasurePanDimensionDepthFT:
      signProjectData?.photos_and_measurements
        ?.ifPanMeasurePanDimensionDepthFT || '',
    ifPanMeasurePanDimensionDepthIN:
      signProjectData?.photos_and_measurements
        ?.ifPanMeasurePanDimensionDepthIN || '',

    otherPhotosMeasurementsMarkupsWidthFT:
      signProjectData?.photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsWidthFT || '',
    otherPhotosMeasurementsMarkupsWidthIN:
      signProjectData?.photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsWidthIN || '',
    otherPhotosMeasurementsMarkupsHeightFT:
      signProjectData?.photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsHeightFT || '',
    otherPhotosMeasurementsMarkupsHeightIN:
      signProjectData?.photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsHeightIN || '',
    otherPhotosMeasurementsMarkupsDepthFT:
      signProjectData?.photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsDepthFT || '',
    otherPhotosMeasurementsMarkupsDepthIN:
      signProjectData?.photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsDepthIN || '',
    measureDistanceLength2FT:
      signProjectData?.photos_and_measurements?.measureDistanceLength2FT || '',
    areMullionsPresent:
      signProjectData?.photos_and_measurements?.areMullionsPresent || '',
    areThereAnyVisibleOpenings:
      signProjectData?.photos_and_measurements?.areThereAnyVisibleOpenings ||
      '',

    customerName: signProjectData?.photos_and_measurements?.customerName || '',
    signOrientation:
      signProjectData?.photos_and_measurements?.signOrientation || '',
    surveyModule: '',
    measureDistanceFromSignToFloorLengthFT:
      signProjectData?.photos_and_measurements
        ?.measureDistanceFromSignToFloorLengthFT || '',
    measureDistanceFromSignToFloorLengthIN:
      signProjectData?.photos_and_measurements
        ?.measureDistanceFromSignToFloorLengthIN || '',
    visibleOpeningsLengthFT:
      signProjectData?.photos_and_measurements?.visibleOpeningsLengthFT || '',
    visibleOpeningsLengthIN:
      signProjectData?.photos_and_measurements?.visibleOpeningsLengthIN || '',
    measureChannelLettersPhotos:
      signProjectData?.photos_and_measurements?.measureChannelLettersPhotos,

    signDimensionsPhoto:
      signProjectData?.photos_and_measurements?.signDimensionsPhoto || [],
    signDimensionsSpikePhoto:
      signProjectData?.photos_and_measurements?.signDimensionsSpikePhoto || [],
    measureChannelLettersPhoto:
      signProjectData?.photos_and_measurements?.measureChannelLettersPhoto ||
      [],
    squareFootagePhoto:
      signProjectData?.photos_and_measurements?.squareFootagePhoto || [],
    squareFootageSpikePhoto:
      signProjectData?.photos_and_measurements?.squareFootageSpikePhoto || [],
    photoCloseUpOfSign:
      signProjectData?.photos_and_measurements?.photoCloseUpOfSign || [],
    visibleOpeningsPhoto:
      signProjectData?.photos_and_measurements?.visibleOpeningsPhoto || [],
    visibleOpeningsSpike:
      signProjectData?.photos_and_measurements?.visibleOpeningsSpike || [],
    mullionsPhoto:
      signProjectData?.photos_and_measurements?.mullionsPhoto || [],
    mullionsSpike:
      signProjectData?.photos_and_measurements?.mullionsSpike || '',
    otherPhotosMeasurementsMarkupsPhoto:
      signProjectData?.photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsPhoto || [],
    otherPhotosMeasurementsMarkupsSpike:
      signProjectData?.photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsSpike || '',
    photoFullFrontalOfWholeSignStructurePhoto:
      signProjectData?.photos_and_measurements
        ?.photoFullFrontalOfWholeSignStructurePhoto || [],
    measureCellingWallSurfaceAreaPhoto:
      signProjectData?.photos_and_measurements
        ?.measureCellingWallSurfaceAreaPhoto || [],
    measureRetainerSizePhoto:
      signProjectData?.photos_and_measurements?.measureRetainerSizePhoto || [],
    measureCutSizePhoto:
      signProjectData?.photos_and_measurements?.measureCutSizePhoto || [],
    ifPanMeasurePanDimensionPhoto:
      signProjectData?.photos_and_measurements?.ifPanMeasurePanDimensionPhoto ||
      [],
    wallDimensionsPhoto:
      signProjectData?.photos_and_measurements?.wallDimensionsPhoto || [],
    otherPhotosImage:
      signProjectData?.photos_and_measurements?.otherPhotosImage || [],
    wallDimensionsSpikePhoto:
      signProjectData?.photos_and_measurements?.wallDimensionsSpikePhoto || [],
    photoOfWallOrFloorPhoto:
      signProjectData?.photos_and_measurements?.photoOfWallOrFloorPhoto || [],
    photoOfWallOrFloor:
      signProjectData?.photos_and_measurements?.photoOfWallOrFloor || '',
    otherPhotosSpike:
      signProjectData?.photos_and_measurements?.otherPhotosSpike || [],
    wallDimensionsLengthFT:
      signProjectData?.photos_and_measurements?.wallDimensionsLengthFT || '',
    wallDimensionsLengthIN:
      signProjectData?.photos_and_measurements?.wallDimensionsLengthIN || '',
    wallDimensionsWidthFT:
      signProjectData?.photos_and_measurements?.wallDimensionsWidthFT || '',
    otherPhotosAndMeasurementsDepthIN:
      signProjectData?.photos_and_measurements
        ?.otherPhotosAndMeasurementsDepthIN || '',
    wallDimensionsWidthIN:
      signProjectData?.photos_and_measurements?.wallDimensionsWidthIN || '',
    otherPhotosAndMeasurementsWidthFT:
      signProjectData?.photos_and_measurements
        ?.otherPhotosAndMeasurementsWidthFT || '',

    wallDimensionsLengthFT:
      signProjectData?.photos_and_measurements?.wallDimensionsLengthFT || '',
    ifPanMeasurePanDimensionPhotos:
      signProjectData?.photos_and_measurements
        ?.ifPanMeasurePanDimensionPhotos || [],
    measureRetainerSizePhoto:
      signProjectData?.photos_and_measurements?.measureRetainerSizePhoto,
    measureRetainerSizePhotos:
      signProjectData?.photos_and_measurements?.measureRetainerSizePhotos,
    photoCloseUpOfSigns:
      signProjectData?.photos_and_measurements?.photoCloseUpOfSigns,
    photoFullFrontalOfWholeSignStructurePhotos:
      signProjectData?.photos_and_measurements
        ?.photoFullFrontalOfWholeSignStructurePhotos,
    signDimensionsPhotos:
      signProjectData?.photos_and_measurements?.signDimensionsPhotos,
    squareFootageSpikePhotos:
      signProjectData?.photos_and_measurements?.squareFootageSpikePhotos,
    visibleOpeningsPhotos:
      signProjectData?.photos_and_measurements?.visibleOpeningsPhotos,
    otherPhotosImages:
      signProjectData?.photos_and_measurements?.otherPhotosImages,
    squareFootage:
      signProjectData?.photos_and_measurements?.squareFootage || '',
    photosAndMeasurementsTodoPunchList:
      signProjectData?.photos_and_measurements
        ?.photosAndMeasurementsTodoPunchList || '',
    photosAndMeasurementsSummaryNotes:
      signProjectData?.photos_and_measurements
        ?.photosAndMeasurementsSummaryNotes || '',
    heightOfPoleLengthFT:
      signProjectData?.photos_and_measurements?.heightOfPoleLengthFT || '',
    heightOfPoleLengthIN:
      signProjectData?.photos_and_measurements?.heightOfPoleLengthIN || '',
    otherPhotosAndMeasurementsWidthIN:
      signProjectData?.photos_and_measurements
        ?.otherPhotosAndMeasurementsWidthIN || '',
    otherPhotosAndMeasurementsLengthIN:
      signProjectData?.photos_and_measurements
        ?.otherPhotosAndMeasurementsLengthIN || '',
    circumferenceOfPoleLengthFT:
      signProjectData?.photos_and_measurements?.circumferenceOfPoleLengthFT ||
      '',
    circumferenceOfPoleLengthIN:
      signProjectData?.photos_and_measurements?.circumferenceOfPoleLengthIN ||
      '',
    distanceBetweenPolesLengthFT:
      signProjectData?.photos_and_measurements?.distanceBetweenPolesLengthFT ||
      '',
    distanceBetweenPolesLengthIN:
      signProjectData?.photos_and_measurements?.distanceBetweenPolesLengthIN ||
      '',
    otherPhotosMeasurementsMarkupsPhotos:
      signProjectData?.photos_and_measurements
        ?.otherPhotosMeasurementsMarkupsPhotos || [],
    indoorWallHeightFT:
      signProjectData?.photos_and_measurements?.indoorWallHeightFT || '',
    indoorWallHeightIN:
      signProjectData?.photos_and_measurements?.indoorWallHeightIN || '',
    indoorWallWidthFT:
      signProjectData?.photos_and_measurements?.indoorWallWidthFT || '',
    indoorWallWidthIN:
      signProjectData?.photos_and_measurements?.indoorWallWidthIN || '',
    indoorWallPhoto:
      signProjectData?.photos_and_measurements?.indoorWallPhoto || [],

    // Ceiling Measurements
    ceilingHeightFT:
      signProjectData?.photos_and_measurements?.ceilingHeightFT || '',
    ceilingHeightIN:
      signProjectData?.photos_and_measurements?.ceilingHeightIN || '',
    ceilingSurfacePhoto:
      signProjectData?.photos_and_measurements?.ceilingSurfacePhoto || [],
    indoorMeasurementNotes:
      signProjectData?.photos_and_measurements?.indoorMeasurementNotes || '',
    indoorMeasurement:
      signProjectData?.photos_and_measurements?.indoorMeasurement || '',
    indoorTodoPunchList:
      signProjectData?.photos_and_measurements?.indoorTodoPunchList || '',
    indoorSummaryNotes:
      signProjectData?.photos_and_measurements?.indoorSummaryNotes || '',
  });

  const data = [
    {
      question: 'Square Footage calculation Required?',
      options: ['Yes', 'No'],
      value: 'squareFootageCalculationRequired',
      selectedValue:
        signProjectData?.photos_and_measurements
          ?.squareFootageCalculationRequired,
    },
  ];

  const handleSave = async () => {
    setLoadingImage(true);
    const netState = await NetInfo.fetch();
    const isConnected = netState.isConnected;

    let base64signDimensionsPhoto = [];
    let base64squareFootageSpikePhoto = [];
    let base64photoFullFrontalOfWholeSignStructurePhoto = [];
    let base64photoCloseUpOfSign = [];
    let base64otherPhotosMeasurementsMarkupsPhoto = [];
    let base64measureRetainerSizePhoto = [];
    let base64visibleOpeningsPhoto = [];
    let base64measureChannelLettersPhoto = [];
    let base64ifPanMeasurePanDimensionPhoto = [];
    if (isConnected) {
      base64signDimensionsPhoto = await getBase64Array(
        selectedOptions?.signDimensionsPhoto || [],
      );
      base64squareFootageSpikePhoto = await getBase64Array(
        selectedOptions?.squareFootageSpikePhoto || [],
      );
      base64photoFullFrontalOfWholeSignStructurePhoto = await getBase64Array(
        selectedOptions?.photoFullFrontalOfWholeSignStructurePhoto || [],
      );
      base64photoCloseUpOfSign = await getBase64Array(
        selectedOptions?.photoCloseUpOfSign || [],
      );
      base64otherPhotosMeasurementsMarkupsPhoto = await getBase64Array(
        selectedOptions?.otherPhotosMeasurementsMarkupsPhoto || [],
      );
      base64measureRetainerSizePhoto = await getBase64Array(
        selectedOptions?.measureRetainerSizePhoto || [],
      );
      base64visibleOpeningsPhoto = await getBase64Array(
        selectedOptions?.visibleOpeningsPhoto || [],
      );
      base64measureChannelLettersPhoto = await getBase64Array(
        selectedOptions?.measureChannelLettersPhoto || [],
      );
      base64ifPanMeasurePanDimensionPhoto = await getBase64Array(
        selectedOptions?.ifPanMeasurePanDimensionPhoto || [],
      );
    } else {
      base64signDimensionsPhoto = selectedOptions?.signDimensionsPhoto || [];
      base64squareFootageSpikePhoto =
        selectedOptions?.squareFootageSpikePhoto || [];
      base64photoFullFrontalOfWholeSignStructurePhoto =
        selectedOptions?.photoFullFrontalOfWholeSignStructurePhoto || [];
      base64photoCloseUpOfSign = selectedOptions?.photoCloseUpOfSign || [];
      base64otherPhotosMeasurementsMarkupsPhoto =
        selectedOptions?.otherPhotosMeasurementsMarkupsPhoto || [];
      base64measureRetainerSizePhoto =
        selectedOptions?.measureRetainerSizePhoto || [];
      base64visibleOpeningsPhoto = selectedOptions?.visibleOpeningsPhoto || [];
      base64measureChannelLettersPhoto =
        selectedOptions?.measureChannelLettersPhoto || [];
      base64ifPanMeasurePanDimensionPhoto =
        selectedOptions?.ifPanMeasurePanDimensionPhoto || [];
    }
    const DoorData = {
      // ...indoorPayload,
      ...selectedOptions,
      photosAndMeasurementsSummaryNotes,
      photosAndMeasurementsTodoPunchList,
      signDimensionsPhoto: base64signDimensionsPhoto,
      squareFootageSpikePhoto: base64squareFootageSpikePhoto,
      photoFullFrontalOfWholeSignStructurePhoto:
        base64photoFullFrontalOfWholeSignStructurePhoto,
      photoCloseUpOfSign: base64photoCloseUpOfSign,
      otherPhotosMeasurementsMarkupsPhoto:
        base64otherPhotosMeasurementsMarkupsPhoto,
      surveyModule:
        signName == 'Outdoor'
          ? 'outdoor_photos_and_measurements'
          : 'indoor_photos_and_measurements',
      squareFootageFeet: '',
      measureRetainerSizePhoto: base64measureRetainerSizePhoto,
      visibleOpeningsPhoto: base64visibleOpeningsPhoto,
      measureChannelLettersPhoto: base64measureChannelLettersPhoto,
      ifPanMeasurePanDimensionPhoto: base64ifPanMeasurePanDimensionPhoto,
    };
    console.log('DATAAA', DoorData);
    // return;
    try {
      if (isConnected) {
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
          await deleteFolders();
          const imagesCache = [
            ...(selectedOptions?.signDimensionsPhoto || []),
            ...(selectedOptions?.squareFootageSpikePhoto || []),
            ...(selectedOptions?.photoFullFrontalOfWholeSignStructurePhoto ||
              []),
            ...(selectedOptions?.photoCloseUpOfSign || []),
            ...(selectedOptions?.otherPhotosMeasurementsMarkupsPhoto || []),
            ...(selectedOptions?.measureRetainerSizePhoto || []),
            ...(selectedOptions?.visibleOpeningsPhoto || []),
            ...(selectedOptions?.measureChannelLettersPhoto || []),
            ...(selectedOptions?.ifPanMeasurePanDimensionPhoto || []),
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
            text1: responce?.data?.message,
            visibilityTime: 3000,
            position: 'top',
          });
          handleFetchData(null, signProjectData);
        } else {
          throw new Error('Sync failed with unknown server response.');
        }
      } else {
        updatePhotosAndMeasurements(DoorData, 0);
        handleFetchData(null, signProjectData);
        Toast.show({
          type: 'info',
          text1: 'Saved Offline. Will sync later.',
          visibilityTime: 3000,
          position: 'top',
        });
      }
      // return;
    } catch (error) {
      console.log('API ERRORRRRRRRRRRRRRR', error.response.data);
      setLoadingImage(true);
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
    const netState = await NetInfo.fetch();
    const isConnected = netState.isConnected;
    try {
      setLoadingImage(true);
      if (isLocalImageRemove) {
        const updatedArray = selectedOptions?.[fieldName1]?.filter(
          item => item.ImageId !== imageId1,
        );
        await insertPhotosAndMeasurementsImagesOnly(
          signProjectData?.signTableId,
          fieldName1,
          updatedArray,
          0,
        );
        const imagesaRRAY = await getPhotosAndMeasurementsImagesByKey(
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
        Id: signProjectData?.photos_and_measurements?.id,
        fieldName: fieldName1,
        surveyModule:
          signName == 'Outdoor'
            ? 'outdoor_photos_and_measurements'
            : 'indoor_photos_and_measurements',
      };

      if (isConnected) {
        const token = loginData?.tokenNumber;
        const response = await axios.post(`${baseUrl}/removeFile`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('respose', response.data);
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
          await insertPhotosAndMeasurementsImagesOnly(
            signProjectData?.signTableId,
            actualKey,
            imagesArray,
            1,
          );
          const imagesaRRAY = await getPhotosAndMeasurementsImagesByKey(
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
        await insertPhotosAndMeasurementsImagesOnly(
          signProjectData?.signTableId,
          actualKey,
          imagesArray,
          0,
        );
        const imagesaRRAY = await getPhotosAndMeasurementsImagesByKey(
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
      console.log('Error response data:', error.response);
    } finally {
      setTimeout(() => setLoadingImage(false), 1000);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          dispatch(setActiveState('Photos'));
        }}
        style={[styles.container, {borderColor: '#5C5CE8'}]}>
        <View style={[styles.iconWrapper, {backgroundColor: '#5C5CE8'}]}>
          <Exist width={30} height={30} />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.projectName}>
            {projectTitle || 'Project Name'}
          </Text>
          <Text style={styles.auditTitle}>
            {signName} Photos & Measurements
          </Text>
          <Text style={styles.projectName}>
            {signProjectData?.photos_and_measurements?.signType ||
              'Digital indoor free standing'}
          </Text>
        </View>
        <View style={styles.dropdownIconWrapper}>
          {globalActive?.includes('Photos') ? (
            <UpDownIcon width={39} height={39} />
          ) : (
            <DropDownIcon width={39} height={39} />
          )}
        </View>
      </TouchableOpacity>
      <View style={{marginTop: -8}}>
        {globalActive?.includes('Photos') && (
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
                        showPhotoOptions(
                          setSelectedOptions,
                          'signDimensionsPhoto',
                          'PhotosAndMesurements',
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
                          {selectedOptions?.signDimensionsPhoto?.length > 0
                            ? `${selectedOptions?.signDimensionsPhoto?.length} files Choosen`
                            : 'No file Choosen'}
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
                          const mergedDimensionsImages = [
                            ...(selectedOptions?.signDimensionsPhoto?.map(
                              item => ({
                                ...item,
                                isLocal: true,
                              }),
                            ) || []),
                            ...(selectedOptions?.signDimensionsPhotos?.map(
                              item => ({
                                ...item,
                                isLocal: false,
                              }),
                            ) || []),
                          ];

                          if (mergedDimensionsImages.length === 0) return null;

                          return mergedDimensionsImages.map((item, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => {
                                openEditorforUpdate(
                                  item.path || item.url,
                                  setSelectedOptions,
                                  item.isLocal
                                    ? 'signDimensionsPhoto'
                                    : 'signDimensionsPhotos',
                                  'SignDimensions',
                                  true,
                                  item.isLocal ? item.ImageId : item.imageId,
                                  baseUrl,
                                  loginData?.tokenNumber,
                                  true,
                                  signProjectData?.photos_and_measurements
                                    ?.id ||
                                    signProjectData?.photos_and_measurements
                                      ?.Id,
                                  signName == 'Outdoor'
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
                                  onPress={() =>
                                    handleRemoveImage(
                                      item.isLocal
                                        ? item.ImageId
                                        : item.imageId,
                                      'signDimensionsPhoto',
                                      'signDimensionsPhotos',
                                      item.path,
                                      item.isLocal,
                                    )
                                  }
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
            {signProjectData?.signId === '2' && (
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
                            value={
                              selectedOptions?.measureChannelLettersHeightIN
                            }
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
                            value={
                              selectedOptions?.measureChannelLettersHeightFT
                            }
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
                            value={
                              selectedOptions?.measureChannelLettersWidthIN
                            }
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
                            value={
                              selectedOptions?.measureChannelLettersWidthFT
                            }
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
                            value={
                              selectedOptions?.measureChannelLettersDepthIN
                            }
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
                            value={
                              selectedOptions?.measureChannelLettersDepthFT
                            }
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
                        onPress={() =>
                          showPhotoOptions(
                            setSelectedOptions,
                            'measureChannelLettersPhoto',
                            'PhotosAndMesurements',
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
                            {selectedOptions?.measureChannelLettersPhoto
                              ?.length > 0
                              ? `${selectedOptions?.measureChannelLettersPhoto?.length} files Choosen`
                              : 'No file Choosen'}
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
                            const mergedDimensionsImages = [
                              ...(selectedOptions?.measureChannelLettersPhoto?.map(
                                item => ({
                                  ...item,
                                  isLocal: true,
                                }),
                              ) || []),
                              ...(selectedOptions?.measureChannelLettersPhotos?.map(
                                item => ({
                                  ...item,
                                  isLocal: false,
                                }),
                              ) || []),
                            ];

                            if (mergedDimensionsImages.length === 0)
                              return null;

                            return mergedDimensionsImages.map((item, index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() => {
                                  openEditorforUpdate(
                                    item.path || item.url,
                                    setSelectedOptions,
                                    item.isLocal
                                      ? 'measureChannelLettersPhoto'
                                      : 'measureChannelLettersPhotos',
                                    'measureChannelLetters',
                                    true,
                                    item.isLocal ? item.ImageId : item.imageId,
                                    baseUrl,
                                    loginData?.tokenNumber,
                                    true,
                                    signProjectData?.photos_and_measurements
                                      ?.id ||
                                      signProjectData?.photos_and_measurements
                                        ?.Id,
                                    signName == 'Outdoor'
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
                                    onPress={() =>
                                      handleRemoveImage(
                                        item.isLocal
                                          ? item.ImageId
                                          : item.imageId,
                                        'measureChannelLettersPhoto',
                                        'measureChannelLettersPhotos',
                                        item.path,
                                        item.isLocal,
                                      )
                                    }
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
            )}

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

                        {/* <View style={[styles.row, {marginBottom: 15}]}>
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
                        </View> */}
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
                            showPhotoOptions(
                              setSelectedOptions,
                              'squareFootageSpikePhoto',
                              'PhotosAndMesurements',
                              false,
                            )
                          }>
                          <View style={styles.photoButton}>
                            <Text style={styles.photoText}>add photo</Text>
                            <Photo />
                          </View>
                          <View style={styles.fileNameContainer}>
                            <Text style={styles.fileNameText}>
                              {selectedOptions?.squareFootageSpikePhoto
                                ?.length > 0
                                ? `${selectedOptions?.squareFootageSpikePhoto?.length} files Choosen`
                                : 'No file Choosen'}
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
                              // Merge local and remote images
                              const mergedSquareFootageImages = [
                                ...(selectedOptions?.squareFootageSpikePhoto?.map(
                                  item => ({
                                    ...item,
                                    isLocal: true,
                                  }),
                                ) || []),
                                ...(selectedOptions?.squareFootageSpikePhotos?.map(
                                  item => ({
                                    ...item,
                                    isLocal: false,
                                  }),
                                ) || []),
                              ];

                              if (mergedSquareFootageImages.length === 0)
                                return null;

                              return mergedSquareFootageImages.map(
                                (item, index) => (
                                  <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                      openEditorforUpdate(
                                        item.path || item.url,
                                        setSelectedOptions,
                                        item.isLocal
                                          ? 'squareFootageSpikePhoto'
                                          : 'squareFootageSpikePhotos',
                                        'SquareFootageSpike',
                                        true,
                                        item.isLocal
                                          ? item.ImageId
                                          : item.imageId,
                                        baseUrl,
                                        loginData?.tokenNumber,
                                        true,
                                        signProjectData?.photos_and_measurements
                                          ?.id ||
                                          signProjectData
                                            ?.photos_and_measurements?.Id,
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
                                            ? item.path
                                            : `file://${item.path || item.url}`,
                                        }}
                                        style={styles.image}
                                      />
                                      <TouchableOpacity
                                        onPress={() =>
                                          handleRemoveImage(
                                            item.isLocal
                                              ? item.ImageId
                                              : item.imageId,
                                            'squareFootageSpikePhoto',
                                            'squareFootageSpikePhotos',
                                            item.path,
                                            item.isLocal,
                                          )
                                        }
                                        style={styles.removeButton}>
                                        <Text style={styles.removeButtonText}>
                                          ×
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </TouchableOpacity>
                                ),
                              );
                            })()
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
            {signProjectData?.signId === '2' && (
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
            )}

            <View style={{marginVertical: 13}}>
              <View style={styles.section}>
                <Text style={styles.label}>
                  Photo - full frontal of whole sign structure
                </Text>
              </View>
              <TouchableOpacity
                style={styles.imageCon}
                onPress={() =>
                  showPhotoOptions(
                    setSelectedOptions,
                    'photoFullFrontalOfWholeSignStructurePhoto',
                    'PhotosAndMesurements',
                    false,
                  )
                }>
                <View style={styles.photoButton}>
                  <Text style={styles.photoText}>add photo</Text>
                  <Photo />
                </View>

                <View style={styles.fileNameContainer}>
                  <Text style={styles.fileNameText}>
                    {selectedOptions?.photoFullFrontalOfWholeSignStructurePhoto
                      ?.length > 0
                      ? `${selectedOptions?.photoFullFrontalOfWholeSignStructurePhoto?.length} files Choosen`
                      : 'No file Choosen'}
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
                    const mergedFullFrontalImages = [
                      ...(selectedOptions?.photoFullFrontalOfWholeSignStructurePhoto?.map(
                        item => ({
                          ...item,
                          isLocal: true,
                        }),
                      ) || []),
                      ...(selectedOptions?.photoFullFrontalOfWholeSignStructurePhotos?.map(
                        item => ({
                          ...item,
                          isLocal: false,
                        }),
                      ) || []),
                    ];

                    if (mergedFullFrontalImages.length === 0) return null;

                    return mergedFullFrontalImages.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          openEditorforUpdate(
                            item.path || item.url,
                            setSelectedOptions,
                            item.isLocal
                              ? 'photoFullFrontalOfWholeSignStructurePhoto'
                              : 'photoFullFrontalOfWholeSignStructurePhotos',
                            'FullFrontalSignStructure',
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
                                ? item.path
                                : `file://${item.path || item.url}`,
                            }}
                            style={styles.image}
                          />
                          <TouchableOpacity
                            onPress={() =>
                              handleRemoveImage(
                                item.isLocal ? item.ImageId : item.imageId,
                                'photoFullFrontalOfWholeSignStructurePhoto',
                                'photoFullFrontalOfWholeSignStructurePhotos',
                                item.path,
                                item.isLocal,
                              )
                            }
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
            <View style={{marginVertical: 13}}>
              <View style={styles.section}>
                <Text style={styles.label}>Photo - close-up of sign</Text>
              </View>
              <TouchableOpacity
                style={styles.imageCon}
                onPress={() =>
                  showPhotoOptions(
                    setSelectedOptions,
                    'photoCloseUpOfSign',
                    'PhotosAndMesurements',
                    false,
                  )
                }>
                <View style={styles.photoButton}>
                  <Text style={styles.photoText}>add photo</Text>
                  <Photo />
                </View>

                <View style={styles.fileNameContainer}>
                  <Text style={styles.fileNameText}>
                    {selectedOptions?.photoCloseUpOfSign?.length > 0
                      ? `${selectedOptions?.photoCloseUpOfSign?.length} files Choosen`
                      : 'No file Choosen'}
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
                    const mergedCloseUpImages = [
                      ...(selectedOptions?.photoCloseUpOfSign?.map(item => ({
                        ...item,
                        isLocal: true,
                      })) || []),
                      ...(selectedOptions?.photoCloseUpOfSigns?.map(item => ({
                        ...item,
                        isLocal: false,
                      })) || []),
                    ];

                    if (mergedCloseUpImages.length === 0) return null;

                    return mergedCloseUpImages.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          openEditorforUpdate(
                            item.path || item.url,
                            setSelectedOptions,
                            item.isLocal
                              ? 'photoCloseUpOfSign'
                              : 'photoCloseUpOfSigns',
                            'CloseUpSign',
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
                                ? item.path
                                : `file://${item.path || item.url}`,
                            }}
                            style={styles.image}
                          />
                          <TouchableOpacity
                            onPress={() =>
                              handleRemoveImage(
                                item.isLocal ? item.ImageId : item.imageId,
                                'photoCloseUpOfSign',
                                'photoCloseUpOfSigns',
                                item.path,
                                item.isLocal,
                              )
                            }
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
            <View>
              <TouchableOpacity
                style={[styles.containerDrop]}
                onPress={() => setVisible(prev => !prev)}>
                <Text style={styles.label}>Measure visible opening</Text>
                <View style={styles.iconButton}>
                  {visible ? (
                    <Down width={18} height={18} />
                  ) : (
                    <Up width={18} height={18} />
                  )}
                </View>
              </TouchableOpacity>
              <View style={{marginBottom: !visible ? 16 : 0}}>
                <Collapsible
                  duration={300}
                  easing="easeInOutQuad"
                  collapsed={!visible}>
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

                    <TouchableOpacity
                      style={styles.imageCon}
                      onPress={() =>
                        showPhotoOptions(
                          setSelectedOptions,
                          'visibleOpeningsPhoto',
                          'PhotosAndMesurements',
                          false,
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
                        <Text style={styles.fileNameText}>
                          {selectedOptions?.visibleOpeningsPhoto?.length > 0
                            ? `${selectedOptions?.visibleOpeningsPhoto?.length} files Choosen`
                            : 'No file Choosen'}
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
                          const mergedVisibleOpeningsImages = [
                            ...(selectedOptions?.visibleOpeningsPhoto?.map(
                              item => ({
                                ...item,
                                isLocal: true,
                              }),
                            ) || []),
                            ...(selectedOptions?.visibleOpeningsPhotos?.map(
                              item => ({
                                ...item,
                                isLocal: false,
                              }),
                            ) || []),
                          ];

                          if (mergedVisibleOpeningsImages.length === 0)
                            return null;

                          return mergedVisibleOpeningsImages.map(
                            (item, index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() => {
                                  openEditorforUpdate(
                                    item.path || item.url,
                                    setSelectedOptions,
                                    item.isLocal
                                      ? 'visibleOpeningsPhoto'
                                      : 'visibleOpeningsPhotos',
                                    'VisibleOpenings',
                                    true,
                                    item.isLocal ? item.ImageId : item.imageId,
                                    baseUrl,
                                    loginData?.tokenNumber,
                                    true,
                                    signProjectData?.photos_and_measurements
                                      ?.id ||
                                      signProjectData?.photos_and_measurements
                                        ?.Id,
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
                                        ? item.path
                                        : `file://${item.path || item.url}`,
                                    }}
                                    style={styles.image}
                                  />
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleRemoveImage(
                                        item.isLocal
                                          ? item.ImageId
                                          : item.imageId,
                                        'visibleOpeningsPhoto',
                                        'visibleOpeningsPhotos',
                                        item.path,
                                        item.isLocal,
                                      )
                                    }
                                    style={styles.removeButton}>
                                    <Text style={styles.removeButtonText}>
                                      ×
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </TouchableOpacity>
                            ),
                          );
                        })()
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() => setVisible(prev => !prev)}
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
            {selectedOptions.signId == '2' && (
              <View>
                <TouchableOpacity
                  style={[styles.containerDrop]}
                  onPress={() => setRetainer(prev => !prev)}>
                  <Text style={styles.label}>Measure retainer size</Text>
                  <View style={styles.iconButton}>
                    {retainer ? (
                      <Down width={18} height={18} />
                    ) : (
                      <Up width={18} height={18} />
                    )}
                  </View>
                </TouchableOpacity>
                <View style={{marginBottom: !retainer ? 16 : 0}}>
                  <Collapsible
                    duration={300}
                    easing="easeInOutQuad"
                    collapsed={!retainer}>
                    <View style={styles.sectionContainer}>
                      <View style={styles.row}>
                        <TextInput
                          style={[styles.input, {flex: 1}]}
                          placeholder="Height(in)"
                          keyboardType="number-pad"
                          value={selectedOptions?.measureRetainerSizeHeightIN}
                          onChangeText={text => {
                            setSelectedOptions(prev => {
                              return {
                                ...prev,
                                measureRetainerSizeHeightIN: text,
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
                          showPhotoOptions(
                            setSelectedOptions,
                            'measureRetainerSizePhoto',
                            'PhotosAndMesurements',
                            false,
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
                          <Text style={styles.fileNameText}>
                            {selectedOptions?.measureRetainerSizePhoto?.length >
                            0
                              ? `${selectedOptions?.measureRetainerSizePhoto?.length} files Choosen`
                              : 'No file Choosen'}
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
                            const mergedMeasureRetainerImages = [
                              ...(selectedOptions?.measureRetainerSizePhoto?.map(
                                item => ({
                                  ...item,
                                  isLocal: true,
                                }),
                              ) || []),
                              ...(selectedOptions?.measureRetainerSizePhotos?.map(
                                item => ({
                                  ...item,
                                  isLocal: false,
                                }),
                              ) || []),
                            ];

                            if (mergedMeasureRetainerImages.length === 0)
                              return null;

                            return mergedMeasureRetainerImages.map(
                              (item, index) => (
                                <TouchableOpacity
                                  key={index}
                                  onPress={() => {
                                    openEditorforUpdate(
                                      item.path || item.url,
                                      setSelectedOptions,
                                      item.isLocal
                                        ? 'measureRetainerSizePhoto'
                                        : 'measureRetainerSizePhotos',
                                      'MeasureRetainerSize',
                                      true,
                                      item.isLocal
                                        ? item.ImageId
                                        : item.imageId,
                                      baseUrl,
                                      loginData?.tokenNumber,
                                      true,
                                      signProjectData?.photos_and_measurements
                                        ?.id ||
                                        signProjectData?.photos_and_measurements
                                          ?.Id,
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
                                          ? item.path
                                          : `file://${item.path || item.url}`,
                                      }}
                                      style={styles.image}
                                    />
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleRemoveImage(
                                          item.isLocal
                                            ? item.ImageId
                                            : item.imageId,
                                          'measureRetainerSizePhoto',
                                          'measureRetainerSizePhotos',
                                          item.path,
                                          item.isLocal,
                                        )
                                      }
                                      style={styles.removeButton}>
                                      <Text style={styles.removeButtonText}>
                                        ×
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </TouchableOpacity>
                              ),
                            );
                          })()
                        )}
                      </View>

                      <TouchableOpacity
                        onPress={() => setRetainer(prev => !prev)}
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
            )}

            {selectedOptions.signId == '2' && (
              <View>
                <TouchableOpacity
                  style={[styles.containerDrop]}
                  onPress={() => setPanstate(prev => !prev)}>
                  <Text style={styles.label}>
                    If pan, measure pan dimensions
                  </Text>
                  <View style={styles.iconButton}>
                    {pansState ? (
                      <Down width={18} height={18} />
                    ) : (
                      <Up width={18} height={18} />
                    )}
                  </View>
                </TouchableOpacity>
                <View style={{marginBottom: !pansState ? 16 : 0}}>
                  <Collapsible
                    duration={300}
                    easing="easeInOutQuad"
                    collapsed={!pansState}>
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
                          value={
                            selectedOptions?.ifPanMeasurePanDimensionWidthFT
                          }
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
                          value={
                            selectedOptions?.ifPanMeasurePanDimensionDepthIN
                          }
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
                          value={
                            selectedOptions?.ifPanMeasurePanDimensionDepthFT
                          }
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
                          showPhotoOptions(
                            setSelectedOptions,
                            'ifPanMeasurePanDimensionPhoto',
                            'PhotosAndMesurements',
                            false,
                          )
                        }>
                        <View style={styles.photoButton}>
                          <Text style={styles.photoText}>add photo</Text>
                          <Photo />
                        </View>

                        <View style={styles.fileNameContainer}>
                          <Text style={styles.fileNameText}>
                            {selectedOptions?.ifPanMeasurePanDimensionPhoto
                              ?.length > 0
                              ? `${selectedOptions?.ifPanMeasurePanDimensionPhoto?.length} files Choosen`
                              : 'No file Choosen'}
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
                            const mergedIfPanMeasureImages = [
                              ...(selectedOptions?.ifPanMeasurePanDimensionPhoto?.map(
                                item => ({
                                  ...item,
                                  isLocal: true,
                                }),
                              ) || []),
                              ...(selectedOptions?.ifPanMeasurePanDimensionPhotos?.map(
                                item => ({
                                  ...item,
                                  isLocal: false,
                                }),
                              ) || []),
                            ];

                            if (mergedIfPanMeasureImages.length === 0)
                              return null;

                            return mergedIfPanMeasureImages.map(
                              (item, index) => (
                                <TouchableOpacity
                                  key={index}
                                  onPress={() => {
                                    openEditorforUpdate(
                                      item.path || item.url,
                                      setSelectedOptions,
                                      item.isLocal
                                        ? 'ifPanMeasurePanDimensionPhoto'
                                        : 'ifPanMeasurePanDimensionPhotos',
                                      'IfPanMeasurePanDimension',
                                      true,
                                      item.isLocal
                                        ? item.ImageId
                                        : item.imageId,
                                      baseUrl,
                                      loginData?.tokenNumber,
                                      true,
                                      signProjectData?.photos_and_measurements
                                        ?.id ||
                                        signProjectData?.photos_and_measurements
                                          ?.Id,
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
                                          ? item.path
                                          : `file://${item.path || item.url}`,
                                      }}
                                      style={styles.image}
                                    />
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleRemoveImage(
                                          item.isLocal
                                            ? item.ImageId
                                            : item.imageId,
                                          'ifPanMeasurePanDimensionPhoto',
                                          'ifPanMeasurePanDimensionPhotos',
                                          item.path,
                                          item.isLocal,
                                        )
                                      }
                                      style={styles.removeButton}>
                                      <Text style={styles.removeButtonText}>
                                        ×
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </TouchableOpacity>
                              ),
                            );
                          })()
                        )}
                      </View>

                      <TouchableOpacity
                        onPress={() => setPanstate(prev => !prev)}
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
            )}

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
                        showPhotoOptions(
                          setSelectedOptions,
                          'otherPhotosMeasurementsMarkupsPhoto',
                          'PhotosAndMesurements',
                          false,
                        )
                      }>
                      <View style={styles.photoButton}>
                        <Text style={styles.photoText}>add photo</Text>
                        <Photo />
                      </View>

                      <View style={styles.fileNameContainer}>
                        <Text style={styles.fileNameText}>
                          {selectedOptions?.otherPhotosMeasurementsMarkupsPhoto
                            ?.length > 0
                            ? `${selectedOptions?.otherPhotosMeasurementsMarkupsPhoto?.length} files Choosen`
                            : 'No file Choosen'}
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
                          const mergedOtherMarkupImages = [
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

                          if (mergedOtherMarkupImages.length === 0) return;

                          return mergedOtherMarkupImages.map((item, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => {
                                openEditorforUpdate(
                                  item.path || item.url,
                                  setSelectedOptions,
                                  item.isLocal
                                    ? 'otherPhotosMeasurementsMarkupsPhoto'
                                    : 'otherPhotosMeasurementsMarkupsPhotos',
                                  'OtherMeasurementsMarkup',
                                  true,
                                  item.isLocal ? item.ImageId : item.imageId,
                                  baseUrl,
                                  loginData?.tokenNumber,
                                  true,
                                  signProjectData?.photos_and_measurements
                                    ?.id ||
                                    signProjectData?.photos_and_measurements
                                      ?.Id,
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
                                      ? item.path
                                      : `file://${item.path || item.url}`,
                                  }}
                                  style={styles.image}
                                />
                                <TouchableOpacity
                                  onPress={() =>
                                    handleRemoveImage(
                                      item.isLocal
                                        ? item.ImageId
                                        : item.imageId,
                                      'otherPhotosMeasurementsMarkupsPhoto',
                                      'otherPhotosMeasurementsMarkupsPhotos',
                                      item.path,
                                      item.isLocal,
                                    )
                                  }
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
              onPress={() => {
                dispatch(setActiveState('Photos'));
              }}>
              <UpDownIcon width={39} height={39} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
export default Photos;
