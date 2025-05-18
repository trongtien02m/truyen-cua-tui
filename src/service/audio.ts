import ChapterEvent from '@/events/ChapterEvent';
import { get, set } from '@/helpers/mmkvStoreUtils';
import * as Speech from 'expo-speech';
import { StoreValueType } from '../types/StoreValueType';

export const speak = ({
  sentences,
  index,
  updateSentenceIndex,
}: {
  sentences: string[];
  index: number;
  updateSentenceIndex: (index: number) => void;
}): void => {
  if (!sentences?.length) return;

  const voice = get('voice') || 'vi-vn-x-vic-local';
  const pitch = get('pitch', StoreValueType.Number) || 1.1;
  const rate = get('rate', StoreValueType.Number) || 1.8;

  if (index < sentences.length) {
    // Cập nhật chỉ số câu hiện tại
    updateSentenceIndex(index);

    Speech.speak(sentences[index], {
      language: 'vi-VN',
      voice,
      pitch,
      rate,
      onDone: () =>
        speak({
          sentences,
          index: index + 1,
          updateSentenceIndex,
        }),
    });
  } else {
    const nextChapter = (get('currentChapter', StoreValueType.Number) || 0) + 1;
    set('currentChapter', nextChapter);
    ChapterEvent.emit('chapterChanged', nextChapter);
  }
};
export const stop = () => {
  Speech.stop();
};
