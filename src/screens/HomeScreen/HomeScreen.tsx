import React, {useEffect, useRef, useState} from 'react';
import {View, Image, Alert, ScrollView} from 'react-native';
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

// Tts.setDefaultLanguage('es-ES');

const HomeScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const ScrollViewRef = useRef<ScrollView>(null);

  const stopSpeaking = () => {
    Tts.stop();
    setSpeaking(false);
  };

  const speechStartHandler = (e: SpeechStartEvent) => {
    console.log('speech start', e);
  };

  const speechEndHandler = (e: SpeechEndEvent) => {
    // setRecording(false);
    console.log('FIN ???? speech end', e);
  };

  const speechResultsHandler = (e: SpeechResultsEvent) => {
    console.log('>>>>>>>>>>>>>>>>>>>>>   speech event', e);
    const text = e.value ? e.value[0] : '';
    setResult(text);
  };

  const speechErrorHandler = (e: SpeechErrorEvent) => {
    console.log('speech error', e);
  };

  const startRecording = async () => {
    setRecording(true);
    Tts.stop();
    try {
      // await Voice.start('en-GB'); // en-US
      await Voice.start('es-ES');
    } catch (error) {
      console.log('error', error);
    }
  };
  const stopRecording = async () => {
    console.log('stopRecording ()');

    setRecording(false);
    setTimeout(async () => {
      await Voice.stop().then(() => {
        console.log('stopRecording ()');
        fetchResponse();
      });
    }, 2000);
  };

  const clear = () => {
    Tts.stop();
    setSpeaking(false);
    setLoading(false);
    setMessages([]);
  };

  const startTextToSpeach = (message: Message) => {
    Tts.getInitStatus().then(() => {
      Tts.setDefaultLanguage('es-ES');
      Tts.speak(message.content);
    });

    // if(!message.content.includes('https')){
    setSpeaking(true);
    // playing response with the voice id and voice speed

    // }
  };

  const fetchResponse = async () => {
    console.log('fetchResponse()', result);

    if (result.trim().length > 0) {
      console.log('INGRESA AL IF');

      setLoading(true);
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: result.trim()});
      setMessages([...newMessages]);

      // scroll to the bottom of the view
      updateScrollView();

      // fetching response from chatGPT with our prompt and old messages
      apiCall(result.trim(), newMessages).then((res: any) => {
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
    Tts.setDefaultLanguage('en-IE');
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
    <>
      <View className="flex-1 flex mx-5">
        <View className="flex-row justify-center">
          <Image
            className="w-36 h-36"
            source={require('../../../assets/images/welcome.png')}
          />
        </View>
        {messages.length > 0 ? (
          <Messages messages={messages} ScrollViewRef={ScrollViewRef} />
        ) : (
          <Features />
        )}
      </View>
      <FooterActions
        loading={loading}
        recording={recording}
        stopRecording={stopRecording}
        startRecording={startRecording}
        messages={messages}
        speaking={speaking}
        stopSpeaking={stopSpeaking}
        clear={clear}
      />
    </>
  );
};

export default HomeScreen;
