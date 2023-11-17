import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {BlurView} from '@react-native-community/blur';

import {RootStackParams} from '../../navigation/Navigator';

export default function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams, 'home'>>();

  return (
    <ImageBackground
      source={require('../../../assets/images/chat.png')}
      className="flex-1 bg-cover">
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={10}
      />
      <View className="flex-1 flex justify-around">
        <View className="space-y-2">
          <Text className="text-center text-4xl font-bold text-gray-600">
            Nana
          </Text>
          <Text className="text-center tracking-wider text-gray-500 font-semibold">
            The Future is here, powered by hdariodev.
          </Text>
        </View>
        <View className="flex-row justify-center">
          <Image
            className="w-72 h-72"
            source={require('../../../assets/images/welcome.png')}
          />
        </View>
        <TouchableOpacity
          className="bg-emerald-600 h-14 mx-5 p-4 rounded-xl"
          onPress={() => navigation.navigate('home')}>
          <Text className="text-center font-bold text-slate-50 text-xl">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
