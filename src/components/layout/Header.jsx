import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { Youtube } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setLanguageMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const categories = [
    { name: t('categories.podcast'), slug: 'podcast' },
    { name: t('categories.live_events'), slug: 'eventos-ao-vivo' },
    { name: t('categories.sports'), slug: 'esporte' },
    { name: t('categories.classes'), slug: 'aulas' },
    { name: t('categories.entertainment'), slug: 'entretenimento' },
    { name: t('categories.culture'), slug: 'cultura' },
    { name: t('categories.trending'), slug: 'aulas-do-momento' },
    { name: t('categories.subjects'), slug: 'disciplinas' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">STV</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-500 font-display">
                Senador Play
              </h1>
              <p className="text-xs text-gray-500 -mt-1">STV</p>
            </div>
          </Link>
           

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            >
              {t('menu.home')}
            </Link>
            <Link
              to="/news"
              className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            >
              {t('menu.news')}
            </Link>
            <Link
              to="/library"
              className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            >
              📚 Materiais
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary-500 transition-colors font-medium flex items-center">
                {t('menu.categories')}
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      to={`/category/${category.slug}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {isAuthenticated && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
              >
                {t('menu.admin')}
              </Link>
            )}
          </nav>
           
          {/* Language Selector & Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
                href="https://www.youtube.com/@EEMSenadorPlay"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <img src="src\components\layout\Youtube_logo.png" alt="YouTube Logo"/>
            </a>
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl">{currentLanguage.flag}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>
              
              {languageMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                        lang.code === i18n.language ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Button */}
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 btn-secondary"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('menu.logout')}</span>
              </button>
            ) : (
              <Link to="/login" className="btn-primary">
                {t('menu.login')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 animate-slide-down">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('menu.home')}
              </Link>
              <Link
                to="/news"
                className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('menu.news')}
              </Link>
              <Link
                to="/library"
                className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                📚 Materiais
              </Link>

              {/* Categories */}
              <div className="border-l-4 border-primary-500 pl-4">
                <p className="text-sm font-semibold text-gray-500 mb-2">
                  {t('menu.categories')}
                </p>
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    className="block py-2 text-gray-700 hover:text-primary-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {isAuthenticated && (
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('menu.admin')}
                </Link>
              )}

              {/* Language Selection Mobile */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm font-semibold text-gray-500 mb-2">
                  Idioma / Language
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex flex-col items-center p-3 rounded-lg border-2 ${
                        lang.code === i18n.language
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-3xl mb-1">{lang.flag}</span>
                      <span className="text-xs font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auth Mobile */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {isAuthenticated ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full btn-secondary flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('menu.logout')}</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full btn-primary text-center block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('menu.login')}
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;