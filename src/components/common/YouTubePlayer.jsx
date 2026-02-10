import { useState } from 'react';

const YouTubePlayer = ({ youtubeId, title, autoplay = false, className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);

  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?${autoplay ? 'autoplay=1&' : ''}rel=0&modestbranding=1`;

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        )}
        
        <iframe
          src={embedUrl}
          title={title || 'YouTube video player'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
};

export default YouTubePlayer;