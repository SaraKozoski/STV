import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Youtube, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-500 text-white mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-500 font-bold text-xl">STV</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-display">Senador Play</h3>
                <p className="text-sm text-primary-100">STV</p>
              </div>
            </div>
            <p className="text-primary-100 text-sm">
              Plataforma educacional de vídeos e notícias para alunos e professores.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-bold text-lg mb-4">{t('menu.categories')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/category/podcast" className="text-primary-100 hover:text-white transition-colors">
                  {t('categories.podcast')}
                </Link>
              </li>
              <li>
                <Link to="/category/aulas" className="text-primary-100 hover:text-white transition-colors">
                  {t('categories.classes')}
                </Link>
              </li>
              <li>
                <Link to="/category/esporte" className="text-primary-100 hover:text-white transition-colors">
                  {t('categories.sports')}
                </Link>
              </li>
              <li>
                <Link to="/category/cultura" className="text-primary-100 hover:text-white transition-colors">
                  {t('categories.culture')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="font-bold text-lg mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-100 hover:text-white transition-colors">
                  {t('menu.home')}
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-primary-100 hover:text-white transition-colors">
                  {t('menu.news')}
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-primary-100 hover:text-white transition-colors">
                  {t('menu.login')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h4 className="font-bold text-lg mb-4">Redes Sociais</h4>
            <div className="flex space-x-4">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-400 mt-8 pt-8 text-center text-primary-100 text-sm">
          <p>&copy; {currentYear} Senador Play (STV). Todos os direitos reservados.</p>
          <p className="mt-2">Desenvolvido como projeto educacional</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
