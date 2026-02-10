import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VideoCard from '../components/common/VideoCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { videosService, categoriesService } from '../lib/supabase';

const CategoryPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      const { data: cat } = await categoriesService.getBySlug(slug);
      setCategory(cat);

      if (cat) {
        const { data: vids } = await videosService.getAll({ category_id: cat.id });
        setVideos(vids || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const categoryName = category
    ? category[`name_${i18n.language}`] || category.name_pt
    : 'Categoria';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 font-display">
          {categoryName}
        </h1>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">
              Nenhum vídeo disponível nesta categoria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
