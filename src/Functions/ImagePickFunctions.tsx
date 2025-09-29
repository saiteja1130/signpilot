import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {compressImage} from './compressImage';
import {Alert} from 'react-native';
import {requestCameraPermission, requestMediaPermission} from './functions';
import {functionToSaveImages, getPath} from './FSfunctions';
import PhotoEditor from '@baronha/react-native-photo-editor';
import RNFS from 'react-native-fs';
import {getAllImages} from '../Db/ProjectDatabase';

export const openEditor = async (
  uri: string,
  setter: any,
  key: string,
  folderName: string,
) => {
  try {
    const path = await getPath(uri);
    const result: any = await PhotoEditor.open({
      path,
      stickers: [],
    });
    const tempPath: string = await compressImage(result, 'Final After Editing');
    if (tempPath !== '') {
      const fileName = await getPath(result);
      await RNFS.unlink(fileName);
    }
    console.log('Edited image saved at:', tempPath);
    const permenantPath = await functionToSaveImages(tempPath, key, setter);
    if (permenantPath !== '') {
      const removingFileName = await getPath(tempPath);
      await RNFS.unlink(removingFileName);
    }
    const ImageId = Date.now();

    setter((prev: any) => ({
      ...prev,
      [key]: [...(prev[key] || []), {ImageId, path: permenantPath}],
    }));
    return;
  } catch (e: any) {
    console.log('PhotoEditor error:', e.message);
    Alert.alert('Error', e.message);
  }
};

export const showPhotoOptions = (
  setter: any,
  key: string,
  folderName: string,
) => {
  Alert.alert(
    'Select Photo',
    'Choose an option',
    [
      {
        text: 'Take Photo',
        onPress: () => {
          console.log('Take Photo pressed');
          handleTakePhoto(setter, key, folderName);
        },
      },
      {
        text: 'Pick from Gallery',
        onPress: () => {
          console.log('Pick from Gallery pressed');
          handlePickPhoto(setter, key, folderName);
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
    {cancelable: true},
  );
};

const handleTakePhoto = async (
  setter: any,
  key: string,
  folderName: string,
) => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    Alert.alert('Permissions denied');
    return;
  }
  launchCamera({mediaType: 'photo'}, async response => {
    if (response.didCancel) return;
    if (response.errorCode) {
      console.log('Camera error:', response.errorMessage);
      return;
    }
    if (response.assets && response.assets[0].uri) {
      const originalPath = response.assets[0].uri;

      const compressPath: any = await compressImage(
        originalPath,
        'After Initial Compression',
      );
      openEditor(compressPath, setter, key, folderName);
    }
  });
};

const handlePickPhoto = async (
  setter: any,
  key: string,
  folderName: string,
) => {
  const hasPermission = await requestMediaPermission();
  if (!hasPermission) {
    Alert.alert('Permissions denied');
    return;
  }
  launchImageLibrary(
    {mediaType: 'photo', selectionLimit: 1},
    async response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log('Picker error:', response.errorMessage);
        return;
      }
      if (response.assets && response.assets[0].uri) {
        const originalPath = response.assets[0].uri;

        const compressPath: string = await compressImage(
          originalPath,
          'After Initial Compression',
        );
        openEditor(compressPath, setter, key, folderName);
      }
    },
  );
};
