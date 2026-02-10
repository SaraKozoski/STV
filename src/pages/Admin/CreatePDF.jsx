import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Upload } from 'lucide-react';
import { pdfsService, storageService, subjectsService } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const CreatePDF = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  
  const [formData, setFormData] = useState({
    title_pt: '',
    title_en: '',
    title_es: '',
    description_pt: '',
    description_en: '',
    description_es: '',
    subject_id: '',
    category: '',
    is_featured: false,
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    const { data } = await subjectsService.getAll();
    setSubjects(data || []);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Por favor, selecione apenas arquivos PDF');
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!pdfFile) {
        alert('Por favor, selecione um arquivo PDF');
        setLoading(false);
        return;
      }

      console.log('Uploading PDF:', pdfFile.name);
      const { data: uploadData, error: uploadError } = await storageService.uploadPDF(pdfFile);
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Erro ao fazer upload do PDF: ' + uploadError.message);
        setLoading(false);
        return;
      }

      const pdfData = {
        ...formData,
        file_url: uploadData.publicUrl,
        file_name: uploadData.fileName,
        file_size: uploadData.fileSize,
        subject_id: formData.subject_id || null,
        created_by: user.id,
        published_at: new Date().toISOString(),
      };

      console.log('Creating PDF document:', pdfData);

      const { error } = await pdfsService.create(pdfData);

      if (error) {
        console.error('Create PDF error:', error);
        throw error;
      }

      alert('Material adicionado com sucesso!');
      navigate('/admin');
    } catch (error) {
      console.error('Error creating PDF:', error);
      alert('Erro ao adicionar material: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-10 h-10 text-primary-500" />
          <div>
            <h1 className="text-4xl font-bold font-display">Adicionar Material (PDF)</h1>
            <p className="text-gray-600">Faça upload de apostilas, resumos e materiais de estudo</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Upload do PDF */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <label className="cursor-pointer">
              <span className="text-primary-500 font-semibold hover:text-primary-600">
                Clique para selecionar o arquivo PDF
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </label>
            {pdfFile && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-green-700 font-medium">✓ {pdfFile.name}</p>
                <p className="text-sm text-green-600">
                  {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>

          {/* Títulos */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título (Português) *</label>
              <input
                type="text"
                required
                value={formData.title_pt}
                onChange={(e) => setFormData({ ...formData, title_pt: e.target.value })}
                className="input-field"
                placeholder="Ex: Resumo de Matemática"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Título (Inglês)</label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                className="input-field"
                placeholder="Ex: Math Summary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Título (Espanhol)</label>
              <input
                type="text"
                value={formData.title_es}
                onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
                className="input-field"
                placeholder="Ex: Resumen de Matemáticas"
              />
            </div>
          </div>

          {/* Descrições */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Descrição (Português)</label>
              <textarea
                rows={4}
                value={formData.description_pt}
                onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })}
                className="input-field resize-y"
                placeholder="Breve descrição do material..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descrição (Inglês)</label>
              <textarea
                rows={4}
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                className="input-field resize-y"
                placeholder="Brief description..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descrição (Espanhol)</label>
              <textarea
                rows={4}
                value={formData.description_es}
                onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                className="input-field resize-y"
                placeholder="Breve descripción..."
              />
            </div>
          </div>

          {/* Disciplina */}
          <div>
            <label className="block text-sm font-medium mb-2">Disciplina *</label>
            <select
              required
              value={formData.subject_id}
              onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
              className="input-field"
            >
              <option value="">Selecione uma disciplina...</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name_pt}
                </option>
              ))}
            </select>
          </div>

          {/* Destaque */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4 text-primary-600"
            />
            <label htmlFor="featured" className="ml-2 text-sm">
              Destacar este material
            </label>
          </div>

          {/* Botão */}
          <button 
            type="submit" 
            disabled={loading || !pdfFile} 
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enviando...
              </span>
            ) : (
              'Adicionar Material'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePDF;
