export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          content_type: "book" | "lecture" | "khutba" | "dua" | "wisdom" | "guide";
          image_url: string | null;
          hidden: boolean;
          parent_id: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["categories"]["Row"],
          "id" | "created_at" | "sort_order"
        > & { sort_order?: number };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      pages: {
        Row: {
          id: string;
          slug: string;
          parent_id: string | null;
          title: string;
          subtitle: string | null;
          hero_image_url: string | null;
          body: string | null;
          meta_description: string | null;
          sort_order: number;
          hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["pages"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["pages"]["Insert"]>;
        Relationships: [];
      };
      books: {
        Row: {
          id: string;
          title: string;
          slug: string;
          author: string;
          translator: string | null;
          description: string | null;
          cover_url: string | null;
          pdf_url: string | null;
          category_id: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["books"]["Row"], "id" | "created_at" | "display_order"> & { display_order?: number };
        Update: Partial<Database["public"]["Tables"]["books"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "books_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      lectures: {
        Row: {
          id: string;
          title: string;
          slug: string;
          speaker: string;
          description: string | null;
          audio_url: string | null;
          video_url: string | null;
          category_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["lectures"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["lectures"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "lectures_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      khutbas: {
        Row: {
          id: string;
          title: string;
          slug: string;
          speaker: string;
          description: string | null;
          audio_url: string | null;
          video_url: string | null;
          category_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["khutbas"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["khutbas"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "khutbas_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      duas: {
        Row: {
          id: string;
          title: string | null;
          arabic_text: string;
          translation: string;
          transliteration: string | null;
          source: string | null;
          category_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["duas"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["duas"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "duas_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      wisdom: {
        Row: {
          id: string;
          quote_arabic: string | null;
          quote_english: string;
          attribution: string;
          source: string | null;
          category_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["wisdom"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["wisdom"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "wisdom_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      guides: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          category_id: string | null;
          order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["guides"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["guides"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "guides_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      page_views: {
        Row: {
          id: string;
          path: string;
          visited_at: string;
          referrer: string | null;
          visitor_id: string | null;
          user_agent: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["page_views"]["Row"],
          "id" | "visited_at" | "referrer" | "visitor_id" | "user_agent"
        > & {
          referrer?: string | null;
          visitor_id?: string | null;
          user_agent?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["page_views"]["Insert"]>;
        Relationships: [];
      };
      audit_log: {
        Row: {
          id: string;
          actor_email: string | null;
          action: string;
          resource_type: string;
          resource_id: string | null;
          resource_title: string | null;
          details: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["audit_log"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["audit_log"]["Insert"]>;
        Relationships: [];
      };
      link_check_results: {
        Row: {
          id: string;
          resource_type: "book" | "lecture" | "khutba";
          resource_id: string;
          field: "cover_url" | "pdf_url" | "audio_url" | "video_url";
          url: string;
          status: "ok" | "broken" | "timeout" | "error";
          http_code: number | null;
          error_message: string | null;
          checked_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["link_check_results"]["Row"],
          "id" | "checked_at"
        > & { id?: string; checked_at?: string };
        Update: Partial<
          Database["public"]["Tables"]["link_check_results"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// Helper types for easier use
export type Book = Database["public"]["Tables"]["books"]["Row"];
export type Lecture = Database["public"]["Tables"]["lectures"]["Row"];
export type Khutba = Database["public"]["Tables"]["khutbas"]["Row"];
export type Dua = Database["public"]["Tables"]["duas"]["Row"];
export type Wisdom = Database["public"]["Tables"]["wisdom"]["Row"];
export type Guide = Database["public"]["Tables"]["guides"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Page = Database["public"]["Tables"]["pages"]["Row"];
