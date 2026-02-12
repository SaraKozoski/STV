import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Video, BookOpen, Award } from 'lucide-react';

const AdminDashboard = () => {
  const { t } = useTranslation();

  const actions = [
    {
      title: t('admin.create_news'),
      description: 'Cadastrar nova notícia em texto com imagem',
      icon: FileText,
      link: '/admin/news/create',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: t('admin.create_video'),
      description: 'Adicionar novo vídeo do YouTube',
      icon: Video,
      link: '/admin/video/create',
      color: 'from-red-500 to-red-600',
    },
    {
      title: 'Adicionar Material (PDF)',
      description: 'Fazer upload de apostilas e materiais de estudo',
      icon: FileText,
      link: '/admin/pdf/create',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: t('admin.manage_subjects'),
      description: 'Gerenciar disciplinas personalizadas',
      icon: BookOpen,
      link: '/admin/subjects',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Gerenciar Apoiadores',
      description: 'Adicionar e gerenciar empresas apoiadoras do projeto',
      icon: Award,
      link: '/admin/supporters',
      color: 'from-yellow-500 to-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">
          {t('admin.dashboard')}
        </h1>
        <p className="text-gray-600 mb-12">Gerencie o conteúdo do Senador Play</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.link}
                to={action.link}
                className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;