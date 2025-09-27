import ImageResizer from 'react-native-image-resizer';

export const compressImage = async (
  uri: string,
  label: string,
): Promise<string> => {
  try {
    const resizedImage = await ImageResizer.createResizedImage(
      uri,
      800,
      600,
      'JPEG',
      80,
    );
    const uriImage: string = resizedImage.uri;
    console.log(`${label} compressed path:`, typeof resizedImage.uri, uriImage);
    return uriImage;
  } catch (err) {
    console.log(`${label} compression error:`, err);
    return '';
  }
};
