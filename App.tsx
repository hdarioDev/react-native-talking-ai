import React from 'react';
import {Navigator} from './src/navigation';
import {SafeAreaView} from 'react-native';

const App = () => {
  return (
    <SafeAreaView className="flex-1">
      <Navigator />
    </SafeAreaView>
  );
};

export default App;
