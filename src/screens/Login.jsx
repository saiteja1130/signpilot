import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import Logo from '../../assets/images/app logo.svg';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {addLoginData} from '../Redux/Slices/LoginData';
import {createUsersTable, getUsers, insertUser} from '../Db/db';
import Icon from 'react-native-vector-icons/Ionicons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [secureEntry, setSecurityEntry] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toggleSecureEntry = () => {
    setSecurityEntry(prev => !prev);
  };

  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;
    let newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Please Enter Email';
      valid = false;
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Invalid Email Format';
      valid = false;
    }
    if (!password.trim()) {
      newErrors.password = 'Please Enter Password';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    createUsersTable();
    const getDevicePlatform = () => {
      if (Platform.OS === 'android') {
        return 'Android';
      }
      if (Platform.OS === 'ios') {
        return 'iOS';
      }
      return 'Unknown';
    };
    if (!validateFields()) return;
    try {
      const data = {email, password};
      const response = await fetch('https://www.beeberg.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `ReactNativeApp ${getDevicePlatform()}`,
        },
        body: JSON.stringify(data),
      });
      const responsedata = await response.json();
      console.log(responsedata);
      if (responsedata?.status) {
        insertUser(responsedata);
        getUsers(users => {
          if (users.length > 0) {
            dispatch(addLoginData(users[0]));
            navigation.navigate('Home');
          }
          console.log(users);
        });
        return;
      }
      if (!responsedata?.status) {
        setErrors(prev => ({
          ...prev,
          invalidError: responsedata?.message,
        }));
        return;
      }
    } catch (error) {
      console.log(error);
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo width={160} height={160} />
      </View>
      {errors?.invalidError && (
        <Text style={{color: 'red', fontSize: 12}}>{errors?.invalidError}</Text>
      )}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>User Email</Text>
        <View>
          <TextInput
            style={[
              styles.input,
              {borderColor: errors?.email ? 'red' : 'black'},
            ]}
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
          />
          {errors?.email && (
            <Text style={{color: 'red', fontSize: 12}}>{errors.email}</Text>
          )}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <View>
          <View
            style={[
              styles.passwordContainer,
              {borderColor: errors?.password ? 'red' : 'black'},
            ]}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={[
                styles.input,
                {
                  flex: 1,
                  borderWidth: 0,
                },
              ]}
              placeholder="********"
              secureTextEntry={secureEntry}
            />
            <TouchableOpacity onPress={toggleSecureEntry}>
              <Icon
                name={secureEntry ? 'eye-off' : 'eye'}
                size={20}
                color="gray"
                style={{marginLeft: 10}}
              />
            </TouchableOpacity>
          </View>
          {errors?.password && (
            <Text style={{color: 'red', fontSize: 12}}>{errors.password}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  logoContainer: {
    alignItems: 'flex-start',
  },
  inputGroup: {
    gap: 5,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
  },
  input: {
    borderWidth: 0.8,
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 13,
    fontSize: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF9239',
    marginTop: 15,
    padding: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
  },
});
