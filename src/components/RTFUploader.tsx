import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RTFUploaderProps {
  onContentExtracted: (content: string) => void;
  currentContent?: string;
}

const RTFUploader: React.FC<RTFUploaderProps> = ({ onContentExtracted, currentContent }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processRTFFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const text = await file.text();
      console.log('Raw RTF content length:', text.length);
      console.log('Raw RTF sample:', text.substring(0, 500));
      
      // More sophisticated RTF parsing
      let content = text;
      
      // First, find where the actual content starts (after font tables, etc.)
      // Look for common RTF document start patterns
      const contentStartPatterns = [
        /\\f0\\fs\d+/,  // font size declarations
        /\\pard/,       // paragraph formatting
        /\\plain/       // plain text formatting
      ];
      
      let contentStartIndex = 0;
      for (const pattern of contentStartPatterns) {
        const match = content.search(pattern);
        if (match > contentStartIndex) {
          contentStartIndex = match;
        }
      }
      
      // If we found a content start, use it
      if (contentStartIndex > 0) {
        content = content.substring(contentStartIndex);
      }
      
      // Remove RTF control groups that don't contain text
      content = content.replace(/{\\fonttbl[^}]*}/g, '');
      content = content.replace(/{\\colortbl[^}]*}/g, '');
      content = content.replace(/{\\stylesheet[^}]*}/g, '');
      content = content.replace(/{\\info[^}]*}/g, '');
      content = content.replace(/{\\generator[^}]*}/g, '');
      
      // Handle paragraph and line breaks first (before removing other controls)
      content = content.replace(/\\par\b/g, '\n\n');
      content = content.replace(/\\line\b/g, '\n');
      content = content.replace(/\\tab\b/g, '\t');
      
      // Remove RTF control words (but keep the space after them)
      content = content.replace(/\\[a-zA-Z]+\d*\s*/g, ' ');
      
      // Remove RTF control symbols
      content = content.replace(/\\[^a-zA-Z\s\n]/g, '');
      
      // Now handle braces - remove them but keep content inside
      let result = '';
      let braceLevel = 0;
      let i = 0;
      
      while (i < content.length) {
        const char = content[i];
        
        if (char === '{') {
          braceLevel++;
        } else if (char === '}') {
          braceLevel--;
        } else if (char === '\\' && i + 1 < content.length) {
          // Skip RTF control sequences we might have missed
          i++;
          while (i < content.length && /[a-zA-Z0-9]/.test(content[i])) {
            i++;
          }
          continue;
        } else {
          // Only add text characters, not control characters
          if (braceLevel <= 1 && char.match(/[\w\s\n\t.,!?;:'"()-]/) && char !== '\\') {
            result += char;
          }
        }
        i++;
      }
      
      content = result;
      
      // Clean up whitespace
      content = content.replace(/\s+/g, ' ');
      content = content.replace(/\n\s+/g, '\n');
      content = content.replace(/\s+\n/g, '\n');
      content = content.replace(/\n{3,}/g, '\n\n');
      content = content.trim();
      
      console.log('Processed content length:', content.length);
      console.log('Processed content sample:', content.substring(0, 300));
      
      if (content.length > 50 && content.match(/[a-zA-Z]/)) {
        onContentExtracted(content);
        toast({
          title: "Success",
          description: "RTF file content extracted successfully"
        });
      } else {
        throw new Error("No readable text content found in RTF file");
      }
    } catch (error) {
      console.error('Error processing RTF file:', error);
      toast({
        title: "Error",
        description: "Failed to process RTF file. Please try again or paste the content manually.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed');
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.type, file.size);
      handleFile(file);
    }
    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  const handleFile = (file: File) => {
    console.log('Handling file:', file.name);
    
    if (!file.name.toLowerCase().endsWith('.rtf')) {
      toast({
        title: "Invalid file type",
        description: "Please select an RTF (.rtf) file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    processRTFFile(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(event.dataTransfer.files);
    const rtfFile = files.find(file => file.name.toLowerCase().endsWith('.rtf'));
    
    if (rtfFile) {
      handleFile(rtfFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please drop an RTF (.rtf) file",
        variant: "destructive"
      });
    }
  };

  const handleButtonClick = () => {
    console.log('Upload button clicked');
    const fileInput = document.getElementById('rtf-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const clearContent = () => {
    onContentExtracted('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Upload RTF Story File</Label>
        {currentContent && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearContent}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Content
          </Button>
        )}
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-amber-500 bg-amber-50' 
            : 'border-gray-300 hover:border-amber-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-amber-100">
            {isProcessing ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
            ) : (
              <FileText className="h-6 w-6 text-amber-600" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isProcessing ? 'Processing RTF file...' : 'Drop your RTF file here'}
            </p>
            <p className="text-sm text-gray-500">
              or click below to browse for a file
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supports .rtf files up to 5MB
            </p>
          </div>
          
          <div>
            <Input
              type="file"
              accept=".rtf"
              onChange={handleFileSelect}
              disabled={isProcessing}
              className="hidden"
              id="rtf-upload"
            />
            <Button 
              type="button" 
              variant="outline" 
              disabled={isProcessing}
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
              onClick={handleButtonClick}
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose RTF File
            </Button>
          </div>
        </div>
      </div>
      
      {currentContent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700 font-medium">
            ✓ Content loaded from RTF file ({currentContent.length} characters)
          </p>
        </div>
      )}
    </div>
  );
};

export default RTFUploader;
