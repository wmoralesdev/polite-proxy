export interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id?: string;
  is_own?: boolean;
}

