import React from 'react';
import {Navigator} from './src/navigation';
import styled from 'styled-components/native';
// import {Text} from 'react-native';

const App = () => {
  return (
    <Container>
      <Navigator />
    </Container>
  );
};

export default App;

const Container = styled.SafeAreaView`
  flex: 1;
`;
