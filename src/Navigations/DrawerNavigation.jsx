import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Admin from '../screens/Admin';

const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Admin" component={Admin} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
