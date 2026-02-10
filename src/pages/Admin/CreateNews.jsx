import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { newsService, storageService } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const CreateNews = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  
  const [formData, setFormData] = useState({
    title_pt: '',
    title_en: '',
    title_es: '',
    content_pt: '',
    content_en: '',
    content_es: '',
    category: '',
    is_featured: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;

      // Upload da imagem se houver
      if (imageFile) {
        console.log('Uploading image:', imageFile.name);
        const { data: uploadData, error: uploadError } = await storageService.uploadImage(imageFile);
        
        if (uploadError) {
          console.error('Upload error:', uploadError);
          alert('Erro ao fazer upload da imagem: ' + uploadError.message);
          setLoading(false);
          return;
        }
        
        imageUrl = uploadData?.publicUrl;
        console.log('Image URL:', imageUrl);
      }

      // Criar notícia
      const newsData = {
        ...formData,
        image_url: imageUrl,
        created_by: user.id,
        published_at: new Date().toISOString(),
      };

      console.log('Creating news with data:', newsData);

      const { error } = await newsService.create(newsData);

      if (error) {
        console.error('Create news error:', error);
        throw error;
      }

      alert(t('admin.news_form.success'));
      navigate('/admin');
    } catch (error) {
      console.error('Error creating news:', error);
      alert(t('admin.news_form.error') + ': ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    console.log('=== DADOS DA NOTÍCIA ==='),
    console.log('Conteúdo PT:', newsData.content_pt),
    console.log('======================='),
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 font-display">{t('admin.news_form.title')}</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin.news_form.title_pt')} *</label>
              <input
                type="text"
                required
                value={formData.title_pt}
                onChange={(e) => setFormData({ ...formData, title_pt: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin.news_form.title_en')}</label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin.news_form.title_es')}</label>
              <input
                type="text"
                value={formData.title_es}
                onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin.news_form.content_pt')} *</label>
              <textarea
                required
                rows={6}
                value={formData.content_pt}
                onChange={(e) => setFormData({ ...formData, content_pt: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin.news_form.content_en')}</label>
              <textarea
                rows={6}
                value={formData.content_en}
                onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin.news_form.content_es')}</label>
              <textarea
                rows={6}
                value={formData.content_es}
                onChange={(e) => setFormData({ ...formData, content_es: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('admin.news_form.image')}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="input-field"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4 text-primary-600"
            />
            <label htmlFor="featured" className="ml-2 text-sm">
              {t('admin.news_form.is_featured')}
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t('common.loading') : t('admin.news_form.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNews;
