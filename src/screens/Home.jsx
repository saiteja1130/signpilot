import {
  Alert,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Logo from '../../assets/images/app logo.svg';
import Refresh from '../../assets/images/cloud.svg';
import Menu from '../../assets/images/menu.svg';
import DownArrow from '../../assets/images/arrow.svg';
import Bag from '../../assets/images/bag.svg';
import Mark from '../../assets/images/ui.svg';
import ExistingAuditProject from '../Components/ExistingAuditProject';
import ElectricalAssessment from '../Components/ElectricalAssessment';
import PermittingAssenment from '../Components/PermittingAssenment';
import Outdoor from '../Components/OutDoor';
import Photos from '../Components/Photos';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import {addProject} from '../Redux/Slices/ProjectData';
import {addSignProject} from '../Redux/Slices/SigProject';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {setPhotoState} from '../Redux/Slices/PhotosActive';
import Toast from 'react-native-toast-message';
import {setActiveState} from '../Redux/Slices/Active';
import ProgressBar from '../Components/Progressbar';
import {syncToOnline, useNetworkStatus} from '../Functions/functions';
import NetInfo from '@react-native-community/netinfo';
import {
  clearAllTables,
  createElectricalAuditTable,
  createExistingSignAuditTable,
  createIndoorPhotosAndMeasurementsTable,
  createLocalDB,
  createOfflineImagesTable,
  createOfflineRemoveTable,
  createPermittingAssessmentTable,
  createSignDataOptionsTable,
  createSignGeneralAuditTable,
  dropAllTables,
  dropOfflineRemoveTable,
  fetchAllProjectsData,
  insertElectricalAudit,
  insertExistingSignAudit,
  insertIndoorPhotosAndMeasurements,
  insertPermittingAssessment,
  insertProjectsData,
  insertSignGeneralAudit,
} from '../Db/LocalData';
import {addData} from '../Redux/Slices/Alldata';
import {createUsersTable, dropUsersTable} from '../Db/db';
import {addLoginData} from '../Redux/Slices/LoginData';
import {clearCache, deleteFolders} from '../Functions/FSfunctions';

const Home = () => {
  const baseUrl = useSelector(state => state.baseUrl.value);
  const signProjectData = useSelector(state => state.signProject.value);
  const isConnected = useNetworkStatus();
  const navigation = useNavigation();
  const [selectedProject, setSelectedProject] = '';
  const [selectedSignValue, setSelectedSignValue] = useState('');
  const [signSelected, setSignSelected] = useState('');
  const loginData = useSelector(state => state.login.value);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [signConfirmed, setSignConfirmed] = useState(false);
  const flatListRef = useRef(null);
  const [allData, setAlldata] = useState([]);
  const [projectTitles, SetProjectTitles] = useState([]);
  const [projects, setProjects] = useState();
  const [signTitles, SetSignTitles] = useState([]);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [response, setResponse] = useState(false);

  const fetchData = async (state, previousSignSelected) => {
    console.log('API fetching....');
    try {
      if (isConnected === true) {
        const token = loginData?.tokenNumber;
        const userId = loginData?.userId;
        const role = loginData?.role;

        const response = await axios.get(
          `${baseUrl}/getData/${userId}/${role}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.status) {
          setResponse(response.data.status);
          const data = response.data.projectData;
          dispatch(addData(data));
          console.log('USER PROJECTS DATA:', data);
          await Promise.all([
            insertProjectsData(data),
            insertExistingSignAudit(data, 1),
            insertElectricalAudit(data, 1),
            insertPermittingAssessment(data, 1),
            insertIndoorPhotosAndMeasurements(data),
            insertSignGeneralAudit(data, 1),
          ]);

          setTimeout(() => {
            fetchAllProjectsData(projects => {
              console.log('All projects data loaded from SQLite:', projects);
              setAlldata(projects);
              handleProjectSelection(projects, previousSignSelected, state);
            });
          }, 1200);
        } else {
          setResponse(response.data.status);
          console.log('FALSE RESPONSE:', response.data);
        }
      } else {
        console.log('OFFLINE - USING LOCAL DATABASE');
        fetchAllProjectsData(projects => {
          console.log('Projects from SQLite:', projects);
          if (projects.length > 0) {
            setAlldata(projects);
            handleProjectSelection(projects, previousSignSelected, state);
          } else {
            console.log('No Projects Assigned');
          }
        });
        setResponse(true);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
        return;
      }
    } catch (error) {
      // console.error(
      //   'Fetch failed:',
      //   error?.response?.data?.status === 401,
      //   error?.response?.data?.success === 'fail',
      // );
      if (
        error?.response?.data?.status === 401 ||
        error?.response?.data?.success === 'fail'
      ) {
        dropUsersTable();
        createUsersTable();
        dispatch(addLoginData(null));
        navigation.replace('Login');
      }
      setResponse(false);
    } finally {
      setLoading(false);
      console.log('API fetched....');
    }
  };

  const handleProjectSelection = (data, previousSignSelected, state) => {
    // console.log(previousSignSelected);
    const titles = data.map(item => item.projectTitle);
    SetProjectTitles(titles);
    console.log('data', data[0]);
    let currentProject =
      data.find(item => item.projectTitle === selectedProject) || data[0];
    console.log('currentProject', currentProject.signDataOptions);

    setSelectedProject(currentProject.projectTitle);
    console.log('1111111');
    setProjects(currentProject);
    console.log('222222');
    dispatch(addProject(currentProject));
    console.log('4444444');
    SetSignTitles(currentProject.signDataOptions);
    console.log('55555');

    console.log(
      'currentProject.signDataOptions',
      currentProject.signDataOptions,
    );

    const matchedSign = currentProject.signDataOptions?.find(
      s => s.signId === previousSignSelected?.signId,
    );

    if (matchedSign) {
      setSignConfirmed(true);
      setSignSelected(matchedSign);
      dispatch(addSignProject(matchedSign));
    } else {
      const firstSign = currentProject.signDataOptions?.[0];
      console.log('firstSign', firstSign);
      if (firstSign) {
        setSignConfirmed(true);
        setSignSelected(firstSign);
        dispatch(addSignProject(firstSign));
      }
    }
    dispatch(setPhotoState(state || null));
  };

  const saveSection = async () => {
    const token = loginData?.tokenNumber;
    try {
      const data = {
        Id:
          signSelected?.electrical_audit?.id ||
          signSelected?.existing_sign_audit?.id,
        projectId:
          signSelected?.electrical_audit?.projectId ||
          signSelected?.existing_sign_audit?.projectId,
        signId: signSelected?.signId,
        optionId: signSelected?.optionId,
        teamId: loginData?.userId,
        adminId: loginData?.userId,
        customerName:
          signSelected?.electrical_audit?.customerName ||
          signSelected?.existing_sign_audit?.customerName,
        role: loginData?.role,
        customerName: signSelected?.customerName,
      };
      const response = await axios.post(`${baseUrl}/sendNotification`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        const response = await axios.post(`${baseUrl}/sendmail`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.status) {
          Toast.show({
            text1: 'Send Report Success',
            visibilityTime: 3000,
            position: 'top',
          });
          setSignConfirmed(false);
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 1500);
        }
      }
    } catch (error) {
      console.log(error?.response?.data || error.message);
    }
  };

  const filterdata = item => {
    setSelectedProject(item);
    setSignConfirmed(false);
    const filteredProject = allData.find(data => data.projectTitle === item);
    if (filteredProject) {
      setProjects(filteredProject);
      dispatch(addProject(filteredProject));
      SetSignTitles(filteredProject.signDataOptions);
      const firstSign = filteredProject.signDataOptions?.[0];
      if (firstSign) {
        setSelectedSignValue('');
        dispatch(addSignProject(null));
        dispatch(setActiveState(null));
      }
    } else {
      console.warn('No project found for:', item);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchOnFocus = async () => {
        if (Object.keys(loginData).length > 0 && isConnected !== null) {
          await fetchData();
        }
      };
      const syncingOnline = async () => {
        setLoading(true);
        const netState = await NetInfo.fetch();
        if (netState.isConnected) {
          console.log('SYNCING TO ONLINE');
          await syncToOnline(loginData, baseUrl);
        }
      };
      clearCache();
      syncingOnline();
      setTimeout(() => {
        fetchOnFocus();
      }, 4000);
    }, [loginData, isConnected]),
  );

  useEffect(() => {
    // dropAllTables();
    // dropOfflineRemoveTable();
    clearAllTables();

    createOfflineRemoveTable();
    createOfflineImagesTable();
    createLocalDB();
    createSignDataOptionsTable();
    createExistingSignAuditTable();
    createElectricalAuditTable();
    createPermittingAssessmentTable();
    createIndoorPhotosAndMeasurementsTable();
    createSignGeneralAuditTable();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (isConnected) {
      await deleteFolders();
    }
    await clearCache();
    await new Promise(resolve => {
      fetchData(null, signProjectData);
      setTimeout(resolve, 1000);
    });
    setRefreshing(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 24,
      paddingBottom: 0,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    iconContainer: {
      flexDirection: 'row',
      gap: 30,
    },
    logoContainer: {
      flex: 1,
    },
    dropDowncontainer: {
      backgroundColor: '#D4E9FC',
      borderRadius: 8,
      padding: 8,
      marginBottom: 8,
    },
    label1: {
      fontWeight: '400',
      fontSize: 12,
      marginBottom: 4,
      fontFamily: 'Barlow-Regular',
    },
    dropdown: {
      borderColor: '#FF8C00',
      borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 0,
      paddingHorizontal: 0,
      paddingLeft: 8,
      backgroundColor: '#fff',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dropdownContainer: {
      borderColor: '#FF8C00',
    },
    arrowBox: {
      backgroundColor: '#FF8C00',
      position: 'absolute',
      right: 0,
      height: '100%',
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
    },
    arrowBoxBlue: {
      backgroundColor: '#2B92F0',
      padding: 16,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
    },
    textStyle: {
      color: '#555',
      fontSize: 16,
    },
    labelStyle: {
      marginLeft: 5,
    },
    tabContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 8,
      paddingBottom: 14,
      justifyContent: 'space-between',
    },
    tabActivecontainer: {
      backgroundColor: '#D4E9FC',
      margin: -1,
      padding: 11,
      borderBottomRightRadius: 12,
      borderBottomLeftRadius: 12,
    },
    headerSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    iconWrapper: {
      marginRight: 11,
    },
    branchTitle: {
      color: isActive ? 'black' : 'white',
      fontSize: 18,
      fontWeight: '600',
      fontFamily: 'Barlow-SemiBold',
    },
    detailsSection: {
      marginBottom: 12,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: isActive ? 2.5 : 0,
    },
    label: {
      color: isActive ? 'black' : 'white',
      fontSize: 16,
      fontWeight: '400',
      flex: 1,
      fontFamily: 'Barlow-Regular',
    },
    value: {
      fontFamily: 'Barlow-Regular',
      color: isActive ? 'black' : 'white',
      flex: 2,
      fontSize: 16,
      fontWeight: '400',
    },
    signLabel: {
      marginBottom: 4,
      fontFamily: 'Barlow-Regular',
    },
    picker: {
      flex: 1,
    },
  });

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ProgressBar duration={2000} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo width={150} height={36} />
        </View>
        <View style={styles.iconContainer}>
          {isConnected && (
            <TouchableOpacity onPress={() => handleRefresh()}>
              <Refresh width={36} height={36} />
            </TouchableOpacity>
          )}
          {isConnected && (
            <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
              <Menu width={36} height={36} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {response ? (
        <FlatList
          ref={flatListRef}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          data={[]}
          contentContainerStyle={{paddingBottom: 20}}
          ListHeaderComponent={() => (
            <View>
              <View style={styles.dropDowncontainer}>
                <Text style={styles.label1}>Select project</Text>
                <View style={styles.dropdown}>
                  <Picker
                    style={styles.picker}
                    selectedValue={selectedProject}
                    onValueChange={(itemValue, itemIndex) => {
                      setSelectedProject(itemValue);
                      filterdata(itemValue);
                    }}>
                    {projectTitles?.map((item, index) => (
                      <Picker.Item label={item} value={item} key={index} />
                    ))}
                  </Picker>
                  <View style={styles.arrowBox}>
                    <DownArrow width={16} height={16} />
                  </View>
                </View>
              </View>
              <ImageBackground
                style={styles.tabContainer}
                resizeMode="cover"
                source={
                  isActive
                    ? require('../../assets/images/righttab.png')
                    : require('../../assets/images/lefttab.png')
                }>
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={() => setIsActive(true)}>
                  <Text style={{fontSize: 12, fontFamily: 'Barlow-Regular'}}>
                    Project signs
                  </Text>
                  <Text style={{fontSize: 16, fontFamily: 'Barlow-Regular'}}>
                    Count: {projects?.totalSigns}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={() => setIsActive(false)}>
                  <Text
                    style={{
                      paddingTop: 12,
                      fontSize: 16,
                      fontFamily: 'Barlow-Regular',
                      color: '#fff',
                      textAlign: 'right',
                    }}>
                    Project Info
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
              {isActive ? (
                <View style={styles.tabActivecontainer}>
                  <View style={styles.headerSection}>
                    <View style={styles.iconWrapper}>
                      <Bag width={33} height={33} />
                    </View>
                    <Text style={styles.branchTitle}>{selectedProject}</Text>
                  </View>
                  <View style={styles.detailsSection}>
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>First Name:</Text>
                      <Text style={styles.value}>{projects?.firstName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>Last Name:</Text>
                      <Text style={styles.value}>{projects?.lastName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>Phone:</Text>
                      <Text style={styles.value}>{projects?.mobile}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>Email:</Text>
                      <Text style={styles.value}>{projects?.email}</Text>
                    </View>
                  </View>
                  <Text style={styles.signLabel}>Select Sign</Text>
                  <View style={[styles.dropdown, {borderColor: '#2B92F0'}]}>
                    <Picker
                      style={styles.picker}
                      selectedValue={
                        selectedSignValue || signSelected?.signAliasName
                      }
                      onValueChange={(itemValue, itemIndex) => {
                        setSelectedSignValue(itemValue);
                        const selectedSign = signTitles.find(
                          sign => sign.signAliasName === itemValue,
                        );
                        if (selectedSign) {
                          dispatch(addSignProject(selectedSign));
                          setSignSelected(selectedSign);
                          setSignConfirmed(true);
                        }
                      }}>
                      <Picker.Item label="Select Sign" value={null} />
                      {signTitles?.map((item, index) => (
                        <Picker.Item
                          label={item.signAliasName}
                          value={item.signAliasName}
                          key={index}
                        />
                      ))}
                    </Picker>
                    <View
                      style={[styles.arrowBox, {backgroundColor: '#2B92F0'}]}>
                      <DownArrow width={16} height={16} />
                    </View>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    padding: 22,
                    backgroundColor: '#4E525F',
                    marginTop: -1,
                    borderBottomRightRadius: 12,
                    borderBottomLeftRadius: 12,
                  }}>
                  <View style={styles.headerSection}>
                    <View style={styles.iconWrapper}>
                      <Bag width={23} height={23} />
                    </View>
                    <Text style={styles.branchTitle}>
                      {projects?.customerCompanyName}
                    </Text>
                  </View>
                  <View style={styles.detailsSection}>
                    <View style={[styles.detailRow, {marginBottom: 24}]}>
                      <View style={styles.label}>
                        <Mark />
                      </View>
                      <Text
                        style={[
                          styles.value,
                          {fontSize: 19, fontWeight: '500'},
                        ]}>
                        {selectedProject}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>Address:</Text>
                      <Text style={styles.value}>{projects?.address}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>City / state:</Text>
                      <Text
                        style={
                          styles.value
                        }>{`${projects?.cityName}/${projects?.stateName}`}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>Zip Code</Text>
                      <Text style={styles.value}>{projects?.zipCode}</Text>
                    </View>
                  </View>
                </View>
              )}
              {signConfirmed && (
                <>
                  <ExistingAuditProject handleFetchData={fetchData} />
                  <ElectricalAssessment handleFetchData={fetchData} />
                  <PermittingAssenment handleFetchData={fetchData} />
                  <Outdoor handleFetchData={fetchData} />
                  {/* <Indoor handleFetchData={fetchData} /> */}
                  {<Photos handleFetchData={fetchData} />}

                  <View>
                    <TouchableOpacity
                      onPress={() => saveSection()}
                      style={{
                        marginVertical: 32,
                        backgroundColor: '#FF9239',
                        padding: 10,
                        alignSelf: 'flex-end',
                        borderRadius: 8,
                      }}>
                      <Text style={{color: '#fff', fontSize: 16}}>
                        Save Report
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          )}
        />
      ) : (
        <Text style={{color: 'red', fontSize: 14, textAlign: 'center'}}>
          No Projects Assigned To you
        </Text>
      )}
    </View>
  );
};

export default Home;
