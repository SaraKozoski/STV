import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Clock, X } from 'lucide-react';
import YouTubePlayer from './YouTubePlayer';

const VideoCard = ({ video }) => {
  const { i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTitle = () => {
    return video[`title_${i18n.language}`] || video.title_pt;
  };

  const getDescription = () => {
    return video[`description_${i18n.language}`] || video.description_pt;
  };

  const getCategoryName = () => {
    if (!video.categories) return '';
    return video.categories[`name_${i18n.language}`] || video.categories.name_pt;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getThumbnail = () => {
    return `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`;
  };

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  return (
    <>
      {/* Card */}
      <div
        onClick={openModal}
        className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
      >
        {/* Thumbnail com Play Button Overlay */}
        <div className="relative aspect-video overflow-hidden bg-gray-200">
          <img
            src={getThumbnail()}
            alt={getTitle()}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;
            }}
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
            <div className="bg-primary-500 group-hover:bg-primary-600 rounded-full p-4 transform group-hover:scale-110 transition-all">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>

          {/* Categoria Badge */}
          {video.categories && (
            <div className="absolute top-3 left-3 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {getCategoryName()}
            </div>
          )}

          {/* Duração (se disponível) */}
          {video.duration && (
            <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {video.duration}
            </div>
          )}
        </div>

        {/* Informações do Card */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {getTitle()}
          </h3>
          
          {video.created_at && (
            <p className="text-sm text-gray-500">
              {formatDate(video.created_at)}
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 modal-fade-in"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto modal-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão Fechar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all hover:rotate-90"
              aria-label="Fechar"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>

            {/* Player do YouTube */}
            <div className="relative">
              <YouTubePlayer
                youtubeId={video.youtube_id}
                title={getTitle()}
                autoplay={true}
              />
            </div>

            {/* Informações do Vídeo */}
            <div className="p-6 md:p-8">
              {/* Título */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {getTitle()}
              </h2>

              {/* Meta informações */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {video.categories && (
                  <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {getCategoryName()}
                  </span>
                )}
                
                {video.created_at && (
                  <span className="text-gray-500 text-sm">
                    📅 {formatDate(video.created_at)}
                  </span>
                )}

                {/* Badge de idioma */}
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {i18n.language === 'pt' ? '🇧🇷 Português' : 
                   i18n.language === 'en' ? '🇺🇸 English' : 
                   '🇪🇸 Español'}
                </span>
              </div>

              {/* Descrição */}
              <div className="prose max-w-none">
                <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                  {getDescription()}
                </p>
              </div>

              {/* Informações adicionais */}
              {video.author && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Autor:</span> {video.author}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;