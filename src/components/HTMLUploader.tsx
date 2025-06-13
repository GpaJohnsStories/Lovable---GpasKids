
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HTMLUploaderProps {
  onContentExtracted: (content: string) => void;
  currentContent?: string;
}

const HTMLUploader: React.FC<HTMLUploaderProps> = ({ onContentExtracted, currentContent }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processHTMLFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const htmlContent = await file.text();
      
      // Extract content from HTML body if it exists, otherwise use the whole content
      let content = htmlContent;
      
      // If it's a full HTML document, extract the body content
      const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        content = bodyMatch[1].trim();
      } else {
        // If no body tag, but has HTML structure, clean it up
        content = htmlContent
          .replace(/<html[^>]*>/gi, '')
          .replace(/<\/html>/gi, '')
          .replace(/<head[\s\S]*?<\/head>/gi, '')
          .replace(/<meta[^>]*>/gi, '')
          .replace(/<title[\s\S]*?<\/title>/gi, '')
          .replace(/<!DOCTYPE[^>]*>/gi, '')
          .trim();
      }
      
      if (content.length > 0) {
        onContentExtracted(content);
        toast({
          title: "Success",
          description: "HTML file content loaded successfully"
        });
      } else {
        throw new Error("No readable content found in HTML file");
      }
    } catch (error) {
      console.error('Error processing HTML file:', error);
      toast({
        title: "Error",
        description: "Failed to process HTML file. Please check the file format and try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.html') && !fileName.endsWith('.htm')) {
      toast({
        title: "Invalid file type",
        description: "Please select an HTML (.html or .htm) file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    processHTMLFile(file);
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
    const htmlFile = files.find(file => {
      const fileName = file.name.toLowerCase();
      return fileName.endsWith('.html') || fileName.endsWith('.htm');
    });
    
    if (htmlFile) {
      handleFile(htmlFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please drop an HTML (.html or .htm) file",
        variant: "destructive"
      });
    }
  };

  const clearContent = () => {
    onContentExtracted('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Upload HTML Story File</Label>
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
              {isProcessing ? 'Processing HTML file...' : 'Drop your HTML file here'}
            </p>
            <p className="text-sm text-gray-500">
              or click below to browse for a file
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supports .html and .htm files up to 10MB
            </p>
          </div>
          
          <div>
            <Input
              type="file"
              accept=".html,.htm"
              onChange={handleFileSelect}
              disabled={isProcessing}
              className="hidden"
              id="html-upload"
            />
            <Label htmlFor="html-upload" className="cursor-pointer">
              <Button 
                type="button" 
                variant="outline" 
                disabled={isProcessing}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose HTML File
              </Button>
            </Label>
          </div>
        </div>
      </div>
      
      {currentContent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700 font-medium">
            ✓ HTML content loaded ({currentContent.length} characters)
          </p>
          <p className="text-xs text-green-600 mt-1">
            The content is now available in the rich text editor below and can be further edited.
          </p>
        </div>
      )}
    </div>
  );
};

export default HTMLUploader;
