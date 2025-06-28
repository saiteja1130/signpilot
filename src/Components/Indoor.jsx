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
import {styles} from '../Global/Global';
import Photo from '../../assets/images/photo.svg';
import Exist from '../../assets/images/4.svg';
import DropDownIcon from '../../assets/images/downarrow.svg';
import UpDownIcon from '../../assets/images/arrowup.svg';
import RadioButton from './RadioButton';
import SaveImg from '../../assets/images/save.svg';
import {useSelector} from 'react-redux';
import Collapsible from 'react-native-collapsible';
import Down from '../../assets/images/down.svg';
import Up from '../../assets/images/arrow.svg';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {handleAddPhoto} from '../Functions/functions';

const Indoor = () => {
  const loginData = useSelector(state => state.login.value);
  const signProjectData = useSelector(state => state.signProject.value);
  console.log('indoor', signProjectData?.indoor_photos_and_measurements);
  const [active, setActive] = useState('');
  const [state, setState] = useState(null);
  const [signGeneralAuditTodoPunchList, setSignGeneralAuditTodoPunchList] =
    useState(
      signProjectData?.indoor_photos_and_measurements
        ?.signGeneralAuditTodoPunchList,
    );
  const [signGeneralAuditSummaryNotes, setSignGeneralAuditSummaryNotes] =
    useState(
      signProjectData?.indoor_photos_and_measurements
        ?.signGeneralAuditSummaryNotes,
    );
  const [
    signGeneralAuditDocumentAccessibilityIssues,
    setSignGeneralAuditDocumentAccessibilityIssues,
  ] = useState(
    signProjectData?.indoor_photos_and_measurements
      ?.signGeneralAuditDocumentAccessibilityIssues,
  );
  const [selectedOptions, setSelectedOptions] = useState({
    adminId: loginData?.adminId,
    projectId: signProjectData?.indoor_photos_and_measurements?.projectId,
    signId: signProjectData?.indoor_photos_and_measurements?.signId,
    optionId: signProjectData?.indoor_photos_and_measurements?.optionId,
    teamId: loginData?.userId,
    areMillionsPresent:
      signProjectData?.indoor_photos_and_measurements?.areMillionsPresent,
    areThereAnyVisibleOpenings:
      signProjectData?.indoor_photos_and_measurements
        ?.areThereAnyVisibleOpenings,
    createDate: signProjectData?.indoor_photos_and_measurements?.createDate,
    customerName: signProjectData?.indoor_photos_and_measurements?.customerName,
    Id: signProjectData?.indoor_photos_and_measurements?.id,
    measureDistanceFromSignToFloorLengthFT:
      signProjectData?.indoor_photos_and_measurements
        ?.measureDistanceFromSignToFloorLengthFT,
    measureDistanceFromSignToFloorLengthIN:
      signProjectData?.indoor_photos_and_measurements
        ?.measureDistanceFromSignToFloorLengthIN,
    measureDistanceLengthFT:
      signProjectData?.indoor_photos_and_measurements?.measureDistanceLengthFT,
    measureDistanceLengthIN:
      signProjectData?.indoor_photos_and_measurements?.measureDistanceLengthIN,
    measureDistanceLengthMM:
      signProjectData?.indoor_photos_and_measurements?.measureDistanceLengthMM,
    measureDistanceLengthCM:
      signProjectData?.indoor_photos_and_measurements?.measureDistanceLengthCM,
    measureDistanceLengthMTR:
      signProjectData?.indoor_photos_and_measurements?.measureDistanceLengthMTR,
    millionsDepthFT:
      signProjectData?.indoor_photos_and_measurements?.millionsDepthFT,
    millionsDepthIN:
      signProjectData?.indoor_photos_and_measurements?.millionsDepthIN,
    millionsLengthFT:
      signProjectData?.indoor_photos_and_measurements?.millionsLengthFT,
    millionsLengthIN:
      signProjectData?.indoor_photos_and_measurements?.millionsLengthIN,
    millionsWidthFT:
      signProjectData?.indoor_photos_and_measurements?.millionsWidthFT,
    millionsWidthIN:
      signProjectData?.indoor_photos_and_measurements?.millionsWidthIN,

    nameOfMeasurement:
      signProjectData?.indoor_photos_and_measurements?.nameOfMeasurement,
    optionId: signProjectData?.indoor_photos_and_measurements?.optionId,

    otherPhotosAndMeasurementsDepthFT:
      signProjectData?.indoor_photos_and_measurements
        ?.otherPhotosAndMeasurementsDepthFT,
    otherPhotosAndMeasurementsDepthIN:
      signProjectData?.indoor_photos_and_measurements
        ?.otherPhotosAndMeasurementsDepthIN,
    otherPhotosAndMeasurementsLengthFT:
      signProjectData?.indoor_photos_and_measurements
        ?.otherPhotosAndMeasurementsLengthFT,
    otherPhotosAndMeasurementsLengthIN:
      signProjectData?.indoor_photos_and_measurements
        ?.otherPhotosAndMeasurementsLengthIN,
    otherPhotosAndMeasurementsWidthFT:
      signProjectData?.indoor_photos_and_measurements
        ?.otherPhotosAndMeasurementsWidthFT,
    otherPhotosAndMeasurementsWidthIN:
      signProjectData?.indoor_photos_and_measurements
        ?.otherPhotosAndMeasurementsWidthIN,

    photoOnMallFloor:
      signProjectData?.indoor_photos_and_measurements?.photoOnMallFloor,
    photosAndMeasurementsSummaryNotes:
      signProjectData?.indoor_photos_and_measurements
        ?.photosAndMeasurementsSummaryNotes,
    photosAndMeasurementsTodoPunchList:
      signProjectData?.indoor_photos_and_measurements
        ?.photosAndMeasurementsTodoPunchList,

    projectId: signProjectData?.indoor_photos_and_measurements?.projectId,
    projectTitle: signProjectData?.indoor_photos_and_measurements?.projectTitle,

    signAliasName:
      signProjectData?.indoor_photos_and_measurements?.signAliasName,
    signDimensionsDepthFT:
      signProjectData?.indoor_photos_and_measurements?.signDimensionsDepthFT,
    signDimensionsDepthIN:
      signProjectData?.indoor_photos_and_measurements?.signDimensionsDepthIN,
    signDimensionsHeightFT:
      signProjectData?.indoor_photos_and_measurements?.signDimensionsHeightFT,
    signDimensionsHeightIN:
      signProjectData?.indoor_photos_and_measurements?.signDimensionsHeightIN,
    signDimensionsWidthFT:
      signProjectData?.indoor_photos_and_measurements?.signDimensionsWidthFT,
    signDimensionsWidthIN:
      signProjectData?.indoor_photos_and_measurements?.signDimensionsWidthIN,
    signId: signProjectData?.indoor_photos_and_measurements?.signId,

    signType: signProjectData?.indoor_photos_and_measurements?.signType,
    signOrder: signProjectData?.indoor_photos_and_measurements?.signOrder,

    squareFootage:
      signProjectData?.indoor_photos_and_measurements?.squareFootage,
    squareFootageCalculationRequired:
      signProjectData?.indoor_photos_and_measurements
        ?.squareFootageCalculationRequired,
    squareFootageFeet:
      signProjectData?.indoor_photos_and_measurements?.squareFootageFeet,
    squareFootageInches:
      signProjectData?.indoor_photos_and_measurements?.squareFootageInches,

    visibleOpeningsHeightFT:
      signProjectData?.indoor_photos_and_measurements?.visibleOpeningsHeightFT,
    visibleOpeningsHeightIN:
      signProjectData?.indoor_photos_and_measurements?.visibleOpeningsHeightIN,
    visibleOpeningsWidthFT:
      signProjectData?.indoor_photos_and_measurements?.visibleOpeningsWidthFT,
    visibleOpeningsWidthIN:
      signProjectData?.indoor_photos_and_measurements?.visibleOpeningsWidthIN,

    wallDimensionsDepthFT:
      signProjectData?.indoor_photos_and_measurements?.wallDimensionsDepthFT,
    wallDimensionsDepthIN:
      signProjectData?.indoor_photos_and_measurements?.wallDimensionsDepthIN,
    wallDimensionsHeightFT:
      signProjectData?.indoor_photos_and_measurements?.wallDimensionsHeightFT,
    wallDimensionsHeightIN:
      signProjectData?.indoor_photos_and_measurements?.wallDimensionsHeightIN,
    wallDimensionsWidthFT:
      signProjectData?.indoor_photos_and_measurements?.wallDimensionsWidthFT,
    wallDimensionsWidthIN:
      signProjectData?.indoor_photos_and_measurements?.wallDimensionsWidthIN,
  });
  const [inputFields, setInputFields] = useState([
    {
      placeholder: 'General Description of placement of sign',
      value:
        signProjectData?.indoor_photos_and_measurements
          ?.generalDescriptionOfPlacementOfSign || '',
      setToValue: 'generalDescriptionOfPlacementOfSign',
    },
    {
      placeholder: 'Channel Letter Material',
      value:
        signProjectData?.indoor_photos_and_measurements
          ?.channelLetterMaterial || '',
      setToValue: 'channelLetterMaterial',
    },
    {
      placeholder: 'Color or Existing Color Match',
      value:
        signProjectData?.indoor_photos_and_measurements
          ?.colorOrExistingColorMatch || '',
      setToValue: 'colorOrExistingColorMatch',
    },
    {
      placeholder: 'Copy Type or Style?',
      value:
        signProjectData?.indoor_photos_and_measurements?.copyTypeOrStyle || '',
      setToValue: 'copyTypeOrStyle',
    },
    {
      placeholder: 'Material Thickness',
      value:
        signProjectData?.indoor_photos_and_measurements?.materialThickness ||
        '',
      setToValue: 'materialThickness',
    },
    {
      placeholder: 'Wall or Substrate Type',
      value:
        signProjectData?.indoor_photos_and_measurements?.wallOrSubstrateType ||
        '',
      setToValue: 'wallOrSubstrateType',
    },
    {
      placeholder: 'Document Substrate Condition',
      value:
        signProjectData?.indoor_photos_and_measurements
          ?.documentSubstrateCondition || '',
      setToValue: 'documentSubstrateCondition',
    },
    {
      placeholder: 'Attachment Type?',
      value:
        signProjectData?.indoor_photos_and_measurements?.attachmentType || '',
      setToValue: 'attachmentType',
    },
  ]);

  const data = [
    {
      question: 'Facility Diagram or Sketch Provided?',
      options: ['Yes', 'No'],
      selectedValue:
        signProjectData?.indoor_photos_and_measurements
          ?.anyAccessibilityObstructions,
      value: 'anyAccessibilityObstructions',
    },
    {
      question: 'RaceWay or Flush?',
      options: ['RaceWay', 'Flush'],
      selectedValue:
        signProjectData?.indoor_photos_and_measurements?.racewayOrFlush,
      value: 'racewayOrFlush',
    },
    {
      question: 'Site covered?',
      options: ['Covered', 'Not covered'],
      selectedValue:
        signProjectData?.indoor_photos_and_measurements?.siteCovered,
      value: 'siteCovered',
    },
    {
      question: 'Site weather dependent?',
      options: ['Weather dependent', 'Not weather dependent'],
      selectedValue:
        signProjectData?.indoor_photos_and_measurements?.siteWeatherDependent,
      value: 'siteWeatherDependent',
    },
    {
      question: 'Any Potential safety issues?',
      options: ['Yes', 'No'],
      selectedValue:
        signProjectData?.indoor_photos_and_measurements
          ?.anyPotentialSafetyIssues,
      value: 'anyPotentialSafetyIssues',
    },
    {
      question: 'Ladder or Lift Required?',
      options: ['Yes', 'No'],
      selectedValue:
        signProjectData?.indoor_photos_and_measurements?.ladderOrLiftRequired,
      value: 'ladderOrLiftRequired',
    },
  ];
  const [loadingImage, setLoadingImage] = useState(true);
  const [sizeOfLadderOrLift, setSizeOfLadderOrLift] = useState(
    signProjectData?.indoor_photos_and_measurements?.sizeOfLadderOrLift || '',
  );

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (active === '') {
            setActive('Outdoor');
          } else {
            setActive('');
          }
        }}
        style={[styles.container, {borderColor: '#2B92F0'}]}>
        <View style={[styles.iconWrapper, {backgroundColor: '#2B92F0'}]}>
          <Exist width={30} height={30} />
        </View>

        <View style={styles.textContent}>
          <Text style={styles.projectName}>
            {signProjectData?.indoor_photos_and_measurements?.projectTitle ||
              'Project Name'}
          </Text>
          <Text style={styles.auditTitle}>Indoor Sign General Audit</Text>
          <Text style={styles.projectName}>
            {signProjectData?.indoor_photos_and_measurements?.signType ||
              'Digital indoor free standing'}
          </Text>
        </View>

        <View style={styles.dropdownIconWrapper}>
          {active === 'Outdoor' ? (
            <UpDownIcon width={39} height={39} />
          ) : (
            <DropDownIcon width={39} height={39} />
          )}
        </View>
      </TouchableOpacity>
      <View style={{marginTop: -8}}>
        {active === 'Outdoor' && (
          <View style={[styles.card, {borderColor: '#2B92F0'}]}>
            {inputFields[0] && (
              <TextInput
                placeholder={inputFields[0].placeholder}
                style={[styles.input, {height: 50}]}
                value={selectedOptions[inputFields[0].setToValue] || ''}
                onChangeText={text => handleInputChange(text, 0)}
              />
            )}
            <View style={{marginVertical: 6}}>
              <TouchableOpacity
                style={[styles.containerDrop]}
                onPress={() => handleState('retainer')}>
                <Text style={styles.label}>{data[0].question}</Text>
                <View style={styles.iconButton}>
                  {state !== 'retainer' ? (
                    <Up width={18} height={18} />
                  ) : (
                    <Down width={18} height={18} />
                  )}
                </View>
              </TouchableOpacity>
              <Collapsible
                collapsed={state !== 'retainer'}
                duration={300}
                easing="easeInOutQuad">
                <View style={styles.sectionContainer}>
                  <View style={styles.radioSection}>
                    <Text style={styles.radioQuestionText}>
                      {data[0].question}
                    </Text>
                    <View style={styles.radioGroup}>
                      {data[0].options.map((option, index) => (
                        <RadioButton
                          key={index}
                          label={option}
                          value={option}
                          selected={selectedOptions[data[0].value] || null}
                          onPress={value1 => {
                            setSelectedOptions(prev => ({
                              ...prev,
                              [data[0].value]:
                                prev[data[0].value] === value1 ? null : value1,
                            }));
                          }}
                        />
                      ))}
                    </View>
                  </View>
                  {(selectedOptions[data[0].value] === 'yes' ||
                    selectedOptions[data[0].value] === 'Yes') && (
                    <View>
                      <TextInput
                        placeholder="General description of placement of sign"
                        style={[styles.input, {height: 50}]}
                        value={signGeneralAuditDocumentAccessibilityIssues}
                        onChangeText={
                          setSignGeneralAuditDocumentAccessibilityIssues
                        }
                      />
                      <TouchableOpacity
                        style={styles.imageCon}
                        onPress={() =>
                          handleAddPhoto(
                            setSelectedOptions,
                            'anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto',
                          )
                        }>
                        <View style={styles.photoButton}>
                          <Text style={styles.photoText}>add photo</Text>
                          <Photo />
                        </View>
                        <View style={styles.fileNameContainer}>
                          <Text style={styles.fileNameText}>
                            No file choosen
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
                          <ActivityIndicator size="small" color="#FF9239" />
                        ) : (
                          selectedOptions
                            ?.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos
                            ?.length > 0 &&
                          selectedOptions?.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos?.map(
                            (data, index) => {
                              return (
                                <View key={index} style={styles.imageContainer}>
                                  <Image
                                    source={{uri: data.url}}
                                    style={styles.image}
                                  />
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleRemoveImage(
                                        data.imageId,
                                        'anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto',
                                        'anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos',
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

                  <TouchableOpacity
                    onPress={() => handleState('retainer')}
                    style={[
                      styles.iconButton,
                      {alignSelf: 'flex-end', marginVertical: 15},
                    ]}>
                    <Down width={18} height={18} />
                  </TouchableOpacity>
                </View>
              </Collapsible>
            </View>
            <View>
              <FlatList
                data={data.slice(1, 4)}
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
                          selected={selectedOptions[item.value]}
                          onPress={value1 => {
                            setSelectedOptions(prev => ({
                              ...prev,
                              [item.value]:
                                prev[item.value] === value1 ? null : value1,
                            }));
                          }}
                        />
                      ))}
                    </View>
                  </View>
                )}
              />
            </View>
            <FlatList
              data={inputFields.slice(1)}
              keyExtractor={item => item.placeholder}
              renderItem={({item, index}) => (
                <TextInput
                  placeholder={item.placeholder}
                  value={selectedOptions[item.setToValue] || ''}
                  onChangeText={text => handleInputChange(text, index + 1)}
                  style={[styles.input, {height: 50}]}
                />
              )}
            />
            <View style={{marginVertical: 6}}>
              <TouchableOpacity
                style={[styles.containerDrop]}
                onPress={() => handleState('Potential')}>
                <Text style={styles.label}>{data[4].question}</Text>
                <View style={styles.iconButton}>
                  {state !== 'Potential' ? (
                    <Up width={18} height={18} />
                  ) : (
                    <Down width={18} height={18} />
                  )}
                </View>
              </TouchableOpacity>
              <Collapsible
                duration={300}
                easing="easeInOutQuad"
                collapsed={state !== 'Potential'}>
                <View style={styles.sectionContainer}>
                  <View style={styles.radioSection}>
                    <Text style={styles.radioQuestionText}>
                      {data[4].question}
                    </Text>
                    <View style={styles.radioGroup}>
                      {data[4].options.map((option, index) => (
                        <RadioButton
                          key={index}
                          label={option}
                          value={option}
                          selected={selectedOptions[data[4].value] || null}
                          onPress={value1 => {
                            setSelectedOptions(prev => ({
                              ...prev,
                              [data[4].value]:
                                prev[data[4].value] === value1 ? null : value1,
                            }));
                          }}
                        />
                      ))}
                    </View>
                  </View>
                  {(selectedOptions[data[4].value] === 'yes' ||
                    selectedOptions[data[4].value] === 'Yes') && (
                    <View>
                      <TextInput
                        placeholder="Document Potential Safety Issues"
                        style={[styles.input, {height: 50}]}
                      />
                      <TouchableOpacity
                        style={styles.imageCon}
                        onPress={() =>
                          handleAddPhoto(
                            setSelectedOptions,
                            'anyPotentialSafetyIssuesPhoto',
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
                        }}>
                        {loadingImage ? (
                          <ActivityIndicator size="small" color="#FF9239" />
                        ) : (
                          selectedOptions?.anyPotentialSafetyIssuesPhotos
                            ?.length > 0 &&
                          selectedOptions.anyPotentialSafetyIssuesPhotos.map(
                            (data, index) => {
                              return (
                                <View key={index} style={styles.imageContainer}>
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
                  <TouchableOpacity
                    onPress={() => handleState('retainer')}
                    style={[
                      styles.iconButton,
                      {alignSelf: 'flex-end', marginVertical: 15},
                    ]}>
                    <Down width={18} height={18} />
                  </TouchableOpacity>
                </View>
              </Collapsible>
            </View>
            <View style={{marginVertical: 6}}>
              <TouchableOpacity
                style={[styles.containerDrop]}
                onPress={() => handleState('Ladder')}>
                <Text style={styles.label}>{data[5].question}</Text>
                <View style={styles.iconButton}>
                  {state !== 'Ladder' ? (
                    <Up width={18} height={18} />
                  ) : (
                    <Down width={18} height={18} />
                  )}
                </View>
              </TouchableOpacity>
              <Collapsible
                duration={300}
                easing="easeInOutQuad"
                collapsed={state !== 'Ladder'}>
                <View style={styles.sectionContainer}>
                  <View style={styles.radioSection}>
                    <Text style={styles.radioQuestionText}>
                      {data[5].question}
                    </Text>
                    <View style={styles.radioGroup}>
                      {data[5].options.map((option, index) => (
                        <RadioButton
                          key={index}
                          label={option}
                          value={option}
                          selected={selectedOptions[data[5].value] || null}
                          onPress={value1 => {
                            setSelectedOptions(prev => ({
                              ...prev,
                              [data[5].value]:
                                prev[data[5].value] === value1 ? null : value1,
                            }));
                          }}
                        />
                      ))}
                    </View>
                  </View>
                  {(selectedOptions[data[5].value] === 'yes' ||
                    selectedOptions[data[5].value] === 'Yes') && (
                    <View>
                      <TextInput
                        placeholder="Size of ladder or lift"
                        style={[styles.input, {height: 50}]}
                        value={sizeOfLadderOrLift}
                        onChangeText={setSizeOfLadderOrLift}
                      />
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => handleState('retainer')}
                    style={[
                      styles.iconButton,
                      {alignSelf: 'flex-end', marginVertical: 15},
                    ]}>
                    <Down width={18} height={18} />
                  </TouchableOpacity>
                </View>
              </Collapsible>
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
                  value={signGeneralAuditTodoPunchList}
                  onChangeText={setSignGeneralAuditTodoPunchList}
                />
                <Text style={{textAlign: 'right', marginTop: 5}}>
                  {signGeneralAuditTodoPunchList?.length}/300
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
                  value={signGeneralAuditSummaryNotes}
                  onChangeText={setSignGeneralAuditSummaryNotes}
                />
                <Text style={{textAlign: 'right', marginTop: 5}}>
                  {signGeneralAuditSummaryNotes?.length}/300
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleSave()}>
              <SaveImg width={28} height={28} />
              <Text style={styles.saveButtonText}>Save Section</Text>
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

export default Indoor;
