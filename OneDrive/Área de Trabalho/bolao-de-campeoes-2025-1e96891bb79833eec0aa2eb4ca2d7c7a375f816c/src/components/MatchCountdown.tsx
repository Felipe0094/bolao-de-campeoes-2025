import { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface MatchCountdownProps {
  matchDate: string;
  matchTime: string;
}

const MatchCountdown = ({ matchDate, matchTime }: MatchCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      try {
        // Criar a data com o horário no fuso horário local
        const [year, month, day] = matchDate.split('-').map(Number);
        const [matchHours, matchMinutes] = matchTime.split(':').map(Number);
        
        const matchDateTime = new Date(year, month - 1, day, matchHours, matchMinutes, 0, 0);
        const cutoffTime = new Date(matchDateTime.getTime() - (60 * 60 * 1000)); // 1 hora antes
        const now = new Date();
        
        const difference = Math.max(0, cutoffTime.getTime() - now.getTime());

        if (difference <= 0) {
          setIsExpired(true);
          setTimeLeft("Tempo esgotado");
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const remainingHours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const remainingMinutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}d ${remainingHours}h ${remainingMinutes}m`);
        } else if (remainingHours > 0) {
          setTimeLeft(`${remainingHours}h ${remainingMinutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${remainingMinutes}m ${seconds}s`);
        }
      } catch (error) {
        console.error('Erro ao calcular tempo restante:', error);
        setIsExpired(true);
        setTimeLeft("Erro ao calcular tempo");
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [matchDate, matchTime]);

  return (
    <div className="flex items-center justify-center gap-2 text-sm">
      {isExpired ? (
        <>
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-red-500 font-medium">Tempo para palpites encerrado</span>
        </>
      ) : (
        <>
          <Clock className="h-4 w-4 text-blue-500" />
          <span className="text-blue-500 font-medium">Tempo restante: {timeLeft}</span>
        </>
      )}
    </div>
  );
};

export default MatchCountdown;
