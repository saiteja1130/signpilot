import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {
  createOfflineImagesTable,
  getAllOfflineImages,
  getAllRemovedImages,
  getUnsyncedElectricalAudits,
  getUnsyncedExistingSignAudits,
  getUnsyncedPermittingAssessments,
  getUnsyncedSignGeneralAudits,
  insertOfflineImage,
} from '../Db/LocalData';

// import {PermissionsAndroid, Platform} from 'react-native';

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

export const requestMediaPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      let permission;

      if (Platform.Version >= 33) {
        permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
      } else {
        permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      }

      const granted = await PermissionsAndroid.request(permission, {
        title: 'Media Permission',
        message: 'App needs access to your photos to select and edit images.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });

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

const saveBase64ToFile = async (imageId, base64) => {
  const path = `${RNFS.DocumentDirectoryPath}/${imageId}.jpg`;
  try {
    await RNFS.writeFile(path, base64, 'base64');
    return path;
  } catch (err) {
    console.log('❌ Error saving file:', err.message);
    return null;
  }
};

export const handleTakePhoto = async (setSelectedOptions, key) => {
  const generateId = () => Date.now().toString();
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
    async response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const imageId = generateId();
        const path = await saveBase64ToFile(imageId, asset.base64);

        if (path) {
          setSelectedOptions(prev => {
            const prevPhotos = prev[key] || [];
            return {
              ...prev,
              [key]: [
                ...prevPhotos,
                {
                  imageId,
                  path,
                  synced: false,
                },
              ],
            };
          });
        }
      }
    },
  );
};

