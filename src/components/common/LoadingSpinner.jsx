import { useTranslation } from 'react-i18next';

const LoadingSpinner = ({ fullScreen = false }) => {
  const { t } = useTranslation();

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium">{t('common.loading')}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
