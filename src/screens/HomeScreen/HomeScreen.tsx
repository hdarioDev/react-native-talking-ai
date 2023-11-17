import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  // Image,
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
import {Features, FooterActions, Messages} from '../../components';
import {Message} from '../../constants/dummy';
import {apiCall} from '../../api/openAi';
import {BlurView} from '@react-native-community/blur';
import SwitchSelector from 'react-native-switch-selector';

// Tts.setDefaultLanguage(lenguage);

const options = [
  {
    label: 'Español',
    value: '0',
    testID: 'es-ES',
    accessibilityLabel: 'es-ES',
  },
  {
    label: 'Inglés',
    value: '1',
    testID: 'en-US',
    accessibilityLabel: 'en-US',
  },
];

const HomeScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const ScrollViewRef = useRef<ScrollView>(null);
  const [lenguage, setLenguage] = useState('es-ES');

  const stopSpeaking = () => {
    Tts.stop();
    setSpeaking(false);
  };

  const speechStartHandler = (e: SpeechStartEvent) => {
    console.log('speech start', e);
  };

  const speechEndHandler = (e: SpeechEndEvent) => {
    console.log('FIN ???? speech end', e);
  };

  const speechResultsHandler = (e: SpeechResultsEvent) => {
    console.log('>>>>>>>>>>>>>>>>>>>>>   speech event', e);
    const text = e.value ? e.value[0] : '';
    setResult(text);
    stopRecording(text);
  };

  const speechErrorHandler = (e: SpeechErrorEvent) => {
    console.log('speech error', e);
    console.log('result ', result);
    setSpeaking(false);
  };

  const startRecording = async () => {
    setRecording(true);
    Tts.stop();
    try {
      // await Voice.start('en-GB'); // en-US
      await Voice.start(lenguage);
    } catch (error) {
      console.log('error', error);
    }
  };
  const stopRecording = async (text: string) => {
    console.log('stopRecording ()', text);

    setRecording(false);
    // setTimeout(async () => {
    await Voice.stop().then(() => {
      console.log('stopRecording ()  result ', result);
      fetchResponse(text);
    });
    // }, 2000);
  };

  const clear = () => {
    Tts.stop();
    setSpeaking(false);
    setLoading(false);
    setMessages([]);
  };

  const startTextToSpeach = (message: Message) => {
    Tts.stop();
    // Tts.getInitStatus().then(() => {
    console.log('lenguage started', lenguage);

    // if (typeof message === 'string') {
    //   Tts.speak(message);
    // } else {
    Tts.speak(message.content);
    // }
    // });
    setSpeaking(true);
  };

  useEffect(() => {
    Tts.setDefaultLanguage(lenguage);
    console.log('Nuevo idioma:', lenguage);
  }, [lenguage]);

  const fetchResponse = async (text: string) => {
    console.log('fetchResponse()', result);

    if (text.trim().length > 0) {
      console.log('INGRESA AL IF');

      setLoading(true);
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: text.trim()});
      setMessages([...newMessages]);

      // scroll to the bottom of the view
      updateScrollView();

      // fetching response from chatGPT with our prompt and old messages
      apiCall(text.trim(), newMessages).then((res: any) => {
        // console.log('got api data');
        setLoading(false);
        console.log('responde : ', res);

        if (res.success) {
          setMessages([...res.data]);
          setResult('');
          updateScrollView();

          // now play the response to user
          console.log('PLAYER SPEAKING ', res.data[res.data.length - 1]);

          startTextToSpeach(res.data[res.data.length - 1]);
        } else {
          Alert.alert('Error', res.msg);
        }
      });
    } else {
      console.log('NO HAY RESULT ');
    }
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
      // destroy the voice instance after component unmounts
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const updateScrollView = () => {
    setTimeout(() => {
      ScrollViewRef?.current?.scrollToEnd({animated: true});
    }, 200);
  };

  console.log('result', result);

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
        <View className="flex-row h-12 justify-center">
          {/* <Image
            className="w-36 h-36"
            source={require('../../../assets/images/welcome.png')}
          /> */}
        </View>

        {messages.length > 0 ? (
          <Messages
            messages={messages}
            ScrollViewRef={ScrollViewRef}
            startTextToSpeech={startTextToSpeach}
          />
        ) : (
          <>
            <SwitchSelector
              options={options}
              buttonColor={'gray'}
              selectedColor={'#fff'}
              initial={0}
              onPress={(value: any) => {
                console.log('SETEAR ', value);
                console.log(typeof value);

                if (value === '0') {
                  setLenguage('es-ES');
                }
                if (value === '1') {
                  setLenguage('en-US');
                }
              }}
            />
            <Features />
          </>
        )}
      </View>
      <FooterActions
        loading={loading}
        recording={recording}
        stopRecording={() => {
          console.log('stopRecording MANUAL  ()');
        }}
        startRecording={startRecording}
        messages={messages}
        speaking={speaking}
        stopSpeaking={stopSpeaking}
        clear={clear}
      />
    </ImageBackground>
  );
};

export default HomeScreen;
