export interface Book {
  id: number;
  name: string;
  slug: string;
  kind: number;
  sex: number;
  state: string;
  status: number;
  link: string;
  note: string;
  status_name: string;
  first_chapter: number;
  latest_chapter: number;
  latest_index: number;
  high_quality: number;
  manager_pick: number;
  poster: {
    default: string;
    "600": string;
    "300": string;
    "150": string;
  };
  synopsis: string;
  vote_count: number;
  review_score: string;
  review_count: number;
  comment_count: number;
  chapter_count: number;
  view_count: number;
  word_count: number;
  created_at: string;
  updated_at: string;
  new_chap_at: string;
  published_at: string;
  published: number;
  user_id: number;
  object_type: string;
  bookmark_count: number;
  chapter_per_week: number;
  ready_for_sale: number;
  discount_price: number;
  discount: number;
  creator: {
    id: number;
    name: string;
    avatar: string[];
    level: number;
    exp: number;
    object_type: string;
  };
  author: {
    id: number;
    name: string;
    avatar: string | null;
    object_type: string;
  };
  genres: {
    id: number;
    name: string;
    object_type: string;
  }[];
  tags: {
    id: number;
    name: string;
    type_id: string;
    object_type: string;
  }[];
}