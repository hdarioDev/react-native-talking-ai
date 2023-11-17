import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';

interface Props {
  loading: boolean;
  recording: boolean;
  stopRecording: () => void;
  startRecording: () => void;
  messages: any;
  speaking: boolean;
  stopSpeaking: () => void;
  clear: () => void;
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
}: Props) => {
  return (
    <View className="flex justify-center items-center border-t-slate-200 h-28  absolute bottom-0 right-0 left-0 p-2 rounded-tl-3xl rounded-tr-3xl">
      {loading ? (
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
    </View>
  );
};

export default FooterActions;
