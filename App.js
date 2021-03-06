import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createAppContainer , createSwitchNavigator} from 'react-navigation';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import LoadingScreen from './screens/LoadingScreen';
import firebase from 'firebase';
import {firebaseConfig} from './config';

firebase.initializeApp(firebaseConfig)

export default function App() {
  return <AppNavigator />
    
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  HomeScreen: HomeScreen
})

const AppNavigator = createAppContainer
(AppSwitchNavigator);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
