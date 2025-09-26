import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Subscribe to network status
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      console.log('[DEBUG] Network status changed:', state.isConnected);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return isConnected;
};

export default useNetworkStatus;
