export interface Book {
  id: number;
  name: string;
  slug: string;
  poster: {
    default: string;
    '600': string;
    '300': string;
    '150': string;
  };
  synopsis: string;
  current_reading_chapter?: number,
  chapter_count: number;
  view_count: number;
  vote_count: number;
  word_count: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  user_id: number;
  author: {
    id: number;
    name: string;
    avatar: string | null;
    object_type: string;
  };
}
