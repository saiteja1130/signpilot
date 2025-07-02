import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {styles} from '../Global/Global';

const RadioButton = ({label, value, selected, onPress}) => {
  const isSelected = (selected?.toLowerCase?.() || '') === value.toLowerCase();

  return (
    <TouchableOpacity
      style={[styles.radioContainer, {marginBottom: 20}]}
      onPress={() => onPress(value)}>
      <View style={styles.outerCircle}>
        {isSelected && <View style={styles.innerCircle} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

export default RadioButton;
