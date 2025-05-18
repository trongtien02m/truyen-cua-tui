import { Book } from '@/types/Book';
import { Chapter } from '@/types/Chapter';
import { create } from 'zustand';
import { chapters, currentBook } from './mockData';

interface AppState {
  currentBook: Book | null; // Sách hiện tại
  setCurrentBook: (book: Book | null) => void;
  chapters: Chapter[] | null; // Danh sách chương
  currentChapter: Chapter | null; // Chương hiện tại
  setCurrentChapter: (chapter: Chapter | undefined) => void;
  sentences: string[]; // Nội dung chương
  setSentences: (sentences: string[]) => void;
  fetchChapters: () => Promise<void>;
}

const useAppStore = create<AppState>((set, get) => ({
  currentBook: currentBook, // Giá trị mặc định
  setCurrentBook: (book) => {
    set({ currentBook: book });

    if (book) {
      get().fetchChapters(); // Gọi fetchChapters khi currentBook thay đổi
    }
  },
  currentChapter: null, // Giá trị mặc định (-1 nghĩa là chưa chọn chương nào)
  setCurrentChapter: (chapter) => {
    set({ currentChapter: chapter });
  },
  chapters: chapters, // Giá trị mặc định
  sentences: [], // Giá trị mặc định
  setSentences: (sentences: string[]) => {
    set({ sentences });
  },
  fetchChapters: async () => {
    const currentBook = get().currentBook;
    if (!currentBook) {
      return; // Nếu không có sách hiện tại, không làm gì cả
    }

    try {
      const url = `https://backend.metruyencv.com/api/chapters?filter[book_id]=${currentBook?.id}&filter[type]=published`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Không thể lấy danh sách chương.');
      }

      const data = await response.json();

      set({
        chapters: data.data,
      });
    } catch (err) {
      console.error('Lỗi khi lấy danh sách chương:', err);
    }
  },
}));

export default useAppStore;
