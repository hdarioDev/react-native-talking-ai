import {
  View,
  Text,
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
      source={require('../../../assets/images/backgroundLogin.png')}
      className="flex-1 bg-cover">
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={5}
      />
      <View className="flex-1 flex justify-between my-10">
        <View className="space-y-2">
          <Text className="text-center tracking-wider text-gray-600 font-semibold">
            The Future is here, powered by hdariodev.
          </Text>
        </View>
        <View className="flex-1" />
        <TouchableOpacity
          className="bg-sky-500 h-14 mx-5 p-3 mt-6 rounded-xl"
          onPress={() => navigation.navigate('home', {generateImage: true})}>
          <Text className="text-center font-bold text-slate-50 text-lg">
            Generar imágenes con IA
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-emerald-500 h-14 mx-5 p-3 rounded-xl mt-3"
          onPress={() => navigation.navigate('home', {generateImage: false})}>
          <Text className="text-center font-bold text-slate-50 text-lg">
            Hablar con la asistente
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
