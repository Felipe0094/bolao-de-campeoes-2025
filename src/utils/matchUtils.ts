
export const canMakePrediction = (matchDate: string, matchTime: string): boolean => {
  const matchDateTime = new Date(`${matchDate} ${matchTime}`);
  const cutoffTime = new Date(matchDateTime.getTime() - (60 * 60 * 1000)); // 1 hora antes
  const now = new Date();
  
  return now < cutoffTime;
};

export const getTimeUntilCutoff = (matchDate: string, matchTime: string): number => {
  const matchDateTime = new Date(`${matchDate} ${matchTime}`);
  const cutoffTime = new Date(matchDateTime.getTime() - (60 * 60 * 1000));
  const now = new Date();
  
  return cutoffTime.getTime() - now.getTime();
};
