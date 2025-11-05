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
      aprovacoes: {
        Row: {
          aprovado_por: string | null
          assigned_to: string | null
          comentario: string | null
          comments: Json | null
          created_at: string
          data: string
          decided_at: string | null
          decided_by: string | null
          due_date: string | null
          entity_id: string | null
          entity_type: string | null
          equipe_id: string | null
          id: string
          item_id: string
          item_type: string | null
          requested_by: string | null
          status: string
          tipo_aprovacao: string
          updated_at: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          aprovado_por?: string | null
          assigned_to?: string | null
          comentario?: string | null
          comments?: Json | null
          created_at?: string
          data?: string
          decided_at?: string | null
          decided_by?: string | null
          due_date?: string | null
          entity_id?: string | null
          entity_type?: string | null
          equipe_id?: string | null
          id?: string
          item_id: string
          item_type?: string | null
          requested_by?: string | null
          status?: string
          tipo_aprovacao: string
          updated_at?: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          aprovado_por?: string | null
          assigned_to?: string | null
          comentario?: string | null
          comments?: Json | null
          created_at?: string
          data?: string
          decided_at?: string | null
          decided_by?: string | null
          due_date?: string | null
          entity_id?: string | null
          entity_type?: string | null
          equipe_id?: string | null
          id?: string
          item_id?: string
          item_type?: string | null
          requested_by?: string | null
          status?: string
          tipo_aprovacao?: string
          updated_at?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aprovacoes_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aprovacoes_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
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
      diana_contextos: {
        Row: {
          contexto_atual: Json | null
          created_at: string | null
          historico_conversas: Json | null
          id: string
          tokens_usados: number | null
          ultima_interacao: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contexto_atual?: Json | null
          created_at?: string | null
          historico_conversas?: Json | null
          id?: string
          tokens_usados?: number | null
          ultima_interacao?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contexto_atual?: Json | null
          created_at?: string | null
          historico_conversas?: Json | null
          id?: string
          tokens_usados?: number | null
          ultima_interacao?: string | null
          updated_at?: string | null
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
      diana_feedback: {
        Row: {
          avaliacao: Database["public"]["Enums"]["avaliacao_tipo"] | null
          conversa_id: string | null
          created_at: string | null
          data_feedback: string | null
          id: string
          mensagem: string
          resposta_diana: string | null
          user_id: string
        }
        Insert: {
          avaliacao?: Database["public"]["Enums"]["avaliacao_tipo"] | null
          conversa_id?: string | null
          created_at?: string | null
          data_feedback?: string | null
          id?: string
          mensagem: string
          resposta_diana?: string | null
          user_id: string
        }
        Update: {
          avaliacao?: Database["public"]["Enums"]["avaliacao_tipo"] | null
          conversa_id?: string | null
          created_at?: string | null
          data_feedback?: string | null
          id?: string
          mensagem?: string
          resposta_diana?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diana_feedback_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "diana_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      equipes: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          data_criacao: string | null
          descricao: string | null
          id: string
          nome_equipe: string
          updated_at: string | null
          usuario_principal_id: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: string
          nome_equipe: string
          updated_at?: string | null
          usuario_principal_id: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: string
          nome_equipe?: string
          updated_at?: string | null
          usuario_principal_id?: string
        }
        Relationships: []
      }
      feriados_nacionais: {
        Row: {
          ano: number
          created_at: string | null
          data: string
          descricao: string | null
          id: string
          nome: string
          regiao: string | null
          tipo: string | null
        }
        Insert: {
          ano: number
          created_at?: string | null
          data: string
          descricao?: string | null
          id?: string
          nome: string
          regiao?: string | null
          tipo?: string | null
        }
        Update: {
          ano?: number
          created_at?: string | null
          data?: string
          descricao?: string | null
          id?: string
          nome?: string
          regiao?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      invite_tokens: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          token: string
          used: boolean | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          token: string
          used?: boolean | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invite_tokens_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      membros_equipes: {
        Row: {
          ativo: boolean | null
          convite_aceito: boolean | null
          created_at: string | null
          data_aceitacao: string | null
          data_convite: string | null
          email_membro: string
          equipe_id: string
          funcao: Database["public"]["Enums"]["funcao_membro"] | null
          id: string
          nome_membro: string
          status: string | null
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          convite_aceito?: boolean | null
          created_at?: string | null
          data_aceitacao?: string | null
          data_convite?: string | null
          email_membro: string
          equipe_id: string
          funcao?: Database["public"]["Enums"]["funcao_membro"] | null
          id?: string
          nome_membro: string
          status?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          convite_aceito?: boolean | null
          created_at?: string | null
          data_aceitacao?: string | null
          data_convite?: string | null
          email_membro?: string
          equipe_id?: string
          funcao?: Database["public"]["Enums"]["funcao_membro"] | null
          id?: string
          nome_membro?: string
          status?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membros_equipes_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membros_equipes_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding: {
        Row: {
          completado: boolean | null
          data_preenchimento: string | null
          expectativas: string | null
          id: string
          identidade_visual: Json | null
          nome_marca: string | null
          objetivos: string | null
          publico_alvo: string | null
          segmento: string | null
          user_id: string
          voz_da_marca: string | null
        }
        Insert: {
          completado?: boolean | null
          data_preenchimento?: string | null
          expectativas?: string | null
          id?: string
          identidade_visual?: Json | null
          nome_marca?: string | null
          objetivos?: string | null
          publico_alvo?: string | null
          segmento?: string | null
          user_id: string
          voz_da_marca?: string | null
        }
        Update: {
          completado?: boolean | null
          data_preenchimento?: string | null
          expectativas?: string | null
          id?: string
          identidade_visual?: Json | null
          nome_marca?: string | null
          objetivos?: string | null
          publico_alvo?: string | null
          segmento?: string | null
          user_id?: string
          voz_da_marca?: string | null
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
          workspace_id: string | null
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
          workspace_id?: string | null
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
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      publish_jobs: {
        Row: {
          attempt: number | null
          created_at: string | null
          error_message: string | null
          external_post_id: string | null
          id: string
          provider: string
          retry_after: string | null
          scheduled_post_id: string
          status: string | null
          target_id: string
        }
        Insert: {
          attempt?: number | null
          created_at?: string | null
          error_message?: string | null
          external_post_id?: string | null
          id?: string
          provider: string
          retry_after?: string | null
          scheduled_post_id: string
          status?: string | null
          target_id: string
        }
        Update: {
          attempt?: number | null
          created_at?: string | null
          error_message?: string | null
          external_post_id?: string | null
          id?: string
          provider?: string
          retry_after?: string | null
          scheduled_post_id?: string
          status?: string | null
          target_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "publish_jobs_scheduled_post_id_fkey"
            columns: ["scheduled_post_id"]
            isOneToOne: false
            referencedRelation: "scheduled_posts"
            referencedColumns: ["id"]
          },
        ]
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
      scheduled_posts: {
        Row: {
          content_text: string | null
          created_at: string | null
          id: string
          media_urls: string[] | null
          scheduled_at: string
          status: string | null
          timezone: string | null
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          content_text?: string | null
          created_at?: string | null
          id?: string
          media_urls?: string[] | null
          scheduled_at: string
          status?: string | null
          timezone?: string | null
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          content_text?: string | null
          created_at?: string | null
          id?: string
          media_urls?: string[] | null
          scheduled_at?: string
          status?: string | null
          timezone?: string | null
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_posts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      social_accounts: {
        Row: {
          access_token: string | null
          account_id: string
          account_name: string | null
          avatar_url: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          needs_reconnect: boolean | null
          provider: string
          refresh_token: string | null
          scopes: string[] | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          account_id: string
          account_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          needs_reconnect?: boolean | null
          provider: string
          refresh_token?: string | null
          scopes?: string[] | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          account_id?: string
          account_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          needs_reconnect?: boolean | null
          provider?: string
          refresh_token?: string | null
          scopes?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      social_targets: {
        Row: {
          account_id: string
          created_at: string | null
          extra: Json | null
          id: string
          provider: string
          target_id: string
          target_name: string | null
          target_type: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          created_at?: string | null
          extra?: Json | null
          id?: string
          provider: string
          target_id: string
          target_name?: string | null
          target_type?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          created_at?: string | null
          extra?: Json | null
          id?: string
          provider?: string
          target_id?: string
          target_name?: string | null
          target_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          interval: string | null
          plan: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          interval?: string | null
          plan?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          interval?: string | null
          plan?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          admin_response: string | null
          created_at: string | null
          description: string
          id: string
          priority: string
          responded_at: string | null
          status: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_response?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority: string
          responded_at?: string | null
          status?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_response?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: string
          responded_at?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          name: string
          owner: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          owner: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      view_posts_usuario: {
        Row: {
          conteudo: string | null
          created_at: string | null
          data_agendamento: string | null
          id: string | null
          nome_usuario: string | null
          redes_sociais: string[] | null
          status: string | null
          tipo: string | null
          titulo: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
      view_relatorios_completos: {
        Row: {
          created_at: string | null
          dados: Json | null
          email_usuario: string | null
          formato: string | null
          id: string | null
          nome_usuario: string | null
          periodo_fim: string | null
          periodo_inicio: string | null
          tipo_relatorio: string | null
          user_id: string | null
        }
        Relationships: []
      }
      view_tendencias_ativas: {
        Row: {
          categoria: string | null
          created_at: string | null
          data_evento: string | null
          descricao: string | null
          fonte: string | null
          id: string | null
          relevancia: number | null
          segmento: string[] | null
          tipo: string | null
          titulo: string | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string | null
          data_evento?: string | null
          descricao?: string | null
          fonte?: string | null
          id?: string | null
          relevancia?: number | null
          segmento?: string[] | null
          tipo?: string | null
          titulo?: string | null
        }
        Update: {
          categoria?: string | null
          created_at?: string | null
          data_evento?: string | null
          descricao?: string | null
          fonte?: string | null
          id?: string | null
          relevancia?: number | null
          segmento?: string[] | null
          tipo?: string | null
          titulo?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_plan_info: {
        Args: { target_user_id: string }
        Returns: {
          email: string
          has_unlimited_credits: boolean
          is_pro: boolean
          plan_type: string
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_user_pro: { Args: { target_user_id: string }; Returns: boolean }
      upgrade_user_to_pro: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      user_has_pro_plan: { Args: { target_user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      avaliacao_tipo: "positiva" | "neutra" | "negativa"
      funcao_membro: "administrador" | "editor" | "visualizador"
      plano_tipo: "free" | "starter" | "pro"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      avaliacao_tipo: ["positiva", "neutra", "negativa"],
      funcao_membro: ["administrador", "editor", "visualizador"],
      plano_tipo: ["free", "starter", "pro"],
    },
  },
} as const
