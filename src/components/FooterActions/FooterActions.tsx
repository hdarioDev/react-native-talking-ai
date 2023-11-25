import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';

interface Props {
  loading: boolean;
  recording: boolean;
  stopRecording: () => void;
  startRecording: () => void;
  messages: any;
  speaking: boolean;
  stopSpeaking: () => void;
  clear: () => void;
  isMaxQuestions: boolean;
}

const FooterActions = ({
  loading,
  recording,
  stopRecording,
  startRecording,
  messages,
  speaking,
  stopSpeaking,
  clear,
  isMaxQuestions,
}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenOptionsPremium = () => {
    setModalVisible(true);
  };

  return (
    <View className="flex justify-center items-center border-t-slate-200 h-28  absolute bottom-0 right-0 left-0 p-2 rounded-tl-3xl rounded-tr-3xl">
      {isMaxQuestions ? (
        <TouchableOpacity
          className="border border-stone-500 rounded-md overflow-hidden"
          onPress={handleOpenOptionsPremium}>
          <Text className="text-gray-200 font-black text-lg px-4 py-1">
            Tokens agotados
          </Text>
        </TouchableOpacity>
      ) : loading ? (
        <ActivityIndicator size="large" color="#e2e2e2" />
      ) : recording ? (
        <TouchableOpacity className="space-y-2" onPress={stopRecording}>
          <Image
            className="rounded-full h-16 w-16"
            source={require('../../../assets/images/voiceLoading.gif')}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={startRecording}>
          <Image
            className="rounded-full h-24 w-24"
            source={require('../../../assets/images/recordingIcon.png')}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View className="flex-1 justify-center items-center">
          <View className="m-20 border border-stone-500 rounded-md overflow-hidden bg-white p-4 items-center shadow-md ">
            <Text className="text-gray-600 text-lg">
              Gracias por probar nuestra esta versión de prueba, puedes hacer 10
              preguntas por día, pronto tendremos una versión premium con más
              preguntas y más funcionalidades.
            </Text>
            <Pressable
              className="text-white font-bold text-center bg-slate-100 mt-3 rounded-md p-2"
              onPress={() => setModalVisible(!modalVisible)}>
              <Text>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FooterActions;
