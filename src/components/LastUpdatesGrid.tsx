import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface LastUpdatesGridProps {
  story?: Story | null;
  hideTitle?: boolean;
}

const LastUpdatesGrid: React.FC<LastUpdatesGridProps> = ({ story, hideTitle = false }) => {
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
      fontFamily: "'Lexend', Arial, sans-serif",
      fontWeight: 'bold'
    };
  };

  const getAudioStatusStyle = () => {
    const hasAudio = story?.audio_generated_at;
    
    // Allow 2-minute grace period for audio generation after text save
    // This handles cases where audio is generated immediately after saving
    const isAudioOutdated = hasAudio && story?.updated_at && 
      (new Date(story.audio_generated_at).getTime() + 120000) < new Date(story.updated_at).getTime();
    
    // Red background if no audio or if audio is outdated (more than 2 min before last text update)
    const shouldBeRed = !hasAudio || isAudioOutdated;
    
    return {
      backgroundColor: shouldBeRed ? '#DC2626' : '#22c55e',
      color: shouldBeRed ? '#FFFF00' : 'black',
      fontSize: '21px',
      fontFamily: "'Lexend', Arial, sans-serif",
      fontWeight: 'bold'
    };
  };

  const getOriginalStyle = () => {
    return {
      backgroundColor: 'rgba(22, 156, 249, 0.3)',
      color: '#333',
      fontSize: '21px',
      fontFamily: "'Lexend', Arial, sans-serif",
      fontWeight: 'bold'
    };
  };

  return (
    <Card className="w-auto mb-0 border-0 bg-white">
      {!hideTitle && (
        <CardHeader className="pb-1">
          <CardTitle className="text-center text-lg font-bold" style={{
            color: '#F97316',
            fontSize: '18px',
            fontFamily: "'Lexend', Arial, sans-serif"
          }}>
            Last Updates
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <table className="w-full" style={{
          border: '2px solid #9c441a'
        }}>
          <tbody>
            {/* First Row - Headers */}
            <tr>
              <td className="text-center font-bold px-1 py-1 w-1/3" style={{
                borderRight: '1px solid #9c441a',
                ...getLastUpdateStyle(),
                fontSize: '16px'
              }}>
                Last Text
              </td>
              <td className="text-center font-bold px-1 py-1 w-1/3" style={{
                borderRight: '1px solid #9c441a',
                ...getAudioStatusStyle(),
                fontSize: '16px'
              }}>
                Last Audio
              </td>
              <td className="text-center font-bold px-1 py-1 w-1/3" style={{
                ...getOriginalStyle(),
                fontSize: '16px'
              }}>
                Original
              </td>
            </tr>
            {/* Second Row - Values */}
            <tr>
              <td className="text-center font-bold px-1 py-1" style={{
                borderTop: '1px solid #9c441a',
                borderRight: '1px solid #9c441a',
                ...getLastUpdateStyle(),
                fontSize: '16px'
              }}>
                {formatDateTime(story?.updated_at).date} {formatDateTime(story?.updated_at).time}
              </td>
              <td className="text-center font-bold px-1 py-1" style={{
                borderTop: '1px solid #9c441a',
                borderRight: '1px solid #9c441a',
                ...getAudioStatusStyle(),
                fontSize: '16px'
              }}>
                {formatDateTime(story?.audio_generated_at).date} {formatDateTime(story?.audio_generated_at).time}
              </td>
              <td className="text-center font-bold px-1 py-1" style={{
                borderTop: '1px solid #9c441a',
                ...getOriginalStyle(),
                fontSize: '16px'
              }}>
                {formatDateTime(story?.created_at).date} {formatDateTime(story?.created_at).time}
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default LastUpdatesGrid;