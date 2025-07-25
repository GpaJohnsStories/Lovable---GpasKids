import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const StorageFileRemover = () => {
  useEffect(() => {
    const removeFile = async () => {
      console.log('🗑️ Attempting to remove ICO-N2K.png from storage...');
      
      const { error } = await supabase.storage
        .from('icons')
        .remove(['ICO-N2K.png']);
      
      if (error) {
        console.error('❌ Error removing file:', error);
      } else {
        console.log('✅ Successfully removed ICO-N2K.png from storage');
      }
    };
    
    removeFile();
  }, []);

  return null;
};

export default StorageFileRemover;