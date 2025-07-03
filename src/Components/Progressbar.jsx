import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Text} from 'react-native';

const ProgressBar = ({duration = 5000}) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, []);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.progressBar, {width: widthInterpolated}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 10,
    width: '65%',
    backgroundColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
    justifyContent: 'center',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2B92F0',
  },
  text: {
    position: 'absolute',
    alignSelf: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
});

export default ProgressBar;
