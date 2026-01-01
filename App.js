import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PlasticBinScreen from './src/screens/plastic';
import SideScreen from './src/screens/sideBar';
import CoinsScreen from './src/screens/coin';
import OrganicBinScreen from './src/screens/organic';
import Notification from './src/screens/notification';
import GlassBinScreen from './src/screens/glass';
import ShopScreen from './src/screens/RedeemShops/shopsDetails';
import ShopDetailsScreen from './src/screens/RedeemShopsOfferDetails/RedeemShopsOfferDetails';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SideBar' screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Plastic" component={PlasticBinScreen} />
        <Stack.Screen name="SideBar" component={SideScreen} />
        <Stack.Screen name="Coins" component={CoinsScreen} />
        <Stack.Screen name="Organic" component={OrganicBinScreen} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Glass" component={GlassBinScreen} />
        <Stack.Screen name="Shops" component={ShopScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}