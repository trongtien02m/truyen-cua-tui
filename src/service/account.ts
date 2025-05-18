import { get, set } from '@/helpers/mmkvStoreUtils';
import { Book } from '@/types/Book';
import { StoreValueType } from '@/types/StoreValueType';

export const getMyBooks = () => {
  return get('myBooks', StoreValueType.Object);
};

export const updateMyBooks = (book: Book) => {
  const myBooks = getMyBooks() || [];

  const existedBook = myBooks.findIndex((b: Book) => b.id === book.id);

  if (existedBook > -1) {
    myBooks[existedBook] = book;
  } else {
    myBooks.push(book);
  }

  set('myBooks', myBooks);
};

export const getCurrentBook = (bookId: number) => {
  const myBooks = get('myBooks', StoreValueType.Object);

  if (!myBooks) return undefined;

  return myBooks.find((b: Book) => b.id === bookId);
};
