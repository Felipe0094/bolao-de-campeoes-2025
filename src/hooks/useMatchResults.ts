
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UpdateResult {
  success: boolean;
  updated_matches: Array<{
    match: string;
    previous_status: string;
    new_status?: string;
  }>;
  total_updated: number;
  errors: string[];
  timestamp: string;
}

export const useMatchResults = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchResults = async (): Promise<UpdateResult | null> => {
    setLoading(true);
    try {
      console.log('Calling fetch-match-results function...');
      
      const { data, error } = await supabase.functions.invoke('fetch-match-results');
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      console.log('Function response:', data);

      if (data.success) {
        toast({
          title: "Resultados atualizados!",
          description: `${data.total_updated} jogos foram atualizados com sucesso.`,
        });
      } else {
        toast({
          title: "Erro ao buscar resultados",
          description: data.error || "Erro desconhecido",
          variant: "destructive",
        });
      }

      return data;
    } catch (error: any) {
      console.error('Error fetching match results:', error);
      toast({
        title: "Erro ao buscar resultados",
        description: error.message || "Erro de conexão",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchResults,
    loading
  };
};
