import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  pt: {
    translation: {
      // Menu principal
      menu: {
        home: 'Início',
        news: 'Notícias',
        categories: 'Categorias',
        login: 'Entrar',
        logout: 'Sair',
        admin: 'Administração',
      },
      
      // Categorias
      categories: {
        podcast: 'Podcast',
        live_events: 'Eventos ao Vivo',
        sports: 'Esporte',
        classes: 'Aulas',
        entertainment: 'Entretenimento',
        culture: 'Cultura',
        trending: 'Aulas do Momento',
        subjects: 'Disciplinas',
      },

      // Página inicial
      home: {
        latest_video: 'Vídeo Mais Recente',
        main_news: 'Principais Notícias',
        see_all: 'Ver Todas',
        watch_now: 'Assistir Agora',
        read_more: 'Ler Mais',
      },

      // Página de notícias
      news: {
        title: 'Notícias',
        search: 'Buscar notícias...',
        filter_category: 'Filtrar por categoria',
        all_categories: 'Todas as categorias',
        no_results: 'Nenhuma notícia encontrada',
        published_at: 'Publicado em',
      },

      // Login
      login: {
        title: 'Entrar no Senador Play',
        email: 'E-mail',
        password: 'Senha',
        submit: 'Entrar',
        error: 'E-mail ou senha incorretos',
        welcome: 'Bem-vindo de volta!',
      },

      // Administração
      admin: {
        dashboard: 'Painel de Controle',
        create_news: 'Criar Notícia',
        create_video: 'Adicionar Vídeo',
        manage_subjects: 'Gerenciar Disciplinas',
        
        // Formulário de notícia
        news_form: {
          title: 'Nova Notícia',
          title_pt: 'Título (Português)',
          title_en: 'Título (Inglês)',
          title_es: 'Título (Espanhol)',
          content_pt: 'Conteúdo (Português)',
          content_en: 'Conteúdo (Inglês)',
          content_es: 'Conteúdo (Espanhol)',
          image: 'Imagem de Capa',
          category: 'Categoria',
          is_featured: 'Destacar na página inicial',
          submit: 'Publicar Notícia',
          success: 'Notícia publicada com sucesso!',
          error: 'Erro ao publicar notícia',
        },

        // Formulário de vídeo
        video_form: {
          title: 'Adicionar Vídeo',
          youtube_url: 'URL do YouTube',
          youtube_url_placeholder: 'https://www.youtube.com/watch?v=...',
          title_pt: 'Título (Português)',
          title_en: 'Título (Inglês)',
          title_es: 'Título (Espanhol)',
          description_pt: 'Descrição (Português)',
          description_en: 'Descrição (Inglês)',
          description_es: 'Descrição (Espanhol)',
          category: 'Categoria',
          subject: 'Disciplina (opcional)',
          is_featured: 'Destacar',
          submit: 'Adicionar Vídeo',
          success: 'Vídeo adicionado com sucesso!',
          error: 'Erro ao adicionar vídeo',
        },

        // Gerenciar disciplinas
        subjects: {
          title: 'Disciplinas',
          create_new: 'Nova Disciplina',
          name_pt: 'Nome (Português)',
          name_en: 'Nome (Inglês)',
          name_es: 'Nome (Espanhol)',
          add: 'Adicionar',
          delete: 'Excluir',
          confirm_delete: 'Tem certeza que deseja excluir esta disciplina?',
          success_create: 'Disciplina criada com sucesso!',
          success_delete: 'Disciplina excluída com sucesso!',
          error: 'Erro ao gerenciar disciplina',
        },
      },

      // Geral
      common: {
        loading: 'Carregando...',
        error: 'Erro',
        success: 'Sucesso',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        save: 'Salvar',
        delete: 'Excluir',
        edit: 'Editar',
        close: 'Fechar',
        back: 'Voltar',
      },
    },
  },

  en: {
    translation: {
      menu: {
        home: 'Home',
        news: 'News',
        categories: 'Categories',
        login: 'Login',
        logout: 'Logout',
        admin: 'Administration',
      },

      categories: {
        podcast: 'Podcast',
        live_events: 'Live Events',
        sports: 'Sports',
        classes: 'Classes',
        entertainment: 'Entertainment',
        culture: 'Culture',
        trending: 'Trending Classes',
        subjects: 'Subjects',
      },

      home: {
        latest_video: 'Latest Video',
        main_news: 'Main News',
        see_all: 'See All',
        watch_now: 'Watch Now',
        read_more: 'Read More',
      },

      news: {
        title: 'News',
        search: 'Search news...',
        filter_category: 'Filter by category',
        all_categories: 'All categories',
        no_results: 'No news found',
        published_at: 'Published on',
      },

      login: {
        title: 'Login to Senador Play',
        email: 'Email',
        password: 'Password',
        submit: 'Login',
        error: 'Incorrect email or password',
        welcome: 'Welcome back!',
      },

      admin: {
        dashboard: 'Dashboard',
        create_news: 'Create News',
        create_video: 'Add Video',
        manage_subjects: 'Manage Subjects',

        news_form: {
          title: 'New Article',
          title_pt: 'Title (Portuguese)',
          title_en: 'Title (English)',
          title_es: 'Title (Spanish)',
          content_pt: 'Content (Portuguese)',
          content_en: 'Content (English)',
          content_es: 'Content (Spanish)',
          image: 'Cover Image',
          category: 'Category',
          is_featured: 'Feature on homepage',
          submit: 'Publish Article',
          success: 'Article published successfully!',
          error: 'Error publishing article',
        },

        video_form: {
          title: 'Add Video',
          youtube_url: 'YouTube URL',
          youtube_url_placeholder: 'https://www.youtube.com/watch?v=...',
          title_pt: 'Title (Portuguese)',
          title_en: 'Title (English)',
          title_es: 'Title (Spanish)',
          description_pt: 'Description (Portuguese)',
          description_en: 'Description (English)',
          description_es: 'Description (Spanish)',
          category: 'Category',
          subject: 'Subject (optional)',
          is_featured: 'Featured',
          submit: 'Add Video',
          success: 'Video added successfully!',
          error: 'Error adding video',
        },

        subjects: {
          title: 'Subjects',
          create_new: 'New Subject',
          name_pt: 'Name (Portuguese)',
          name_en: 'Name (English)',
          name_es: 'Name (Spanish)',
          add: 'Add',
          delete: 'Delete',
          confirm_delete: 'Are you sure you want to delete this subject?',
          success_create: 'Subject created successfully!',
          success_delete: 'Subject deleted successfully!',
          error: 'Error managing subject',
        },
      },

      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        back: 'Back',
      },
    },
  },

  es: {
    translation: {
      menu: {
        home: 'Inicio',
        news: 'Noticias',
        categories: 'Categorías',
        login: 'Iniciar Sesión',
        logout: 'Cerrar Sesión',
        admin: 'Administración',
      },

      categories: {
        podcast: 'Podcast',
        live_events: 'Eventos en Vivo',
        sports: 'Deportes',
        classes: 'Clases',
        entertainment: 'Entretenimiento',
        culture: 'Cultura',
        trending: 'Clases del Momento',
        subjects: 'Materias',
      },

      home: {
        latest_video: 'Vídeo Más Reciente',
        main_news: 'Noticias Principales',
        see_all: 'Ver Todas',
        watch_now: 'Ver Ahora',
        read_more: 'Leer Más',
      },

      news: {
        title: 'Noticias',
        search: 'Buscar noticias...',
        filter_category: 'Filtrar por categoría',
        all_categories: 'Todas las categorías',
        no_results: 'No se encontraron noticias',
        published_at: 'Publicado el',
      },

      login: {
        title: 'Iniciar Sesión en Senador Play',
        email: 'Correo Electrónico',
        password: 'Contraseña',
        submit: 'Iniciar Sesión',
        error: 'Correo o contraseña incorrectos',
        welcome: '¡Bienvenido de nuevo!',
      },

      admin: {
        dashboard: 'Panel de Control',
        create_news: 'Crear Noticia',
        create_video: 'Agregar Video',
        manage_subjects: 'Gestionar Materias',

        news_form: {
          title: 'Nueva Noticia',
          title_pt: 'Título (Portugués)',
          title_en: 'Título (Inglés)',
          title_es: 'Título (Español)',
          content_pt: 'Contenido (Portugués)',
          content_en: 'Contenido (Inglés)',
          content_es: 'Contenido (Español)',
          image: 'Imagen de Portada',
          category: 'Categoría',
          is_featured: 'Destacar en página principal',
          submit: 'Publicar Noticia',
          success: '¡Noticia publicada exitosamente!',
          error: 'Error al publicar noticia',
        },

        video_form: {
          title: 'Agregar Video',
          youtube_url: 'URL de YouTube',
          youtube_url_placeholder: 'https://www.youtube.com/watch?v=...',
          title_pt: 'Título (Portugués)',
          title_en: 'Título (Inglés)',
          title_es: 'Título (Español)',
          description_pt: 'Descripción (Portugués)',
          description_en: 'Descripción (Inglés)',
          description_es: 'Descripción (Español)',
          category: 'Categoría',
          subject: 'Materia (opcional)',
          is_featured: 'Destacado',
          submit: 'Agregar Video',
          success: '¡Video agregado exitosamente!',
          error: 'Error al agregar video',
        },

        subjects: {
          title: 'Materias',
          create_new: 'Nueva Materia',
          name_pt: 'Nombre (Portugués)',
          name_en: 'Nombre (Inglés)',
          name_es: 'Nombre (Español)',
          add: 'Agregar',
          delete: 'Eliminar',
          confirm_delete: '¿Está seguro de que desea eliminar esta materia?',
          success_create: '¡Materia creada exitosamente!',
          success_delete: '¡Materia eliminada exitosamente!',
          error: 'Error al gestionar materia',
        },
      },

      common: {
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        save: 'Guardar',
        delete: 'Eliminar',
        edit: 'Editar',
        close: 'Cerrar',
        back: 'Volver',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en', 'es'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
