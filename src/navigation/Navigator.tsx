import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen, LoginScreen} from '../screens';

export type RootStackParams = {
  home: undefined;
  login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();

function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{
          headerShown: false,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#fff',
          },
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;
