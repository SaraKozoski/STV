import { supabase } from './supabase';

const BUCKET_NAME = 'supporters-logos';

export const supportersService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('supporters')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      // Adicionar URL pública para cada logo
      const supportersWithUrls = data?.map(supporter => ({
        ...supporter,
        logo_public_url: supporter.logo_path 
          ? supabase.storage.from(BUCKET_NAME).getPublicUrl(supporter.logo_path).data.publicUrl
          : null
      }));

      return { data: supportersWithUrls, error: null };
    } catch (error) {
      console.error('Error fetching supporters:', error);
      return { data: null, error };
    }
  },

  async create(supporter) {
    try {
      const { data, error } = await supabase
        .from('supporters')
        .insert([supporter])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating supporter:', error);
      return { data: null, error };
    }
  },

  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('supporters')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating supporter:', error);
      return { data: null, error };
    }
  },

  async delete(id) {
    try {
      const { error } = await supabase
        .from('supporters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting supporter:', error);
      return { error };
    }
  },

  // Upload de logo
  async uploadLogo(file) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      return { 
        data: { 
          path: filePath, 
          publicUrl: urlData.publicUrl 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error uploading logo:', error);
      return { data: null, error };
    }
  },

  // Deletar logo
  async deleteLogo(filePath) {
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting logo:', error);
      return { error };
    }
  }
};