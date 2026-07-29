export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type LoyaltyTier = "Seedling" | "Bloom" | "Forest";

export type Database = {
  public: {
    Tables: {
      loyalty_points: {
        Row: {
          id: string;
          user_id: string;
          points_balance: number;
          tier: LoyaltyTier;
          lifetime_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          points_balance?: number;
          tier?: LoyaltyTier;
          lifetime_points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          points_balance?: number;
          tier?: LoyaltyTier;
          lifetime_points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notify_requests: {
        Row: {
          id: string;
          product_id: string | null;
          product_slug: string | null;
          email: string;
          size: string | null;
          color: string | null;
          variant_id: string | null;
          notified_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          product_slug?: string | null;
          email: string;
          size?: string | null;
          color?: string | null;
          variant_id?: string | null;
          notified_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          product_slug?: string | null;
          email?: string;
          size?: string | null;
          color?: string | null;
          variant_id?: string | null;
          notified_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          category_id: string | null;
          category: string | null;
          images: string[];
          badge: string | null;
          color_variants: Json;
          variants: Json;
          inventory_count: number;
          rating: number;
          review_count: number;
          fabric_composition: string | null;
          comfort_score: number | null;
          breathability_score: number | null;
          softness_score: number | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          category_id?: string | null;
          category?: string | null;
          images?: string[];
          badge?: string | null;
          color_variants?: Json;
          variants?: Json;
          inventory_count?: number;
          rating?: number;
          review_count?: number;
          fabric_composition?: string | null;
          comfort_score?: number | null;
          breathability_score?: number | null;
          softness_score?: number | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          category_id?: string | null;
          category?: string | null;
          images?: string[];
          badge?: string | null;
          color_variants?: Json;
          variants?: Json;
          inventory_count?: number;
          rating?: number;
          review_count?: number;
          fabric_composition?: string | null;
          comfort_score?: number | null;
          breathability_score?: number | null;
          softness_score?: number | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [{ foreignKeyName: "products_category_id_fkey"; columns: ["category_id"]; isOneToOne: false; referencedRelation: "categories"; referencedColumns: ["id"] }];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          customer_email: string | null;
          status: string;
          items: Json;
          subtotal: number;
          discount: number;
          total: number;
          shipping_address: Json | null;
          payment_method: string | null;
          payment_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id?: string | null;
          customer_email?: string | null;
          status?: string;
          items?: Json;
          subtotal?: number;
          discount?: number;
          total: number;
          shipping_address?: Json | null;
          payment_method?: string | null;
          payment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          customer_email?: string | null;
          status?: string;
          items?: Json;
          subtotal?: number;
          discount?: number;
          total?: number;
          shipping_address?: Json | null;
          payment_method?: string | null;
          payment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          customer_id: string;
          item_index: number;
          product_slug: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          size: string | null;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          customer_id: string;
          item_index: number;
          product_slug: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          size?: string | null;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          customer_id?: string;
          item_index?: number;
          product_slug?: string;
          product_name?: string;
          quantity?: number;
          unit_price?: number;
          size?: string | null;
          color?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "order_items_order_id_fkey"; columns: ["order_id"]; isOneToOne: false; referencedRelation: "orders"; referencedColumns: ["id"] },
          { foreignKeyName: "order_items_customer_id_fkey"; columns: ["customer_id"]; isOneToOne: false; referencedRelation: "customers"; referencedColumns: ["id"] }
        ];
      };
      customers: {
        Row: {
          id: string;
          auth_user_id: string | null;
          name: string;
          email: string;
          phone: string | null;
          addresses: Json;
          reward_points: number;
          tier: string;
          total_spent: number;
          size_profile: Json;
          notification_preferences: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          name: string;
          email: string;
          phone?: string | null;
          addresses?: Json;
          reward_points?: number;
          tier?: string;
          total_spent?: number;
          size_profile?: Json;
          notification_preferences?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string | null;
          name?: string;
          email?: string;
          phone?: string | null;
          addresses?: Json;
          reward_points?: number;
          tier?: string;
          total_spent?: number;
          size_profile?: Json;
          notification_preferences?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          product_id: string | null;
          customer_id: string | null;
          customer_name: string | null;
          rating: number | null;
          comment: string | null;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          customer_id?: string | null;
          customer_name?: string | null;
          rating?: number | null;
          comment?: string | null;
          is_approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          customer_id?: string | null;
          customer_name?: string | null;
          rating?: number | null;
          comment?: string | null;
          is_approved?: boolean;
          created_at?: string;
        };
        Relationships: [{ foreignKeyName: "reviews_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "products"; referencedColumns: ["id"] }];
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          cover_image: string | null;
          excerpt: string | null;
          content: string | null;
          author: string;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          cover_image?: string | null;
          excerpt?: string | null;
          content?: string | null;
          author?: string;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          cover_image?: string | null;
          excerpt?: string | null;
          content?: string | null;
          author?: string;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      discount_codes: {
        Row: {
          id: string;
          code: string;
          type: string | null;
          value: number;
          usage_limit: number | null;
          used_count: number;
          expires_at: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type?: string | null;
          value: number;
          usage_limit?: number | null;
          used_count?: number;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          type?: string | null;
          value?: number;
          usage_limit?: number | null;
          used_count?: number;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      store_settings: {
        Row: { key: string; value: Json; updated_at: string; };
        Insert: { key: string; value: Json; updated_at?: string; };
        Update: { key?: string; value?: Json; updated_at?: string; };
        Relationships: [];
      };
      store_content: {
        Row: { id: string; type: string; slug: string; title: string | null; payload: Json; created_at: string; updated_at: string; };
        Insert: { id?: string; type: string; slug: string; title?: string | null; payload?: Json; created_at?: string; updated_at?: string; };
        Update: { id?: string; type?: string; slug?: string; title?: string | null; payload?: Json; created_at?: string; updated_at?: string; };
        Relationships: [];
      };
      admin_users: {
        Row: {
          auth_user_id: string;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: {
          auth_user_id: string;
          email: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          auth_user_id?: string;
          email?: string;
          role?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      record_razorpay_order: {
        Args: {
          p_order_number: string;
          p_customer_id: string;
          p_customer_email: string | null;
          p_items: Json;
          p_subtotal: number;
          p_total: number;
          p_shipping_address: Json | null;
          p_payment_id: string;
        };
        Returns: string;
      };
      transition_razorpay_order_status: {
        Args: {
          p_payment_id: string | null;
          p_order_number: string | null;
          p_target_status: string;
        };
        Returns: string;
      };
      finalize_razorpay_order: {
        Args: {
          p_order_number: string;
          p_items: Json;
          p_payment_id: string;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
