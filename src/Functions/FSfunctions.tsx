import RNFS from 'react-native-fs';
import {insertImage} from '../Db/ProjectDatabase';

export const clearCache = async () => {
  try {
    const cachePath = RNFS.CachesDirectoryPath;
    const files = await RNFS.readDir(cachePath);

    for (const file of files) {
      await RNFS.unlink(file.path);
      console.log('Deleted cache file:', file.path);
    }

    console.log('Cache cleared successfully');
  } catch (error) {
    console.log('Error clearing cache:', error);
  }
};

export const getBase64FromFile = async (filePath: string): Promise<string> => {
  try {
    const base64Data = await RNFS.readFile(filePath, 'base64');
    console.log('Base64 length:::::::::', base64Data.length);
    return base64Data;
  } catch (err) {
    console.error('Error reading file as Base64:::::::::', err);
    return '';
  }
};

export const getPath = async (uri: string) => {
  if (uri.startsWith('content://')) {
    const dest = `${RNFS.CachesDirectoryPath}/temp_${Date.now()}.jpg`;
    await RNFS.copyFile(uri, dest);
    console.log('Dist Uri:::', dest);
    return dest;
  }
  return uri.replace('file://', '');
};

export const functionToSaveImages = async (
  tempPath: string = '',
  key: string,
  state: boolean,
): Promise<string> => {
  try {
    const readBase64 = await getBase64FromFile(tempPath);
    const folderPath = `${RNFS.DocumentDirectoryPath}/${key}`;
    let fileName: string = `${folderPath}/${Date.now()}.jpg`;
    const folderExists: boolean = await RNFS.exists(folderPath);
    if (!folderExists) {
      await RNFS.mkdir(folderPath);
      console.log('Folder Created::::::::');
    }
    await RNFS.writeFile(fileName, readBase64, 'base64');
    return fileName;
  } catch (error) {
    console.log('Image Saving Error::', error);
    return '';
  }
};
