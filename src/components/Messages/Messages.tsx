import {View, Text, Image, ScrollView} from 'react-native';
import React from 'react';
import {Message} from '../../constants/dummy';

interface Props {
  messages: Message[];
  ScrollViewRef?: any;
}

const Messages = ({messages, ScrollViewRef}: Props) => {
  return (
    <View className="flex-1 space-y-2 ">
      <Text className="text-2xl text-gray-700 font-semibold ml-1">
        Assistant
      </Text>
      <View className="bg-neutral-200 rounded-3xl p-4 h-5/6">
        <ScrollView
          className="space-y-4"
          bounces={false}
          ref={ScrollViewRef}
          showsVerticalScrollIndicator={false}>
          {messages.map((message, index) => {
            if (message.role === 'assistant') {
              if (message.content.includes('https')) {
                return (
                  <View
                    key={index}
                    className="bg-emerald-100 w-56 h-56 rounded-2xl p-2 rounded-tl-none">
                    <Image
                      className="w-52 h-52 rounded-2xl"
                      resizeMode="contain"
                      source={{uri: message.content}}
                    />
                  </View>
                );
              } else {
                return (
                  <View
                    key={index}
                    className="bg-emerald-100 rounded-2xl p-3 w-3/4 rounded-tl-none">
                    <Text className="text-gray-700">{message.content}</Text>
                  </View>
                );
              }
            } else {
              return (
                <View key={index} className="flex-row justify-end">
                  <View className="bg-white rounded-2xl p-3 w-3/4 rounded-tr-none">
                    <Text className="text-gray-700">{message.content}</Text>
                  </View>
                </View>
              );
            }
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default Messages;
