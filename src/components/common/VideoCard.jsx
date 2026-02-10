import { useTranslation } from 'react-i18next';
import { Play, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';

const VideoCard = ({ video, featured = false }) => {
  const { i18n } = useTranslation();
  
  const locales = { pt: ptBR, en: enUS, es: es };
  const locale = locales[i18n.language] || ptBR;

  const title = video[`title_${i18n.language}`] || video.title_pt;
  const description = video[`description_${i18n.language}`] || video.description_pt;

  const getYoutubeThumbnail = (youtubeId) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd MMM yyyy', { locale });
  };

  if (featured) {
    return (
      <div className="card group cursor-pointer">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={video.thumbnail_url || getYoutubeThumbnail(video.youtube_id)}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-primary-500 ml-1" fill="currentColor" />
            </div>
          </div>
          {video.is_featured && (
            <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Destaque
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            {video.categories && (
              <span className="text-primary-500 font-medium">
                {video.categories[`name_${i18n.language}`] || video.categories.name_pt}
              </span>
            )}
            <span>•</span>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(video.published_at)}
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card group cursor-pointer">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail_url || getYoutubeThumbnail(video.youtube_id)}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-primary-500 ml-1" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{title}</h4>
        {video.categories && (
          <p className="text-xs text-primary-500 font-medium">
            {video.categories[`name_${i18n.language}`] || video.categories.name_pt}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
