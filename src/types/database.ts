export interface Database {
  public: {
    Tables: {
      news: {
        Row: {
          id: string;
          title: string;
          content: string;
          date: string;
          author: string;
          image: string | null;
          imageCaption: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          date: string;
          author: string;
          image?: string | null;
          imageCaption?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          date?: string;
          author?: string;
          image?: string | null;
          imageCaption?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}