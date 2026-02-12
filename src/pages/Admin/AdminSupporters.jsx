import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, ExternalLink, Save, X } from 'lucide-react';
import { supportersService } from '../../lib/supportersService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminSupporters = () => {
  const [supporters, setSupporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupporter, setEditingSupporter] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    website_url: '',
    logo_path: '',
    display_order: 0,
    is_active: true
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    loadSupporters();
  }, []);

  const loadSupporters = async () => {
    try {
      setLoading(true);
      const { data } = await supportersService.getAll();
      setSupporters(data || []);
    } catch (error) {
      console.error('Error loading supporters:', error);
      alert('Erro ao carregar apoiadores');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (supporter = null) => {
    if (supporter) {
      setEditingSupporter(supporter);
      setFormData({
        name: supporter.name,
        website_url: supporter.website_url || '',
        logo_path: supporter.logo_path || '',
        display_order: supporter.display_order || 0,
        is_active: supporter.is_active ?? true
      });
      setLogoPreview(supporter.logo_public_url);
    } else {
      setEditingSupporter(null);
      setFormData({
        name: '',
        website_url: '',
        logo_path: '',
        display_order: supporters.length,
        is_active: true
      });
      setLogoPreview(null);
    }
    setLogoFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupporter(null);
    setFormData({
      name: '',
      website_url: '',
      logo_path: '',
      display_order: 0,
      is_active: true
    });
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUploadingLogo(true);
      let logoPath = formData.logo_path;

      if (logoFile) {
        const { data: uploadData, error: uploadError } = await supportersService.uploadLogo(logoFile);
        
        if (uploadError) {
          throw new Error('Erro ao fazer upload do logo');
        }
        
        logoPath = uploadData.path;

        if (editingSupporter?.logo_path && editingSupporter.logo_path !== logoPath) {
          await supportersService.deleteLogo(editingSupporter.logo_path);
        }
      }

      const supporterData = {
        ...formData,
        logo_path: logoPath
      };

      if (editingSupporter) {
        const { error } = await supportersService.update(editingSupporter.id, supporterData);
        if (error) throw error;
        alert('Apoiador atualizado com sucesso!');
      } else {
        const { error } = await supportersService.create(supporterData);
        if (error) throw error;
        alert('Apoiador criado com sucesso!');
      }

      handleCloseModal();
      loadSupporters();
    } catch (error) {
      console.error('Error saving supporter:', error);
      alert('Erro ao salvar apoiador: ' + error.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleDelete = async (supporter) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${supporter.name}"?`)) {
      return;
    }

    try {
      if (supporter.logo_path) {
        await supportersService.deleteLogo(supporter.logo_path);
      }

      const { error } = await supportersService.delete(supporter.id);
      if (error) throw error;

      alert('Apoiador excluído com sucesso!');
      loadSupporters();
    } catch (error) {
      console.error('Error deleting supporter:', error);
      alert('Erro ao excluir apoiador');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Apoiadores</h1>
            <p className="text-gray-600 mt-2">Adicione e gerencie empresas apoiadoras do projeto</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Adicionar Apoiador
          </button>
        </div>

        {supporters.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Nenhum apoiador cadastrado</p>
            <button
              onClick={() => handleOpenModal()}
              className="text-primary-500 hover:text-primary-600 font-semibold"
            >
              Adicionar o primeiro apoiador
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supporters.map((supporter) => (
              <div
                key={supporter.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video bg-gray-100 flex items-center justify-center p-6">
                  {supporter.logo_public_url ? (
                    <img
                      src={supporter.logo_public_url}
                      alt={supporter.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <Upload className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Sem logo</p>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{supporter.name}</h3>
                      {supporter.website_url && (
                        <a
                          href={supporter.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1 mt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Visitar site
                        </a>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        supporter.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {supporter.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-500">
                      Ordem: {supporter.display_order}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(supporter)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(supporter)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingSupporter ? 'Editar Apoiador' : 'Novo Apoiador'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Logo da Empresa
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  {logoPreview ? (
                    <div className="space-y-4">
                      <img
                        src={logoPreview}
                        alt="Preview"
                        className="max-h-40 mx-auto object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remover logo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">
                        Clique para fazer upload do logo
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG ou SVG (recomendado: 400x200px)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoSelect}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-block mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors"
                  >
                    Selecionar arquivo
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ex: Empresa ABC"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Site da Empresa
                </label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://exemplo.com"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Menor número aparece primeiro
                </p>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Exibir no site
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploadingLogo}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingLogo ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingSupporter ? 'Atualizar' : 'Criar'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupporters;