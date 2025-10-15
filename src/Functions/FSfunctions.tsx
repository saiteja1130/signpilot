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
  setter: boolean,
  status: boolean,
  path: string,
): Promise<string> => {
  try {
    const readBase64 = await getBase64FromFile(tempPath);
    const folderPath = `${RNFS.DocumentDirectoryPath}/${key}`;
    let fileName: string = status ? path : `${folderPath}/${Date.now()}.jpg`;
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

export const getBase64Array = async (
  imageArray: {ImageId: number; path: string}[],
) => {
  const base64Array: string[] = [];

  for (const img of imageArray) {
    try {
      // Read file as base64
      const base64Data = await RNFS.readFile(img.path, 'base64');
      base64Array.push(base64Data);
    } catch (error) {
      console.log('Error reading file as base64:', img.path, error);
    }
  }

  return base64Array;
};

export const getBase64Array2222 = async (
  imageArray: {ImageId: number; path: string; fileName?: string}[],
) => {
  const base64Array: string[] = [];

  for (const img of imageArray) {
    try {
      // 1️⃣ Normalize path (remove file://)
      const tempPath = img.path.startsWith('file://')
        ? img.path.replace('file://', '')
        : img.path;

      // 2️⃣ Copy to persistent folder (optional, avoids ENOENT)
      const fileName = img.fileName || `${Date.now()}.jpg`;
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const fileExists = await RNFS.exists(destPath);
      if (!fileExists) {
        await RNFS.copyFile(tempPath, destPath);
      }

      // 3️⃣ Read as base64
      const base64Data = await RNFS.readFile(destPath, 'base64');
      base64Array.push(base64Data);
    } catch (error) {
      console.log('Error reading file as base64:', img.path, error);
    }
  }

  return base64Array;
};

export const downloadImagesArray = async (
  images: {imageId: string; url: string}[],
  key: string,
) => {
  console.log('DOWNLOADING IMAGESS:', key);
  return Promise.all(
    images.map(async img => {
      try {
        const fileExtension = img.url.split('.').pop() || 'jpg';
        const folderPath = `${RNFS.DocumentDirectoryPath}/${key}`;
        if (!(await RNFS.exists(folderPath))) {
          await RNFS.mkdir(folderPath);
          console.log('FOLDER CREATED::');
        }
        const filePath = `${folderPath}/${Date.now()}.${fileExtension}`;

        const result = await RNFS.downloadFile({
          fromUrl: img.url,
          toFile: filePath,
        }).promise;

        console.log('IMAGE RESULTTT:::', result);
        if (
          result.statusCode === 200 ||
          result.statusCode === 201 ||
          !result.statusCode
        ) {
          return {
            imageId: img.imageId,
            path: filePath,
          };
        } else {
          console.log('Failed to download image:', img.url, result.statusCode);
          return {imageId: img.imageId, path: null};
        }
      } catch (error) {
        console.log('Error downloading image:', img.url, error);
        return {imageId: img.imageId, path: null};
      }
    }),
  );
};

export const deleteFolders = async () => {
  try {
    const basePath = RNFS.DocumentDirectoryPath;
    const items = await RNFS.readDir(basePath);

    for (const item of items) {
      if (item.isDirectory()) {
        try {
          await RNFS.unlink(item.path);
          console.log(`Deleted folder: ${item.name}`);
        } catch (err) {
          console.log(`Error deleting folder ${item.name}:`, err);
        }
      }
    }

    console.log('✅ All folders deleted successfully');
  } catch (error) {
    console.log('Error reading document directory:', error);
  }
};