export const imagePicker = async (setSelectedOptions, key) => {
  const hasPermission = await requestMediaPermission();
  if (!hasPermission) {
    Alert.alert('Media permission denied');
    return;
  }

  const generateId = () => Date.now().toString();

  launchImageLibrary(
    {
      mediaType: 'photo',
      includeBase64: true,
      selectionLimit: 1,
    },
    async response => {
      if (response.didCancel) {
        console.log('Image picking canceled');
      } else if (response.errorCode) {
        console.log('Error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const imageId = generateId();
        const path = await saveBase64ToFile(imageId, asset.base64);

        if (path) {
          setSelectedOptions(prev => {
            const prevPhotos = prev[key] || [];
            return {
              ...prev,
              [key]: [
                ...prevPhotos,
                {
                  base64: asset?.base64,
                  imageId,
                  path,
                  synced: false,
                },
              ],
            };
          });
        }
      }
    },
  );
};

export const fetchCustomers = async (
  admin_id,
  role,
  token,
  setCustomers,
  baseUrl,
) => {
  try {
    const response = await axios.get(
      `${baseUrl}/getCustomers/${admin_id}/${role}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response.data);
    if (response.data.status) {
      const customerData = response.data.customers;
      setCustomers(customerData);
    }
  } catch (error) {
    console.error('Error fetching customers:', error.response?.data);
  }
};

export const fetchSigns = async (signId, token, setSignData, baseUrl) => {
  try {
    const response = await axios.get(`${baseUrl}/signsOptions/${signId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSignData(response.data.signOptions);
    console.log('FETCH SIGNS ERRORR::::', response.data);
  } catch (error) {
    console.log('Fetch Sign Error:::::::::', error.response?.data);
    console.log('Fetch Sign Error22222:::::::::', error);
  }
};

export const getUnassociatedSigns = async (
  admin_id,
  token,
  setUnassociatedSign,
  baseUrl,
) => {
  try {
    const response = await axios.get(
      `${baseUrl}/getUnAssociatedSigns/${admin_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const signs = response.data.signs;
    setUnassociatedSign(signs);
  } catch (error) {
    console.error('Error creating project:', error.response?.data);
  }
};

export const getTeams = async (admin_id, role, token, setTeams, baseUrl) => {
  try {
    const response = await axios.get(`${baseUrl}/team/${admin_id}/${role}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    if (response.data.status) {
      const data = response.data?.data;
      setTeams(data);
    }
  } catch (error) {
    console.error('Error updating customer:', error.response?.data);
  }
};

export const getUnassociatedCustomerSigns = async (
  customer_id,
  token,
  setUnassociatedSign,
  baseUrl,
) => {
  try {
    const response = await axios.get(
      `${baseUrl}/${customer_id}/getUnAttachedSigns`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const signs = response.data.signs;
    setUnassociatedSign(signs);
  } catch (error) {
    console.error('Error creating project:', error.response?.data);
  }
};

export const getUnsignedSigns = async (
  projectId,
  token,
  setFullyAssociatedSigns,
  baseUrl,
) => {
  try {
    const response = await axios.get(
      `${baseUrl}/${projectId}/getUnAssignSigns`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('getUnsignedSigns:::', response.data);
    if (response.data?.status) {
      setFullyAssociatedSigns(response.data?.signs || []);
    }
  } catch (error) {
    console.error('Error creating project:', error);
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
  } catch (error) {
    console.error('Error creating project:', error.response?.data);
  }
};

export const sendChangeTypeUpdateMail = async data => {
  const {token, baseUrl, ...rest} = data;
  try {
    const response = await axios.post(`${baseUrl}/sendUpdateMail`, rest, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error creating project:', error.response?.data);
  }
};

export const sendProjectChange = async data => {
  const {token, baseUrl, ...rest} = data;
  try {
    const response = await axios.post(`${baseUrl}/sendProjectChange`, rest, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error creating project:', error.response?.data);
  }
};

export const getCompletedSurveys = async (data, setSubmittedSigns, baseUrl) => {
  try {
    const {tokenNumber, userId, role} = data;

    const response = await axios.get(
      `${baseUrl}/submitted-signs/${userId}/${role}`,
      {
        headers: {
          Authorization: `Bearer ${tokenNumber}`,
        },
      },
    );
    setSubmittedSigns(response.data?.submittedSigns);
  } catch (error) {
    console.error('Error creating project:', error.response);
    console.error('Error creating project:', error);
  }
};

export const changeSignSubmitStatus = async data => {
  try {
    const {token, baseUrl, ...rest} = data;
    const response = await axios.post(
      `${baseUrl}/changeSignSubmitStatus`,
      rest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    console.error('Error creating project:', error.response);
    console.error('Error creating project:', error);
  }
};

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return isConnected;
};

export const updateFile = async data => {
  try {
    const {tokenNumber, baseUrl, ...rest} = data;

    const netState = await NetInfo.fetch();
    const isConnected = netState.isConnected;

    console.log('NETWORK STATUS:', isConnected);

    if (isConnected) {
      const response = await axios.post(`${baseUrl}/updateFile`, rest, {
        headers: {
          Authorization: `Bearer ${tokenNumber}`,
        },
      });
      console.log('UPDATE FILE RESPONSE:::', response.data);
      return {success: true, online: true};
    } else {
      createOfflineImagesTable();
      insertOfflineImage({
        imageId: rest.imageId,
        image: rest.image,
        field: rest.field,
        moduleId: rest.moduleId,
        module: rest.module,
      });
      console.log('OFFLINE — image stored locally');
      return;
    }
  } catch (error) {
    console.log('UPDATE FILE ERRORRR', error?.response?.data || error.message);

    // insertOfflineImage({
    //   imageId: data.imageId,
    //   image: data.image,
    //   field: data.field,
    //   moduleId: data.moduleId,
    //   module: data.module,
    // });
    console.log('FAILED TO UPLOAD — stored offline');

    return;
  }
};

export const syncToOnline = async (loginData,baseUrl) => {
  console.log('STARTED SYNCINGGGGG');
  try {
    getUnsyncedExistingSignAudits(async audits => {
      console.log('Pending Existing SYNCCCC::::::::::::', audits);
      // return
      if (audits.length > 0) {
        const token = loginData?.tokenNumber;
        for (const audit of audits) {
          const data = {
            ...audit,
            teamId: loginData?.userId,
            surveyModule: '',
          };
          try {
            const response = await axios.post(
              `${baseUrl}/updateExistingSignAudit`,
              data,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            console.log('RESPONSE EXISTINGG SYNCEDDDD::', response.data);
            updateExistingSignAudit(audit, 1);
          } catch (err) {
            console.error(
              'Error syncing audit ID',
              audit.Id,
              err.response.data,
            );
          }
        }
      }
    });
  } catch (error) {
    console.log('ERRORRRRRRR!!!!!!!!!!!!!!:', error);
  }
  // try {
  //   getUnsyncedPermittingAssessments(async audits => {
  //     console.log('Pending Permitt sync:', audits);
  //     // return
  //     if (audits.length > 0) {
  //       const token = loginData?.tokenNumber;
  //       for (const audit of audits) {
  //         const data = {
  //           ...audit,
  //           teamId: loginData?.userId,
  //           surveyModule: '',
  //         };
  //         try {
  //           const response = await axios.post(
  //             `${baseUrl}/updatePermittingAssessmentAudit`,
  //             data,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //               },
  //             },
  //           );
  //           console.log('RESPONSE PERMITTT SYNCEDDDD::', response.data);
  //           updatePermittingAssessment(audit, 1);
  //         } catch (err) {
  //           console.error(
  //             'Error syncing audit ID',
  //             audit.Id,
  //             err.response.data,
  //           );
  //         }
  //       }
  //     }
  //   });
  // } catch (error) {
  //   console.log('RESPONSE SYNCHEDD ERRORRRR::', error);
  // }
  // try {
  //   getUnsyncedSignGeneralAudits(async audits => {
  //     console.log('PENDING SIGNGENERAL AUDITSSS:::', audits);
  //     if (audits.length > 0) {
  //       const token = loginData?.tokenNumber;
  //       for (const audit of audits) {
  //         const data = {
  //           ...audit,
  //           teamId: loginData?.userId,
  //           surveyModule: '',
  //         };
  //         try {
  //           const response = await axios.post(
  //             `${baseUrl}/updateSignGeneralAudit`,
  //             data,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //               },
  //             },
  //           );
  //           console.log('RESPONSE SIGNGENERAL SYNCEDDDD::', response.data);
  //           updateSignGeneralAudit(audit, 1);
  //         } catch (err) {
  //           console.error(
  //             'Error syncing audit ID',
  //             audit.Id,
  //             err.response.data,
  //           );
  //         }
  //       }
  //     }
  //   });
  // } catch (error) {
  //   console.log('RESPONSE SYNCHEDD ERRORRRR::', error);
  // }
  // try {
  //   getUnsyncedElectricalAudits(async audits => {
  //     console.log('PENDINGG ELECTRICAL AUDITS', audits);
  //     if (audits.length > 0) {
  //       const token = loginData?.tokenNumber;
  //       for (const audit of audits) {
  //         const data = {
  //           ...audit,
  //           teamId: loginData?.userId,
  //           surveyModule: '',
  //         };
  //         try {
  //           const response = await axios.post(
  //             `${baseUrl}/updateElectricalAudit`,
  //             data,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //               },
  //             },
  //           );
  //           console.log('RESPONSE SIGNGENERAL SYNCEDDDD::', response.data);
  //           updateElectricalAudit(audit, 1);
  //         } catch (err) {
  //           console.error(
  //             'Error syncing audit ID',
  //             audit.Id,
  //             err.response.data,
  //           );
  //         }
  //       }
  //     }
  //   });
  // } catch (error) {
  //   console.log('RESPONSE SYNCHEDD ERRORRRR::', error);
  // }
  try {
    getAllOfflineImages(async audits => {
      console.log('PENDINGG ELECTRICAL AUDITS', audits);
      if (audits.length > 0) {
        const token = loginData?.tokenNumber;
        for (const audit of audits) {
          const data = {
            ...audit,
            teamId: loginData?.userId,
          };
          try {
            const response = await axios.post(`${baseUrl}/updateFile`, data, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log('RESPONSE SIGNGENERAL SYNCEDDDD::', response.data);
          } catch (err) {
            console.error(
              'Error syncing audit ID',
              audit.Id,
              err.response.data,
            );
          }
        }
      }
    });
  } catch (error) {
    console.log('RESPONSE SYNCHEDD ERRORRRR::', error);
  }
  
  try {
    getAllRemovedImages(async audits => {
      console.log('PENDINGG REMOVED IMAGE AUDITS', audits);
      if (audits.length > 0) {
        const token = loginData?.tokenNumber;
        for (const audit of audits) {
          const data = {
            ...audit,
            teamId: loginData?.userId,
          };
          try {
            const response = await axios.post(`${baseUrl}/removeFile`, data, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log('RESPONSE SIGNGENERAL SYNCEDDDD::', response.data);
          } catch (err) {
            console.error('Error syncing audit ID', err.response.data);
          }
        }
      }
    });
  } catch (error) {
    console.log('RESPONSE SYNCHEDD ERRORRRR::', error);
  }
};
