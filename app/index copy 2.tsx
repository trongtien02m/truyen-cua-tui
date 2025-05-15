import React, { useEffect, useState } from 'react';
import {
  AppState,
  Button,
  PermissionsAndroid,
  Platform,
  Text,
  View,
} from 'react-native';
import BackgroundService from 'react-native-background-actions';

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const veryIntensiveTask = async (taskData: any) => {
  const { delay } = taskData;
  while (BackgroundService.isRunning()) {
    const now = new Date().toISOString();
    console.log(`[Background Task] ${now}`);
    await sleep(delay);
  }
};

const options = {
  taskName: 'TimeLogger',
  taskTitle: 'Time Logger Running',
  taskDesc: 'Logging time every second...',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourapp://home',
  parameters: {
    delay: 1000,
  },
};

export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      appStateListener.remove(); // Clean up listener when component unmounts
    };
  }, []);

  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      console.log('App is in the background, stopping the background task');
      stopBackgroundService();
    }
  };

  const startBackgroundService = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Permission Required',
          message:
            'App needs notification permission to run background service',
          buttonPositive: 'OK',
        },
      );
    }

    await BackgroundService.start(veryIntensiveTask, options);
    setIsRunning(true);
  };

  const stopBackgroundService = async () => {
    await BackgroundService.stop();
    setIsRunning(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{isRunning ? 'Task is running...' : 'Task is stopped'}</Text>
      <Button
        title="Start Background Task"
        onPress={startBackgroundService}
        disabled={isRunning}
      />
      <Button
        title="Stop Background Task"
        onPress={stopBackgroundService}
        disabled={!isRunning}
      />
    </View>
  );
}
