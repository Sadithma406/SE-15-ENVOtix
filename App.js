import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SideScreen from './src/screens/plastic'; // Path matches your image

export default function App() {
  return (
      <SafeAreaProvider>
        <SideScreen />
      </SafeAreaProvider>
    );
  }