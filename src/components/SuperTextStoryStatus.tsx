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
      fontSize: '21px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold' as const,
      border: 'none',
      cursor: 'pointer' as const,
      padding: '8px 16px',
      textAlign: 'center' as const,
      width: '100%',
      marginBottom: '4px'
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
          backgroundColor: '#D3D3D3', // Light gray (inactive state)
          color: 'black'
        };
    }
  };

  const statusLabels = [
    "0 - Ready to be Saved & Published — Approved and Reviewed",
    "1 - Ready to be Saved & Published — Approved Only", 
    "2 - Saved, NOT PUBLISHED — Not Reviewed by CoPilot",
    "3 - Saved — NOT APPROVED by Gpa",
    "4 - Saved — Still being formatted",
    "5 - FILE NOT SAVED"
  ];

  return (
    <Card className="h-fit relative" style={{
      borderColor: '#3b82f6',
      borderWidth: '4px',
      minHeight: '500px'
    }}>
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{
          color: '#3b82f6'
        }}>
          <FileText className="h-5 w-5" />
          Text Status
        </CardTitle>
        <h3 className="text-xl font-bold" style={{
          color: '#F97316',
          fontSize: '21px',
          fontFamily: 'Arial, sans-serif'
        }}>
          Last Updates
        </h3>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="space-y-1">
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
        </div>

        <div className="flex flex-col items-center">
          <table className="w-full text-xs" style={{
            border: '2px solid #9c441a'
          }}>
            <tbody>
              <tr>
                <td className="text-center font-bold px-1 py-1" style={{
                  ...getLastUpdateStyle()
                }}>
                  Last Text
                </td>
              </tr>
              <tr>
                <td className="text-center font-bold px-1 py-1" style={{
                  borderTop: '1px solid #9c441a',
                  ...getLastUpdateStyle()
                }}>
                  {formatDateTime(story?.updated_at).date} {formatDateTime(story?.updated_at).time}
                </td>
              </tr>
              <tr>
                <td className="text-center font-bold px-1 py-1" style={{
                  borderTop: '1px solid #9c441a',
                  ...getAudioStatusStyle()
                }}>
                  Last Audio
                </td>
              </tr>
              <tr>
                <td className="text-center font-bold px-1 py-1" style={{
                  borderTop: '1px solid #9c441a',
                  ...getAudioStatusStyle()
                }}>
                  {formatDateTime(story?.audio_generated_at).date} {formatDateTime(story?.audio_generated_at).time}
                </td>
              </tr>
              <tr>
                <td className="text-center font-bold px-1 py-1 text-gray-700" style={{
                  borderTop: '1px solid #9c441a',
                  backgroundColor: 'rgba(22, 156, 249, 0.3)',
                  fontSize: '21px',
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 'bold'
                }}>
                  Original
                </td>
              </tr>
              <tr>
                <td className="text-center font-bold px-1 py-1 text-gray-600" style={{
                  borderTop: '1px solid #9c441a',
                  backgroundColor: 'rgba(22, 156, 249, 0.3)',
                  fontSize: '21px',
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 'bold'
                }}>
                  {formatDateTime(story?.created_at).date} {formatDateTime(story?.created_at).time}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </CardContent>
    </Card>
  );
};

export default SuperTextStoryStatus;