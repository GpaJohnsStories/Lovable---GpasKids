
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AdminLayoutWithHeaderBanner from "./AdminLayoutWithHeaderBanner";
import AuthorBioForm from "./AuthorBioForm";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "sonner";

const AuthorBioManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const isEditing = Boolean(id);

  // Fetch bio data if editing
  const { data: bio, isLoading, error } = useQuery({
    queryKey: ['admin-author-bio', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('author_bios')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  const handleBack = () => {
    navigate('/buddys_admin/stories?view=bios');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // The save operation is handled in AuthorBioForm
      // After successful save, navigate back to the bios list
      toast.success(isEditing ? "Author bio updated successfully" : "Author bio created successfully");
      handleBack();
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast.error("Error saving author bio");
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing && isLoading) {
    return (
      <AdminLayoutWithHeaderBanner>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </AdminLayoutWithHeaderBanner>
    );
  }

  if (isEditing && error) {
    return (
      <AdminLayoutWithHeaderBanner>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading author bio: {error.message}</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Author Bios
          </button>
        </div>
      </AdminLayoutWithHeaderBanner>
    );
  }

  return (
    <AdminLayoutWithHeaderBanner>
      <AuthorBioForm
        bio={bio}
        onBack={handleBack}
        onSave={handleSave}
        backButtonText="Back to Author Bios"
      />
    </AdminLayoutWithHeaderBanner>
  );
};

export default AuthorBioManagement;
