import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './src/Navigations/StackNavigation';
import {Provider} from 'react-redux';
import {store} from './src/Redux/store';
import Toast from 'react-native-toast-message';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <StackNavigation />
        </NavigationContainer>
        <Toast />
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
