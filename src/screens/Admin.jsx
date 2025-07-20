import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Logo from '../../assets/images/app logo.svg';
import Refresh from '../../assets/images/cloud.svg';
import Menu from '../../assets/images/close.svg';
import {useNavigation} from '@react-navigation/native';
import {createUsersTable, dropUsersTable} from '../Db/db';
import {useDispatch} from 'react-redux';
import {addLoginData} from '../Redux/Slices/LoginData';
import {dropProjectsTable} from '../Db/ProjectsDb';

const Admin = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const MenuItem = ({icon, label, screen}) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        if (screen === 'logout') {
          dropUsersTable();
          dropProjectsTable();
          createUsersTable();
          dispatch(addLoginData(null));
          navigation.replace('Login');
        } else {
          navigation.navigate(screen);
        }
      }}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo width={150} height={36} />
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleRefresh()}>
            <Refresh width={36} height={36} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Menu width={36} height={36} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.menuList}>
        <MenuItem label="Surveys" screen="Home" />
        <MenuItem label="Manage" screen="Manage" />
        <MenuItem label="Completed surveys" screen="Completedsurveys" />
        <MenuItem label="Sign out" screen="logout" />
      </View>
    </View>
  );
};

export default Admin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 24,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 30,
  },
  logoContainer: {
    flex: 1,
  },
  menuList: {
    gap: 20,
    padding: 24,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 4,
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  label: {
    fontSize: 16,
    color: '#3F4455',
    fontWeight: '500',
  },
});
