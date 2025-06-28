import axios from 'axios';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
};
export const handleAddPhoto = (setSelectedOptions, key) => {
  Alert.alert(
    'Add Photo',
    'Choose an option',
    [
      {
        text: 'Take Photo',
        onPress: () => handleTakePhoto(setSelectedOptions, key),
      },
      {
        text: 'Choose from Gallery',
        onPress: () => imagePicker(setSelectedOptions, key),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
    {cancelable: true},
  );
};
export const handleTakePhoto = async (setSelectedOptions, key) => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    Alert.alert('Camera permission denied');
    return;
  }

  launchCamera(
    {
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: true,
      includeBase64: true,
    },
    response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setSelectedOptions(prev => {
          const prevPhotos = prev[key] || [];
          return {
            ...prev,
            [key]: [...prevPhotos, asset.base64],
          };
        });
      }
    },
  );
};

export const imagePicker = (setSelectedOptions, key) => {
  try {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        includeBase64: true,
      },
      response => {
        if (response.didCancel) {
          console.log('Image picking canceled');
        } else if (response.errorCode) {
          console.log('Error:', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setSelectedOptions(prev => {
            const prevPhotos = prev[key] || [];
            return {
              ...prev,
              [key]: [...prevPhotos, asset.base64],
            };
          });
        }
      },
    );
  } catch (error) {
    console.log(error);
  }
};

export const fetchCustomers = async (admin_id, role, token, setCustomers) => {
  try {
    const response = await axios.get(
      `https://www.beeberg.com/api/getCustomers/${admin_id}/${role}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.data.status) {
      const customerData = response.data.customers;
      setCustomers(customerData);
    }
  } catch (error) {
    console.error('Error fetching customers:', error.response?.data);
  }
};

export const fetchSigns = async (signId, token, setSignData) => {
  console.log(signId, token, setSignData);
  try {
    const response = await axios.get(
      `https://beeberg.com/api/signsOptions/${signId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    setSignData(response.data.signOptions);
    console.log(response.data.signOptions);
  } catch (error) {
    console.log(error.response?.data);
  }
};

export const getUnassociatedSigns = async (
  admin_id,
  token,
  setUnassociatedSign,
) => {
  try {
    const response = await axios.get(
      `https://www.beeberg.com/api/getUnAssociatedSigns/${admin_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const signs = response.data.signs;
    setUnassociatedSign(signs);
    console.log(signs);
  } catch (error) {
    console.error('Error creating project:', error.response?.data);
  }
};

export const getTeams = async (admin_id, role, token, setTeams) => {
  try {
    const response = await axios.get(
      `https://www.beeberg.com/api/team/${admin_id}/${role}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    if (response.data.status) {
      const data = response.data?.data;
      setTeams(data);
      console.log(data);
    }
  } catch (error) {
    console.error('Error updating customer:', error.response?.data);
  }
};

export const getUnassociatedCustomerSigns = async (
  customer_id,
  token,
  setUnassociatedSign,
) => {
  console.log(customer_id, token, setUnassociatedSign);
  try {
    const response = await axios.get(
      `https://www.beeberg.com/api/${customer_id}/getUnAttachedSigns`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const signs = response.data.signs;
    setUnassociatedSign(signs);
    console.log(signs);
  } catch (error) {
    console.error('Error creating project:', error.response?.data);
  }
};

export const getUnsignedSigns = async (
  projectId,
  token,
  setFullyAssociatedSigns,
) => {
  try {
    console.log(projectId, token, setFullyAssociatedSigns);
    const response = await axios.get(
      `https://www.beeberg.com/api/${projectId}/getUnAssignSigns`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response.data);
    if (response.data?.status) {
      setFullyAssociatedSigns(response.data?.signs || []);
    }
  } catch (error) {
    console.error('Error creating project:', error.response?.data);
  }
};

export const sendUpdateNameMail = async data => {
  const {token, ...rest} = data;
  try {
    const response = await axios.post(
      `https://www.beeberg.com/api/updateNameMail`,
      rest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response.data);
  } catch (error) {
    console.error('Error creating project:', error.response?.data);
  }
};
export const sendChangeTypeUpdateMail = async data => {
  const {token, ...rest} = data;
  try {
    const response = await axios.post(
      `https://www.beeberg.com/api/sendUpdateMail`,
      rest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response.data);
  } catch (error) {
    console.error('Error creating project:', error.response?.data);
  }
};
export const sendProjectChange = async data => {
  const {token, ...rest} = data;
  try {
    const response = await axios.post(
      `https://www.beeberg.com/api/sendProjectChange`,
      rest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response.data);
  } catch (error) {
    console.error('Error creating project:', error.response?.data);
  }
};

export const getCompletedSurveys = async (data, setSubmittedSigns) => {
  console.log(data);
  try {
    const {tokenNumber, userId, role} = data;

    const response = await axios.get(
      `https://www.beeberg.com/api/submitted-signs/${userId}/${role}`,
      {
        headers: {
          Authorization: `Bearer ${tokenNumber}`,
        },
      },
    );
    console.log(response.data?.submittedSigns);
    setSubmittedSigns(response.data?.submittedSigns);
  } catch (error) {
    console.error('Error creating project:', error.response);
    console.error('Error creating project:', error);
  }
};

export const changeSignSubmitStatus = async data => {
  console.log(data);
  try {
    const {token, ...rest} = data;
    const response = await axios.post(
      `https://www.beeberg.com/api/changeSignSubmitStatus`,
      rest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response.data);
  } catch (error) {
    console.error('Error creating project:', error.response);
    console.error('Error creating project:', error);
  }
};
