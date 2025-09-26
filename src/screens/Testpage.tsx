import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Alert,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import PhotoEditor from '@baronha/react-native-photo-editor';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

const Testpage = () => {
  const [editedImagePath, setEditedImagePath] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Request permissions
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const perms = [PermissionsAndroid.PERMISSIONS.CAMERA];
        if (Platform.Version >= 33) {
          perms.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
        } else {
          perms.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        }
        const granted = await PermissionsAndroid.requestMultiple(perms);
        return (
          granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          (Platform.Version >= 33
            ? granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED
            : granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
              PermissionsAndroid.RESULTS.GRANTED)
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const getPath = async (uri: string) => {
    if (uri.startsWith('content://')) {
      const dest = `${RNFS.CachesDirectoryPath}/temp_${Date.now()}.jpg`;
      await RNFS.copyFile(uri, dest);
      return dest;
    }
    return uri.replace('file://', '');
  };

  const logFileSize = async (path: string, label: string) => {
    try {
      const stats = await RNFS.stat(path);
      console.log(`${label} size: ${formatSize(Number(stats.size))}`);
    } catch (e) {
      console.log(`Error reading size for ${label}:`, e);
    }
  };

  //return only string variable
  const compressImage = async (uri: string, label: string): Promise<string> => {
    try {
      const resizedImage = await ImageResizer.createResizedImage(
        uri,
        800,
        600,
        'JPEG',
        80,
      );
      const uriImage: string = resizedImage.uri;
      console.log(
        `${label} compressed path:`,
        typeof resizedImage.uri,
        uriImage,
      );
      await logFileSize(uriImage, label);
      return uriImage;
    } catch (err) {
      console.log(`${label} compression error:`, err);
      return '';
    }
  };

  const openEditor = async (uri: string) => {
    try {
      const path = await getPath(uri);
      await logFileSize(path, 'Before Editing');

      const result: any = await PhotoEditor.open({
        path,
        stickers: [],
      });

      console.log('Edited image saved at:', result);
      await logFileSize(result, 'After Editing (raw)');

      // 🔹 Compress AFTER editing
      const finalCompressed: string = await compressImage(
        result,
        'Final After Editing',
      );
      setEditedImagePath(finalCompressed);
    } catch (e: any) {
      console.log('PhotoEditor error:', e.message);
      Alert.alert('Error', e.message);
    }
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions();
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
        await logFileSize(originalPath, 'Original Picked (Camera)');
        const compressPath: any = await compressImage(
          originalPath,
          'After Initial Compression',
        );
        openEditor(compressPath);
      }
    });
  };

  const handlePickPhoto = async () => {
    const hasPermission = await requestPermissions();
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
          await logFileSize(originalPath, 'Original Picked (Gallery)');
          const compressPath: any = await compressImage(
            originalPath,
            'After Initial Compression',
          );
          openEditor(compressPath);
        }
      },
    );
  };

  const downloadImage = async () => {
    try {
      const folderPath = `${RNFS.DocumentDirectoryPath}/existingauditphotos`;
      console.log('folderPath:::', folderPath);
      const folderExists: boolean = await RNFS.exists(folderPath);
      if (!folderExists) {
        await RNFS.mkdir(folderPath);
        console.log('Folder Created');
      }
      console.log('Folder Created::', folderExists);
      const uri =
        'https://images.unsplash.com/photo-1507149833265-60c372daea22';
      const fileName = `ExistingAuditPhoto_${Date.now()}.jpg`;
      const filePath = `${folderPath}/${fileName}`;

      const result = await RNFS.downloadFile({
        fromUrl: uri,
        toFile: filePath,
      }).promise;

      console.log('Download Image:::', result);
    } catch (error) {
      console.log('Download Image error:::', error);
    }
  };

  useEffect(() => {
    downloadImage();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photo Picker + Editor</Text>

      <View style={styles.buttonRow}>
        <Button title="📷 Take Photo" onPress={handleTakePhoto} />
        <Button title="🖼️ Pick from Gallery" onPress={handlePickPhoto} />
      </View>

      {editedImagePath && (
        <TouchableOpacity onPress={() => openEditor(editedImagePath!)}>
          <Image source={{uri: editedImagePath}} style={styles.preview} />
          <Text style={{marginTop: 10}}>Final Image Saved</Text>
        </TouchableOpacity>
      )}
    </View>
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
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
