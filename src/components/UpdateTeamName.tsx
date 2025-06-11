import { Button } from "@/components/ui/button";
import { useTeams } from "@/hooks/useTeams";

export const UpdateTeamName = () => {
  const { updateTeamName } = useTeams();

  const handleUpdate = async () => {
    try {
      await updateTeamName();
      console.log('Nome do time atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar nome do time:', error);
    }
  };

  return (
    <Button onClick={handleUpdate}>
      Atualizar Nome do Time
    </Button>
  );
}; 