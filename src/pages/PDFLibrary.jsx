import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Filter } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { pdfsService, subjectsService } from '../lib/supabase';
import { format } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';

const PDFLibrary = () => {
  const { t, i18n } = useTranslation();
  const [pdfs, setPdfs] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('');

  const locales = { pt: ptBR, en: enUS, es: es };
  const locale = locales[i18n.language] || ptBR;

  useEffect(() => {
    loadData();
  }, [selectedSubject]);

  const loadData = async () => {
    try {
      const filters = selectedSubject ? { subject_id: selectedSubject } : {};
      const { data: pdfsData } = await pdfsService.getAll(filters);
      const { data: subjectsData } = await subjectsService.getAll();
      
      setPdfs(pdfsData || []);
      setSubjects(subjectsData || []);
    } catch (error) {
      console.error('Error loading PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (pdf) => {
    // Incrementar contador
    await pdfsService.incrementDownloads(pdf.id);
    
    // Abrir PDF em nova aba
    window.open(pdf.file_url, '_blank');
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return mb < 1 
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${mb.toFixed(1)} MB`;
  };

  const getTitle = (pdf) => pdf[`title_${i18n.language}`] || pdf.title_pt;
  const getDescription = (pdf) => pdf[`description_${i18n.language}`] || pdf.description_pt;

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 font-display">
            📚 Biblioteca de Materiais
          </h1>
          <p className="text-gray-600 text-lg">
            Baixe apostilas, resumos e materiais de estudo organizados por disciplina
          </p>
        </div>

        {/* Filtro por Disciplina */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-lg">Filtrar por Disciplina</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubject('')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedSubject === ''
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas as Disciplinas
            </button>
            
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedSubject === subject.id
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {subject[`name_${i18n.language}`] || subject.name_pt}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de PDFs */}
        {pdfs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfs.map((pdf) => (
              <div
                key={pdf.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-6 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-white" />
                </div>
                
                <div className="p-6">
                  {pdf.subjects && (
                    <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      {pdf.subjects[`name_${i18n.language}`] || pdf.subjects.name_pt}
                    </span>
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {getTitle(pdf)}
                  </h3>
                  
                  {getDescription(pdf) && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {getDescription(pdf)}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{format(new Date(pdf.published_at), 'dd/MM/yyyy', { locale })}</span>
                    {pdf.file_size && <span>{formatFileSize(pdf.file_size)}</span>}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {pdf.downloads_count || 0} downloads
                    </span>
                    
                    <button
                      onClick={() => handleDownload(pdf)}
                      className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Baixar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">
              {selectedSubject 
                ? 'Nenhum material encontrado para esta disciplina'
                : 'Nenhum material disponível no momento'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFLibrary;
