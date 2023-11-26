import {useEffect, useRef, useState} from 'react';
import Tts from 'react-native-tts';
import Voice, {
  SpeechEndEvent,
  SpeechErrorEvent,
  SpeechResultsEvent,
  SpeechStartEvent,
} from '@react-native-community/voice';
import {Alert, ScrollView} from 'react-native';
import {AsyncStorageRepository} from '../infrastructure/AsyncStorageRepository';
import {OpenAiChatRepository} from '../infrastructure/ChatRepository';
import {OpenAiDalleRepository} from '../infrastructure/DalleRepository';
import {StorageRepository} from '../domain/StorageInterface';
import {ChatRepository} from '../domain/ChatInterface';
import {DalleRepository} from '../domain/DalleInterface';
import {MAX_DAILY_QUESTIONS} from '../constants/config';
import {Message} from '../constants/dummy';
import {CHAT_GPT_URL, DALLE_URL} from '../constants/environment';
import {EnglishLevel, LanguageCode, Roles} from './TalkingInterface';

export const useTalking = (initialGenerateImage: boolean) => {
  const generateImage = initialGenerateImage;
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
  const [lenguage, setLenguage] = useState<LanguageCode>(LanguageCode.ES);
  const [isMaxQuestions, setIsMaxQuestions] = useState(false);
  const [image, setImage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel>(
    EnglishLevel.NATIVE,
  );

  const selectedLevelRef = useRef(selectedLevel);
  const lenguageLevelRef = useRef(lenguage);

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
          {role: Roles.USER, content: text.trim()},
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
    setLenguage(LanguageCode.ES);
  };

  const startTextToSpeach = (message: Message) => {
    Tts.stop();

    Tts.speak(message.content);
    setSpeaking(true);
  };

  useEffect(() => {
    Tts.setDefaultLanguage(lenguage);
    lenguageLevelRef.current = lenguage;
  }, [lenguage]);

  useEffect(() => {
    selectedLevelRef.current = selectedLevel;
    if (selectedLevel !== EnglishLevel.NATIVE) {
      const rate = selectedLevel === EnglishLevel.BASIC ? 0.1 : 0.3;
      Tts.setDefaultRate(rate);
    } else {
      Tts.setDefaultRate(0.5);
    }
  }, [selectedLevel]);

  async function fetchResponse(text: string, messagesSend: Message[]) {
    if (text.trim().length > 0) {
      setLoading(true);
      updateScrollView();
      try {
        const res = await chatRepository.callApi(
          messagesSend,
          lenguageLevelRef.current,
          selectedLevelRef.current,
        );
        setLoading(false);
        setMessages(res);
        updateScrollView();
        startTextToSpeach(res[res.length - 1]);
      } catch (err) {
        setLoading(false);
        Alert.alert('Error', err.message);
      }
    } else {
      Alert.alert('Error al grabar audio');
    }
  }

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

  return {
    generateImage,
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
    stopRecording,
    clear,
    startTextToSpeach,
    setRecording,
    updateScrollView,
    setSelectedLevel,
    selectedLevel,
  };
};
