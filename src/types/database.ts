export interface Database {
  public: {
    Tables: {
      assessments: {
        Row: {
          id: string;
          created_at: string;
          first_name: string | null;
          last_name: string | null;
          company_name: string | null;
          ili: number | null;
          iar: number | null;
          bottleneck: string | null;
          followup_status: string | null;
        };
      };
    };
  };
}
