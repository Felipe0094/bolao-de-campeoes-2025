export const canMakePrediction = (matchDate: string, matchTime: string): boolean => {
  try {
    // Criar a data com o horário no fuso horário local
    const [year, month, day] = matchDate.split('-').map(Number);
    const [hours, minutes] = matchTime.split(':').map(Number);
    
    const matchDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const cutoffTime = new Date(matchDateTime.getTime() - (60 * 60 * 1000)); // 1 hora antes
    const now = new Date();
    
    return now < cutoffTime;
  } catch (error) {
    console.error('Erro ao calcular tempo para palpites:', error);
    return false;
  }
};

export const getTimeUntilCutoff = (matchDate: string, matchTime: string): number => {
  try {
    // Criar a data com o horário no fuso horário local
    const [year, month, day] = matchDate.split('-').map(Number);
    const [hours, minutes] = matchTime.split(':').map(Number);
    
    const matchDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const cutoffTime = new Date(matchDateTime.getTime() - (60 * 60 * 1000)); // 1 hora antes
    const now = new Date();
    
    return Math.max(0, cutoffTime.getTime() - now.getTime());
  } catch (error) {
    console.error('Erro ao calcular tempo restante:', error);
    return 0;
  }
};
