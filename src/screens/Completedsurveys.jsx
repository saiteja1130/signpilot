import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Logo from '../../assets/images/app logo.svg';
import Refresh from '../../assets/images/cloud.svg';
import Menu from '../../assets/images/close.svg';
import {
  changeSignSubmitStatus,
  getCompletedSurveys,
} from '../Functions/functions';
import {useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ProgressBar from '../Components/Progressbar';

const Completedsurveys = () => {
  const baseUrl = useSelector(state => state.baseUrl.value);

  const navigation = useNavigation();
  const loginData = useSelector(state => state.login.value);
  const [loading, setLoading] = useState(false);
  const [submittedSigns, setSubmittedSigns] = useState([]);
  const [expandedIndexes, setExpandedIndexes] = useState({});

  const toggleDetails = index => {
    setExpandedIndexes(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const changeStatus = async sign => {
    try {
      await changeSignSubmitStatus({
        token: loginData?.tokenNumber,
        signId: sign?.signId,
        userId: loginData?.userId,
        role: loginData?.role,
        baseUrl
      });
      await getCompletedSurveys(loginData, setSubmittedSigns,baseUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({item, index}) => {
    const isExpanded = expandedIndexes[index];

    return (
      <View>
        <TouchableOpacity
          style={styles.row}
          onPress={() => toggleDetails(index)}>
          <Icon name="folder" size={20} color="#f2962f" />
          <Text style={styles.title}>{item.projectName}</Text>
          <Text style={styles.dueDate}>
            {item.latestSignSubmittedDate || 'No date'}
          </Text>
          <Icon
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-right'}
            size={24}
            color="#333"
          />
        </TouchableOpacity>

        {isExpanded &&
          item.signs?.map((sign, subIndex) => (
            <View style={styles.details} key={subIndex}>
              <TouchableOpacity onPress={() => changeStatus(sign)}>
                <Icon1 name="close-circle-outline" size={26} color="#f44336" />
              </TouchableOpacity>

              <Icon name="assignment" size={20} color="#007aff" />
              <Text style={styles.detailText}>
                Survey Module: {sign.aliasName}
              </Text>
            </View>
          ))}
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getCompletedSurveys(loginData, setSubmittedSigns,baseUrl);
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 1200);
      return () => clearTimeout(timeout);
    }, [loginData]),
  );

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ProgressBar duration={1000} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo width={150} height={36} />
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => {}}>
            <Refresh width={36} height={36} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Menu width={36} height={36} />
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <View style={{padding: 18}}>
        <View style={styles.header1}>
          <Icon name="check-box" size={20} color="#007aff" />
          <Text style={styles.headerText}>Sign Surveys Complete</Text>
          <Text style={styles.dueHeader}>Due Date</Text>
        </View>

        <FlatList
          data={submittedSigns}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </View>
  );
};

export default Completedsurveys;

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 30,
  },
  logoContainer: {
    flex: 1,
  },
  header1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a2742',
    padding: 10,
  },
  headerText: {
    color: '#fff',
    marginLeft: 10,
    flex: 1,
  },
  dueHeader: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  dueDate: {
    marginRight: 10,
    color: '#888',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 36,
    marginBottom: 6,
    paddingVertical: 4,
  },
  detailText: {
    marginLeft: 10,
    color: '#007aff',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 15,
  },
});
