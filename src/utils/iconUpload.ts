import { supabase } from "@/integrations/supabase/client";

export interface IconUploadResult {
  success: boolean;
  fileName?: string;
  uploadPath?: string;
  error?: string;
}

export const uploadIconFromGoogleDrive = async (
  googleDriveUrl: string,
  fileName: string,
  description?: string
): Promise<IconUploadResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('download-and-upload-icon', {
      body: {
        googleDriveUrl,
        fileName,
        description
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      return {
        success: false,
        error: `Failed to upload icon: ${error.message}`
      };
    }

    if (data.success) {
      return {
        success: true,
        fileName: data.fileName,
        uploadPath: data.uploadPath
      };
    } else {
      return {
        success: false,
        error: data.error || 'Unknown error occurred'
      };
    }
  } catch (error) {
    console.error('Unexpected error uploading icon:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error occurred'
    };
  }
};