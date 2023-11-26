import React from 'react';
import {View, Image, ImageBackground, StyleSheet} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import SwitchSelector from 'react-native-switch-selector';
import {Picker} from '@react-native-picker/picker';

import {FooterActions, HeaderNav, Messages} from '../../components';
import {optionsLenguage} from '../../constants/config';
import {useTalking} from '../../hooks/useTalking';
import {EnglishLevel, LanguageCode} from '../../hooks/TalkingInterface';

interface HomeScreenProps {
  route: {
    params?: {
      generateImage?: boolean;
    };
  };
}

const HomeScreen = ({route}: HomeScreenProps) => {
  const generateImage = route.params?.generateImage || false;

  const {
    messages,
    recording,
    speaking,
    loading,
    ScrollViewRef,
    lenguage,
    isMaxQuestions,
    image,
    setLenguage,
    stopSpeaking,
    startRecording,
    clear,
    setRecording,
    startTextToSpeach,
    setSelectedLevel,
    selectedLevel,
  } = useTalking(generateImage);

  return (
    <ImageBackground
      source={require('../../../assets/images/background.jpg')}
      className="flex-1 bg-cover">
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={10}
      />

      <View className="flex-1 flex mx-5">
        <View className="flex-row h-12 justify-center" />
        <HeaderNav />
        {generateImage && image !== '' && (
          <Image
            className="w-full h-2/3 mt-2 rounded-2xl"
            resizeMode="contain"
            source={{uri: image}}
          />
        )}
        {messages.length > 0 ? (
          <Messages
            messages={messages}
            ScrollViewRef={ScrollViewRef}
            startTextToSpeech={startTextToSpeach}
          />
        ) : (
          <>
            {!generateImage && (
              <>
                <SwitchSelector
                  options={optionsLenguage}
                  buttonColor={'gray'}
                  selectedColor={'#fff'}
                  initial={0}
                  onPress={(value: any) => {
                    if (value === '0') {
                      setLenguage(LanguageCode.ES);
                    }
                    if (value === '1') {
                      setLenguage(LanguageCode.EN);
                    }
                  }}
                />
                {lenguage === 'en-US' && (
                  <View className="bg-slate-100 rounded-lg mt-3 mx-2">
                    <Picker
                      selectedValue={selectedLevel}
                      onValueChange={itemValue => setSelectedLevel(itemValue)}>
                      <Picker.Item label="Nativo" value={EnglishLevel.NATIVE} />
                      <Picker.Item
                        label="Intermedio"
                        value={EnglishLevel.INTERMEDIATE}
                      />
                      <Picker.Item label="Básico" value={EnglishLevel.BASIC} />
                    </Picker>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </View>
      <FooterActions
        loading={loading}
        recording={recording}
        stopRecording={() => {
          setRecording(false);
        }}
        startRecording={startRecording}
        messages={messages}
        speaking={speaking}
        stopSpeaking={stopSpeaking}
        clear={clear}
        isMaxQuestions={isMaxQuestions}
      />
    </ImageBackground>
  );
};

export default HomeScreen;
