import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Logo from '../../assets/images/app logo.svg';
import Refresh from '../../assets/images/cloud.svg';
import Menu from '../../assets/images/close.svg';
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  fetchCustomers,
  fetchSigns,
  getUnsignedSigns,
} from '../Functions/functions';
import Toast from 'react-native-toast-message';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';

const CustomerProjectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const baseUrl = useSelector(state => state.baseUrl.value);

  const [signId, setSignId] = useState(0);
  const [signData, setSignData] = useState([]);
  const [fullyAsscociatedSigns, setFullyAssociatedSigns] = useState([]);
  const [selectedSignToEdit, setSelectedSignToEdit] = useState(null);
  const [isEditSignModalVisible, setIsEditSignModalVisible] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const [isAliasChanged, setIsAliasChanged] = useState(false);
  const [isSignIdChanged, setSignIdChanged] = useState(false);
  const [customerChanged, setCustomerChanged] = useState(false);
  const [apiEndpointsToSetSigns, setApiEndpointsToSetSigns] = useState('');
  const [addSignModalVisible, setAddSignModalVisible] = useState(false);

  const loginData = useSelector(state => state.login.value);
  const token = loginData?.tokenNumber;
  const admin_id = loginData?.adminId;
  const role = loginData?.role;
  const userId = loginData?.userId;

  const [addSignForm, setAddSignForm] = useState({
    signType: '',
    alias_name: '',
    signLocation: '',
    projectId: 0,
    userId: loginData?.userId,
    role: loginData?.role,
  });

  const [EditSignForm, setEditSignForm] = useState({
    signType: '',
    alias_name: '',
    signLocation: '',
    projectId: 0,
    userId: loginData?.userId,
    role: loginData?.role,
    signTableId: '',
    assign_to: '',
    teamId: '',
  });
  const customerData = route.params?.customerData;
  const project = route.params?.project;
  const projects = route.params?.projects;
  const customers = route.params?.customers;
  const teams = route.params?.teams;

  const actions = [
    'change sign name',
    'change sign type',
    'Change customer',
    'assign to project',
    'assign to self',
    'assign to surveyor',
  ];

  const updateSignStats = async () => {
    try {
      const customer = customers?.find(
        data => data.id === EditSignForm?.teamId,
      );
      const self = teams?.find(data => data.id === userId);
      const others = teams?.find(data => data.id === EditSignForm?.teamId);
      const projectData = projects.find(
        data => data.id === EditSignForm?.teamId,
      );
      const updatedData = {
        ...EditSignForm,
        name: EditSignForm?.alias_name,
        sign_id: EditSignForm?.signTableId,
        project_id: projectData ? projectData?.id : 0,
        projectId: projectData ? projectData?.id : 0,
      };
      updatedData.admin_id = admin_id;
      updatedData.customer_id = customerData?.id;

      if (isAssigned) {
        updatedData.assign_to = self?.role;
        updatedData.teamId = self?.id;
      } else {
        updatedData.assign_to = others?.role;
        updatedData.teamId = others?.id;
      }

      const response = await axios.post(
        `${baseUrl}/${apiEndpointsToSetSigns}`,
        updatedData,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.data.status) {
        Toast.show({
          text1: response?.data?.message,
          visibilityTime: 3000,
          position: 'top',
        });
        getUnsignedSigns(project?.id, token, setFullyAssociatedSigns, baseUrl);
        setIsEditSignModalVisible(false);
        setSelectedSignToEdit(null);
        setIsAssigned(false);
        setIsAliasChanged(false);
        setSignIdChanged(false);
        setCustomerChanged(false);
      }
    } catch (error) {
      console.log('Axios Error:', error);
      console.log('Axios Error:', error.response?.data);
    }
  };
  const handleSaveSign = async () => {
    try {
      const data = {...addSignForm};
      const resonse = await axios.post(`${baseUrl}/createSign`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const signTableId = resonse.data?.signTableId;
      if (signTableId) {
        const updatedData = {
          ...EditSignForm,
          name: EditSignForm?.alias_name,
        };
        updatedData.projectId = project?.id;
        updatedData.project_id = project?.id;
        updatedData.admin_id = admin_id;
        updatedData.customer_id = customerData?.id;
        updatedData.sign_id = signTableId;
        const response = await axios.post(
          `${baseUrl}/changeCustomer`,
          updatedData,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        if (response.data.status) {
          const response = await axios.post(
            `${baseUrl}/changeProject`,
            updatedData,
            {
              headers: {Authorization: `Bearer ${token}`},
            },
          );
          console.log('ADD SIGNNNNN:::', response.data);
        }
      }
      setAddSignModalVisible(false);
      getUnsignedSigns(project?.id, token, setFullyAssociatedSigns, baseUrl);
    } catch (error) {
      console.error('ADD SIGNNNNN Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
    }
  };
  const onAssign = () => {
    setIsAssigned(prev => !prev);
  };
  useEffect(() => {
    if (
      addSignForm?.signLocation === 'Outdoor' ||
      EditSignForm?.signLocation === 'Outdoor'
    ) {
      setSignId(2);
    } else if (
      addSignForm?.signLocation === 'Indoor' ||
      EditSignForm?.signLocation === 'Indoor'
    ) {
      setSignId(1);
    } else {
      setSignData([]);
    }
  }, [addSignForm?.signLocation]);

  useEffect(() => {
    if (signId !== 0) {
      fetchSigns(signId, token, setSignData, baseUrl);
    }
  }, [signId]);

  useEffect(() => {
    if (selectedSignToEdit === 'change sign name') {
      setApiEndpointsToSetSigns('updateName');
      return;
    } else if (selectedSignToEdit === 'change sign type') {
      setApiEndpointsToSetSigns('changeSignType');
      return;
    } else if (selectedSignToEdit === 'Change customer') {
      setApiEndpointsToSetSigns('changeCustomer');
      return;
    } else if (selectedSignToEdit === 'assign to project') {
      setApiEndpointsToSetSigns('changeProject');
      return;
    } else if (selectedSignToEdit === 'assign to self') {
      setApiEndpointsToSetSigns('signAssign');
      return;
    } else if (selectedSignToEdit === 'assign to surveyor') {
      setApiEndpointsToSetSigns('signAssign');
      return;
    }
  }, [selectedSignToEdit]);

  useEffect(() => {
    getUnsignedSigns(project?.id, token, setFullyAssociatedSigns, baseUrl);
  }, []);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo width={150} height={36} />
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => getCustomersProject()}>
            <Refresh width={36} height={36} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Home'}],
                }),
              );
            }}>
            <Menu width={36} height={36} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{padding: 24, paddingTop: 0}}>
        <View style={styles.section}>
          <Feather name="toggle-left" size={20} color="#333" />
          <Text style={styles.sectionTitle}>Manage</Text>
        </View>
        <TouchableOpacity
          style={styles.addSignButton}
          onPress={() => {
            setAddSignModalVisible(true);
            setAddSignForm({
              signType: '',
              alias_name: '',
              signLocation: '',
              projectId: 0,
              userId: loginData?.userId,
              role: loginData?.role,
            });
          }}>
          <Text style={styles.addSignText}>Add Sign</Text>
        </TouchableOpacity>
        <View style={styles.userRow}>
          <Text style={styles.userName}>
            {customerData?.company_name || 'Company Name'}
          </Text>
          <TouchableOpacity onPress={() => navigation.replace('Manage')}>
            <FontAwesome5
              name="minus-circle"
              size={16}
              color="green"
              style={{marginHorizontal: 10}}
            />
          </TouchableOpacity>
          <View style={{marginRight: 8}}>
            <Feather name="arrow-right" size={16} color="#555" />
          </View>
          <Text style={styles.userName}>
            {project?.project_name || 'Project Name'}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5
              name="minus-circle"
              size={16}
              color="orange"
              style={{marginLeft: 10}}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.associatedSection}>
          <View style={styles.associatedHeader}>
            <FontAwesome5 name="project-diagram" size={16} color="#fff" />
            <Text style={styles.associatedText}>Fully-associated signs</Text>
          </View>

          <View style={styles.signsContainer}>
            {fullyAsscociatedSigns?.length > 0 ? (
              fullyAsscociatedSigns.map((data, index) => (
                <View key={index} style={styles.signItem}>
                  <Text>{data?.alias_name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setEditSignForm(prev => {
                        return {
                          ...prev,
                          alias_name: data?.alias_name,
                          signType: data?.signType,
                          signLocation: data?.signLocation,
                          projectId: data?.projectId,
                          signTableId: data?.signTableId,
                        };
                      });

                      setIsEditSignModalVisible(true);
                    }}>
                    <Feather name="zap" size={20} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.noSignFound}>
                <FontAwesome5 name="box-open" size={16} color="#3B82F6" />
                <Text style={styles.noSignText}>No signs found</Text>
              </View>
            )}
          </View>
        </View>
        <Modal
          transparent={true}
          visible={isEditSignModalVisible}
          animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer]}>
              {/* Header */}
              <View
                style={[
                  styles.header,
                  {
                    backgroundColor: '#fff',
                    borderBottomWidth: 0,
                    padding: 15,
                    borderRadius: 8,
                  },
                ]}>
                <Text style={[styles.title, {marginBottom: 0}]}>
                  Unattached sign actions
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsEditSignModalVisible(false);
                    setSelectedSignToEdit(null);
                  }}>
                  <Menu width={24} height={24} />
                </TouchableOpacity>
              </View>
              {/* Action Grid */}
              {selectedSignToEdit === null && (
                <FlatList
                  data={actions}
                  numColumns={3}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={styles.grid}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => setSelectedSignToEdit(item)}>
                      <Ionicons name="flash-outline" size={20} color="#fff" />
                      <Text style={styles.actionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              {selectedSignToEdit !== null && (
                <View style={[styles.subHeader, {padding: 15}]}>
                  <View style={styles.subHeaderLeft}>
                    <Icon3
                      name="drive-file-rename-outline"
                      size={22}
                      color="#007AFF"
                    />
                    <Text style={styles.subHeaderText}>
                      {selectedSignToEdit}
                    </Text>
                  </View>
                  <Ionicons name="return-up-back" size={20} color="#999" />
                </View>
              )}
              {selectedSignToEdit === 'change sign name' && (
                <View style={styles.content}>
                  <Text>Sign Name</Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      marginVertical: 5,
                      borderRadius: 8,
                      borderColor: '#666',
                    }}
                    placeholder="Sign name"
                    value={EditSignForm.alias_name} // controlled input
                    onChangeText={text => {
                      setIsAliasChanged(true); // user changed it manually
                      setEditSignForm(prev => ({...prev, alias_name: text}));
                    }}
                  />
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      (EditSignForm?.alias_name?.trim() === '' ||
                        !isAliasChanged) &&
                        styles.disabledButton,
                    ]}
                    disabled={
                      EditSignForm?.alias_name?.trim() === '' || !isAliasChanged
                    }
                    onPress={() => {
                      updateSignStats();
                      setIsAliasChanged(false);
                    }}>
                    <Text style={styles.saveButtonText}>Change sign name</Text>
                    <Icon3 name="save-alt" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
              {selectedSignToEdit === 'change sign type' && (
                <View>
                  <ScrollView contentContainerStyle={styles.modalBody}>
                    <View
                      style={{
                        backgroundColor: '#fff',
                        padding: 10,
                        borderRadius: 8,
                      }}>
                      <Text style={[styles.label, {marginBottom: 0}]}>
                        Indoor or Outdoor
                      </Text>
                      <View style={styles.pickerContainer}>
                        <Icon
                          name="selection"
                          size={20}
                          color="#007AFF"
                          style={styles.leftIcon}
                        />

                        <Picker
                          selectedValue={EditSignForm?.signLocation}
                          onValueChange={value => {
                            setEditSignForm(prev => ({
                              ...prev,
                              signLocation: value,
                            }));
                            setSignIdChanged(true);
                          }}
                          style={styles.picker}
                          dropdownIconColor="#fff">
                          <Picker.Item
                            label="Select indoor or outdoor"
                            value=""
                          />
                          <Picker.Item label="Indoor" value="Indoor" />
                          <Picker.Item label="Outdoor" value="Outdoor" />
                        </Picker>

                        <View style={styles.arrowContainer}>
                          <AntDesign name="down" size={16} color="#fff" />
                        </View>
                      </View>
                      <View>
                        <Text style={[styles.label, {marginBottom: 0}]}>
                          Sign Type
                        </Text>
                        <View style={styles.pickerContainer}>
                          <Icon
                            name="selection"
                            size={20}
                            color="#007AFF"
                            style={styles.leftIcon}
                          />

                          <Picker
                            selectedValue={EditSignForm?.signLocation}
                            onValueChange={selectedOptionId => {
                              const selectedType = signData.find(
                                item => item.optionId === selectedOptionId,
                              );
                              if (selectedType) {
                                setEditSignForm(prev => ({
                                  ...prev,
                                  signType: selectedType.optionName,
                                  signId: selectedType.signId,
                                  optionId: selectedType.optionId,
                                }));
                              }
                            }}
                            style={styles.picker}
                            dropdownIconColor="#fff">
                            <Picker.Item label="Select sign type" value="" />
                            {signData?.length > 0 &&
                              signData.map((type, index) => (
                                <Picker.Item
                                  key={index}
                                  label={type.optionName}
                                  value={type.optionId}
                                />
                              ))}
                          </Picker>

                          <View style={styles.arrowContainer}>
                            <AntDesign name="down" size={16} color="#fff" />
                          </View>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.label}>Sign Name</Text>
                        <TextInput
                          style={{
                            borderWidth: 1,
                            marginVertical: 5,
                            borderRadius: 8,
                            borderColor: '#007AFF',
                          }}
                          placeholder="Sign name"
                          value={EditSignForm.alias_name}
                          onChangeText={text => {
                            setSignIdChanged(true);
                            setEditSignForm(prev => ({
                              ...prev,
                              alias_name: text,
                            }));
                          }}
                        />
                        <TouchableOpacity
                          style={[
                            styles.saveButton,
                            (EditSignForm?.alias_name?.trim() === '' ||
                              !isSignIdChanged) &&
                              styles.disabledButton,
                          ]}
                          disabled={
                            EditSignForm?.alias_name?.trim() === '' ||
                            !isSignIdChanged
                          }
                          onPress={() => {
                            updateSignStats();
                            setIsAliasChanged(false);
                          }}>
                          <Text style={styles.saveButtonText}>Save Sign</Text>
                          <Icon3 name="save-alt" size={18} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ScrollView>
                </View>
              )}
              {selectedSignToEdit === 'Change customer' && (
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    padding: 10,
                  }}>
                  <Text style={styles.label}>Select Customer</Text>
                  <View style={styles.pickerContainer}>
                    <Icon
                      name="selection"
                      size={20}
                      color="#007AFF"
                      style={styles.leftIcon}
                    />

                    <Picker
                      selectedValue={EditSignForm?.teamId}
                      onValueChange={itemValue => {
                        setEditSignForm(prev => ({...prev, teamId: itemValue}));
                        setCustomerChanged(true);
                      }}
                      style={styles.picker}
                      dropdownIconColor="#fff">
                      <Picker.Item label="Select Customer" value="" />
                      {customers?.length > 0 &&
                        customers?.map(customer => (
                          <Picker.Item
                            key={customer?.id}
                            label={customer?.company_name || customer?.name}
                            value={customer?.id}
                          />
                        ))}
                    </Picker>

                    <View style={styles.arrowContainer}>
                      <AntDesign name="down" size={16} color="#fff" />
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      (EditSignForm?.alias_name?.trim() === '' ||
                        !customerChanged) &&
                        styles.disabledButton,
                    ]}
                    disabled={
                      EditSignForm?.alias_name?.trim() === '' ||
                      !customerChanged
                    }
                    onPress={() => {
                      updateSignStats();
                      setCustomerChanged(false);
                    }}>
                    <Text style={styles.saveButtonText}>
                      Add sign to customer
                    </Text>
                    <Icon3 name="save-alt" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
              {selectedSignToEdit === 'assign to project' && (
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    padding: 10,
                  }}>
                  <Text style={styles.label}>Assign</Text>

                  <View style={styles.pickerContainer}>
                    <Icon
                      name="selection"
                      size={20}
                      color="#007AFF"
                      style={styles.leftIcon}
                    />

                    <Picker
                      selectedValue={EditSignForm?.teamId}
                      onValueChange={itemValue => {
                        setEditSignForm(prev => ({...prev, teamId: itemValue}));
                        setCustomerChanged(true);
                      }}
                      style={styles.picker}
                      dropdownIconColor="#fff">
                      <Picker.Item
                        label="Select Project To Assign"
                        value={null}
                      />
                      {projects?.length > 0 &&
                        projects?.map(data => (
                          <Picker.Item
                            key={data?.id}
                            label={data?.project_name || data?.name}
                            value={data?.id}
                          />
                        ))}
                    </Picker>

                    <View style={styles.arrowContainer}>
                      <AntDesign name="down" size={16} color="#fff" />
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      (EditSignForm?.alias_name?.trim() === '' ||
                        !customerChanged) &&
                        styles.disabledButton,
                    ]}
                    disabled={
                      EditSignForm?.alias_name?.trim() === '' ||
                      !customerChanged
                    }
                    onPress={() => {
                      updateSignStats();
                      setCustomerChanged(false);
                    }}>
                    <Text style={styles.saveButtonText}>
                      Add sign to customer
                    </Text>
                    <Icon3 name="save-alt" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
              {selectedSignToEdit === 'assign to self' && (
                <View style={styles.modalBody}>
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={styles.radioOption}
                      onPress={onAssign}>
                      <View style={styles.radioCircle}>
                        {isAssigned && <View style={styles.radioInner} />}
                      </View>
                      <Text style={styles.radioLabel}>Assign to self</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.filledButton}
                      onPress={() => (isAssigned ? updateSignStats() : null)}>
                      <Text style={styles.filledText}>Assign to self</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {selectedSignToEdit === 'assign to surveyor' && (
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    padding: 10,
                  }}>
                  <Text style={styles.label}>Assign</Text>
                  <View style={styles.pickerContainer}>
                    <Icon
                      name="selection"
                      size={20}
                      color="#007AFF"
                      style={styles.leftIcon}
                    />

                    <Picker
                      selectedValue={EditSignForm?.teamId}
                      onValueChange={itemValue =>
                        setEditSignForm(prev => ({...prev, teamId: itemValue}))
                      }
                      style={styles.picker}
                      dropdownIconColor="#fff">
                      <Picker.Item label="assign to surveyor" value={null} />
                      {teams?.length > 0 &&
                        teams?.map(data => (
                          <Picker.Item
                            key={data?.id}
                            label={data?.email || data?.name}
                            value={data?.id}
                          />
                        ))}
                    </Picker>

                    <View style={styles.arrowContainer}>
                      <AntDesign name="down" size={16} color="#fff" />
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => updateSignStats()}>
                    <Text style={styles.buttonText}>Add sign to customer</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
        <Modal
          visible={addSignModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setAddSignModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add sign</Text>
                <TouchableOpacity onPress={() => setAddSignModalVisible(false)}>
                  <Menu width={26} height={26} />
                </TouchableOpacity>
              </View>

              <ScrollView
                contentContainerStyle={{
                  backgroundColor: '#fff',
                  padding: 10,
                  borderRadius: 8,
                }}>
                <Text style={styles.label}>Indoor or Outdoor</Text>
                <View style={styles.pickerContainer}>
                  <Icon
                    name="selection"
                    size={20}
                    color="#007AFF"
                    style={styles.leftIcon}
                  />

                  <Picker
                    selectedValue={addSignForm?.signLocation}
                    onValueChange={value => {
                      setAddSignForm(prev => ({
                        ...prev,
                        signLocation: value,
                      }));
                    }}
                    style={styles.picker}
                    dropdownIconColor="#fff">
                    <Picker.Item label="Select Location" value="" />
                    <Picker.Item label="Indoor" value="Indoor" />
                    <Picker.Item label="Outdoor" value="Outdoor" />
                  </Picker>

                  <View style={styles.arrowContainer}>
                    <AntDesign name="down" size={16} color="#fff" />
                  </View>
                </View>

                {addSignForm?.signLocation !== '' && (
                  <View>
                    <Text style={[styles.label, {marginBottom: 0}]}>
                      Sign Type
                    </Text>
                    <View style={styles.pickerContainer}>
                      <Icon
                        name="selection"
                        size={20}
                        color="#007AFF"
                        style={styles.leftIcon}
                      />

                      <Picker
                        selectedValue={addSignForm.optionId}
                        onValueChange={selectedOptionId => {
                          const selectedType = signData.find(
                            item => item.optionId === selectedOptionId,
                          );
                          if (selectedType) {
                            setAddSignForm(prev => ({
                              ...prev,
                              signType: selectedType.optionName,
                              signId: selectedType.signId,
                              optionId: selectedType.optionId,
                            }));
                          }
                        }}
                        style={styles.picker}
                        dropdownIconColor="#fff">
                        <Picker.Item label="Select sign type" value="" />
                        {signData?.length > 0 &&
                          signData.map((type, index) => (
                            <Picker.Item
                              key={index}
                              label={type.optionName}
                              value={type.optionId}
                            />
                          ))}
                      </Picker>

                      <View style={styles.arrowContainer}>
                        <AntDesign name="down" size={16} color="#fff" />
                      </View>
                    </View>
                  </View>
                )}

                {addSignForm?.signType !== '' && (
                  <View>
                    <Text style={styles.label}>Sign Name</Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        marginVertical: 5,
                        borderRadius: 8,
                        borderColor: '#007AFF',
                      }}
                      placeholder="Sign name"
                      value={addSignForm?.alias_name}
                      onChangeText={text => {
                        setAddSignForm(prev => ({
                          ...prev,
                          alias_name: text,
                        }));
                      }}
                    />
                  </View>
                )}
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveSign}>
                  <Text style={styles.btnText}>Save Sign</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default CustomerProjectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  logoContainer: {
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  sectionTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '500',
  },
  addSignButton: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    padding: 12,
    marginVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  addSignText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  signsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    minHeight: 100,
  },
  associatedSection: {
    backgroundColor: '#e1e5ea',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  associatedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c757d',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  associatedText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  signItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#999',
  },
  signName: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#666',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 18,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  innerCheck: {
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#1E293B',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: '#1E293B',
  },
  fullInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    fontSize: 14,
    color: '#1E293B',
  },
  saveBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  signItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    marginVertical: 8,
  },
  noSignFound: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  grid: {
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 5,
    borderRadius: 8,
    paddingVertical: 16,
  },
  actionButton: {
    backgroundColor: '#1E90FF',
    width: 90,
    height: 90,
    margin: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  actionText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: '#7ED6A7',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#D3F2E1',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  subHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subHeaderText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  content: {
    marginTop: 5,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    gap: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  filledButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#C8F7D1',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  filledText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
  },

  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },

  radioLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 5,
  },
  leftIcon: {
    paddingHorizontal: 10,
  },
  picker: {
    flex: 1,
    color: '#333',
  },
  arrowContainer: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 14,
    paddingVertical: 18.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
