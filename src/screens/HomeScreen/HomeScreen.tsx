import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  Alert,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import Tts from 'react-native-tts';
import Voice, {
  SpeechEndEvent,
  SpeechErrorEvent,
  SpeechResultsEvent,
  SpeechStartEvent,
} from '@react-native-community/voice';
import {BlurView} from '@react-native-community/blur';
import SwitchSelector from 'react-native-switch-selector';

import {FooterActions, HeaderNav, Messages} from '../../components';
import {Message} from '../../constants/dummy';
import {MAX_DAILY_QUESTIONS, optionsLenguage} from '../../constants/config';
import {AsyncStorageRepository} from '../../infrastructure/AsyncStorageRepository';
import {StorageRepository} from '../../domain/StorageInterface';
import {ChatRepository} from '../../domain/ChatInterface';
import {OpenAiChatRepository} from '../../infrastructure/ChatRepository';
import {CHAT_GPT_URL, DALLE_URL} from '../../constants/environment';
import {OpenAiDalleRepository} from '../../infrastructure/DalleRepository';
import {DalleRepository} from '../../domain/DalleInterface';

interface HomeScreenProps {
  route: {
    params?: {
      generateImage?: boolean;
    };
  };
}

const HomeScreen = ({route}: HomeScreenProps) => {
  const generateImage = route.params?.generateImage || false;
  const storageRepository: StorageRepository = new AsyncStorageRepository();
  const chatRepository: ChatRepository = new OpenAiChatRepository({
    chatgptUrl: CHAT_GPT_URL,
  });
  const dalleRepository: DalleRepository = new OpenAiDalleRepository({
    dalleUrl: DALLE_URL,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const ScrollViewRef = useRef<ScrollView>(null);
  const [lenguage, setLenguage] = useState('es-ES');
  const [isMaxQuestions, setIsMaxQuestions] = useState(false);
  const [image, setImage] = useState('');

  useEffect(() => {
    const verifyCanAsk = async () => {
      const currentCount = await storageRepository.getQuestionCount();
      if (currentCount >= MAX_DAILY_QUESTIONS) {
        setIsMaxQuestions(true);
      }
    };
    verifyCanAsk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const checkAndResetDailyCount = async () => {
      const lastQuestionDate = await storageRepository.getLastQuestionDate();
      const currentDate = new Date().toISOString().split('T')[0];

      if (lastQuestionDate !== currentDate) {
        await storageRepository.saveQuestionCount(0);
        await storageRepository.saveLastQuestionDate(currentDate);
      }
    };
    checkAndResetDailyCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopSpeaking = () => {
    Tts.stop();
    setSpeaking(false);
  };

  const speechStartHandler = (e: SpeechStartEvent) => {
    console.log('speech start', e);
  };

  const speechEndHandler = (e: SpeechEndEvent) => {
    console.log('speech end', e);
  };

  const speechResultsHandler = (e: SpeechResultsEvent) => {
    const text = e.value ? e.value[0] : '';
    stopRecording(text);
  };

  const speechErrorHandler = (e: SpeechErrorEvent) => {
    setSpeaking(false);
    setRecording(false);
    if (e.error && e.error.message === '7/No match') {
      Alert.alert('No se reconoció el comando. Por favor, intenta nuevamente.');
    }
  };

  const startRecording = async () => {
    setRecording(true);
    await Tts.stop();
    try {
      await Voice.start(lenguage);
    } catch (error) {
      console.log('error', error);
    }
  };

  const stopRecording = async (text: string) => {
    setRecording(false);
    await Voice.stop();
    if (generateImage) {
      fetchApiCallImagesGenerate(text);
    } else {
      setMessages(prevMessages => {
        const newMessages = [
          ...prevMessages,
          {role: 'user', content: text.trim()},
        ];
        fetchResponse(text, newMessages);
        return newMessages;
      });
    }

    await controlNumberQuestions();
  };

  const controlNumberQuestions = async () => {
    const currentCount = await storageRepository.getQuestionCount();
    if (currentCount < MAX_DAILY_QUESTIONS) {
      await storageRepository.saveQuestionCount(currentCount + 1);
    } else {
      setIsMaxQuestions(true);
    }
  };

  const clear = () => {
    Tts.stop();
    setSpeaking(false);
    setLoading(false);
    setMessages([]);
    setLenguage('es-ES');
  };

  const startTextToSpeach = (message: Message) => {
    Tts.stop();
    Tts.speak(message.content);
    setSpeaking(true);
  };

  useEffect(() => {
    Tts.setDefaultLanguage(lenguage);
  }, [lenguage]);

  const fetchResponse = async (text: string, messagesSend: Message[]) => {
    console.log('fetchResponse ', text);
    if (text.trim().length > 0) {
      setLoading(true);
      updateScrollView();
      chatRepository
        .callApi(messagesSend)
        .then((res: any) => {
          setLoading(false);
          if (res) {
            setMessages(res);
            updateScrollView();
            startTextToSpeach(res[res.length - 1]);
          } else {
            Alert.alert('Error');
          }
        })
        .catch((err: any) => {
          setLoading(false);
          Alert.alert('Error', err.message);
        });
    } else {
      Alert.alert('Error al grabar audio');
    }
  };

  const fetchApiCallImagesGenerate = (prompt: string) => {
    setLoading(true);
    dalleRepository
      .callApi(prompt)
      .then((res: any) => {
        if (res) {
          setImage(res);
          setLoading(false);
        } else {
          setLoading(false);
          Alert.alert('Error', res.msg);
        }
      })
      .catch((err: any) => {
        setLoading(false);
        Alert.alert('Error', err.message);
      });
  };

  useEffect(() => {
    // voice handler events
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    // text to speech events
    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-finish', event => {
      console.log('finish', event);
      setSpeaking(false);
    });
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateScrollView = () => {
    setTimeout(() => {
      ScrollViewRef?.current?.scrollToEnd({animated: true});
    }, 200);
  };

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
              <SwitchSelector
                options={optionsLenguage}
                buttonColor={'gray'}
                selectedColor={'#fff'}
                initial={0}
                onPress={(value: any) => {
                  if (value === '0') {
                    setLenguage('es-ES');
                  }
                  if (value === '1') {
                    setLenguage('en-US');
                  }
                }}
              />
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
