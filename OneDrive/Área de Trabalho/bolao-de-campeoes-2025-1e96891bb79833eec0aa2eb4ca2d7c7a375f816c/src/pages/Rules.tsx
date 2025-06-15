import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Rules = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <Navbar showBack />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Regras do Bolão</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Pontuação</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Palpite exato (placar e resultado): 3 pontos</li>
                <li>Resultado correto (vitória/empate/derrota): 1 ponto</li>
                <li>Nenhum ponto para resultado errado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Regras Gerais</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Os palpites devem ser feitos antes do início de cada jogo</li>
                <li>Não é possível alterar palpites após o início do jogo</li>
                <li>Em caso de empate na pontuação, o critério de desempate será a quantidade de palpites exatos</li>
                <li>O vencedor será o participante com maior pontuação ao final do torneio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Premiação</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>1º lugar: 70% do valor total do bolão</li>
                <li>2º lugar: 20% do valor total do bolão</li>
                <li>3º lugar: 10% do valor total do bolão</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rules;
