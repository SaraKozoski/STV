import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { videosService, categoriesService, subjectsService } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const CreateVideo = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  const [formData, setFormData] = useState({
    youtube_url: '',
    title_pt: '',
    title_en: '',
    title_es: '',
    description_pt: '',
    description_en: '',
    description_es: '',
    category_id: '',
    subject_id: '',
    is_featured: false,
  });

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    const { data: cats } = await categoriesService.getAll();
    const { data: subs } = await subjectsService.getAll();
    setCategories(cats || []);
    setSubjects(subs || []);
  };

  const extractYoutubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const youtubeId = extractYoutubeId(formData.youtube_url);
      
      if (!youtubeId) {
        alert('URL do YouTube inválida');
        setLoading(false);
        return;
      }



      const { error } = await videosService.create({
        ...formData,
        youtube_id: youtubeId,
        category_id: formData.category_id || null,
        subject_id: formData.subject_id || null,
        created_by: user.id,
      });

      if (error) throw error;

      alert(t('admin.video_form.success'));
      navigate('/admin');
    } catch (error) {
      console.error('Error creating video:', error);
      alert(t('admin.video_form.error'));
    } finally {
      setLoading(false);
    }
  };
   

  return (
    
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 font-display">{t('admin.video_form.title')}</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">{t('admin.video_form.youtube_url')} *</label>
            <input
              type="url"
              required
              placeholder={t('admin.video_form.youtube_url_placeholder')}
              value={formData.youtube_url}
              onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin.video_form.title_pt')} *</label>
              <input
                type="text"
                required
                value={formData.title_pt}
                onChange={(e) => setFormData({ ...formData, title_pt: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin.video_form.title_en')}</label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin.video_form.title_es')}</label>
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
              <label className="block text-sm font-medium mb-2">
                {t('admin.video_form.description_pt')}
              </label>
              <textarea
                rows={4}
                value={formData.description_pt}
                onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })}
                className="input-field resize-y"
                placeholder="Digite a descrição em português..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('admin.video_form.description_en')}
              </label>
              <textarea
                rows={4}
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                className="input-field resize-y"
                placeholder="Enter description in English..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('admin.video_form.description_es')}
              </label>
              <textarea
                rows={4}
                value={formData.description_es}
                onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                className="input-field resize-y"
                placeholder="Ingrese la descripción en español..."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin.video_form.category')}</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="input-field"
              >
                <option value="">Selecione...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name_pt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin.video_form.subject')}</label>
              <select
                value={formData.subject_id}
                onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                className="input-field"
              >
                <option value="">Nenhuma</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name_pt}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t('common.loading') : t('admin.video_form.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateVideo;
