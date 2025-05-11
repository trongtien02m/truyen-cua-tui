import { Book } from "./Book";
import { Chapter } from "./Chapter";

export interface ChapterData {
  chapter: Chapter;
  book: Book;
  chapterCount: number,
}
