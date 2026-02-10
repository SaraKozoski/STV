import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import NewsCard from '../components/common/NewsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { newsService } from '../lib/supabase';

const News = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const { data } = await newsService.getAll({});
      setNews(data || []);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter(article => {
    const searchLower = searchTerm.toLowerCase();
    return (
      article.title_pt?.toLowerCase().includes(searchLower) ||
      article.title_en?.toLowerCase().includes(searchLower) ||
      article.title_es?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 font-display">
          {t('news.title')}
        </h1>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('news.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">{t('news.no_results')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
