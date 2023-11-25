import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import LoginScreen from './LoginScreen';
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

describe('LoginScreen', () => {
  const renderLoginScreen = () =>
    render(
      <NavigationContainer>
        <LoginScreen />
      </NavigationContainer>,
    );

  it('renders the correct text', () => {
    const {getByText} = renderLoginScreen();

    expect(getByText('Hablar con la asistente')).toBeDefined();
  });

  it('navigates to home screen when "Get Started" button is pressed', () => {
    const {getByText} = renderLoginScreen();

    fireEvent.press(getByText('Hablar con la asistente'));
    expect(mockedNavigation).toHaveBeenCalledWith('home', {
      generateImage: false,
    });
  });
});
