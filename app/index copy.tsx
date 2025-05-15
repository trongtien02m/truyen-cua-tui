import React, { useEffect, useState } from 'react';
import { AppState, Button, Text, View } from 'react-native';
import BackgroundService from 'react-native-background-actions';
import { get, set } from '../src/helpers/mmkvStoreUtils';
import { speak, stop } from '../src/service/audio';
import { StoreValueType } from '../src/types/StoreValueType';
import ChapterEvent from './events/ChapterEvent';

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const veryIntensiveTask = async () => {
  console.log('📡 Listening for chapterChanged events...');

  const initialChapter = get('currentChapter', StoreValueType.Number);

  const chapter = get('currentChapter', StoreValueType.Number);
  const sentences = Array.from(
    { length: 5 },
    (_, i) => `Chapter ${chapter} - Câu ${i + 1}`,
  );
  speak(sentences, 0);

  const handler = async (newChapter: number) => {
    console.log('📘 New chapter triggered:', newChapter);

    const sentences = Array.from(
      { length: 5 },
      (_, i) => `Chapter ${newChapter} - Câu ${i + 1}`,
    );
    speak(sentences, 0);
  };

  ChapterEvent.on('chapterChanged', handler);

  while (BackgroundService.isRunning()) {
    await sleep(10000); // Không làm gì cả, chỉ để duy trì
  }

  ChapterEvent.off('chapterChanged', handler);
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
  set('currentChapter', 1);
  set('speakingChapter', 1);
  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      stopBackgroundService();
      appStateListener.remove(); // Clean up listener when component unmounts
    };
  }, []);

  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'inactive') {
      console.log('App is in the background, stopping the background task');
      stopBackgroundService();
    }
  };

  const startBackgroundService = async () => {
    await BackgroundService.start(veryIntensiveTask, options);
  };

  const stopBackgroundService = async () => {
    console.log('stopBackgroundService');
    await BackgroundService.stop();
    stop();
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
