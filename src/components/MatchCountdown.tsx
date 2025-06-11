
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
      // Combinar data e hora do jogo
      const matchDateTime = new Date(`${matchDate} ${matchTime}`);
      
      // Subtrair 1 hora (limite para palpites)
      const cutoffTime = new Date(matchDateTime.getTime() - (60 * 60 * 1000));
      
      const now = new Date();
      const difference = cutoffTime.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft("Tempo esgotado");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [matchDate, matchTime]);

  return (
    <div className={`flex items-center justify-center gap-3 p-3 rounded-lg ${
      isExpired 
        ? 'bg-gradient-to-r from-red-50 to-red-100 border border-red-200' 
        : 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200'
    }`}>
      {isExpired ? (
        <AlertTriangle className="h-4 w-4 text-red-600" />
      ) : (
        <Clock className="h-4 w-4 text-blue-600" />
      )}
      <span className={`font-semibold text-sm ${
        isExpired ? 'text-red-700' : 'text-blue-700'
      }`}>
        {isExpired ? "Palpites encerrados" : `Palpites até: ${timeLeft}`}
      </span>
    </div>
  );
};

export default MatchCountdown;
