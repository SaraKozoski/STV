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
    is_live: false,
    live_start_date: '',
    live_end_date: '',
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
    // Padrões para vídeos normais
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
      // Padrão para lives do YouTube
      /youtube\.com\/live\/([^"&?\/\s]{11})/,
      // Padrão alternativo para lives
      /youtube\.com\/watch\?v=([^"&?\/\s]{11})/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
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

      // Validar datas de live se for um vídeo ao vivo
      if (formData.is_live) {
        if (!formData.live_start_date || !formData.live_end_date) {
          alert('Por favor, preencha as datas de início e fim da transmissão ao vivo');
          setLoading(false);
          return;
        }

        const startDate = new Date(formData.live_start_date);
        const endDate = new Date(formData.live_end_date);

        if (endDate <= startDate) {
          alert('A data de fim deve ser posterior à data de início');
          setLoading(false);
          return;
        }
      }

      console.log('=== DADOS DO VÍDEO ===');
      console.log('Título PT:', formData.title_pt);
      console.log('Descrição PT:', formData.description_pt);
      console.log('YouTube ID:', youtubeId);
      console.log('É Live:', formData.is_live);
      if (formData.is_live) {
        console.log('Início:', formData.live_start_date);
        console.log('Fim:', formData.live_end_date);
      }
      console.log('=======================');

      const videoData = {
        ...formData,
        youtube_id: youtubeId,
        category_id: formData.category_id || null,
        subject_id: formData.subject_id || null,
        created_by: user.id,
      };

      // Converter datas para ISO se for live, senão enviar null
      if (formData.is_live) {
        videoData.live_start_date = new Date(formData.live_start_date).toISOString();
        videoData.live_end_date = new Date(formData.live_end_date).toISOString();
      } else {
        videoData.live_start_date = null;
        videoData.live_end_date = null;
      }

      const { error } = await videosService.create(videoData);

      if (error) throw error;

      alert(t('admin.video_form.success'));
      navigate('/admin');
    } catch (error) {
      console.error('Error creating video:', error);
      alert(t('admin.video_form.error') + ': ' + error.message);
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
              placeholder="https://youtube.com/watch?v=... ou https://youtube.com/live/..."
              value={formData.youtube_url}
              onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
              className="input-field"
            />
            <p className="text-xs text-gray-600 mt-1">
              ✅ Aceita vídeos normais e transmissões ao vivo
            </p>
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
              <label className="block text-sm font-medium mb-2">Descrição (PT) *</label>
              <textarea
                required
                rows="4"
                value={formData.description_pt}
                onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descrição (EN)</label>
              <textarea
                rows="4"
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descrição (ES)</label>
              <textarea
                rows="4"
                value={formData.description_es}
                onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                className="input-field"
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

          {/* Campos de Vídeo Ao Vivo */}
          <div className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
            formData.is_live 
              ? 'border-red-400 bg-red-50' 
              : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔴</span>
                <div>
                  <label htmlFor="is_live" className="font-bold text-lg text-gray-900 block cursor-pointer">
                    Vídeo ao Vivo
                  </label>
                  <p className="text-sm text-gray-600">
                    Ative para programar uma transmissão ao vivo
                  </p>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_live: !formData.is_live })}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  formData.is_live 
                    ? 'bg-red-600 focus:ring-red-500' 
                    : 'bg-gray-300 focus:ring-gray-400'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                    formData.is_live ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {formData.is_live && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Início da Transmissão *
                  </label>
                  <input
                    type="datetime-local"
                    required={formData.is_live}
                    value={formData.live_start_date}
                    onChange={(e) => setFormData({ ...formData, live_start_date: e.target.value })}
                    className="input-field"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    A live aparecerá na página inicial a partir desta data
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Fim da Transmissão *
                  </label>
                  <input
                    type="datetime-local"
                    required={formData.is_live}
                    value={formData.live_end_date}
                    onChange={(e) => setFormData({ ...formData, live_end_date: e.target.value })}
                    className="input-field"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Após esta data, voltará a mostrar o vídeo mais recente
                  </p>
                </div>
              </div>
            )}
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