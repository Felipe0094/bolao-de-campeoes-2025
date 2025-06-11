import { UpdateTeamName } from "@/components/UpdateTeamName";
import { UpdateTeamLogos } from "@/components/UpdateTeamLogos";

export const Admin = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Administração</h1>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Atualização de Times</h2>
          <div className="space-y-2">
            <UpdateTeamName />
            <UpdateTeamLogos />
          </div>
        </div>
      </div>
    </div>
  );
}; 