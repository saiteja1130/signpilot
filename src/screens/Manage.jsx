import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Logo from '../../assets/images/app logo.svg';
import Refresh from '../../assets/images/cloud.svg';
import Menu from '../../assets/images/close.svg';
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  fetchCustomers,
  fetchSigns,
  getUnassociatedSigns,
  sendapiSendUpdateMail,
  sendChangeTypeUpdateMail,
  sendUpdateNameMail,
} from '../Functions/functions';
import ProgressBar from '../Components/Progressbar';

const Manage = () => {
  const baseUrl = useSelector(state => state.baseUrl.value);
  const navigation = useNavigation();
  const [addCustomerModalVisible, setAddCustomerModalVisible] = useState(false);
  const [editCustomerModalVisible, setEditCustomerModalVisible] =
    useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const [addSignModalVisible, setAddSignModalVisible] = useState(false);
  const [isEditSignModalVisible, setIsEditSignModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAliasChanged, setIsAliasChanged] = useState(false);
  const [isSignIdChanged, setSignIdChanged] = useState(false);
  const [customerChanged, setCustomerChanged] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isSignCreated, setIsSignCreated] = useState(false);
  const [apiEndpointsToSetSigns, setApiEndpointsToSetSigns] = useState('');

  const [signId, setSignId] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [savedSign, setSavedSign] = useState(null);
  const [unassociatedSigns, setUnassociatedSign] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedSignToEdit, setSelectedSignToEdit] = useState(null);
  const [teams, setTeams] = useState([]);

  const loginData = useSelector(state => state.login.value);
  const token = loginData?.tokenNumber;
  const admin_id = loginData?.adminId;
  const role = loginData?.role;
  const userId = loginData?.userId;
  const apiTTocken =
    'pk.eyJ1IjoidmlqYXk3IiwiYSI6ImNsdHkyaWZ3dTA2emsybW1raDU3ejE0NnAifQ.MJnak0xb8_wU6jIkRIZAyA&types';

  // "https://api.mapbox.com/geocoding/v5/mapbox.places/${pincode}.json?access_token=pk.eyJ1IjoidmlqYXk3IiwiYSI6ImNsdHkyaWZ3dTA2emsybW1raDU3ejE0NnAifQ.MJnak0xb8_wU6jIkRIZAyA&types=postcode&limit=1"

  const [form, setForm] = useState({
    role: role,
    admin_id: admin_id || null,
    company_name: '',
    fname: '',
    lname: '',
    mobile: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    extension: '',
    zip_code: '',
  });

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
  const validateForm = () => {
    const requiredFields = [
      'company_name',
      'fname',
      'lname',
      'email',
      'mobile',
      'address1',
      'city',
      'state',
      'zip_code',
    ];

    let valid = true;
    let newErrors = {};

    requiredFields.forEach(field => {
      if (!form[field]?.trim()) {
        newErrors[field] = 'Required';
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const formatPhoneNumber = number => {
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

    if (!match) return number;

    let formatted = '';
    if (match[1]) formatted += match[1];
    if (match[2]) formatted += '-' + match[2];
    if (match[3]) formatted += '-' + match[3];

    return formatted;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      const response = await axios.post(`${baseUrl}/createCustomer`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        Toast.show({
          text1: response?.data?.message,
          visibilityTime: 3000,
          position: 'top',
        });
        setAddCustomerModalVisible(false);
        fetchCustomers(admin_id, role, token, setCustomers, baseUrl);
        setForm({
          company_name: '',
          fname: '',
          lname: '',
          email: '',
          mobile: '',
          address1: '',
          address2: '',
          city: '',
          state: '',
          extension: '',
          zip_code: '',
          admin_id: loginData?.adminId,
          role: loginData?.role,
        });
        setErrors({});
      }
      if (response.data?.errors) {
        Toast.show({
          text1: response?.data?.errors?.email,
          visibilityTime: 3000,
          position: 'top',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error saving customer:', error.response?.data);
    }
  };

  const handleSaveSign = async () => {
    try {
      const response = await axios.post(`${baseUrl}/createSign`, addSignForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        setSavedSign(response.data);
        setIsSignCreated(true);
        getUnassociatedSigns(userId, token, setUnassociatedSign, baseUrl);
      }
    } catch (error) {
      console.error('Error creating project:', error.response?.data);
    }
  };

  const handleUpdateCustomer = async () => {
    try {
      const updateCustomerData = {
        ...selectedCustomer,
        customer_id: selectedCustomer?.id,
        fname: selectedCustomer?.first_name,
        lname: selectedCustomer?.last_name,
      };
      const response = await axios.post(
        `${baseUrl}/updateCustomer`,
        updateCustomerData,
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
      }
      setEditCustomerModalVisible(false);
      fetchCustomers(admin_id, role, token, setCustomers, baseUrl);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const updateSignStats = async () => {
    try {
      const customer = customers?.find(
        data => data.id === EditSignForm?.teamId,
      );
      const updatedData = {
        ...EditSignForm,
        name: EditSignForm?.alias_name,
        sign_id: EditSignForm?.signTableId,
      };
      updatedData.projectId = 0;
      updatedData.admin_id = admin_id;
      updatedData.customer_id = customer?.id;
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
        if (apiEndpointsToSetSigns === 'updateName') {
          sendUpdateNameMail({
            token,
            signTableId: EditSignForm?.signTableId,
            name: EditSignForm?.alias_name,
            alias_name: response.data?.alias_name,
          });
        }
        if (apiEndpointsToSetSigns === 'changeSignType') {
          sendChangeTypeUpdateMail({
            token,
            signTableId: EditSignForm?.signTableId,
            alias_name: EditSignForm?.alias_name,
            signId: EditSignForm?.signId,
            optionId: EditSignForm?.optionId,
          });
        }
        // if (apiEndpointsToSetSigns === 'changeCustomer') {
        //   sendChangeTypeUpdateMail({
        //     token,
        //     signTableId: EditSignForm?.signTableId,
        //     alias_name: EditSignForm?.alias_name,
        //     signId: EditSignForm?.signId,
        //     optionId: EditSignForm?.optionId,
        //   });
        // }
        setSavedSign(null);
        setIsEditSignModalVisible(false);
        setSelectedSignToEdit(null);
        getUnassociatedSigns(userId, token, setUnassociatedSign, baseUrl);
        setIsAssigned(false);
        setIsAliasChanged(false);
        setSignIdChanged(false);
        setCustomerChanged(false);
        setSelectedCustomer(null);
        setEditSignForm({
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
      }
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };
  useEffect(() => {
    fetchCustomers(admin_id, role, token, setCustomers, baseUrl);

    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const [signData, setSignData] = useState([]);
  useEffect(() => {
    let location = addSignForm?.signLocation || EditSignForm?.signLocation;

    if (location === 'Outdoor') {
      setSignId(2);
    } else if (location === 'Indoor') {
      setSignId(1);
    } else {
      setSignData([]);
      return;
    }
    const fetchSignsData = async () => {
      const id = location === 'Outdoor' ? 2 : 1;
      await fetchSigns(id, token, setSignData, baseUrl);
    };
    fetchSignsData();
  }, [addSignForm?.signLocation, EditSignForm?.signLocation]);

  const fetchLocationDetails = async pincode => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${pincode}.json?access_token=${apiTTocken}=postcode&limit=1`,
      );
      const stateData = response.data?.features[0]?.context?.filter(data =>
        data?.id.includes('region'),
      )[0];
      const cityData = response.data?.features[0]?.context?.filter(data =>
        data?.id.includes('district'),
      )[0];
      if (stateData && cityData) {
        setForm(prev => ({
          ...prev,
          city: cityData?.text,
          state: stateData?.text,
        }));
      }
    } catch (error) {
      console.warn('Failed to fetch location details:', error);
    }
  };
  const handleInput = (key, value) => {
    setForm(prev => ({...prev, [key]: value}));
    setErrors(prev => ({...prev, [key]: ''}));

    if (key === 'zip_code') {
      if (/^[1-9][0-9]{5}$/.test(value)) {
        fetchLocationDetails(value);
      } else {
        setForm(prev => ({
          ...prev,
          city: '',
          state: '',
        }));
        setErrors(prev => ({
          ...prev,
          zip_code: 'Enter a valid 6-digit pincode',
        }));
      }
    }
  };

  useEffect(() => {
    getUnassociatedSigns(userId, token, setUnassociatedSign, baseUrl);
  }, []);
  const handleEditInput = (field, value) => {
    setSelectedCustomer(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const actions = ['change sign name', 'change sign type', 'add customer'];

  useEffect(() => {
    if (selectedSignToEdit === 'change sign name') {
      setApiEndpointsToSetSigns('updateName');
      return;
    } else if (selectedSignToEdit === 'change sign type') {
      setApiEndpointsToSetSigns('changeSignType');
      return;
    } else if (selectedSignToEdit === 'add customer') {
      setApiEndpointsToSetSigns('changeCustomer');
      return;
    }
  }, [selectedSignToEdit]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo width={150} height={36} />
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() =>
              fetchCustomers(admin_id, role, token, setCustomers, baseUrl)
            }>
            <Refresh width={36} height={36} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Menu width={36} height={36} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{padding: 24, paddingTop: 0}}>
        <Text style={styles.title}>Manage</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.greenBtn}
            onPress={() => setAddCustomerModalVisible(true)}>
            <Text style={styles.btnText}>Add customer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.blueBtn}
            onPress={() => {
              setAddSignModalVisible(true);
              setIsSignCreated(false);
              setAddSignForm({
                signType: '',
                alias_name: '',
                signLocation: '',
                projectId: 0,
                userId: loginData?.userId,
                role: loginData?.role,
              });
            }}>
            <Text style={styles.btnText}>Add Sign</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={[]}
          ListHeaderComponent={() => (
            <View style={{paddingBottom: 180}}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={customers}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.customerItem}
                    onPress={() =>
                      navigation.navigate('AddProject', {data: item})
                    }>
                    <View style={styles.customerLeft}>
                      <FontAwesome5
                        name="arrow-circle-right"
                        size={20}
                        color="#0891B2"
                        style={{marginRight: 12}}
                      />
                      <Text style={styles.customerText}>
                        {item?.company_name || item.name}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={{
                        borderRadius: '50%',
                        borderWidth: 1,
                        borderColor: '#22C55E',
                        padding: 2,
                      }}
                      onPress={() => {
                        setSelectedCustomer(item);
                        setEditCustomerModalVisible(true);
                      }}>
                      <Feather name="zap" size={16} color="#22C55E" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
                contentContainerStyle={{paddingBottom: 20}}
              />

              <View style={styles.unassociatedBox}>
                <View style={styles.unassociatedHeader}>
                  <Text style={styles.unassociatedHeaderText}>
                    Unassociated signs
                  </Text>
                </View>
                <View style={styles.noSignBox}>
                  {unassociatedSigns?.length > 0 ? (
                    unassociatedSigns.map((data, index) => (
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
            </View>
          )}
        />
      </View>

      {/* Add Customer Modal */}
      <Modal
        visible={addCustomerModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddCustomerModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add new customer</Text>
              <TouchableOpacity
                onPress={() => setAddCustomerModalVisible(false)}>
                <Menu width={26} height={26} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalBody}>
              <TextInput
                placeholderTextColor={errors.company_name ? 'red' : '#999'}
                style={[styles.input, errors.company_name && styles.errorInput]}
                placeholder="Company name"
                onChangeText={text => handleInput('company_name', text)}
              />
              <View style={styles.row}>
                <TextInput
                  placeholder="First name"
                  placeholderTextColor={errors.fname ? 'red' : '#999'}
                  style={[
                    styles.input,
                    styles.half,
                    errors.fname && styles.errorInput,
                  ]}
                  onChangeText={text => handleInput('fname', text)}
                />
                <TextInput
                  placeholder="Last name"
                  placeholderTextColor={errors.lname ? 'red' : '#999'}
                  style={[
                    styles.input,
                    styles.half,
                    errors.lname && styles.errorInput,
                  ]}
                  onChangeText={text => handleInput('lname', text)}
                />
              </View>
              <TextInput
                placeholder="Email address"
                placeholderTextColor={errors.email ? 'red' : '#999'}
                style={[styles.input, errors.email && styles.errorInput]}
                onChangeText={text => handleInput('email', text)}
              />
              <View style={styles.row}>
                <TextInput
                  placeholder="Phone number"
                  style={[
                    styles.input,
                    styles.twoThird,
                    errors.mobile && styles.errorInput,
                  ]}
                  placeholderTextColor={errors.mobile ? 'red' : '#999'}
                  keyboardType="numeric"
                  value={form?.mobile}
                  maxLength={12}
                  onChangeText={text => {
                    const formatted = formatPhoneNumber(text);
                    handleInput('mobile', formatted);
                  }}
                />
                <TextInput
                  placeholder="Ext"
                  style={[styles.input, styles.oneThird]}
                  onChangeText={text => handleInput('extension', text)}
                />
              </View>
              <View style={styles.row}>
                <TextInput
                  placeholder="Address 1"
                  placeholderTextColor={errors.address1 ? 'red' : '#999'}
                  style={[
                    styles.input,
                    styles.half,
                    errors.address1 && styles.errorInput,
                  ]}
                  onChangeText={text => handleInput('address1', text)}
                />
                <TextInput
                  placeholder="Address 2"
                  style={[styles.input, styles.half]}
                  onChangeText={text => handleInput('address2', text)}
                />
              </View>
              <View style={styles.row}>
                <TextInput
                  placeholder="Zip code"
                  placeholderTextColor={errors.zip_code ? 'red' : '#999'}
                  style={[
                    styles.input,
                    styles.half,
                    errors.zip_code && styles.errorInput,
                  ]}
                  onChangeText={text => handleInput('zip_code', text)}
                />
                <TextInput
                  placeholder="City"
                  placeholderTextColor={errors.city ? 'red' : '#999'}
                  value={form?.city}
                  style={[
                    styles.input,
                    styles.half,
                    errors.city && styles.errorInput,
                  ]}
                  onChangeText={text => handleInput('city', text)}
                />
              </View>
              <TextInput
                placeholder="State"
                value={form?.state}
                placeholderTextColor={errors.state ? 'red' : '#999'}
                style={[styles.input, errors.state && styles.errorInput]}
                onChangeText={text => handleInput('state', text)}
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Sign Modal */}
      <Modal
        visible={addSignModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddSignModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add sign</Text>
              <TouchableOpacity onPress={() => setAddSignModalVisible(false)}>
                <Menu width={26} height={26} />
              </TouchableOpacity>
            </View>

            {!isSignCreated ? (
              <ScrollView contentContainerStyle={styles.modalBody}>
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
                      value={addSignForm?.alias_name}
                      onChangeText={text => {
                        setAddSignForm(prev => ({
                          ...prev,
                          alias_name: text,
                        }));
                      }}
                      style={styles.input}
                      placeholder="Enter sign name"
                    />
                  </View>
                )}

                <TouchableOpacity
                  disabled={addSignForm?.signLocation === ''}
                  style={[
                    styles.saveBtn,
                    addSignForm?.signLocation === '' && styles.disabledButton,
                  ]}
                  onPress={handleSaveSign}>
                  <Text style={styles.btnText}>Save Sign</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <View
                style={{padding: 10, backgroundColor: '#fff', borderRadius: 8}}>
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, {color: '#80BFFF'}]}>
                      New sign added!
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.item}>
                    <Icon3
                      name="assignment"
                      size={20}
                      color="#e67e22"
                      style={styles.itemIcon}
                    />
                    <Text style={styles.itemText}>
                      {addSignForm?.alias_name}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.divider} />
                <View style={[styles.section, {borderColor: '#22C55E'}]}>
                  <View style={[styles.sectionHeader, {padding: 8}]}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <FontAwesome5
                        name="arrow-circle-right"
                        size={20}
                        color="#22C55E"
                        style={{marginRight: 8}}
                      />
                      <Text style={styles.sectionTitle}>Sign actions</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setEditSignForm(prev => {
                          return {
                            ...prev,
                            alias_name: addSignForm?.alias_name,
                            signType: addSignForm?.signType,
                            signLocation: addSignForm?.signLocation,
                            projectId: addSignForm?.projectId,
                            signTableId: savedSign?.signTableId,
                          };
                        });
                        setAddSignModalVisible(false);
                        setIsEditSignModalVisible(true);
                      }}>
                      <Feather name="zap" size={16} color="#22C55E" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.section, {borderWidth: 0}]}>
                  <Text style={styles.label}>Indoor or Outdoor</Text>
                  <View style={[styles.pickerContainer]}>
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
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={editCustomerModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditCustomerModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Customer</Text>
              <TouchableOpacity
                onPress={() => setEditCustomerModalVisible(false)}>
                <Menu width={26} height={26} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalBody}>
              <TextInput
                placeholder="Company name"
                style={styles.input}
                value={selectedCustomer?.company_name}
                onChangeText={text => handleEditInput('company_name', text)}
              />
              <View style={styles.row}>
                <TextInput
                  placeholder="First name"
                  style={[styles.input, styles.half]}
                  value={selectedCustomer?.first_name}
                  onChangeText={text => handleEditInput('fname', text)}
                />
                <TextInput
                  placeholder="Last name"
                  style={[styles.input, styles.half]}
                  value={selectedCustomer?.last_name}
                  onChangeText={text => handleEditInput('lname', text)}
                />
              </View>
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={selectedCustomer?.email}
                onChangeText={text => handleEditInput('email', text)}
              />
              <View style={styles.row}>
                <TextInput
                  placeholder="Phone number"
                  style={[styles.input, styles.twoThird]}
                  value={selectedCustomer?.mobile}
                  onChangeText={text => handleEditInput('mobile', text)}
                />
                <TextInput
                  placeholder="Ext"
                  style={[styles.input, styles.oneThird]}
                  value={selectedCustomer?.extension}
                  onChangeText={text => handleEditInput('extension', text)}
                />
              </View>
              <View style={styles.row}>
                <TextInput
                  placeholder="Address 1"
                  style={[styles.input, styles.half]}
                  value={selectedCustomer?.address1}
                  onChangeText={text => handleEditInput('address1', text)}
                />
                <TextInput
                  placeholder="Address 2"
                  style={[styles.input, styles.half]}
                  value={selectedCustomer?.address2}
                  onChangeText={text => handleEditInput('address2', text)}
                />
              </View>
              <View style={styles.row}>
                <TextInput
                  placeholder="Zip code"
                  style={[styles.input, styles.half]}
                  value={selectedCustomer?.zip_code}
                  onChangeText={text => handleEditInput('zip_code', text)}
                />
                <TextInput
                  placeholder="City"
                  style={[styles.input, styles.half]}
                  value={selectedCustomer?.city}
                  onChangeText={text => handleEditInput('city', text)}
                />
              </View>
              <TextInput
                placeholder="State"
                style={styles.input}
                value={selectedCustomer?.state}
                onChangeText={text => handleEditInput('state', text)}
              />
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleUpdateCustomer}>
                <Text style={styles.btnText}>Update</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isEditSignModalVisible}
        animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, {paddingBottom: 20}]}>
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
            {/* <Text>{EditSignForm?.alias_name}</Text> */}
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
              <View style={styles.modalBody}>
                <View style={styles.subHeader}>
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
                    styles.saveBtn,
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
                          setSignIdChanged(true);
                          setEditSignForm(prev => ({
                            ...prev,
                            signLocation: value,
                          }));
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
                          styles.saveBtn,
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
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </View>
            )}
            {selectedSignToEdit === 'add customer' && (
              <View
                style={{backgroundColor: '#fff', borderRadius: 8, padding: 10}}>
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
                    <Picker.Item label="Select Customer" value={null} />
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
                    styles.saveBtn,
                    (EditSignForm?.alias_name?.trim() === '' ||
                      !customerChanged) &&
                      styles.disabledButton,
                  ]}
                  disabled={
                    EditSignForm?.alias_name?.trim() === '' || !customerChanged
                  }
                  onPress={() => {
                    updateSignStats();
                    setCustomerChanged(false);
                  }}>
                  <Text style={styles.saveButtonText}>
                    Add sign to customer
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 30,
  },
  logoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3F4455',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  greenBtn: {
    backgroundColor: '#22C55E',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  blueBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  customerItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerText: {
    fontSize: 16,
    color: '#334155',
  },
  unassociatedBox: {
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  unassociatedHeader: {
    backgroundColor: '#64748B',
    padding: 10,
  },
  unassociatedHeaderText: {
    color: '#fff',
    fontWeight: '500',
  },
  noSignBox: {
    backgroundColor: '#fff',
    padding: 10,
    gap: 15,
  },
  noSignText: {
    color: '#EF4444',
    fontWeight: '500',
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  modalBody: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderRadius: 6,
    padding: 10,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#1E293B',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  twoThird: {
    flex: 2,
    marginRight: 8,
  },
  oneThird: {
    flex: 1,
  },
  saveBtn: {
    backgroundColor: '#22C55E',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#1E293B',
  },
  customerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    padding: 10,
    borderColor: '#CBD5E1',
    borderRadius: 6,
  },
  noSignFound: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  section: {
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#80BFFF',
    padding: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
  },
  item: {
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#34495e',
  },
  divider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 4,
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
    padding: 10,
    borderRadius: 8,
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
    marginTop: 15,
    backgroundColor: '#F6F6F6',
    padding: 10,
    borderRadius: 10,
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
  errorInput: {
    borderColor: 'red',
  },
});

export default Manage;
