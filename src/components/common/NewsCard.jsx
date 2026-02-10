import { useTranslation } from 'react-i18next';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const NewsCard = ({ article, featured = false }) => {
  const { t, i18n } = useTranslation();
  
  const locales = { pt: ptBR, en: enUS, es: es };
  const locale = locales[i18n.language] || ptBR;

  const title = article[`title_${i18n.language}`] || article.title_pt;
  const content = article[`content_${i18n.language}`] || article.content_pt;

  const formatDate = (date) => {
    return format(new Date(date), 'dd MMM yyyy', { locale });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (featured) {
    return (
      <Link to={`/news/${article.id}`} className="card group block">
        <div className="relative aspect-video overflow-hidden">
          {article.image_url ? (
            <img
              src={article.image_url}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white text-4xl font-bold opacity-50">STV</span>
            </div>
          )}
          {article.is_featured && (
            <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Destaque
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
            {article.category && (
              <>
                <span className="text-primary-500 font-medium capitalize">
                  {article.category}
                </span>
                <span>•</span>
              </>
            )}
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(article.published_at)}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {truncateText(content, 200)}
          </p>
          <div className="flex items-center text-primary-500 font-medium group-hover:gap-2 transition-all">
            <span>{t('home.read_more')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/news/${article.id}`} className="card group block">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative sm:w-48 aspect-video sm:aspect-square overflow-hidden flex-shrink-0">
          {article.image_url ? (
            <img
              src={article.image_url}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white text-2xl font-bold opacity-50">STV</span>
            </div>
          )}
        </div>
        <div className="flex-1 p-4 sm:p-0 sm:py-2">
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
            {article.category && (
              <>
                <span className="text-primary-500 font-medium capitalize">
                  {article.category}
                </span>
                <span>•</span>
              </>
            )}
            <span>{formatDate(article.published_at)}</span>
          </div>
          <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {title}
          </h4>
          <p className="text-gray-600 text-sm line-clamp-2">
            {truncateText(content, 120)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
