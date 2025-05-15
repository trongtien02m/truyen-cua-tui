export interface Chapter {
  id: number;
  name: string;
  index: number;
  word_count: number;
  view_count: number;
  user_id: number;
  published_at: string; // ISO 8601 date string
  unlock_price: number;
  unlock_key_price: number;
  is_locked: boolean | null;
  object_type: string;
  previous: {
    index: number;
  };
  next: {
    index: number;
  };
  sentences: string[];
}
