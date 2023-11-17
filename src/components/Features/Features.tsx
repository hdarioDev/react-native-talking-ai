import {View, Text, Image} from 'react-native';
import React from 'react';

const Features = () => {
  return (
    <View className="space-y-4">
      <Text className="font-semibold text-gray-600 text-3xl" />
      <View className="bg-emerald-200 p-4 rounded-xl space-y-2">
        <View className="flex-row items-center space-x-2">
          <Image
            source={require('../../../assets/images/chat.png')}
            className="w-10 h-10"
          />
          <Text className="font-semibold text-gray-700 text-xl">Chat GPT</Text>
        </View>
      </View>
      <View className="bg-purple-200 p-4 rounded-xl space-y-2">
        <View className="flex-row items-center space-x-2">
          <Image
            source={require('../../../assets/images/dell.png')}
            className="w-10 h-10"
          />
          <Text className="font-semibold text-gray-700 text-xl">DALL-E</Text>
        </View>
      </View>
      <View className="bg-cyan-200 p-4 rounded-xl space-y-2">
        <View className="flex-row items-center space-x-2">
          <Image
            source={require('../../../assets/images/dell.png')}
            className="w-10 h-10"
          />
          <Text className="font-semibold text-gray-700 text-xl">Smart AI</Text>
        </View>
      </View>
    </View>
  );
};

export default Features;
