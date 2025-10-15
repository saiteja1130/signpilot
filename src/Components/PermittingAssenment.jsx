import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {styles} from '../Global/Global';
import Exist from '../../assets/images/3.svg';
import DropDownIcon from '../../assets/images/downarrow.svg';
import UpDownIcon from '../../assets/images/arrowup.svg';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import RadioButton from './RadioButton';
import SaveImg from '../../assets/images/save.svg';
import Date1 from '../../assets/images/date.svg';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {updatePermittingAssessment} from '../Db/LocalData';
import {useNetworkStatus} from '../Functions/functions';
import {setActiveState} from '../Redux/Slices/Active';

const PermittingAssenment = ({handleFetchData}) => {
  const projectTitle = useSelector(state => state.projecttitle.value);
  const globActive = useSelector(state => state.active.value);
  const dispatch = useDispatch();
  const status = useNetworkStatus();
  const baseUrl = useSelector(state => state.baseUrl.value);
  const [active, setActive] = useState('');
  const signProjectData = useSelector(state => state.signProject.value);
  const loginData = useSelector(state => state.login.value);
  const [loadingImage, setLoadingImage] = useState(false);
  const [fromDate, setFromDate] = useState(
    signProjectData?.permitting_assessment?.permitTimeframeFrom
      ? new Date(signProjectData.permitting_assessment.permitTimeframeFrom)
      : null,
  );
  const [toDate, setToDate] = useState(
    signProjectData?.permitting_assessment?.permitTimeframeTo
      ? new Date(signProjectData.permitting_assessment.permitTimeframeTo)
      : null,
  );
  const [
    permittingAssessmentTodoPunchList,
    setPermittingAssessmentTodoPunchList,
  ] = useState(
    signProjectData?.permitting_assessment?.permittingAssessmentTodoPunchList,
  );
  const [
    permittingAssessmentSummaryNotes,
    setPermittingAssessmentSummaryNotes,
  ] = useState(
    signProjectData?.permitting_assessment?.permittingAssessmentSummaryNotes,
  );
  const [permitEstimatedCost, setPermitEstimatedCost] = useState(
    signProjectData?.permitting_assessment?.permitEstimatedCost || '',
  );
  const [permitAcquisitionFeeText, setPermitAcquisitionFeeText] = useState(
    signProjectData?.permitting_assessment?.permitAcquisitionFeeText || '',
  );
  const [selectedOptions, setSelectedOptions] = useState({
    Id:
      signProjectData?.permitting_assessment?.id ||
      signProjectData?.permitting_assessment?.Id,
    projectId: signProjectData?.permitting_assessment?.projectId,
    signId: signProjectData?.permitting_assessment?.signId,
    optionId: signProjectData?.permitting_assessment?.optionId,
    teamId: loginData?.userId,
    adminId: loginData?.userId,
    permitRequired: signProjectData?.permitting_assessment?.permitRequired,
    permitAppliedFor: signProjectData?.permitting_assessment?.permitAppliedFor,
    permitEstimatedCost:
      signProjectData?.permitting_assessment?.permitEstimatedCost,
    permitAcquisitionFee:
      signProjectData?.permitting_assessment?.permitAcquisitionFee,
    permitAcquisitionFeeText:
      signProjectData?.permitting_assessment?.permitAcquisitionFeeText,
    permitTimeframeFrom:
      signProjectData?.permitting_assessment?.permitTimeframeFrom || '',
    permitTimeframeTo:
      signProjectData?.permitting_assessment?.permitTimeframeTo || '',
    permittingAssessmentTodoPunchList: permittingAssessmentTodoPunchList,
    permittingAssessmentSummaryNotes: permittingAssessmentSummaryNotes,
    customerName: signProjectData?.permitting_assessment?.customerName,
    surveyModule: '',
    electricalSignsAllowed:
      signProjectData?.permitting_assessment?.electricalSignsAllowed,
  });
  const data = [
    {
      question: 'Permit required?',
      options: ['Yes', 'No'],
      value: 'permitRequired',
      selectedValue: signProjectData?.permitting_assessment?.permitRequired,
    },
    {
      question: 'Permit Applied For (Y/N)',
      options: ['Yes', 'No'],
      value: 'permitAppliedFor',
      selectedValue: signProjectData?.permitting_assessment?.permitAppliedFor,
    },
    {
      question: 'Permit Acquisition Fee?',
      options: ['Yes', 'No'],
      value: 'permitAcquisitionFee',
      selectedValue:
        signProjectData?.permitting_assessment?.permitAcquisitionFee,
    },
    {
      question: 'Electrical Signs Allowed?',
      options: ['Yes', 'No', "Don't Know"],
      value: 'electricalSignsAllowed',
      selectedValue:
        signProjectData?.permitting_assessment?.electricalSignsAllowed,
    },
  ];

  const showDatePicker = (mode, currentDate, setDate) => {
    try {
      let validDate;
      if (currentDate instanceof Date) {
        validDate = currentDate;
      } else if (
        typeof currentDate === 'string' ||
        typeof currentDate === 'number'
      ) {
        validDate = new Date(currentDate);
      } else {
        validDate = new Date(); // ✅ always start from today
      }

      DateTimePickerAndroid.open({
        value: validDate,
        minimumDate: new Date(), // ✅ prevents past dates (optional)
        onChange: (event, selectedDate) => {
          if (selectedDate) {
            setDate(selectedDate);
          }
        },
        mode,
        is24Hour: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = date => {
    if (!(date instanceof Date)) return 'From';
    return date.toLocaleDateString();
  };
  const handleSave = async () => {
    console.log('--- Save Button Pressed ---');
    setLoadingImage(true);

    const permitData = {
      ...selectedOptions,
      permitTimeframeFrom: fromDate?.toISOString() || '',
      permitTimeframeTo: toDate?.toISOString() || '',
      permittingAssessmentTodoPunchList,
      permittingAssessmentSummaryNotes,
      permitEstimatedCost,
      permitAcquisitionFeeText,
      signAliasName: signProjectData?.signAliasName,
      signType: signProjectData?.signType,
    };
    try {
      if (status) {
        const token = loginData?.tokenNumber;
        const response = await axios.post(
          `${baseUrl}/updatePermittingAssessmentAudit`,
          permitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log('PERMITTING ASSESMENT::', response.data);
        if (response?.data?.status) {
          Toast.show({
            type: 'success',
            text1: response?.data?.message || 'Audit saved successfully.',
            visibilityTime: 3000,
            position: 'top',
          });
          handleFetchData(null, signProjectData);
        } else {
          throw new Error('Sync failed with unknown server response.');
        }
      } else {
        updatePermittingAssessment(permitData, 0);
        handleFetchData(null, signProjectData);
        Toast.show({
          type: 'info',
          text1: 'Saved Offline. Will sync later.',
          visibilityTime: 3000,
          position: 'top',
        });
      }
    } catch (error) {
      console.log('❌ API Sync failed. Will still save locally.');
      console.log('Error:', error?.response?.data || error?.message);
    } finally {
      if (status) {
        setLoadingImage(false);
      } else {
        setTimeout(() => {
          setLoadingImage(false);
        }, 1200);
      }
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          dispatch(setActiveState('Permitt'));
        }}
        style={[styles.container, {borderColor: '#1FA163'}]}>
        <View style={[styles.iconWrapper, {backgroundColor: '#1FA163'}]}>
          <Exist width={30} height={30} />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.projectName}>
            {projectTitle || 'Project Name'}
          </Text>
          <Text style={styles.auditTitle}>Permitting Assessment</Text>
          <Text style={styles.projectName}>
            {signProjectData?.permitting_assessment?.signType ||
              'Digital indoor free standing'}
          </Text>
        </View>
        <View style={styles.dropdownIconWrapper}>
          {globActive?.includes('Permitt') ? (
            <UpDownIcon width={39} height={39} />
          ) : (
            <DropDownIcon width={39} height={39} />
          )}
        </View>
      </TouchableOpacity>
      <View style={{marginTop: -8}}>
        {globActive?.includes('Permitt') && (
          <View style={[styles.card, {borderColor: '#1FA163'}]}>
            <View style={[styles.headerSection, {backgroundColor: '#CCF5E1'}]}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  borderBottomWidth: 0.5,
                  borderColor: '#4E525F',
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
            <View>
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

                        {item.question === 'Permit Applied For (Y/N)' && (
                          <TextInput
                            style={[styles.input, {marginTop: 10, height: 50}]}
                            placeholder="Permit Estimated Cost"
                            multiline
                            textAlignVertical="top"
                            value={permitEstimatedCost}
                            onChangeText={setPermitEstimatedCost}
                          />
                        )}
                        {(selectedOptions[item.value] === 'yes' ||
                          selectedOptions[item.value] === 'Yes') &&
                          item.question === 'Permit Acquisition Fee?' && (
                            <View>
                              <TextInput
                                style={[
                                  styles.input,
                                  {marginTop: 10, height: 50},
                                ]}
                                placeholder="Permit Acquision fee"
                                multiline
                                textAlignVertical="top"
                                value={permitAcquisitionFeeText}
                                onChangeText={setPermitAcquisitionFeeText}
                              />
                            </View>
                          )}
                      </View>
                    )}
                  />
                  <View style={styles.section}>
                    <Text style={styles.label}>
                      Permit timeframe / schedule
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        gap: 10,
                        marginBottom: 34,
                      },
                    ]}>
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '400',
                          paddingHorizontal: 12,
                          marginBottom: 3,
                        }}>
                        From
                      </Text>
                      <TouchableOpacity
                        style={{
                          borderWidth: 0.8,
                          borderColor: '#E0E3E7',
                          padding: 13,
                          borderRadius: 4,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flex: 1,
                        }}
                        onPress={() =>
                          showDatePicker(
                            'date',
                            fromDate || new Date(),
                            setFromDate,
                          )
                        }>
                        <Text style={{color: fromDate ? '#000' : '#888'}}>
                          {fromDate ? formatDate(fromDate) : 'From'}
                        </Text>
                        <Date1 />
                      </TouchableOpacity>
                    </View>
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '400',
                          paddingHorizontal: 12,
                          marginBottom: 3,
                        }}>
                        To
                      </Text>
                      <TouchableOpacity
                        style={{
                          borderWidth: 0.8,
                          borderColor: '#E0E3E7',
                          padding: 13,
                          borderRadius: 4,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flex: 1,
                        }}
                        onPress={() =>
                          showDatePicker(
                            'date',
                            toDate || new Date(),
                            setToDate,
                          )
                        }>
                        <Text style={{color: toDate ? '#000' : '#888'}}>
                          {toDate ? formatDate(toDate) : 'To'}
                        </Text>
                        <Date1 />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
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
                  value={permittingAssessmentTodoPunchList}
                  onChangeText={setPermittingAssessmentTodoPunchList}
                />
                <Text style={{textAlign: 'right', marginTop: 5}}>
                  {permittingAssessmentTodoPunchList?.length}
                  /300
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
                  value={permittingAssessmentSummaryNotes}
                  onChangeText={setPermittingAssessmentSummaryNotes}
                />
                <Text style={{textAlign: 'right', marginTop: 5}}>
                  {permittingAssessmentSummaryNotes?.length}
                  /300
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
              onPress={() => {
                dispatch(setActiveState('Permitt'));
              }}>
              <UpDownIcon width={39} height={39} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default PermittingAssenment;
