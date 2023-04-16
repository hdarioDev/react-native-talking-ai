import {View, Text} from 'react-native';
import React from 'react';

export default function HomeScreen() {
  return (
    <View>
      <Text>Home</Text>
      <View
        style={{
          width: 200,
          height: 200,
          backgroundColor: 'red',
        }}
      />
    </View>
  );
}
