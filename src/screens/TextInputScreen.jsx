import React, {useRef, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  findNodeHandle,
  UIManager,
} from 'react-native';

const TextInputScreen = () => {
  const scrollViewRef = useRef(null);
  const field1Ref = useRef(null);
  const field2Ref = useRef(null);
  const screenHeight = Dimensions.get('window').height;

  const [field1Value, setField1Value] = useState('');
  const [field2Value, setField2Value] = useState('');

  const handleFocus = fieldRef => {
    const scrollViewHandle = findNodeHandle(scrollViewRef.current);
    const fieldHandle = findNodeHandle(fieldRef.current);

    if (fieldHandle && scrollViewHandle) {
      let bottomPositionofTheField;

      UIManager.measureInWindow(fieldHandle, (x, y, width, height) => {
        bottomPositionofTheField = y + height;

        UIManager.measureLayout(
          fieldHandle,
          scrollViewHandle,
          () => {},
          (x, y, width, height) => {
            const fieldBottomY = y + height;
            const ScreenHeightCal = screenHeight * 0.55;

            console.log('ScreenHeightCal', ScreenHeightCal);
            console.log('Field bottom:', fieldBottomY);
            console.log('Bottom on screen:', bottomPositionofTheField);

            if (bottomPositionofTheField < ScreenHeightCal) {
              return;
            }

            if (fieldBottomY > ScreenHeightCal) {
              const scrollPosition = fieldBottomY - ScreenHeightCal;
              scrollViewRef.current?.scrollTo({
                y: scrollPosition,
                animated: true,
              });
            }
          },
        );
      });
    }
  };

  return (
    <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps="handled">
      <View style={{height: screenHeight * 0.7, backgroundColor: '#eee'}}>
        <Text style={{textAlign: 'center', marginTop: 30}}>
          Scroll down to interact
        </Text>
      </View>

      <TextInput
        ref={field1Ref}
        placeholder="Enter Option 1"
        value={field1Value}
        onChangeText={setField1Value}
        editable={true}
        multiline={true}
        showSoftInputOnFocus={false}
        onFocus={() => handleFocus(field1Ref)}
        style={styles.textInput}
        verticalAlign="top"
      />

      <TextInput
        ref={field2Ref}
        placeholder="Enter Option 2"
        value={field2Value}
        editable={true}
        showSoftInputOnFocus={false}
        multiline={true}
        onChangeText={setField2Value}
        onFocus={() => handleFocus(field2Ref)}
        style={styles.textInput}
        verticalAlign="top"
      />

      <View style={styles.fakeInput}>
        <Text>Other field</Text>
      </View>
      <View style={styles.fakeInput}>
        <Text>Another field</Text>
      </View>
      <View style={styles.fakeInput}>
        <Text>More content</Text>
      </View>
      <View style={styles.fakeInput}>
        <Text>And more</Text>
      </View>
      <View style={{height: 500}} />
    </ScrollView>
  );
};

export default TextInputScreen;

const styles = StyleSheet.create({
  textInput: {
    height: 100,
    borderWidth: 1,
    margin: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    fontSize: 16,
  },
  fakeInput: {
    height: 60,
    borderWidth: 1,
    margin: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
});
