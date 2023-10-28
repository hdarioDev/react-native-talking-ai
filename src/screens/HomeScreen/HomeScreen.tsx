import React, {useState} from 'react';
import {View, Image} from 'react-native';
import {Features, Messages} from '../../components';
import {Message, dummyMessages} from '../../constants/dummy';

const HomeScreen = () => {
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  return (
    <View className="flex-1 flex mx-5">
      <View className="flex-row justify-center">
        <Image
          className="w-40 h-40"
          source={require('../../../assets/images/welcome.png')}
        />
      </View>
      {messages.length > 0 ? <Messages messages={messages} /> : <Features />}
    </View>
  );
};

export default HomeScreen;
