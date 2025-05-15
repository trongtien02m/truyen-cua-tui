import { get, set } from '@/helpers/mmkvStoreUtils';
import ChapterEvent from '@app/events/ChapterEvent';
import * as Speech from 'expo-speech';
import { StoreValueType } from '../types/StoreValueType';

export const speak = (sentences: string[], index: number): void => {
  console.log('speak', sentences);
  const voice = get('voice') || 'vi-vn-x-vic-local';
  const pitch = get('pitch', StoreValueType.Number) || 1;
  const rate = get('rate', StoreValueType.Number) || 1;

  if (index < sentences.length) {
    Speech.speak(sentences[index], {
      language: 'vi-VN',
      voice: voice,
      pitch: pitch,
      rate: rate,
      onDone: () => speak(sentences, index + 1),
    });
  } else {
    const nextChapter = get('currentChapter', StoreValueType.Number) + 1;
    set('currentChapter', nextChapter);
    ChapterEvent.emit('chapterChanged', nextChapter);
  }
};

export const stop = () => {
  console.log('stop');
  Speech.stop();
};
