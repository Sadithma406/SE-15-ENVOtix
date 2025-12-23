import React from 'react';
import { View, Text } from 'react-native';

export default function PlasticScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d0f0c0',
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
        initializing plastic fill level screen
      </Text>
    </View>
  );
}
