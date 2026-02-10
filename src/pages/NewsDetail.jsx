import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { newsService } from '../lib/supabase';

const NewsDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const locales = { pt: ptBR, en: enUS, es: es };

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      const { data } = await newsService.getById(id);
      setArticle(data);
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!article) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Notícia não encontrada</h1>
        <Link to="/news" className="text-primary-500 hover:text-primary-600">
          Voltar para notícias
        </Link>
      </div>
    );
  }

  const title = article[`title_${i18n.language}`] || article.title_pt;
  const content = article[`content_${i18n.language}`] || article.content_pt;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <Link
          to="/news"
          className="inline-flex items-center text-primary-500 hover:text-primary-600 mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('common.back')} {t('news.title')}
        </Link>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {article.image_url && (
            <img
              src={article.image_url}
              alt={title}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-8">
            <div className="flex items-center space-x-3 text-sm text-gray-500 mb-4">
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
                {format(new Date(article.published_at), 'dd MMMM yyyy', {
                  locale: locales[i18n.language] || ptBR,
                })}
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6 font-display">
              {title}
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {content}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetail;
