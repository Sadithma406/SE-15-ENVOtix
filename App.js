import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CoinHeader from './src/coin';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <CoinHeader />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
