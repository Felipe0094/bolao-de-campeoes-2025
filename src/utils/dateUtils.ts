export const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo'
  };
  
  const formattedDate = date.toLocaleDateString('pt-BR', options);
  const [weekday, ...rest] = formattedDate.split(', ');
  
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${rest.join(', ')}`;
};

export const formatDateTime = (dateStr: string, timeStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo'
  };
  
  const formattedDateTime = date.toLocaleDateString('pt-BR', options);
  const [weekday, ...rest] = formattedDateTime.split(', ');
  
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${rest.join(', ')}`;
}; 