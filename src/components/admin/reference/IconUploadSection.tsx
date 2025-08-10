import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const IconUploadSection = () => {
  const [iconCode, setIconCode] = useState("");
  const [iconName, setIconName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async ({ file, fileName, name }: { file: File; fileName: string; name: string }) => {
      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('icons')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('icon_library')
        .insert({
          icon_code: iconCode,
          icon_name: name,
          file_path: uploadData.path
        });

      if (dbError) {
        throw new Error(`Database save failed: ${dbError.message}`);
      }

      return { fileName, path: uploadData.path };
    },
    onSuccess: (data) => {
      toast({
        title: "Icon uploaded successfully",
        description: `${data.fileName} has been saved to the icon library.`,
      });
      
      // Reset form
      setIconCode("");
      setIconName("");
      setSelectedFile(null);
      
      // Invalidate queries to refresh icon library
      queryClient.invalidateQueries({ queryKey: ["icons"] });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateFileName = (code: string, file: File | null) => {
    if (!file) return '';
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    return `${code.toUpperCase()}.${extension}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!iconCode || !iconName || !selectedFile) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select a file.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[A-Z]{3}-[A-Z0-9]{3}$/.test(iconCode.toUpperCase())) {
      toast({
        title: "Invalid icon code",
        description: "Icon code must follow AAA-BBB format (3 capital letters, dash, 3 letters/numbers).",
        variant: "destructive",
      });
      return;
    }

    const fileName = generateFileName(iconCode, selectedFile);
    uploadMutation.mutate({ 
      file: selectedFile, 
      fileName, 
      name: iconName 
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a PNG, JPG, JPEG, SVG, or GIF file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 2MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Auto-populate icon name from filename (without extension)
      const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
      setIconName(fileNameWithoutExtension);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Icon
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="iconCode">Icon Code (AAA-BBB format)</Label>
              <Input
                id="iconCode"
                value={iconCode}
                onChange={(e) => setIconCode(e.target.value.toUpperCase())}
                placeholder="e.g., HOM-BTN, STR-ICO"
                maxLength={7}
                className="uppercase"
              />
            </div>

          </div>

          <div className="space-y-2">
            <Label htmlFor="iconName">Icon Name</Label>
            <Input
              id="iconName"
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
              placeholder="e.g., Home Icon, Story Icon, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="iconFile">Icon File</Label>
            <Input
              id="iconFile"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          {iconCode && selectedFile && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">Generated filename:</p>
              <p className="text-sm text-muted-foreground">{generateFileName(iconCode, selectedFile)}</p>
            </div>
          )}

          {selectedFile && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">Selected file:</p>
              <p className="text-sm text-muted-foreground">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={uploadMutation.isPending}
            className="w-full"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Icon
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default IconUploadSection;