import { Book } from '@/types/Book';

export const mappingBook = (rawData: any): Book => {
  return {
    id: rawData.id,
    name: rawData.name,
    slug: rawData.slug,
    poster: {
      default: rawData.poster?.default || '',
      '600': rawData.poster?.['600'] || '',
      '300': rawData.poster?.['300'] || '',
      '150': rawData.poster?.['150'] || '',
    },
    synopsis: rawData.synopsis,
    chapter_count: rawData.chapter_count,
    view_count: rawData.view_count,
    vote_count: rawData.vote_count,
    word_count: rawData.word_count,
    created_at: rawData.created_at,
    updated_at: rawData.updated_at,
    published_at: rawData.published_at,
    user_id: rawData.user_id,
    author: {
      id: rawData.author.id,
      name: rawData.author.name,
      avatar: rawData.author.avatar || null,
      object_type: rawData.author.object_type,
    },
  };
};
