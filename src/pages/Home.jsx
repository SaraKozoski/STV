import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Award } from 'lucide-react';
import YouTubePlayer from '../components/common/YouTubePlayer';
import VideoCard from '../components/common/VideoCard';
import NewsCard from '../components/common/NewsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { supportersService } from '../lib/supportersService';
import { videosService, newsService } from '../lib/supabase';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [latestVideo, setLatestVideo] = useState(null);
  const [featuredNews, setFeaturedNews] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [supporters, setSupporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileDesc, setShowMobileDesc] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data: latest } = await videosService.getLatest();
      setLatestVideo(latest);

      const { data: news } = await newsService.getAll({ is_featured: true, limit: 5 });
      setFeaturedNews(news || []);

      const { data: videos } = await videosService.getAll({ limit: 5 });
      if (videos && latest) {
        setRecentVideos(videos.filter(v => v.id !== latest.id).slice(0, 8));
      }

      const { data: supportersData } = await supportersService.getAll();
      setSupporters(supportersData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const getTitle = (item) => item[`title_${i18n.language}`] || item.title_pt;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero - Vídeo Mais Recente */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-white font-display mb-6">
            {t('home.latest_video')}
          </h2>

          {latestVideo ? (
            <>
              {/* Desktop */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <YouTubePlayer youtubeId={latestVideo.youtube_id} title={getTitle(latestVideo)} />
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                  <h3 className="text-2xl font-bold mb-4">{getTitle(latestVideo)}</h3>
                  <p className="text-white/90 mb-6 line-clamp-6">
                    {latestVideo[`description_${i18n.language}`] || latestVideo.description_pt}
                  </p>
                  {latestVideo.categories && (
                    <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                      {latestVideo.categories[`name_${i18n.language}`] || latestVideo.categories.name_pt}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile */}
              <div className="flex lg:hidden flex-col gap-4">
                <YouTubePlayer youtubeId={latestVideo.youtube_id} title={getTitle(latestVideo)} />
                <div className="flex items-center justify-between">
                  {latestVideo.categories && (
                    <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-medium text-white">
                      {latestVideo.categories[`name_${i18n.language}`] || latestVideo.categories.name_pt}
                    </div>
                  )}
                  <button
                    onClick={() => setShowMobileDesc(prev => !prev)}
                    className="inline-flex items-center gap-2 bg-white text-primary-600 px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-primary-50 transition-colors text-sm"
                  >
                    {showMobileDesc ? 'Fechar' : 'Saiba mais'}
                    <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${showMobileDesc ? 'rotate-90' : ''}`} />
                  </button>
                </div>
                {showMobileDesc && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-white animate-slide-down">
                    <h3 className="text-lg font-bold mb-3">{getTitle(latestVideo)}</h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {latestVideo[`description_${i18n.language}`] || latestVideo.description_pt}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-center text-white">
              <p className="text-xl">Nenhum vídeo disponível no momento</p>
            </div>
          )}
        </div>
      </section>

      {/* Notícias Principais */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 font-display">
              {t('home.main_news')}
            </h2>
            <Link to="/news" className="flex items-center text-primary-500 hover:text-primary-600 font-medium transition-colors">
              {t('home.see_all')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          {featuredNews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              <NewsCard article={featuredNews[0]} featured />
              {featuredNews.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredNews.slice(1).map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">Nenhuma notícia em destaque</p>
            </div>
          )}
        </div>
      </section>

      {/* Vídeos Recentes */}
      {recentVideos.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-gray-900 font-display mb-8">
              Vídeos Recentes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentVideos.map((video, index) => (
                <VideoCard key={video.id} video={video} featured={index === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categorias */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 font-display mb-8">
            {t('menu.categories')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: t('categories.podcast'), slug: 'podcast', icon: '🎙️' },
              { name: t('categories.live_events'), slug: 'eventos-ao-vivo', icon: '📡' },
              { name: t('categories.sports'), slug: 'esporte', icon: '⚽' },
              { name: t('categories.classes'), slug: 'aulas', icon: '📚' },
              { name: t('categories.entertainment'), slug: 'entretenimento', icon: '🎬' },
              { name: t('categories.culture'), slug: 'cultura', icon: '🎭' },
              { name: t('categories.trending'), slug: 'aulas-do-momento', icon: '🔥' },
              { name: t('categories.subjects'), slug: 'disciplinas', icon: '📖' },
            ].map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="group bg-gradient-to-br from-primary-50 to-white border-2 border-primary-100 hover:border-primary-500 rounded-xl p-3 md:p-6 text-center transition-all hover:shadow-lg"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-500 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Apoiadores */}
      {supporters.length > 0 && (
        <section className="py-12 bg-gradient-to-br from-gray-50 to-white border-y border-gray-200">
          <div className="container-custom">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Award className="w-8 h-8 text-primary-500" />
                <h2 className="text-3xl font-bold text-gray-900 font-display">Nossos Apoiadores</h2>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Empresas e instituições que acreditam e apoiam nosso projeto
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4 justify-items-center max-w-5xl mx-auto">
              {supporters.map((supporter) => (
                <a
                  key={supporter.id}
                  href={supporter.website_url || '#'}
                  target={supporter.website_url ? "_blank" : "_self"}
                  rel={supporter.website_url ? "noopener noreferrer" : undefined}
                  className="group bg-white rounded-lg p-2 sm:p-3 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center border border-gray-100 hover:border-primary-300 w-full aspect-square"
                  title={supporter.name}
                >
                  <img
                    src={supporter.logo_public_url || '/placeholder-logo.svg'}
                    alt={supporter.name}
                    className="max-w-full max-h-full object-contain transition-all duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `data:image/svg+xml,${encodeURIComponent(`
                        <svg width="200" height="80" xmlns="http://www.w3.org/2000/svg">
                          <rect width="200" height="80" fill="#f3f4f6"/>
                          <text x="100" y="40" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="14" font-weight="600">${supporter.name}</text>
                        </svg>
                      `)}`;
                    }}
                  />
                </a>
              ))}
            </div>

            {/* CTA Apoiador */}
            <div className="mt-10 text-center">
              <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-3 max-w-xs mx-auto md:p-6 md:max-w-2xl">
                <h3 className="text-base font-bold text-gray-900 mb-3 md:text-xl md:mb-2">
                  Quer se tornar um apoiador?
                </h3>
                <p className="hidden md:block text-gray-600 mb-4 text-sm">
                  Junte-se às empresas que acreditam na educação e cultura. Entre em contato para conhecer as oportunidades de parceria.
                </p>
                <a
                  href="https://wa.me/5541999868566"
                  className="inline-flex items-center gap-2 bg-primary-500 text-white px-5 py-2 rounded-lg hover:bg-primary-600 transition-colors font-semibold shadow-md hover:shadow-xl text-sm md:px-6 md:py-2.5 md:text-base"
                >
                  Entre em Contato
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;