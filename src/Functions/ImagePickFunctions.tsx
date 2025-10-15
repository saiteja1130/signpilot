import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {compressImage} from './compressImage';
import {Alert} from 'react-native';
import {
  requestCameraPermission,
  requestMediaPermission,
  updateFile,
} from './functions';
import {functionToSaveImages, getBase64FromFile, getPath} from './FSfunctions';
import PhotoEditor from '@baronha/react-native-photo-editor';
import RNFS from 'react-native-fs';

export const openEditor = async (
  uri: string,
  setter: any,
  key: string,
  folderName: string,
  status: boolean,
  ImageIdOld: number,
  saveTo: boolean,
) => {
  try {
    const path = await getPath(uri);
    const result: any = await PhotoEditor.open({
      path,
      stickers: [],
    });
    if (result && result !== path) {
      const fileExists = await RNFS.exists(path);
      if (fileExists) {
        await RNFS.unlink(path);
      }
    }
    const tempPath: string = await compressImage(result, 'Final After Editing');
    console.log('Edited image temp path:', tempPath);
    let permanentPath = tempPath;
    if (saveTo) {
      permanentPath = await functionToSaveImages(
        tempPath,
        key,
        setter,
        status,
        '',
      );
    }
    if (tempPath && tempPath !== permanentPath) {
      const tempFileExists = await RNFS.exists(tempPath);
      console.log('tempfile', tempFileExists);
      if (tempFileExists) {
        await RNFS.unlink(tempPath);
        console.log('Temporary file removed:', tempPath);
      }
    }
    const ImageId = status ? ImageIdOld : Date.now();
    setter((prev: any) => {
      const existingArray = prev[key] || [];
      if (status) {
        const indexToReplace = existingArray.findIndex(
          (item: any) => item.ImageId === ImageId,
        );
        if (indexToReplace !== -1) {
          const updatedArray = [...existingArray];
          updatedArray[indexToReplace] = {ImageId, path: permanentPath};
          return {...prev, [key]: updatedArray};
        }
      }
      return {
        ...prev,
        [key]: [...existingArray, {ImageId, path: permanentPath}],
      };
    });

    return;
  } catch (e: any) {
    console.log('PhotoEditor error:', e.message);
    Alert.alert('Error', e.message);
  }
};

export const openEditorforUpdate = async (
  uri: string,
  setter: any,
  key: string,
  folderName: string,
  status: boolean,
  imageId: number,
  baseUrl: string,
  tokenNumber: string,
  saveTo: boolean,
  moduleId: number | string,
  module: string,
  localFileUpdate: boolean,
) => {
  console.log('openEditorforUpdate called with:', {
    uri,
    key,
    folderName,
    status,
    imageId,
    saveTo,
    moduleId,
    module,
    localFileUpdate,
  });

  try {
    const path = await getPath(uri);

    const result: any = await PhotoEditor.open({
      path,
      stickers: [],
    });

    if (localFileUpdate) {
      console.log('Local file update, skipping upload.');
      if (result && result !== path) {
        const fileExists = await RNFS.exists(path);
        if (fileExists) {
          await RNFS.unlink(path);
        }
      }
      setter((prev: any) => {
        const existingArray = prev[key] || [];

        if (status) {
          const indexToReplace = existingArray.findIndex(
            (item: any) => item.ImageId === imageId,
          );
          if (indexToReplace !== -1) {
            const updatedArray = [...existingArray];
            updatedArray[indexToReplace] = {ImageId: imageId, path: result};
            return {...prev, [key]: updatedArray};
          }
        }

        return {
          ...prev,
          [key]: [...existingArray, {ImageId: imageId, path: result}],
        };
      });
    } else {
      await updateFile({
        baseUrl,
        tokenNumber,
        imageId: imageId,
        module: module,
        field: key,
        moduleId: moduleId,
        resultPath: result,
        localleySavedpath: path,
      });
    }

    // console.log('ImageId', imageId);
  } catch (e: any) {
    console.log('PhotoEditor error:', e.message);
  }
};

export const showPhotoOptions = (
  setter: any,
  key: string,
  folderName: string,
  saveTo: boolean,
) => {
  Alert.alert(
    'Select Photo',
    'Choose an option',
    [
      {
        text: 'Take Photo',
        onPress: () => {
          console.log('Take Photo pressed');
          handleTakePhoto(setter, key, folderName, saveTo);
        },
      },
      {
        text: 'Pick from Gallery',
        onPress: () => {
          console.log('Pick from Gallery pressed');
          handlePickPhoto(setter, key, folderName, saveTo);
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
  saveTo: boolean,
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
      openEditor(originalPath, setter, key, folderName, false, 12, saveTo);
    }
  });
};

const handlePickPhoto = async (
  setter: any,
  key: string,
  folderName: string,
  saveTo: boolean,
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
        openEditor(originalPath, setter, key, folderName, false, 12, saveTo);
      }
    },
  );
};
