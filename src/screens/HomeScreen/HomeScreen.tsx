import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from 'react-native';
import Voice, {
  SpeechEndEvent,
  SpeechErrorEvent,
  SpeechResultsEvent,
  SpeechStartEvent,
} from '@react-native-community/voice';

import {Features, Messages} from '../../components';
import {Message} from '../../constants/dummy';
import {apiCall} from '../../api/openAi';

const HomeScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const ScrollViewRef = useRef<ScrollView>(null);

  const stopSpeaking = () => {
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
    // Tts.stop();
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
    // Tts.stop();
    setSpeaking(false);
    setLoading(false);
    setMessages([]);
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
      apiCall(result.trim(), newMessages).then(res => {
        // console.log('got api data');
        setLoading(false);
        console.log('responde : ', res);

        if (res.success) {
          setMessages([...res.data]);
          setResult('');
          updateScrollView();

          // now play the response to user
          // startTextToSpeach(res.data[res.data.length - 1]);
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
    // Tts.setDefaultLanguage('en-IE');
    // Tts.addEventListener('tts-start', event => console.log('start', event));
    // Tts.addEventListener('tts-finish', event => {console.log('finish', event); setSpeaking(false)});
    // Tts.addEventListener('tts-cancel', event => console.log('cancel', event));

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
      <View className="flex justify-center items-center">
        {/* <Image
          className="rounded-full h-24 w-24"
          source={require('../../../assets/images/recordingIcon.png')}
        /> */}

        {loading ? (
          <Image
            className=" h-20 w-20"
            source={require('../../../assets/images/loading.gif')}
            // style={{width: hp(10), height: hp(10)}}
          />
        ) : recording ? (
          <TouchableOpacity className="space-y-2" onPress={stopRecording}>
            {/* recording stop button */}
            <Image
              className="rounded-full h-20 w-20"
              source={require('../../../assets/images/voiceLoading.gif')}
              // style={{width: hp(10), height: hp(10)}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={startRecording}>
            {/* recording start button */}
            <Image
              className="rounded-full h-20 w-20"
              source={require('../../../assets/images/recordingIcon.png')}
              // style={{width: hp(10), height: hp(10)}}
            />
          </TouchableOpacity>
        )}

        {messages.length > 0 && (
          <TouchableOpacity
            onPress={clear}
            className="bg-neutral-400 rounded-3xl p-2 absolute right-10">
            <Text className="text-white font-semibold">Clear</Text>
          </TouchableOpacity>
        )}
        {speaking && (
          <TouchableOpacity
            onPress={stopSpeaking}
            className="bg-red-400 rounded-3xl p-2 absolute left-10">
            <Text className="text-white font-semibold">Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
