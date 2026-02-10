import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { subjectsService } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const ManageSubjects = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_pt: '',
    name_en: '',
    name_es: '',
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    const { data } = await subjectsService.getAll();
    setSubjects(data || []);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await subjectsService.create({
        ...formData,
        created_by: user.id,
      });

      alert(t('admin.subjects.success_create'));
      setFormData({ name_pt: '', name_en: '', name_es: '' });
      loadSubjects();
    } catch (error) {
      alert(t('admin.subjects.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('admin.subjects.confirm_delete'))) return;

    try {
      await subjectsService.delete(id);
      alert(t('admin.subjects.success_delete'));
      loadSubjects();
    } catch (error) {
      alert(t('admin.subjects.error'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 font-display">{t('admin.subjects.title')}</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">{t('admin.subjects.create_new')}</h2>
          
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.subjects.name_pt')} *</label>
                <input
                  type="text"
                  required
                  value={formData.name_pt}
                  onChange={(e) => setFormData({ ...formData, name_pt: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.subjects.name_en')}</label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.subjects.name_es')}</label>
                <input
                  type="text"
                  value={formData.name_es}
                  onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? t('common.loading') : t('admin.subjects.add')}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Disciplinas Cadastradas</h2>
          
          <div className="space-y-3">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{subject.name_pt}</p>
                  <p className="text-sm text-gray-600">EN: {subject.name_en || '-'} | ES: {subject.name_es || '-'}</p>
                </div>
                <button
                  onClick={() => handleDelete(subject.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSubjects;
