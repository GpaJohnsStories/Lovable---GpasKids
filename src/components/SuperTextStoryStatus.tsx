import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileText, Headphones, Video } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Story {
  id?: string;
  title?: string;
  author?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
  audio_generated_at?: string | null;
  copyright_status?: string;
  published?: string;
  google_drive_link?: string;
  publication_status_code?: number;
}

interface SuperTextStoryStatusProps {
  story?: Story | null;
  publicationStatusCode?: number;
  onStatusChange?: (status: number) => void;
}

const SuperTextStoryStatus: React.FC<SuperTextStoryStatusProps> = ({ story, publicationStatusCode = 5, onStatusChange }) => {
  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return { date: '--/--/--', time: '--:--' };
    
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: '2-digit' 
    });
    const formattedTime = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    return { date: formattedDate, time: formattedTime };
  };

  const getLastUpdateStyle = () => {
    return {
      backgroundColor: '#F2BA15',
      color: 'black',
      fontSize: '21px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold'
    };
  };

  const getAudioStatusStyle = () => {
    const hasAudio = story?.audio_generated_at;
    return {
      backgroundColor: hasAudio ? '#22c55e' : '#DC2626',
      color: hasAudio ? 'black' : '#FFFF00',
      fontSize: '21px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold'
    };
  };

  const getStatusButtonStyle = (buttonStatus: number) => {
    const isActive = publicationStatusCode === buttonStatus;
    const baseStyle = {
      fontSize: '19px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold' as const,
      border: 'none',
      cursor: 'pointer' as const,
      padding: '8px 16px',
      textAlign: 'left' as const,
      width: '100%'
    };

    if (!isActive) {
      return {
        ...baseStyle,
        backgroundColor: '#D3D3D3', // Light gray
        color: 'black'
      };
    }

    switch (buttonStatus) {
      case 0:
        return {
          ...baseStyle,
          backgroundColor: '#228B22', // Forest Green
          color: 'white'
        };
      case 1:
        return {
          ...baseStyle,
          backgroundColor: '#10b981', // Green Emerald
          color: 'white'
        };
      case 2:
        return {
          ...baseStyle,
          backgroundColor: '#FFD700', // Golden Yellow
          color: '#228B22' // Forest Green text
        };
      case 3:
        return {
          ...baseStyle,
          backgroundColor: '#3b82f6', // Blue Primary
          color: 'white'
        };
      case 4:
        return {
          ...baseStyle,
          backgroundColor: '#9c441a', // Brown Earth
          color: 'white'
        };
      default: // 5
        return {
          ...baseStyle,
          backgroundColor: '#DC143C', // Red Crimson
          color: '#FFD700' // Golden Yellow text
        };
    }
  };

  const statusLabels = [
    "0 - Save & Publish, App & Rev",
    "1 - Save & Publish, App Only", 
    "2 - Save, NO Publish, No CoP",
    "3 - Save, NO Gpa APR",
    "4 - Save, Formatting",
    "5 - NOT SAVED"
  ];

  return (
    <Card className="h-fit relative w-fit max-w-xs" style={{
      borderColor: '#3b82f6',
      borderWidth: '2px'
    }}>
      <CardHeader className="p-0">
        <CardTitle className="flex flex-col items-center gap-1 font-bold py-3" style={{
          color: '#FFD700',
          backgroundColor: '#228B22',
          fontSize: '24px',
          textShadow: '2px 2px 0px #B8860B, 4px 4px 0px #8B6914, 6px 6px 0px #654321, 8px 8px 15px rgba(0,0,0,0.4)'
        }}>
          <span>Set Text Status</span>
          <span>BEFORE Saving</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {statusLabels.map((label, index) => (
            <button
              key={index}
              onClick={() => onStatusChange?.(index)}
              style={getStatusButtonStyle(index)}
            >
              {label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuperTextStoryStatus;