import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SyncOptions {
  retries?: number;
  showToast?: boolean;
}

class SupabaseSync {
  private async syncWithRetry(
    operation: () => Promise<any>,
    options: SyncOptions = {}
  ) {
    const { retries = 3, showToast = true } = options;
    let attempt = 0;
    
    while (attempt < retries) {
      try {
        const result = await operation();
        if (result.error) {
          throw new Error(result.error.message);
        }
        
        if (showToast && attempt > 0) {
          toast({
            title: "Dados sincronizados",
            description: "Os dados foram salvos com sucesso no Supabase",
          });
        }
        
        return result;
      } catch (error) {
        attempt++;
        console.error(`Tentativa ${attempt} falhou:`, error);
        
        if (attempt >= retries) {
          if (showToast) {
            toast({
              title: "Erro de sincronização",
              description: "Não foi possível sincronizar os dados. Tente novamente.",
              variant: "destructive",
            });
          }
          throw error;
        }
        
        // Aguardar antes de tentar novamente (backoff exponencial)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }

  async insert(table: string, data: any, options?: SyncOptions) {
    const { user_id, ...insertData } = data;
    
    return this.syncWithRetry(async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');
      
      return (supabase as any)
        .from(table)
        .insert({
          ...insertData,
          user_id: user_id || user.user.id
        });
    }, options);
  }

  async update(table: string, id: string, data: any, options?: SyncOptions) {
    const { user_id, ...updateData } = data;
    
    return this.syncWithRetry(async () => {
      return (supabase as any)
        .from(table)
        .update(updateData)
        .eq('id', id);
    }, options);
  }

  async remove(table: string, id: string, options?: SyncOptions) {
    return this.syncWithRetry(async () => {
      return (supabase as any)
        .from(table)
        .delete()
        .eq('id', id);
    }, options);
  }

  async select(table: string, filters?: any) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');
    
    let query = (supabase as any).from(table).select('*');
    
    // Filtrar por usuário se a tabela não for pública
    if (table !== 'tendencias') {
      query = query.eq('user_id', user.user.id);
    }
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    return query;
  }

  // Funções específicas para cada entidade
  async syncBriefing(action: 'create' | 'update' | 'delete', data: any, id?: string) {
    switch (action) {
      case 'create':
        return this.insert('briefings', data);
      case 'update':
        return this.update('briefings', id!, data);
      case 'delete':
        return this.remove('briefings', id!);
    }
  }

  async syncBranding(action: 'create' | 'update' | 'delete', data: any, id?: string) {
    switch (action) {
      case 'create':
        return this.insert('brandings', data);
      case 'update':
        return this.update('brandings', id!, data);
      case 'delete':
        return this.remove('brandings', id!);
    }
  }

  async syncPost(action: 'create' | 'update' | 'delete', data: any, id?: string) {
    switch (action) {
      case 'create':
        return this.insert('posts', data);
      case 'update':
        return this.update('posts', id!, data);
      case 'delete':
        return this.remove('posts', id!);
    }
  }

  async syncLibraryItem(action: 'create' | 'update' | 'delete', data: any, id?: string) {
    switch (action) {
      case 'create':
        return this.insert('biblioteca', data);
      case 'update':
        return this.update('biblioteca', id!, data);
      case 'delete':
        return this.remove('biblioteca', id!);
    }
  }

  async syncDianaConversation(data: any) {
    return this.insert('diana_conversations', data);
  }

  async syncReport(action: 'create' | 'update' | 'delete', data: any, id?: string) {
    switch (action) {
      case 'create':
        return this.insert('relatorios', data);
      case 'update':
        return this.update('relatorios', id!, data);
      case 'delete':
        return this.remove('relatorios', id!);
    }
  }

  async syncProfile(action: 'create' | 'update', data: any, id?: string) {
    switch (action) {
      case 'create':
        return this.insert('profiles', data);
      case 'update':
        return this.update('profiles', id!, data);
    }
  }

  async syncSettings(action: 'create' | 'update', data: any, id?: string) {
    switch (action) {
      case 'create':
        return this.insert('configuracoes_conta', data);
      case 'update':
        return this.update('configuracoes_conta', id!, data);
    }
  }
}

export const supabaseSync = new SupabaseSync();