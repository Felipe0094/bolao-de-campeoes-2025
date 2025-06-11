
import { useState } from 'react';

interface TeamLogoProps {
  logoUrl?: string;
  teamName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TeamLogo = ({ logoUrl, teamName, size = 'md', className = '' }: TeamLogoProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-10 h-10'
  };

  const handleImageError = () => {
    console.log(`Failed to load image for ${teamName}:`, logoUrl);
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const getImageUrl = (url?: string) => {
    if (!url) {
      console.log('No logo URL provided for:', teamName);
      return null;
    }
    
    // Se já é uma URL completa, usar como está
    if (url.startsWith('http')) {
      return url;
    }
    
    // Se é apenas um nome de arquivo, usar da pasta public
    const imageUrl = `/team-logos/${url}`;
    console.log('Using local image URL for', teamName, ':', imageUrl);
    return imageUrl;
  };

  const imageUrl = getImageUrl(logoUrl);

  // Se não tem logo_url ou deu erro, mostrar iniciais
  if (!imageUrl || imageError) {
    const initials = teamName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return (
      <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-300`}>
        {initials}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative rounded-full overflow-hidden border border-gray-200 shadow-sm`}>
      {isLoading && (
        <div className={`${sizeClasses[size]} bg-gray-200 rounded-full animate-pulse absolute inset-0`} />
      )}
      <img 
        src={imageUrl} 
        alt={`${teamName} logo`}
        className={`${sizeClasses[size]} object-cover rounded-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default TeamLogo;
