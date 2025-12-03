// Supabase generated types

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          name_cn: string | null;
          slug: string;
          description: string | null;
          icon: string | null;
          color: string;
          sort_order: number;
          workflow_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['categories']['Row'],
          'created_at' | 'updated_at' | 'workflow_count'
        >;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };

      repo_sources: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          owner: string;
          repo: string;
          branch: string;
          root_path: string | null;
          strategy: string;
          exclude_paths: string[] | null;
          default_tags: string[] | null;
          weight: number;
          is_featured: boolean;
          is_active: boolean;
          total_workflows: number;
          last_synced_at: string | null;
          last_sync_error: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['repo_sources']['Row'],
          'created_at' | 'updated_at' | 'total_workflows'
        >;
        Update: Partial<Database['public']['Tables']['repo_sources']['Insert']>;
      };

      workflows: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          category_id: string | null;
          tags: string[];
          repo_id: string;
          file_path: string;
          github_url: string;
          raw_url: string;
          dsl_content: string;
          content_hash: string;
          readme_content: string | null;
          dify_version: string | null;
          app_mode: string | null;
          node_count: number;
          node_types: string[];
          has_knowledge_base: boolean;
          has_tool_nodes: boolean;
          preview_image_url: string | null;
          has_valid_positions: boolean;
          view_count: number;
          download_count: number;
          works_count: number;
          broken_count: number;
          github_updated_at: string | null;
          synced_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['workflows']['Row'],
          | 'id'
          | 'created_at'
          | 'updated_at'
          | 'view_count'
          | 'download_count'
          | 'works_count'
          | 'broken_count'
        >;
        Update: Partial<Database['public']['Tables']['workflows']['Insert']>;
      };

      workflow_events: {
        Row: {
          id: number;
          workflow_id: string | null;
          event_type: string;
          ip_address: string | null;
          user_agent: string | null;
          country: string | null;
          referer: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['workflow_events']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<
          Database['public']['Tables']['workflow_events']['Insert']
        >;
      };

      workflow_feedback: {
        Row: {
          id: string;
          workflow_id: string;
          feedback_type: 'works' | 'broken';
          dify_version: string | null;
          comment: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['workflow_feedback']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<
          Database['public']['Tables']['workflow_feedback']['Insert']
        >;
      };

      sync_logs: {
        Row: {
          id: string;
          repo_id: string | null;
          status: 'started' | 'completed' | 'failed';
          workflows_added: number;
          workflows_updated: number;
          workflows_unchanged: number;
          workflows_deleted: number;
          error_message: string | null;
          duration_ms: number | null;
          started_at: string;
          completed_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['sync_logs']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['sync_logs']['Insert']>;
      };
    };
    Views: {
      category_stats: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          color: string;
          sort_order: number;
          workflow_count: number;
          total_downloads: number;
          total_views: number;
        };
      };
    };
    Functions: {
      increment_workflow_stat: {
        Args: {
          p_workflow_id: string;
          p_stat_name: string;
          p_increment: number;
        };
        Returns: void;
      };
      increment_download_count: {
        Args: {
          workflow_id: string;
        };
        Returns: void;
      };
      increment_view_count: {
        Args: {
          workflow_id: string;
        };
        Returns: void;
      };
      increment_feedback_count: {
        Args: {
          workflow_id: string;
          field_name: string;
        };
        Returns: void;
      };
    };
  };
}
