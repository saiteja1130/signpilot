import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import PhotoEditor from '@baronha/react-native-photo-editor';
import RNFS from 'react-native-fs';
import {
  requestCameraPermission,
  requestMediaPermission,
} from '../Functions/functions';
import {
  createImageTable,
  getAllImages,
  updatePathInsideImageTable,
} from '../Db/ProjectDatabase';
import {compressImage} from '../Functions/compressImage';
import {
  clearCache,
  functionToSaveImages,
  getPath,
} from '../Functions/FSfunctions';

const Testpage = () => {
  const [imageArr, setImageArr] = useState<any[]>([]);
  const editTheExistingImage = async (item: any) => {
    const path = await getPath(item.path);
    const result: any = await PhotoEditor.open({
      path,
      stickers: [],
    });
    const tempPath: string = await compressImage(result, 'Final After Editing');

    if (tempPath !== '') {
      const fileName = await getPath(result);
      await RNFS.unlink(fileName);
      await RNFS.unlink(path);
    }
    const permenantPath = await functionToSaveImages(
      tempPath,
      'ExistingSignAudit',
      true,
    );
    updatePathInsideImageTable(item.imageID, permenantPath, setImageArr);
  };

  const openEditor = async (uri: string) => {
    try {
      const path = await getPath(uri);
      const result: any = await PhotoEditor.open({
        path,
        stickers: [],
      });
      const tempPath: string = await compressImage(
        result,
        'Final After Editing',
      );
      if (tempPath !== '') {
        const fileName = await getPath(result);
        await RNFS.unlink(fileName);
      }
      console.log('Edited image saved at:', tempPath);
      const permenantPath = await functionToSaveImages(
        tempPath,
        'ExistingSignAudit',
        false,
      );
      if (permenantPath !== '') {
        const removingFileName = await getPath(tempPath);
        await RNFS.unlink(removingFileName);
        getAllImages(setImageArr);
      }
      return;
    } catch (e: any) {
      console.log('PhotoEditor error:', e.message);
      Alert.alert('Error', e.message);
    }
  };

  const handleTakePhoto = async () => {
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
        openEditor(compressPath);
      }
    });
  };

  const handlePickPhoto = async () => {
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
          openEditor(compressPath);
        }
      },
    );
  };

  useEffect(() => {
    // dropImageTable();
    clearCache();
    createImageTable();
    getAllImages(setImageArr);
  }, []);

  const readImages = () => {
    let images: any[] = [];
    imageArr?.forEach(async item => {
      console.log('itemitemitemitemitemitemitem', item);
      const readImage: string = await RNFS.readFile(item.path, 'base64');
      if (readImage) {
        images.push(readImage);
      }
    });
    console.log('Images:::::::::::::::', images);
  };

  useEffect(() => {
    if (imageArr?.length > 0) {
      readImages();
    }
  }, [imageArr]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Photo Picker + Editor</Text>

      <View style={styles.buttonRow}>
        <Button title="📷 Take Photo" onPress={handleTakePhoto} />
        <Button title="🖼️ Pick from Gallery" onPress={handlePickPhoto} />
      </View>
      {imageArr?.length > 0 ? (
        <>
          {imageArr.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => editTheExistingImage(item)}>
                <Image
                  source={{uri: 'file://' + item.path}}
                  style={styles.preview}
                />
              </TouchableOpacity>
            );
          })}
        </>
      ) : null}
    </ScrollView>
  );
};

export default Testpage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {fontSize: 20, marginBottom: 20, fontWeight: 'bold'},
  buttonRow: {flexDirection: 'row', gap: 10, marginBottom: 20},
  preview: {
    width: 80,
    height: 80,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

// const downloadImage = async () => {
//   try {
//     const folderPath = `${RNFS.DocumentDirectoryPath}/existingauditphotos`;
//     console.log('folderPath:::', folderPath);
//     const folderExists: boolean = await RNFS.exists(folderPath);
//     if (!folderExists) {
//       await RNFS.mkdir(folderPath);
//       console.log('Folder Created');
//     }
//     console.log('Folder Created::', folderExists);
//     const uri =
//       'https://images.unsplash.com/photo-1507149833265-60c372daea22';
//     const fileName = `ExistingAuditPhoto_${Date.now()}.jpg`;
//     const filePath = `${folderPath}/${fileName}`;

//     const result = await RNFS.downloadFile({
//       fromUrl: uri,
//       toFile: filePath,
//     }).promise;

//     console.log('Download Image:::', result);
//   } catch (error) {
//     console.log('Download Image error:::', error);
//   }
// };

// useEffect(() => {
//   downloadImage();
// }, []);
