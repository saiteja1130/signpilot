import {Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Home from '../screens/Home';
import {createUsersTable, dropUsersTable, getUsers} from '../Db/db.js';
import {useDispatch} from 'react-redux';
import {addLoginData} from '../Redux/Slices/LoginData';
import Admin from '../screens/Admin.jsx';
import Completedsurveys from '../screens/Completedsurveys.jsx';
import Manage from '../screens/Manage.jsx';
import AddProject from '../screens/AddProject.jsx';
import CustomerProjectScreen from '../screens/CustomerProjectScreen.jsx';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    // dropUsersTable();
    createUsersTable();
    getUsers(users => {
      if (users.length > 0) {
        dispatch(addLoginData(users[0]));
        setUser(users[0]);
      } else {
        setLoading(false);
      }
      console.log(users);
    });
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 24}}>Loading...</Text>
      </View>
    );
  }
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={user?.tokenNumber ? 'Home' : 'Login'}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="Menu"
        component={Admin}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="Completedsurveys"
        component={Completedsurveys}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="Manage"
        component={Manage}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="AddProject"
        component={AddProject}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="CustomerProjectScreen"
        component={CustomerProjectScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
