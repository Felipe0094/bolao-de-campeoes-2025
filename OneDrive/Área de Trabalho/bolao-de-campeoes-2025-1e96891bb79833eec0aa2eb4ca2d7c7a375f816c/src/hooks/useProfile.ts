import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      console.log('Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (!data) {
        console.log('Profile not found, creating one...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
            email: user.email || '',
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          throw createError;
        }

        console.log('Profile created successfully:', newProfile);
        return newProfile as Profile;
      }

      console.log('Profile fetched successfully:', data);
      return data as Profile;
    },
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Starting avatar upload for user:', user.id);
      console.log('File details:', { name: file.name, size: file.size, type: file.type });

      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      console.log('Uploading file as:', fileName);

      // Remover avatar anterior se existir
      if (profileQuery.data?.avatar_url) {
        const oldFileName = profileQuery.data.avatar_url.split('/').pop();
        if (oldFileName && oldFileName !== fileName.split('/').pop()) {
          console.log('Removing old avatar:', `${user.id}/${oldFileName}`);
          try {
            await supabase.storage
              .from('avatars')
              .remove([`${user.id}/${oldFileName}`]);
          } catch (error) {
            console.warn('Error removing old avatar:', error);
            // Não interrompe o processo se falhar ao remover o avatar antigo
          }
        }
      }

      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, { 
            upsert: true,
            contentType: file.type
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        console.log('Upload successful:', uploadData);

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        console.log('Public URL generated:', urlData.publicUrl);

        return urlData.publicUrl;
      } catch (error: any) {
        console.error('Storage operation failed:', error);
        if (error.message?.includes('bucket')) {
          throw new Error(
            'O bucket de avatares não está configurado. ' +
            'Por favor, entre em contato com o administrador do sistema para configurar o bucket de avatares no Supabase.'
          );
        }
        throw error;
      }
    },
    onSuccess: (avatarUrl) => {
      console.log('Avatar upload successful, updating profile with URL:', avatarUrl);
      updateProfileMutation.mutate({ avatar_url: avatarUrl });
    },
    onError: (error: any) => {
      console.error('Avatar upload failed:', error);
      toast({
        title: "Erro ao fazer upload",
        description: error.message || 'Erro desconhecido no upload',
        variant: "destructive",
      });
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    updateProfile: updateProfileMutation.mutate,
    uploadAvatar: uploadAvatarMutation.mutate,
    isUpdating: updateProfileMutation.isPending || uploadAvatarMutation.isPending,
  };
};
