import { create } from "zustand";
import { Book } from "../types/Book";
import { Chapter } from "../types/Chapter";
import decryptContent from "../helpers/decryptContent";

interface AppState {
  currentBook: Book | null; // Sách hiện tại
  setCurrentBook: (book: Book | null) => void;
  chapters: Chapter[] | null; // Danh sách chương
  currentChapter: Chapter | null; // Chương hiện tại
  setCurrentChapter: (chapter: Chapter) => void;
  sentences: string[]; // Nội dung chương
  fetchChapters: () => Promise<void>;
  fetchChapterContent: () => Promise<void>;
}

const useAppStore = create<AppState>((set, get) => ({
  currentBook: null, // Giá trị mặc định
  setCurrentBook: (book) => {
    set({ currentBook: book });

    if (book) {
      get().fetchChapters(); // Gọi fetchChapters khi currentBook thay đổi
    }
  },
  currentChapter: null, // Giá trị mặc định (-1 nghĩa là chưa chọn chương nào)
  setCurrentChapter: (chapter) => {
    set({ currentChapter: chapter });

    get().fetchChapterContent(); // Gọi fetchChapterContent khi currentChapter thay đổi
  },
  chapters: null, // Giá trị mặc định
  sentences: [], // Giá trị mặc định
  fetchChapters: async () => {
    const currentBook = get().currentBook;
    if (!currentBook) {
      return; // Nếu không có sách hiện tại, không làm gì cả
    }

    try {
      const url = `https://backend.metruyencv.com/api/chapters?filter[book_id]=${currentBook?.id}&filter[type]=published`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách chương.");
      }

      const data = await response.json();

      set({
        chapters: data.data,
      });
    } catch (err) {
      console.error("Lỗi khi lấy danh sách chương:", err);
    }
  },
  fetchChapterContent: async () => {
    const currentBook = get().currentBook;
    const currentChapter = get().currentChapter;

    if (
      !currentBook ||
      !currentChapter ||
      currentChapter.index < 0 ||
      currentChapter.index > currentBook.chapter_count
    ) {
      return [];
    }

    try {
      const url = `https://metruyencv.com/truyen/${currentBook.slug}/chuong-${currentChapter.index}`;
      const response = await fetch(url);
      const html = await response.text();
      const match = html.match(/content:\s*"(.*?)"/);

      if (match && match[1]) {
        let encryptContent = match[1];
        encryptContent = encryptContent.replace(/\\\//g, "/");
        encryptContent = encryptContent.replace(/\\n/g, "\n");
        encryptContent = encryptContent.replace(/\\t/g, "\t");
        encryptContent = encryptContent.replace(/\\"/g, '"');
        encryptContent = encryptContent.replace(/\\\\/g, "\\");

        let content = decryptContent(encryptContent);
        content = content.map((item: string) => item.replace(/"/g, ""));

        set({ sentences: content });
        return content;
      }
    } catch (err) {
      console.error("Error fetching chapter content:", err);
    }
  },
}));

export default useAppStore;
