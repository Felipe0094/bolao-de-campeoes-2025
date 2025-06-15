import { Button } from "@/components/ui/button";
import { useTeams } from "@/hooks/useTeams";

export const UpdateTeamLogos = () => {
  const { updateTeamLogos } = useTeams();

  const handleUpdate = async () => {
    try {
      await updateTeamLogos();
      console.log('Logos dos times atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar logos dos times:', error);
    }
  };

  return (
    <Button onClick={handleUpdate}>
      Atualizar Logos dos Times
    </Button>
  );
}; 