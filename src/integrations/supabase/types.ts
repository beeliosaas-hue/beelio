export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      biblioteca: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome_arquivo: string
          pasta: string | null
          tags: string[] | null
          tamanho_arquivo: number | null
          tipo_arquivo: string
          updated_at: string
          url_arquivo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome_arquivo: string
          pasta?: string | null
          tags?: string[] | null
          tamanho_arquivo?: number | null
          tipo_arquivo: string
          updated_at?: string
          url_arquivo: string
          user_id: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome_arquivo?: string
          pasta?: string | null
          tags?: string[] | null
          tamanho_arquivo?: number | null
          tipo_arquivo?: string
          updated_at?: string
          url_arquivo?: string
          user_id?: string
        }
        Relationships: []
      }
      brandings: {
        Row: {
          branding_sensorial: Json | null
          calendario_editorial: Json | null
          comunicacao_canais: Json | null
          conteudo_estrategico: Json | null
          created_at: string
          elementos_visuais: string[] | null
          estrategia_lancamentos: Json | null
          estrategia_trafego: Json | null
          experiencia_usuario: Json | null
          feedback_clientes: Json | null
          guia_estilo_url: string | null
          id: string
          logo_versoes: Json | null
          mapeamento_concorrencia: Json | null
          metricas_kpis: Json | null
          nome_marca: string
          objetivos_curto_prazo: string | null
          objetivos_longo_prazo: string | null
          objetivos_medio_prazo: string | null
          paleta_cores: string[] | null
          perfis_sociais: Json | null
          pontos_contato: Json | null
          site_otimizado: Json | null
          tipografias: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          branding_sensorial?: Json | null
          calendario_editorial?: Json | null
          comunicacao_canais?: Json | null
          conteudo_estrategico?: Json | null
          created_at?: string
          elementos_visuais?: string[] | null
          estrategia_lancamentos?: Json | null
          estrategia_trafego?: Json | null
          experiencia_usuario?: Json | null
          feedback_clientes?: Json | null
          guia_estilo_url?: string | null
          id?: string
          logo_versoes?: Json | null
          mapeamento_concorrencia?: Json | null
          metricas_kpis?: Json | null
          nome_marca: string
          objetivos_curto_prazo?: string | null
          objetivos_longo_prazo?: string | null
          objetivos_medio_prazo?: string | null
          paleta_cores?: string[] | null
          perfis_sociais?: Json | null
          pontos_contato?: Json | null
          site_otimizado?: Json | null
          tipografias?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          branding_sensorial?: Json | null
          calendario_editorial?: Json | null
          comunicacao_canais?: Json | null
          conteudo_estrategico?: Json | null
          created_at?: string
          elementos_visuais?: string[] | null
          estrategia_lancamentos?: Json | null
          estrategia_trafego?: Json | null
          experiencia_usuario?: Json | null
          feedback_clientes?: Json | null
          guia_estilo_url?: string | null
          id?: string
          logo_versoes?: Json | null
          mapeamento_concorrencia?: Json | null
          metricas_kpis?: Json | null
          nome_marca?: string
          objetivos_curto_prazo?: string | null
          objetivos_longo_prazo?: string | null
          objetivos_medio_prazo?: string | null
          paleta_cores?: string[] | null
          perfis_sociais?: Json | null
          pontos_contato?: Json | null
          site_otimizado?: Json | null
          tipografias?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      briefings: {
        Row: {
          admira_concorrentes: string | null
          busca_solucao: string | null
          canais_preferidos: string[] | null
          cliente_ideal: string | null
          concorrentes_diretos: Json | null
          cores_principais: string[] | null
          created_at: string
          desafios_atuais: string | null
          diferenciais: string | null
          dores: string | null
          faixa_etaria: string | null
          id: string
          informacoes_adicionais: string | null
          interesses: string | null
          lista_produtos: string | null
          localizacao: string | null
          localizacao_publico: string | null
          logo_url: string | null
          marcas_admiradas: string | null
          materiais_existentes: string[] | null
          meta_especifica: string | null
          missao: string | null
          nao_fazer: string | null
          nao_repetir: string | null
          nivel_socioeconomico: string | null
          nome_marca: string
          objetivos_marketing: string[] | null
          oportunidades: string | null
          personalidade: string[] | null
          principais_conquistas: string | null
          prioridade_atual: string | null
          progresso: number | null
          redes_sociais: string[] | null
          redes_utilizadas: string[] | null
          referencias_visuais: string[] | null
          resumo_historia: string | null
          segmento_atuacao: string | null
          site: string | null
          status: string | null
          ticket_medio: number | null
          tipo_conteudo: string[] | null
          tom_voz: string | null
          updated_at: string
          user_id: string
          valores: string | null
          visao: string | null
        }
        Insert: {
          admira_concorrentes?: string | null
          busca_solucao?: string | null
          canais_preferidos?: string[] | null
          cliente_ideal?: string | null
          concorrentes_diretos?: Json | null
          cores_principais?: string[] | null
          created_at?: string
          desafios_atuais?: string | null
          diferenciais?: string | null
          dores?: string | null
          faixa_etaria?: string | null
          id?: string
          informacoes_adicionais?: string | null
          interesses?: string | null
          lista_produtos?: string | null
          localizacao?: string | null
          localizacao_publico?: string | null
          logo_url?: string | null
          marcas_admiradas?: string | null
          materiais_existentes?: string[] | null
          meta_especifica?: string | null
          missao?: string | null
          nao_fazer?: string | null
          nao_repetir?: string | null
          nivel_socioeconomico?: string | null
          nome_marca: string
          objetivos_marketing?: string[] | null
          oportunidades?: string | null
          personalidade?: string[] | null
          principais_conquistas?: string | null
          prioridade_atual?: string | null
          progresso?: number | null
          redes_sociais?: string[] | null
          redes_utilizadas?: string[] | null
          referencias_visuais?: string[] | null
          resumo_historia?: string | null
          segmento_atuacao?: string | null
          site?: string | null
          status?: string | null
          ticket_medio?: number | null
          tipo_conteudo?: string[] | null
          tom_voz?: string | null
          updated_at?: string
          user_id: string
          valores?: string | null
          visao?: string | null
        }
        Update: {
          admira_concorrentes?: string | null
          busca_solucao?: string | null
          canais_preferidos?: string[] | null
          cliente_ideal?: string | null
          concorrentes_diretos?: Json | null
          cores_principais?: string[] | null
          created_at?: string
          desafios_atuais?: string | null
          diferenciais?: string | null
          dores?: string | null
          faixa_etaria?: string | null
          id?: string
          informacoes_adicionais?: string | null
          interesses?: string | null
          lista_produtos?: string | null
          localizacao?: string | null
          localizacao_publico?: string | null
          logo_url?: string | null
          marcas_admiradas?: string | null
          materiais_existentes?: string[] | null
          meta_especifica?: string | null
          missao?: string | null
          nao_fazer?: string | null
          nao_repetir?: string | null
          nivel_socioeconomico?: string | null
          nome_marca?: string
          objetivos_marketing?: string[] | null
          oportunidades?: string | null
          personalidade?: string[] | null
          principais_conquistas?: string | null
          prioridade_atual?: string | null
          progresso?: number | null
          redes_sociais?: string[] | null
          redes_utilizadas?: string[] | null
          referencias_visuais?: string[] | null
          resumo_historia?: string | null
          segmento_atuacao?: string | null
          site?: string | null
          status?: string | null
          ticket_medio?: number | null
          tipo_conteudo?: string[] | null
          tom_voz?: string | null
          updated_at?: string
          user_id?: string
          valores?: string | null
          visao?: string | null
        }
        Relationships: []
      }
      configuracoes_conta: {
        Row: {
          configuracoes: Json
          created_at: string
          id: string
          notificacoes: Json | null
          privacidade: Json | null
          tema: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          configuracoes?: Json
          created_at?: string
          id?: string
          notificacoes?: Json | null
          privacidade?: Json | null
          tema?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          configuracoes?: Json
          created_at?: string
          id?: string
          notificacoes?: Json | null
          privacidade?: Json | null
          tema?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      diana_conversations: {
        Row: {
          conversa_id: string
          created_at: string
          creditos_usados: number | null
          id: string
          mensagem: string
          metadata: Json | null
          resposta: string | null
          tipo_interacao: string | null
          user_id: string
        }
        Insert: {
          conversa_id?: string
          created_at?: string
          creditos_usados?: number | null
          id?: string
          mensagem: string
          metadata?: Json | null
          resposta?: string | null
          tipo_interacao?: string | null
          user_id: string
        }
        Update: {
          conversa_id?: string
          created_at?: string
          creditos_usados?: number | null
          id?: string
          mensagem?: string
          metadata?: Json | null
          resposta?: string | null
          tipo_interacao?: string | null
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          aprovacao_url: string | null
          conteudo: string | null
          created_at: string
          data_agendamento: string | null
          hashtags: string[] | null
          id: string
          midia_urls: string[] | null
          redes_sociais: string[] | null
          status: string | null
          tipo: string | null
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          aprovacao_url?: string | null
          conteudo?: string | null
          created_at?: string
          data_agendamento?: string | null
          hashtags?: string[] | null
          id?: string
          midia_urls?: string[] | null
          redes_sociais?: string[] | null
          status?: string | null
          tipo?: string | null
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          aprovacao_url?: string | null
          conteudo?: string | null
          created_at?: string
          data_agendamento?: string | null
          hashtags?: string[] | null
          id?: string
          midia_urls?: string[] | null
          redes_sociais?: string[] | null
          status?: string | null
          tipo?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          plan_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          plan_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          plan_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      relatorios: {
        Row: {
          created_at: string
          dados: Json
          formato: string | null
          id: string
          periodo_fim: string | null
          periodo_inicio: string | null
          tipo_relatorio: string
          url_arquivo: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          dados: Json
          formato?: string | null
          id?: string
          periodo_fim?: string | null
          periodo_inicio?: string | null
          tipo_relatorio: string
          url_arquivo?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          dados?: Json
          formato?: string | null
          id?: string
          periodo_fim?: string | null
          periodo_inicio?: string | null
          tipo_relatorio?: string
          url_arquivo?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tendencias: {
        Row: {
          categoria: string | null
          created_at: string
          data_evento: string | null
          descricao: string | null
          fonte: string | null
          id: string
          metadata: Json | null
          relevancia: number | null
          segmento: string[] | null
          tipo: string | null
          titulo: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          data_evento?: string | null
          descricao?: string | null
          fonte?: string | null
          id?: string
          metadata?: Json | null
          relevancia?: number | null
          segmento?: string[] | null
          tipo?: string | null
          titulo: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          data_evento?: string | null
          descricao?: string | null
          fonte?: string | null
          id?: string
          metadata?: Json | null
          relevancia?: number | null
          segmento?: string[] | null
          tipo?: string | null
          titulo?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
