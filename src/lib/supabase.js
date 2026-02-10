import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper functions para operações comuns

// Autenticação
export const authService = {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Categorias
export const categoriesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name_pt');
    return { data, error };
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
    return { data, error };
  }
};

// Disciplinas
export const subjectsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name_pt');
    return { data, error };
  },

  async create(subject) {
    const { data, error } = await supabase
      .from('subjects')
      .insert([subject])
      .select()
      .single();
    return { data, error };
  },

  async delete(id) {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Vídeos
export const videosService = {
  async getAll(filters = {}) {
    let query = supabase
      .from('videos')
      .select(`
        *,
        categories (name_pt, name_en, name_es, slug),
        subjects (name_pt, name_en, name_es)
      `)
      .order('published_at', { ascending: false });

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters.subject_id) {
      query = query.eq('subject_id', filters.subject_id);
    }

    if (filters.is_featured) {
      query = query.eq('is_featured', true);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async getLatest() {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        categories (name_pt, name_en, name_es, slug)
      `)
      .order('published_at', { ascending: false })
      .limit(1)
      .single();
    return { data, error };
  },

  async create(video) {
    const { data, error } = await supabase
      .from('videos')
      .insert([video])
      .select()
      .single();
    return { data, error };
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id) {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Notícias
export const newsService = {
  async getAll(filters = {}) {
    let query = supabase
      .from('news_articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (filters.is_featured) {
      query = query.eq('is_featured', true);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async create(article) {
    const { data, error } = await supabase
      .from('news_articles')
      .insert([article])
      .select()
      .single();
    return { data, error };
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('news_articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id) {
    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Upload de imagens
export const storageService = {
  async uploadImage(file, bucket = 'images') {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload do arquivo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return { data: null, error: uploadError };
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log('Image uploaded successfully:', publicUrl);
      return { data: { path: filePath, publicUrl }, error: null };
    } catch (error) {
      console.error('Storage service error:', error);
      return { data: null, error };
    }
  },};

