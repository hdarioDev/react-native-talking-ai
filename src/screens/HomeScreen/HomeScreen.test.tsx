import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import HomeScreen from './HomeScreen';

import {NavigationContainer} from '@react-navigation/native';

const mockedNavigation = jest.fn();

jest.mock('@react-navigation/native', () => {
  const originalModule = jest.requireActual('@react-navigation/native');

  return {
    __esModule: true,
    ...originalModule,
    useNavigation: () => ({
      navigate: mockedNavigation,
    }),
  };
});

jest.mock('@react-native-community/voice', () => ({
  start: jest.fn(),
  stop: jest.fn(),
  destroy: jest.fn(),
  onSpeechStart: jest.fn(),
  onSpeechEnd: jest.fn(),
  onSpeechResults: jest.fn(),
  onSpeechError: jest.fn(),
}));

jest.mock('react-native-tts', () => ({
  stop: jest.fn(),
  speak: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  setDefaultLanguage: jest.fn(),
  setDefaultRate: jest.fn(),
}));

jest.mock('react-native-switch-selector', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

// Mock para '@react-native-community/blur'
jest.mock('@react-native-community/blur', () => ({
  BlurView: jest.fn(),
}));

jest.mock('../../infrastructure/AsyncStorageRepository', () => {
  return {
    __esModule: true,
    AsyncStorageRepository: jest.fn(() => ({
      getQuestionCount: jest.fn().mockResolvedValue(0),
      getLastQuestionDate: jest.fn().mockResolvedValue(null),
      saveQuestionCount: jest.fn().mockResolvedValue(1),
      saveLastQuestionDate: jest.fn().mockResolvedValue('25/11/2023'),
    })),
  };
});

jest.mock('../../infrastructure/ChatRepository', () => {
  return {
    __esModule: true,
    OpenAiChatRepository: jest.fn(() => ({
      callApi: jest
        .fn()
        .mockResolvedValue([{role: 'assistant', content: 'Hello!'}]),
    })),
  };
});

jest.mock('../../infrastructure/DalleRepository', () => {
  return {
    __esModule: true,
    OpenAiDalleRepository: jest.fn(() => ({
      callApi: jest.fn().mockResolvedValue('fakeImageUrl'),
    })),
  };
});

describe('HomeScreen', () => {
  it('renders language switch options when no messages are present', async () => {
    const {getByTestId} = render(
      <NavigationContainer>
        <HomeScreen route={{params: {generateImage: false}}} />
      </NavigationContainer>,
    );

    waitFor(() => {
      expect(getByTestId('es-ES')).toBeDefined();
    });
  });
});
