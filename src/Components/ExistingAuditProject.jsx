import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Exist from '../../assets/images/1.svg';
import DropDownIcon from '../../assets/images/downarrow.svg';
import UpDownIcon from '../../assets/images/arrowup.svg';
import {styles} from '../Global/Global';
import SaveImg from '../../assets/images/save.svg';
import RadioButton from './RadioButton';
import {useSelector} from 'react-redux';
import Photo from '../../assets/images/photo.svg';
import axios from 'axios';
import {handleAddPhoto} from '../Functions/functions.js';
import Toast from 'react-native-toast-message';

const ExistingAuditProject = ({handleFetchData}) => {
  const loginData = useSelector(state => state.login.value);
  const signProjectData = useSelector(state => state.signProject.value);
  const [loadingImage, setLoadingImage] = useState(true);
  // console.log('sign projected data', signProjectData?.electrical_audit);
  const [active, setActive] = useState('');
  const [existingSignAuditSummaryNotes, setExistingSignAuditSummaryNotes] =
    useState(
      signProjectData?.existing_sign_audit?.existingSignAuditSummaryNotes,
    );
  const [existingSignAuditTodoPunchList, setExistingSignAuditTodoPunchList] =
    useState(
      signProjectData?.existing_sign_audit?.existingSignAuditTodoPunchList,
    );
  const [
    existingSignAuditDocumentSignCondition,
    setExistingSignAuditDocumentSignCondition,
  ] = useState(
    signProjectData?.existing_sign_audit
      ?.existingSignAuditDocumentSignCondition,
  );
  const [selectedOptions, setSelectedOptions] = useState({
    existingSignAuditPhotos:
      signProjectData?.existing_sign_audit?.existingSignAuditPhotos,
    Id: signProjectData?.existing_sign_audit?.id,
    projectId: signProjectData?.existing_sign_audit?.projectId,
    signId: signProjectData?.existing_sign_audit?.signId,
    optionId: signProjectData?.existing_sign_audit?.optionId,
    teamId: loginData?.userId,
    adminId: loginData?.userId,
    customerName: signProjectData?.existing_sign_audit?.customerName,
    surveyModule: '',
    existingSignAuditTodoPunchList: existingSignAuditTodoPunchList,
    existingSignAuditPhoto:
      signProjectData?.existing_sign_audit?.existingSignAuditPhoto || [],
    existingSignAuditDocumentSignCondition:
      signProjectData?.existing_sign_audit
        ?.existingSignAuditDocumentSignCondition,
    isThisReplacementSign:
      signProjectData?.existing_sign_audit?.isThisReplacementSign,
    oldSignStillPresent:
      signProjectData?.existing_sign_audit?.oldSignStillPresent,
    electricSubcontractor:
      signProjectData?.existing_sign_audit?.electricSubcontractor,
    isElectricalPresentSign:
      signProjectData?.existing_sign_audit?.isElectricalPresentSign,
    removalScheduled: signProjectData?.existing_sign_audit?.removalScheduled,
    isTheSignIlluminated:
      signProjectData?.existing_sign_audit?.isTheSignIlluminated,
    existingSignAuditSummaryNotes: existingSignAuditSummaryNotes,
  });

  const data = [
    {
      question: 'Is this a replacement sign?',
      options: ['Yes', 'No'],
      value: 'isThisReplacementSign',
      selectedValue:
        signProjectData?.existing_sign_audit?.isThisReplacementSign,
    },
    {
      question: 'Old Sugn Still Present Y/N',
      options: ['Yes', 'No'],
      value: 'oldSignStillPresent',
      selectedValue: signProjectData?.existing_sign_audit?.oldSignStillPresent,
    },
    {
      question: 'is This Sign Illuminated?',
      options: ['Yes', 'No'],
      value: 'isTheSignIlluminated',
      selectedValue: signProjectData?.existing_sign_audit?.isTheSignIlluminated,
    },
    {
      question: 'Removal Scheduled (Y/N)',
      options: ['Yes', 'No'],
      value: 'removalScheduled',
      selectedValue: signProjectData?.existing_sign_audit?.removalScheduled,
    },
  ];
  const handleRemoveImage = async (imageId1, fieldName1) => {
    try {
      setLoadingImage(true);
      const data = {
        imageId: imageId1,
        Id: signProjectData?.existing_sign_audit?.id,
        fieldName: fieldName1,
        surveyModule: 'existing_sign_audit',
      };
      const token = loginData?.tokenNumber;
      const responce = await axios.post(
        'https://www.beeberg.com/api/removeFile',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (responce.data.status) {
        setSelectedOptions(prev => {
          return {
            ...prev,
            existingSignAuditPhotos:
              responce.data.data?.existingSignAuditPhotos,
          };
        });
        // handleFetchData();
        setTimeout(() => {
          setLoadingImage(false);
        }, 1000);
      }
    } catch (error) {
      console.log('Error response data:', error);
    }
  };

  const handleSave = async () => {
    try {
      setLoadingImage(true);
      const bodyData = {
        ...selectedOptions,
        existingSignAuditSummaryNotes,
        existingSignAuditTodoPunchList,
        existingSignAuditDocumentSignCondition,
      };
      const token = loginData?.tokenNumber;
      const responce = await axios.post(
        'https://www.beeberg.com/api/updateExistingSignAudit',
        bodyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (responce.data.status) {
        Toast.show({
          type: 'success',
          text1: responce?.data?.message,
          visibilityTime: 3000,
          position: 'top',
        });
        handleFetchData(null, signProjectData);
        setLoadingImage(false);
      }
    } catch (error) {
      console.log('Error response data:', error.response?.data);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoadingImage(false);
    }, 800);
  }, [loadingImage]);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (active === '') {
            setActive('Audit');
          } else {
            setActive('');
          }
        }}
        style={styles.container}>
        <View style={styles.iconWrapper}>
          <Exist width={30} height={30} />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.projectName}>
            {signProjectData?.existing_sign_audit?.projectTitle ||
              'Project Name'}
          </Text>
          <Text style={styles.auditTitle}>Exist Sign Audit</Text>
          <Text style={styles.projectName}>
            {signProjectData?.existing_sign_audit?.signType ||
              'Digital indoor free standing'}
          </Text>
        </View>
        <View style={styles.dropdownIconWrapper}>
          {active === 'Audit' ? (
            <UpDownIcon width={39} height={39} />
          ) : (
            <DropDownIcon width={39} height={39} />
          )}
        </View>
      </TouchableOpacity>
      <View style={{marginTop: -8}}>
        {active === 'Audit' && (
          <View style={[styles.card, {borderColor: '#4E525F'}]}>
            <View style={[styles.headerSection, {backgroundColor: '#F7F9FC'}]}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  borderBottomWidth: 0.5,
                  borderColor: '#B3B7BE',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  paddingBottom: 8,
                }}>
                <View style={styles.titleSection}>
                  <Text style={styles.titleText}>Existing sign audit</Text>
                  <Text style={styles.subTitleText}>Special instructions</Text>
                </View>
                <Text style={styles.authorText}>
                  {signProjectData?.existing_sign_audit?.adminName}
                </Text>
              </View>
              <View style={styles.instructionsSection}>
                <Text style={styles.instructionText}>
                  Be sure to document the condition of this replacement sign.
                </Text>
                <Text style={styles.dateText}>
                  {signProjectData?.existing_sign_audit?.createdDate?.slice(
                    0,
                    10,
                  )}
                </Text>
              </View>
            </View>
            <View style={styles.radioSection}>
              <Text style={styles.radioQuestionText}>{data[0].question}</Text>
              <View style={styles.radioGroup}>
                {data[0].options.map((option, index) => (
                  <RadioButton
                    key={index}
                    label={option}
                    value={option}
                    selected={selectedOptions[data[0].value] ?? ''}
                    onPress={value1 => {
                      setSelectedOptions(prev => {
                        const current =
                          prev?.[data[0].value]?.toLowerCase?.() || '';
                        const incoming = value1.toLowerCase();

                        return {
                          ...prev,
                          [data[0].value]: current === incoming ? '' : value1,
                        };
                      });
                    }}
                  />
                ))}
              </View>
            </View>
            {(selectedOptions[data[0].value] === 'yes' ||
              selectedOptions[data[0].value] === 'Yes') && (
              <View>
                <FlatList
                  data={data.slice(1)}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <View>
                      <View style={styles.radioSection}>
                        <Text style={styles.radioQuestionText}>
                          {item.question}
                        </Text>
                        <View style={styles.radioGroup}>
                          {item.options.map((option, index) => (
                            <RadioButton
                              key={index}
                              label={option}
                              value={option}
                              selected={selectedOptions[item.value] ?? ''}
                              onPress={value1 => {
                                setSelectedOptions(prev => {
                                  const current =
                                    prev?.[item?.value]?.toLowerCase?.() || '';
                                  const incoming = value1.toLowerCase();
                                  return {
                                    ...prev,
                                    [item?.value]:
                                      current === incoming ? '' : value1,
                                  };
                                });
                              }}
                            />
                          ))}
                        </View>
                      </View>
                      {item.question === 'is This Sign Illuminated?' && (
                        <View style={{marginBottom: 12}}>
                          <TextInput
                            placeholder="Document Sign Condition"
                            style={{
                              fontSize: 16,
                              fontFamily: 'Barlow-Regular',
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              borderWidth: 1,
                              borderColor: '#E0E3E7',
                              borderRadius: 4,
                              marginBottom: 24,
                              height: 50,
                            }}
                            value={existingSignAuditDocumentSignCondition || ''}
                            onChangeText={
                              setExistingSignAuditDocumentSignCondition
                            }
                          />
                          <TouchableOpacity
                            style={styles.imageCon}
                            onPress={() =>
                              handleAddPhoto(
                                setSelectedOptions,
                                'existingSignAuditPhoto',
                              )
                            }>
                            <View style={styles.photoButton}>
                              <Text style={styles.photoText}>add photo</Text>
                              <Photo />
                            </View>
                            <View style={styles.fileNameContainer}>
                              <Text style={styles.fileNameText}>Hai</Text>
                            </View>
                          </TouchableOpacity>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginVertical: 15,
                              gap: 15,
                              flexWrap: 'wrap',
                            }}>
                            {loadingImage ? (
                              <ActivityIndicator size="small" color="#FF9239" />
                            ) : (
                              selectedOptions?.existingSignAuditPhotos?.length >
                                0 &&
                              selectedOptions?.existingSignAuditPhotos?.map(
                                (data, index) => {
                                  return (
                                    <View
                                      key={index}
                                      style={styles.imageContainer}>
                                      <Image
                                        source={{uri: data.url}}
                                        style={styles.image}
                                      />
                                      <TouchableOpacity
                                        onPress={() =>
                                          handleRemoveImage(
                                            data.imageId,
                                            'existingSignAuditPhoto',
                                          )
                                        }
                                        style={styles.removeButton}>
                                        <Text style={styles.removeButtonText}>
                                          ×
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  );
                                },
                              )
                            )}
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                />
              </View>
            )}
            <View>
              <View style={styles.section}>
                <Text style={styles.label}>To do / punch list</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, {height: 100}]}
                  maxLength={300}
                  placeholder="To do / punch list"
                  multiline={true}
                  textAlignVertical="top"
                  value={existingSignAuditTodoPunchList}
                  onChangeText={setExistingSignAuditTodoPunchList}
                />
                <Text style={{textAlign: 'right', marginTop: 5}}>
                  {existingSignAuditTodoPunchList?.length}/300
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.label}>Summary Notes</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, {height: 100}]}
                  multiline={true}
                  textAlignVertical="top"
                  placeholder="Notes"
                  value={existingSignAuditSummaryNotes}
                  onChangeText={setExistingSignAuditSummaryNotes}
                />
                <Text style={{textAlign: 'right', marginTop: 5}}>
                  {existingSignAuditSummaryNotes?.length}/300
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.saveButton, loadingImage && {opacity: 0.6}]}
              onPress={handleSave}
              disabled={loadingImage}>
              {loadingImage ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <SaveImg width={28} height={28} />
                  <Text style={styles.saveButtonText}>Save Section</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dropdownIconWrapper,
                {alignSelf: 'flex-end', marginTop: 34},
              ]}
              onPress={() => setActive('')}>
              <UpDownIcon width={39} height={39} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default ExistingAuditProject;
