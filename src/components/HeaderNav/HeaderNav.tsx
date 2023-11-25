import {View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const HeaderNav = () => {
  const {goBack} = useNavigation();

  return (
    <View className="flex-row justify-between h-10 mb-3">
      <TouchableOpacity onPress={() => goBack()}>
        <Image
          className="w-11 h-11 absolute top-0 left-0 -ml-2 -mt-2"
          source={require('../../../assets/images/iconBackButton.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderNav;
