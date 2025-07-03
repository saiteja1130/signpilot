import {useRoute} from '@react-navigation/native';
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import Logo from '../../assets/images/app logo.svg';
import Refresh from '../../assets/images/cloud.svg';
import Menu from '../../assets/images/close.svg';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  fetchCustomers,
  fetchSigns,
  getTeams,
  getUnassociatedCustomerSigns,
  sendProjectChange,
} from '../Functions/functions';
import ProgressBar from '../Components/Progressbar';

const AddProject = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addSignModalVisible, setAddSignModalVisible] = useState(false);
  const [sameAsCustomer, setSameAsCustomer] = useState(false);
  const [signId, setSignId] = useState(0);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const [isAliasChanged, setIsAliasChanged] = useState(false);
  const [isSignIdChanged, setSignIdChanged] = useState(false);
  const [customerChanged, setCustomerChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSelectCustomer, setIsSelectCustomer] = useState(false);

  const [projects, setProjects] = useState([]);
  const [selectedSignToEdit, setSelectedSignToEdit] = useState(null);
  const [isEditSignModalVisible, setIsEditSignModalVisible] = useState(false);
  const [signData, setSignData] = useState([]);
  const [unassociatedSigns, setUnassociatedSign] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiEndpointsToSetSigns, setApiEndpointsToSetSigns] = useState('');
  const [teams, setTeams] = useState([]);

  const loginData = useSelector(state => state.login.value);
  const token = loginData?.tokenNumber;
  const admin_id = loginData?.adminId;
  const role = loginData?.role;
  const userId = loginData?.userId;

  const route = useRoute();
  const customerData = route.params?.data;
  const customer_id = route.params?.data?.id || '';

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
  const fetchLocationDetails = async pincode => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${pincode}.json?access_token=${yourMapboxToken}&types=postcode&limit=1`,
      );

      const context = response.data?.features[0]?.context || [];
      const cityData = context.find(item => item.id.includes('place'));
      const stateData = context.find(item => item.id.includes('region'));

      if (cityData && stateData) {
        setProjectAssignData(prev => ({
          ...prev,
          city: cityData.text,
          state: stateData.text,
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch location:', err);
    }
  };

  const [projectAssignData, setProjectAssignData] = useState({
    project_id: '',
    admin_id: admin_id,
    customer_id: customer_id,
    role: role,
    project_name: '',
    mobile: '',
    mis: '',
    lname: '',
    fname: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    extension: '',
    zip_code: '',
  });

  const handleInputChange = (field, value) => {
    if (
      sameAsCustomer &&
      [
        'fname',
        'lname',
        'email',
        'address1',
        'address2',
        'city',
        'state',
        'extension',
        'zip_code',
        'mobile',
        'mis',
      ].includes(field)
    ) {
      return;
    }
    setProjectAssignData(prev => ({...prev, [field]: value}));
    if (field === 'zip_code') {
      if (/^[1-9][0-9]{5}$/.test(value)) {
        fetchLocationDetails(value);
      } else {
        setProjectAssignData(prev => ({...prev, city: '', state: ''}));
      }
    }
  };

  const getCustomersAllProjects = async () => {
    try {
      const response = await axios.get(
        `https://www.beeberg.com/api/${customer_id}/getCustomerProjects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  const validateFields = () => {
    const requiredFields = [
      'project_name',
      'mobile',
      'fname',
      'lname',
      'email',
      'address1',
      'city',
      'state',
      'zip_code',
    ];

    let newErrors = {};
    requiredFields.forEach(field => {
      if (!projectAssignData[field]?.trim()) {
        newErrors[field] = `Please enter ${field.replace('_', ' ')}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProject = async () => {
    if (!validateFields()) return;

    try {
      const response = await axios.post(
        'https://www.beeberg.com/api/createProject',
        projectAssignData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status) {
        Toast.show({
          text1: response.data.message,
          visibilityTime: 3000,
          position: 'top',
        });
        setModalVisible(false);
        getCustomersAllProjects();
      }
    } catch (error) {
      console.error('Error creating project:', error.response?.data);
    }
  };

  const handleUpdateProject = async () => {
    try {
      const updateData = {
        ...projectAssignData,
        project_id: projectAssignData?.id,
      };
      const response = await axios.post(
        'https://www.beeberg.com/api/updateProject',
        projectAssignData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status) {
        Toast.show({
          text1: response.data.message,
          visibilityTime: 3000,
          position: 'top',
        });
        getCustomersAllProjects();
        setUpdateModalVisible(false);
      }
    } catch (error) {
      console.error('Error creating project:', error.response?.data);
    }
  };

  const handleSaveSign = async () => {
    try {
      const data = {...addSignForm};
      const resonse = await axios.post(
        `https://www.beeberg.com/api/createSign`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const signTableId = resonse.data?.signTableId;
      if (signTableId) {
        const updatedData = {
          ...EditSignForm,
          name: EditSignForm?.alias_name,
        };
        updatedData.projectId = 0;
        updatedData.admin_id = admin_id;
        updatedData.customer_id = customerData?.id;
        updatedData.sign_id = signTableId;
        const response = await axios.post(
          `https://www.beeberg.com/api/changeCustomer`,
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
        }
      }

      setAddSignModalVisible(false);
      getUnassociatedCustomerSigns(customer_id, token, setUnassociatedSign);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
    }
  };

  const handleSameAsCustomerToggle = isChecked => {
    setSameAsCustomer(isChecked);
    if (!isChecked) {
      setProjectAssignData(prev => ({
        ...prev,
        fname: '',
        lname: '',
        email: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        extension: '',
        zip_code: '',
        mobile: '',
      }));
    } else {
      if (customerData) {
        setProjectAssignData(prev => ({
          ...prev,
          fname: customerData.first_name || '',
          lname: customerData.last_name || '',
          email: customerData.email || '',
          address1: customerData.address1 || '',
          address2: customerData.address2 || '',
          city: customerData.city || '',
          state: customerData.state || '',
          extension: customerData.extension || '',
          zip_code: customerData.zip_code || '',
          mobile: customerData?.mobile || '',
        }));
      }
    }
  };

  const updateSignStats = async () => {
    try {
      const customer = customers?.find(
        data => data.id === EditSignForm?.teamId,
      );
      const self = teams?.find(data => data.id === userId);
      const others = teams?.find(data => data.id === EditSignForm?.teamId);
      const project = projects.find(data => data.id === EditSignForm?.teamId);
      const updatedData = {
        ...EditSignForm,
        name: EditSignForm?.alias_name,
        sign_id: EditSignForm?.signTableId,
        project_id: project ? project?.id : 0,
        projectId: project ? project?.id : 0,
      };
      updatedData.admin_id = admin_id;
      updatedData.customer_id = customer?.id;
      if (isAssigned) {
        updatedData.assign_to = self?.role;
        updatedData.teamId = self?.id;
      } else {
        updatedData.assign_to = others?.role;
        updatedData.teamId = others?.id;
      }
      const response = await axios.post(
        `https://www.beeberg.com/api/${apiEndpointsToSetSigns}`,
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
        if (apiEndpointsToSetSigns === 'changeProject') {
          sendProjectChange({
            token,
            project_id: project ? project?.id : 0,
            sign_id: EditSignForm?.signId,
            oldProjectName: '',
            oldProject_id: 0,
          });
        }
        setIsEditSignModalVisible(false);
        setSelectedSignToEdit(null);
        getUnassociatedCustomerSigns(customer_id, token, setUnassociatedSign);
        setIsAssigned(false);
        setIsAliasChanged(false);
        setSignIdChanged(false);
        setCustomerChanged(false);
      }
    } catch (error) {
      console.log('Axios Error:', error.response?.data);
    }
  };

  const onAssign = () => {
    setIsAssigned(prev => !prev);
  };
  const actions = [
    'change sign name',
    'change sign type',
    'Change customer',
    'assign to project',
    'assign to self',
    'assign to surveyor',
  ];
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
      await fetchSigns(id, token, setSignData);
    };
    fetchSignsData();
  }, [addSignForm?.signLocation, EditSignForm?.signLocation]);
  useEffect(() => {
    getUnassociatedCustomerSigns(customer_id, token, setUnassociatedSign);
    fetchCustomers(admin_id, role, token, setCustomers);
    getTeams(admin_id, role, token, setTeams);
  }, []);

  useEffect(() => {
    getCustomersAllProjects();
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (sameAsCustomer && customerData) {
      setProjectAssignData(prev => ({
        ...prev,
        fname: customerData.first_name || '',
        lname: customerData.last_name || '',
        email: customerData.email || '',
        address1: customerData.address1 || '',
        address2: customerData.address2 || '',
        city: customerData.city || '',
        state: customerData.state || '',
        extension: customerData.extension || '',
        zip_code: customerData.zip_code || '',
        mobile: customerData?.mobile || '',
      }));
    }
    setErrors({});
  }, [sameAsCustomer, customerData]);
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ProgressBar duration={1000} />
      </View>
    );
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo width={150} height={36} />
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => getCustomersProject()}>
            <Refresh width={36} height={36} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Menu width={36} height={36} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.tabContainer}>
            <Text style={styles.tabTextActive}>Manage</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.addProjectBtn}
              onPress={() => {
                setSameAsCustomer(false);
                setProjectAssignData({
                  admin_id: admin_id,
                  customer_id: customer_id,
                  role: role,
                  project_name: '',
                  mobile: '',
                  mis: '',
                  lname: '',
                  fname: '',
                  email: '',
                  address1: '',
                  address2: '',
                  city: '',
                  state: '',
                  extension: '',
                  zip_code: '',
                });
                setModalVisible(true);
              }}>
              <Text style={styles.btnText}>Add project</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addSignBtn}
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
              <Text style={styles.btnText}>Add Sign</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.customerInfoContainer}>
            <Text style={styles.customerName}>
              {customerData?.company_name || 'No customer name'}
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.collapseIcon}>–</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.projectsContainer}>
            <View>
              <Text>Projects</Text>
            </View>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.projectItem}
                  onPress={() =>
                    navigation.navigate('CustomerProjectScreen', {
                      customerData,
                      project,
                      projects,
                      customers,
                      teams,
                    })
                  }>
                  <Text style={styles.projectName}>{project.project_name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setProjectAssignData({
                        project_id: project?.id,
                        project_name: project.project_name,
                        mis: project?.MIS,
                        fname: project.first_name,
                        lname: project.last_name,
                        email: project.email,
                        mobile: project.mobile,
                        address1: project.address1,
                        address2: project.address2,
                        city: project.city,
                        state: project.state,
                        extension: project.extension,
                        zip_code: project.zip_code,
                        admin_id: admin_id,
                        customer_id: customer_id,
                        role: role,
                      });
                      setUpdateModalVisible(true);
                    }}>
                    <Feather name="zap" size={20} color="#3B82F6" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No projects found</Text>
            )}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>
              Customer-associated signs
            </Text>
          </View>

          <View style={styles.signsContainer}>
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
      </ScrollView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setSameAsCustomer(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add new project</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Menu width={26} height={26} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formContainer}>
              <View style={styles.checkboxRow}>
                <TouchableOpacity
                  onPress={() => handleSameAsCustomerToggle(!sameAsCustomer)}
                  style={[
                    styles.checkboxBox,
                    sameAsCustomer && styles.checkboxChecked,
                  ]}>
                  {sameAsCustomer && <View style={styles.innerCheck} />}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Same as Customer</Text>
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Project name"
                  placeholderTextColor={errors.project_name ? 'red' : '#999'}
                  style={[
                    styles.input,
                    errors.project_name && {borderColor: 'red', borderWidth: 1},
                  ]}
                  value={projectAssignData.project_name}
                  onChangeText={text => handleInputChange('project_name', text)}
                />
                <TextInput
                  placeholder="MIS#"
                  style={styles.input}
                  value={
                    sameAsCustomer ? customerData?.mis : projectAssignData.mis
                  }
                  onChangeText={text => handleInputChange('mis', text)}
                />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="First name"
                  placeholderTextColor={errors.fname ? 'red' : '#999'}
                  style={[styles.input, errors.fname && styles.errorBorder]}
                  value={
                    sameAsCustomer
                      ? customerData?.first_name
                      : projectAssignData.fname
                  }
                  onChangeText={text => handleInputChange('fname', text)}
                />
                <TextInput
                  placeholder="Last name"
                  placeholderTextColor={errors.lname ? 'red' : '#999'}
                  style={[styles.input, errors.lname && styles.errorBorder]}
                  value={
                    sameAsCustomer
                      ? customerData?.last_name
                      : projectAssignData.lname
                  }
                  onChangeText={text => handleInputChange('lname', text)}
                />
              </View>

              <TextInput
                placeholder="Email address"
                placeholderTextColor={errors.email ? 'red' : '#999'}
                style={[
                  styles.input,
                  errors.email && styles.errorBorder,
                  {marginBottom: 5},
                ]}
                value={
                  sameAsCustomer ? customerData?.email : projectAssignData.email
                }
                onChangeText={text => handleInputChange('email', text)}
              />

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Phone number"
                  placeholderTextColor={errors.mobile ? 'red' : '#999'}
                  style={[styles.input, errors.mobile && styles.errorBorder]}
                  value={
                    sameAsCustomer
                      ? customerData?.mobile
                      : projectAssignData.mobile
                  }
                  onChangeText={text => handleInputChange('mobile', text)}
                />
                <TextInput
                  placeholder="Ext"
                  style={styles.input}
                  value={
                    sameAsCustomer
                      ? customerData?.extension || ''
                      : projectAssignData.extension || ''
                  }
                  editable={!sameAsCustomer}
                  onChangeText={text => handleInputChange('extension', text)}
                />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Address 1"
                  placeholderTextColor={errors.address1 ? 'red' : '#999'}
                  style={[styles.input, errors.address1 && styles.errorBorder]}
                  value={
                    sameAsCustomer
                      ? customerData?.address1
                      : projectAssignData.address1
                  }
                  onChangeText={text => handleInputChange('address1', text)}
                />
                <TextInput
                  placeholder="Address 2"
                  placeholderTextColor={errors.zip_code ? 'red' : '#999'}
                  style={[styles.input, errors.zip_code && styles.errorBorder]}
                  value={
                    sameAsCustomer
                      ? customerData?.address2
                      : projectAssignData.address2
                  }
                  onChangeText={text => handleInputChange('address2', text)}
                />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Zip code"
                  placeholderTextColor={errors.zip_code ? 'red' : '#999'}
                  style={[styles.input, errors.zip_code && styles.errorBorder]}
                  value={
                    sameAsCustomer
                      ? customerData?.zip_code
                      : projectAssignData.zip_code
                  }
                  onChangeText={text => handleInputChange('zip_code', text)}
                />
                <TextInput
                  placeholder="City"
                  placeholderTextColor={errors.city ? 'red' : '#999'}
                  style={[styles.input, errors.city && styles.errorBorder]}
                  value={
                    sameAsCustomer ? customerData?.city : projectAssignData.city
                  }
                  onChangeText={text => handleInputChange('city', text)}
                />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="State"
                  placeholderTextColor={errors.state ? 'red' : '#999'}
                  style={[styles.input, errors.state && styles.errorBorder]}
                  value={
                    sameAsCustomer
                      ? customerData?.state
                      : projectAssignData.state
                  }
                  onChangeText={text => handleInputChange('state', text)}
                />
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveProject}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
                style={[
                  styles.saveBtn,
                  addSignForm?.alias_name === '' && styles.disabledButton,
                ]}
                disabled={addSignForm?.alias_name === ''}
                onPress={handleSaveSign}>
                <Text style={styles.btnText}>Save Sign</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={updateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setUpdateModalVisible(false);
          setSameAsCustomer(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update project</Text>
              <TouchableOpacity onPress={() => setUpdateModalVisible(false)}>
                <Menu width={26} height={26} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.formContainer}>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Project name"
                  style={styles.input}
                  value={projectAssignData.project_name}
                  onChangeText={text => handleInputChange('project_name', text)}
                />
                <TextInput
                  placeholder="MIS#"
                  style={styles.input}
                  value={projectAssignData.mis}
                  onChangeText={text => handleInputChange('mis', text)}
                />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="First name"
                  style={styles.input}
                  value={projectAssignData.fname}
                  onChangeText={text => handleInputChange('fname', text)}
                />
                <TextInput
                  placeholder="Last name"
                  style={styles.input}
                  value={projectAssignData.lname}
                  onChangeText={text => handleInputChange('lname', text)}
                />
              </View>

              <TextInput
                placeholder="Email address"
                style={styles.fullInput}
                value={projectAssignData.email}
                onChangeText={text => handleInputChange('email', text)}
              />

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Phone number"
                  style={styles.input}
                  value={projectAssignData.mobile}
                  onChangeText={text => handleInputChange('mobile', text)}
                />
                <TextInput
                  placeholder="Ext"
                  style={styles.input}
                  value={projectAssignData.extension}
                  onChangeText={text => handleInputChange('extension', text)}
                />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Address 1"
                  style={styles.input}
                  value={projectAssignData.address1}
                  onChangeText={text => handleInputChange('address1', text)}
                />
                <TextInput
                  placeholder="Address 2"
                  style={styles.input}
                  value={projectAssignData.address2}
                  onChangeText={text => handleInputChange('address2', text)}
                />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Zip code"
                  style={styles.input}
                  value={projectAssignData.zip_code}
                  onChangeText={text => handleInputChange('zip_code', text)}
                />
                <TextInput
                  placeholder="City"
                  style={styles.input}
                  value={projectAssignData.city}
                  onChangeText={text => handleInputChange('city', text)}
                />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="State"
                  style={styles.input}
                  value={projectAssignData.state}
                  onChangeText={text => handleInputChange('state', text)}
                />
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleUpdateProject}>
                  <Text style={styles.saveText}>Update</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
                  <Text style={styles.subHeaderText}>{selectedSignToEdit}</Text>
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
                  value={EditSignForm.alias_name}
                  onChangeText={text => {
                    setIsAliasChanged(true);
                    setEditSignForm(prev => ({...prev, alias_name: text}));
                  }}
                />
                <TouchableOpacity
                  style={[
                    styles.button,
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
            {selectedSignToEdit === 'Change customer' && (
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
            {selectedSignToEdit === 'assign to project' && (
              <View
                style={{backgroundColor: '#fff', borderRadius: 8, padding: 10}}>
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
                    styles.saveBtn,
                    (EditSignForm?.teamId?.trim() === '' || !customerChanged) &&
                      styles.disabledButton,
                  ]}
                  disabled={
                    EditSignForm?.teamId?.trim() === '' || !customerChanged
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
                    style={[styles.filledButton, isAssigned && styles.saveBtn]}
                    disabled={!isAssigned}
                    onPress={() => (isAssigned ? updateSignStats() : null)}>
                    <Text
                      style={[
                        styles.filledText,
                        {color: isAssigned ? 'white' : 'black'},
                      ]}>
                      Assign to self
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {selectedSignToEdit === 'assign to surveyor' && (
              <View
                style={{backgroundColor: '#fff', borderRadius: 8, padding: 10}}>
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
                      setIsSelectCustomer(true);
                    }}
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
                  style={[styles.button]}
                  disabled={!isSelectCustomer}
                  onPress={() => updateSignStats()}>
                  <Text style={styles.buttonText}>Add sign to customer</Text>
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
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
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 0,
  },
  tabContainer: {
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#f58220',
  },
  tabTextActive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 16,
  },
  addProjectBtn: {
    backgroundColor: '#f58220',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 120,
  },
  addSignBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 120,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  customerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  customerName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  collapseIcon: {
    fontSize: 24,
    color: '#64748B',
    paddingHorizontal: 8,
  },
  projectsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    minHeight: 100,
    marginBottom: 24,
  },
  errorBorder: {
    borderColor: 'red',
  },
  projectItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  projectName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  projectDetail: {
    fontSize: 13,
    color: '#64748B',
  },
  sectionHeader: {
    backgroundColor: '#E2E8F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  signsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    minHeight: 100,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
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

export default AddProject;
