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
import Exist from '../../assets/images/2.svg';
import DropDownIcon from '../../assets/images/downarrow.svg';
import Photo from '../../assets/images/photo.svg';
import {styles} from '../Global/Global';
import SaveImg from '../../assets/images/save.svg';
import UpDownIcon from '../../assets/images/arrowup.svg';
import RadioButton from './RadioButton';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {handleAddPhoto} from '../Functions/functions.js';

const ElectricalAssessment = ({handleFetchData}) => {
  const signProjectData = useSelector(state => state.signProject.value);
  // console.log('Electrical AUdit Data:', signProjectData?.electrical_audit);
  // console.log(signProjectData?.electrical_audit?.adminName);
  const loginData = useSelector(state => state.login.value);
  const [electricalAuditTodoPunchList, setElectricalAuditTodoPunchList] =
    useState(signProjectData?.electrical_audit?.electricalAuditTodoPunchList);
  const [electricalAuditSummaryNotes, setElectricalAuditSummaryNotes] =
    useState(signProjectData?.electrical_audit?.electricalAuditSummaryNotes);
  const [selectedOptions, setSelectedOptions] = useState({
    adminName: signProjectData?.electrical_audit?.adminName,
    anyAccessibilityIssues:
      signProjectData?.electrical_audit?.anyAccessibilityIssues,
    anyKnownRepairorMaintenanceToElectricalEquipmentRequired:
      signProjectData?.electrical_audit
        ?.anyKnownRepairorMaintenanceToElectricalEquipmentRequired,
    customerName: signProjectData?.electrical_audit?.customerName,
    doesTheExistingSignIlluminate:
      signProjectData?.electrical_audit?.doesTheExistingSignIlluminate,
    electric120Vor220V: signProjectData?.electrical_audit?.electric120Vor220V,
    electricSubcontractorNeeded:
      signProjectData?.electrical_audit?.electricSubcontractorNeeded,
    electricTagsPhotoFromAdmin:
      signProjectData?.electrical_audit?.electricTagsPhotoFromAdmin,
    electricTagsPhoto:
      signProjectData?.electrical_audit?.electricTagsPhoto || [],
    electricTagsPhotos: signProjectData?.electrical_audit?.electricTagsPhotos,
    electricTagsorCertificationsPresent:
      signProjectData?.electrical_audit?.electricTagsorCertificationsPresent,
    electricalAuditDocumentAccessibilityIssues:
      signProjectData?.electrical_audit
        ?.electricalAuditDocumentAccessibilityIssues,
    electricalAuditPhotoFromAdmin:
      signProjectData?.electrical_audit?.electricalAuditPhotoFromAdmin,
    electricalAuditPhoto:
      signProjectData?.electrical_audit?.electricalAuditPhoto || [],
    electricalAuditPhotos:
      signProjectData?.electrical_audit?.electricalAuditPhotos,
    electricalAuditSummaryNotes:
      signProjectData?.electrical_audit?.electricalAuditSummaryNotes,
    electricalAuditTodoPunchList:
      signProjectData?.electrical_audit?.electricalAuditTodoPunchList,
    electricalAuditspecialInstructions:
      signProjectData?.electrical_audit?.electricalAuditspecialInstructions,
    Id: signProjectData?.electrical_audit?.id,
    isElectricPresentAtTheSign:
      signProjectData?.electrical_audit?.isElectricPresentAtTheSign,
    isPowerLiveAtSignLocation:
      signProjectData?.electrical_audit?.isPowerLiveAtSignLocation,
    optionId: signProjectData?.electrical_audit?.optionId,
    powerWithinNeededDistance:
      signProjectData?.electrical_audit?.powerWithinNeededDistance,
    projectId: signProjectData?.electrical_audit?.projectId,
    projectTitle: signProjectData?.electrical_audit?.projectTitle,
    signAliasName: signProjectData?.electrical_audit?.signAliasName,
    signId: signProjectData?.electrical_audit?.signId,
    signType: signProjectData?.electrical_audit?.signType,
    sign_order: signProjectData?.electrical_audit?.sign_order,
    typeOfIlluminationInside:
      signProjectData?.electrical_audit?.typeOfIlluminationInside || '',
    teamId: loginData?.userId,
    adminId: loginData?.userId,
    surveyModule: 'elevation_and_siteplan',
    electricalAuditspecialInstructions:
      signProjectData?.electrical_audit?.electricalAuditspecialInstructions,
  });
  const [active, setActive] = useState('');
  const [signImageName, setSignImageName] = useState('No File Choosen');
  const [anyAccessibilityIssues, setAnyAccessibilityIssues] = useState(
    signProjectData?.electrical_audit?.anyAccessibilityIssues || '',
  );
  const [typeOfIlluminationInside, setTypeOfIlluminationInside] = useState(
    signProjectData?.electrical_audit?.typeOfIlluminationInside || '',
  );
  const [loadingImage, setLoadingImage] = useState(true);
  const dispatch = useDispatch();

  const data = [
    {
      question: 'Is electric present at the sign?',
      value: 'isElectricPresentAtTheSign',
      options: ['Yes', 'No'],
      selectedValue:
        signProjectData?.electrical_audit?.isElectricPresentAtTheSign || '',
    },
    {
      question: 'Electric Subcontractor Needed?',
      options: ['Yes', 'No', "Don't Know"],
      value: 'electricSubcontractorNeeded',
      selectedValue:
        signProjectData?.electrical_audit?.electricSubcontractorNeeded || '',
    },
    {
      question: 'Any accessibility issues?',
      options: ['Yes', 'No'],
      value: 'anyAccessibilityIssues',
      selectedValue:
        signProjectData?.electrical_audit?.anyAccessibilityIssues || '',
    },
    {
      question: 'Is power live at sign location?',
      options: ['Yes', 'No', "Don't Know"],
      value: 'isPowerLiveAtSignLocation',
      selectedValue:
        signProjectData?.electrical_audit?.isPowerLiveAtSignLocation || '',
    },
    {
      question: 'Power within needed distance?',
      options: ['Yes', 'No'],
      value: 'powerWithinNeededDistance',
      selectedValue:
        signProjectData?.electrical_audit?.powerWithinNeededDistance || '',
    },
    {
      question: 'Does the existing sign illuminate?',
      options: ['Yes', 'No'],
      value: 'doesTheExistingSignIlluminate',
      selectedValue:
        signProjectData?.electrical_audit?.doesTheExistingSignIlluminate || '',
    },
    {
      question: 'Electric 120V or 220V?',
      options: ['120V', '220V', "Don't Know"],
      value: 'electric120Vor220V',
      selectedValue:
        signProjectData?.electrical_audit?.electric120Vor220V || '',
    },
    {
      question: 'Electric Tags or Certifications Present?',
      options: ['Yes', 'No'],
      value: 'electricTagsorCertificationsPresent',
      selectedValue:
        signProjectData?.electrical_audit
          ?.electricTagsorCertificationsPresent || '',
    },
    {
      question:
        'Any known repair or maintenance to electrical equipment required? Y/N',
      options: ['Yes', 'No'],
      value: 'anyKnownRepairorMaintenanceToElectricalEquipmentRequired',
      selectedValue:
        signProjectData?.electrical_audit
          ?.anyKnownRepairorMaintenanceToElectricalEquipmentRequired || '',
    },
  ];

  const handleSave = async () => {
    try {
      setLoadingImage(true);
      const bodyData = {
        ...selectedOptions,
        // anyAccessibilityIssues,
        typeOfIlluminationInside,
        electricalAuditTodoPunchList,
        electricalAuditSummaryNotes,
      };
      console.log(bodyData);
      const token = loginData?.tokenNumber;
      const responce = await axios.post(
        'https://www.beeberg.com/api/updateElectricalAudit',
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

  const handleRemoveImage = async (imageId1, fieldName1, actualKey) => {
    try {
      setLoadingImage(true);
      const data = {
        imageId: imageId1,
        Id: signProjectData?.electrical_audit?.id,
        fieldName: fieldName1,
        surveyModule: 'electrical_audit',
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
      console.log(responce.data);
      if (responce.data.status) {
        setSelectedOptions(prev => {
          return {
            ...prev,
            [actualKey]: responce?.data?.data[actualKey],
          };
        });
        setTimeout(() => {
          setLoadingImage(false);
        }, 1200);
      }
    } catch (error) {
      console.log('Error response data:', error.response);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setLoadingImage(false);
    }, 800);
  }, [loadingImage]);

  if (signProjectData?.electrical_audit === undefined) {
    return <View></View>;
  }

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (active === '') {
            setActive('Electrical');
          } else {
            setActive('');
          }
        }}
        style={[styles.container, {borderColor: '#FF9239'}]}>
        <View style={[styles.iconWrapper, {backgroundColor: '#FF9239'}]}>
          <Exist width={30} height={30} />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.projectName}>
            {signProjectData?.electrical_audit?.projectTitle || 'Project Name'}
          </Text>
          <Text style={styles.auditTitle}>Electrical Assessment</Text>
          <Text style={styles.projectName}>
            {signProjectData?.electrical_audit?.signType ||
              'Digital indoor free standing'}
          </Text>
        </View>
        <View style={styles.dropdownIconWrapper}>
          {active === 'Electrical' ? (
            <UpDownIcon width={39} height={39} />
          ) : (
            <DropDownIcon width={39} height={39} />
          )}
        </View>
      </TouchableOpacity>
      <View style={{marginTop: -8}}>
        {active === 'Electrical' && (
          <View style={styles.card}>
            <View style={styles.headerSection}>
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
                  <Text style={styles.titleText}>Electrical assessment</Text>
                  <Text style={styles.subTitleText}>Special instructions</Text>
                </View>
                <Text style={styles.authorText}>
                  {signProjectData?.electrical_audit?.adminName}
                </Text>
              </View>
              <View style={styles.instructionsSection}>
                <Text style={styles.instructionText}>
                  Be sure to take a picture of the electric box.
                </Text>
                <Text style={styles.dateText}>April 10 2024</Text>
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
                      {(selectedOptions[item.value] === 'yes' ||
                        selectedOptions[item.value] === 'Yes') &&
                        item.question === 'Any accessibility issues?' && (
                          <View>
                            <TextInput
                              style={[
                                styles.input,
                                {marginVertical: 10, height: 80},
                              ]}
                              placeholder="Please provide more details"
                              multiline
                              textAlignVertical="top"
                              value={anyAccessibilityIssues}
                              onChangeText={setAnyAccessibilityIssues}
                            />
                            <TouchableOpacity
                              onPress={() =>
                                handleAddPhoto(
                                  setSelectedOptions,
                                  'electricalAuditPhoto',
                                )
                              }
                              style={styles.imageCon}>
                              <View style={styles.photoButton}>
                                <Text style={styles.photoText}>add photo</Text>
                                <Photo />
                              </View>
                              <View style={styles.fileNameContainer}>
                                <Text style={styles.fileNameText}>
                                  {signImageName}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <View
                              style={{
                                flexDirection: 'row',
                                marginVertical: 15,
                                gap: 15,
                              }}>
                              {loadingImage ? (
                                <ActivityIndicator
                                  size="small"
                                  color="#FF9239"
                                />
                              ) : (
                                selectedOptions?.electricalAuditPhotos?.length >
                                  0 &&
                                selectedOptions.electricalAuditPhotos.map(
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
                                              'electricalAuditPhoto',
                                              'electricalAuditPhotos',
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
                      {(selectedOptions[item.value] === 'yes' ||
                        selectedOptions[item.value] === 'Yes') &&
                        item.question ===
                          'Does the existing sign illuminate?' && (
                          <TextInput
                            style={[styles.input, {marginTop: 10, height: 80}]}
                            placeholder="Type of illumination Inside"
                            multiline
                            textAlignVertical="top"
                            value={typeOfIlluminationInside}
                            onChangeText={setTypeOfIlluminationInside}
                          />
                        )}
                      {(selectedOptions[item.value] === 'yes' ||
                        selectedOptions[item.value] === 'Yes') &&
                        item.question ===
                          'Electric Tags or Certifications Present?' && (
                          <View>
                            <TouchableOpacity
                              onPress={() =>
                                handleAddPhoto(
                                  setSelectedOptions,
                                  'electricTagsPhoto',
                                )
                              }
                              style={styles.imageCon}>
                              <View style={styles.photoButton}>
                                <Text style={styles.photoText}>add photo</Text>
                                <Photo />
                              </View>
                              <View style={styles.fileNameContainer}>
                                <Text style={styles.fileNameText}>
                                  {signImageName}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <View
                              style={{
                                flexDirection: 'row',
                                marginVertical: 15,
                                gap: 15,
                              }}>
                              {loadingImage ? (
                                <ActivityIndicator
                                  size="small"
                                  color="#FF9239"
                                />
                              ) : (
                                selectedOptions?.electricTagsPhotos?.length >
                                  0 &&
                                selectedOptions.electricTagsPhotos.map(
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
                                              'electricTagsPhoto',
                                              'electricTagsPhotos',
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
                      value={electricalAuditTodoPunchList}
                      onChangeText={setElectricalAuditTodoPunchList}
                    />
                    <Text style={{textAlign: 'right', marginTop: 5}}>
                      {electricalAuditTodoPunchList.length}/300
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
                      value={electricalAuditSummaryNotes}
                      onChangeText={setElectricalAuditSummaryNotes}
                    />
                    <Text style={{textAlign: 'right', marginTop: 5}}>
                      {electricalAuditSummaryNotes.length}/300
                    </Text>
                  </View>
                </View>
              </View>
            )}
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

export default ElectricalAssessment;
