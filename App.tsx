import React from 'react';
import {Navigator} from './src/navigation';
import {SafeAreaView, StatusBar} from 'react-native';

const App = () => {
  return (
    <>
      <StatusBar
        barStyle={'light-content'}
        translucent
        backgroundColor="#617474ef"
      />
      <SafeAreaView className="flex-1 bg-slate-500">
        <Navigator />
      </SafeAreaView>
    </>
  );
};

export default App;
