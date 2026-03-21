import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PlasticBinScreen from './src/screens/plastic';
import SideScreen from './src/screens/sideBar';
import CoinsScreen from './src/screens/coin';
import OrganicBinScreen from './src/screens/organic';
import Notification from './src/screens/notification';
import PaperBinScreen from './src/screens/paper';
import Shops from './src/screens/RedeemShops/shopsDetails';
import ShopDetails from './src/screens/RedeemShopsOfferDetails/RedeemShopsOfferDetails';
import LoginScreen from './src/screens/Login_Page';
import RegisterScreen from './src/screens/RegisterScreen';
import SplashScreen from './src/screens/Splash';
import HomeScreen from './src/screens/HomeScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import QRScreen from './src/screens/QRPage';
import MonitorScreen from './src/screens/monitor';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Plastic" component={PlasticBinScreen} />
          <Stack.Screen name="SideBar" component={SideScreen} />
          <Stack.Screen name="Coins" component={CoinsScreen} />
          <Stack.Screen name="Organic" component={OrganicBinScreen} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="Paper" component={PaperBinScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Shops" component={Shops} />
          <Stack.Screen name="ShopDetails" component={ShopDetails} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="QRPage" component={QRScreen} />
          <Stack.Screen name="MonitorBin" component={MonitorScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}