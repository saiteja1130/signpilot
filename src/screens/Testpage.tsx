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
  dropImageTable,
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
  const [existingSignAuditPhotos, setExistingSignAuditPhotos] = useState<any[]>(
    [],
  );
  const [electricalAuditPhotos, setElectricalAuditPhotos] = useState<any[]>([]);

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
    updatePathInsideImageTable(
      item.imageID,
      permenantPath,
      setExistingSignAuditPhotos,
    );
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
        getAllImages(setExistingSignAuditPhotos);
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

  const readImages = () => {
    let images: any[] = [];
    existingSignAuditPhotos?.forEach(async item => {
      console.log('itemitemitemitemitemitemitem', item);
      const readImage: string = await RNFS.readFile(item.path, 'base64');
      if (readImage) {
        images.push(readImage);
      }
    });
    console.log('Images:::::::::::::::', images);
  };

  useEffect(() => {
    if (existingSignAuditPhotos?.length > 0) {
      readImages();
    }
  }, [existingSignAuditPhotos]);

  useEffect(() => {
    // dropImageTable();
    // clearCache();
    createImageTable();
    getAllImages(setExistingSignAuditPhotos);
  }, []);

  const showPhotoOptions = () => {
    Alert.alert(
      'Select Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => {
            console.log('Take Photo pressed');
            handleTakePhoto();
          },
        },
        {
          text: 'Pick from Gallery',
          onPress: () => {
            console.log('Pick from Gallery pressed');
            handlePickPhoto();
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Photo Picker + Editor</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Existing Sign Audit</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => showPhotoOptions()}>
            <Text style={styles.buttonText}> No File Choosen</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal contentContainerStyle={styles.photoRow}>
          {existingSignAuditPhotos.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.photoCard}
              onPress={() => editTheExistingImage(item)}>
              <Image
                source={{uri: 'file://' + item.path}}
                style={styles.photo}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Electrical Audit</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => showPhotoOptions()}>
            <Text style={styles.buttonText}> No File Choosen</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal contentContainerStyle={styles.photoRow}>
          {electricalAuditPhotos.map((item, index) => (
            <TouchableOpacity key={index} style={styles.photoCard}>
              <Image
                source={{uri: 'file://' + item.path}}
                style={styles.photo}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default Testpage;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  button: {
    flex: 1,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  photoRow: {
    paddingVertical: 5,
    gap: 10,
  },
  photoCard: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
    backgroundColor: '#fff',
    elevation: 3, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
});

// const downloadImage = async () => {
//   try {
//     const folderPath = `${RNFS.ExternalDirectoryPath}/existingauditphotos`;
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
