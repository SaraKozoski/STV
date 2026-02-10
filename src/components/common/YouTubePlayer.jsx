import { useState } from 'react';
import { Play } from 'lucide-react';

const YouTubePlayer = ({ youtubeId, title, autoplay = false }) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);

  const getThumbnail = () => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  if (!isPlaying) {
    return (
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden group cursor-pointer">
        <img
          src={getThumbnail()}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <button
            onClick={() => setIsPlaying(true)}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl"
          >
            <Play className="w-10 h-10 text-primary-500 ml-2" fill="currentColor" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default YouTubePlayer;
