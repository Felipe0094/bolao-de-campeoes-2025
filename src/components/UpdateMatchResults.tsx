
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useMatchResults } from "@/hooks/useMatchResults";

export const UpdateMatchResults = () => {
  const { fetchResults, loading } = useMatchResults();
  const [lastUpdate, setLastUpdate] = useState<any>(null);

  const handleUpdateResults = async () => {
    const result = await fetchResults();
    if (result) {
      setLastUpdate(result);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Atualização de Resultados
        </CardTitle>
        <CardDescription>
          Buscar resultados atualizados da API-Sports para o Mundial de Clubes 2025
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleUpdateResults}
          disabled={loading}
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Buscando resultados...' : 'Atualizar Resultados'}
        </Button>

        {lastUpdate && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {lastUpdate.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">
                Última atualização: {new Date(lastUpdate.timestamp).toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {lastUpdate.total_updated} jogos atualizados
                </Badge>
              </div>
              {lastUpdate.errors.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">
                    {lastUpdate.errors.length} erros
                  </Badge>
                </div>
              )}
            </div>

            {lastUpdate.updated_matches.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Jogos atualizados:</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {lastUpdate.updated_matches.map((match: any, index: number) => (
                    <div key={index} className="text-xs p-2 bg-muted rounded">
                      {match.match}
                      {match.new_status && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {match.new_status}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lastUpdate.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-600">Erros:</h4>
                <div className="max-h-24 overflow-y-auto space-y-1">
                  {lastUpdate.errors.map((error: string, index: number) => (
                    <div key={index} className="text-xs p-2 bg-red-50 text-red-700 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
