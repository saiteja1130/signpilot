import React, {useState} from 'react';
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

const Testpage = () => {
  const [editedImagePath, setEditedImagePath] = useState<string | null>(null);

  // Request permissions on Android
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const perms = [PermissionsAndroid.PERMISSIONS.CAMERA];

        if (Platform.Version >= 33) {
          // Android 13+
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

  const openEditor = async (uri: string) => {
    try {
      const path = await getPath(uri);
      const result: any = await PhotoEditor.open({
        path,
        stickers: [],
      });
      console.log('Edited image saved at:', result);
      setEditedImagePath(result);
    } catch (e: any) {
      console.log('PhotoEditor error:', e.message);
      Alert.alert('Error', e.message);
    }
  };

  // Handle taking photo
  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permissions denied');
      return;
    }

    launchCamera({mediaType: 'photo'}, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log('Camera error:', response.errorMessage);
        return;
      }
      if (response.assets && response.assets[0].uri) {
        openEditor(response.assets[0].uri);
      }
    });
  };

  // Handle picking photo from gallery
  const handlePickPhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permissions denied');
      return;
    }

    launchImageLibrary({mediaType: 'photo', selectionLimit: 1}, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log('Picker error:', response.errorMessage);
        return;
      }
      if (response.assets && response.assets[0].uri) {
        openEditor(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photo Picker + Editor</Text>

      <View style={styles.buttonRow}>
        <Button title="📷 Take Photo" onPress={handleTakePhoto} />
        <Button title="🖼️ Pick from Gallery" onPress={handlePickPhoto} />
      </View>

      {editedImagePath && (
        <TouchableOpacity onPress={() => openEditor(editedImagePath)}>
          <Image source={{uri: editedImagePath}} style={styles.preview} />
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
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  preview: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
