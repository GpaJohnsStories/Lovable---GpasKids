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
}

const LastUpdatesGrid: React.FC<LastUpdatesGridProps> = ({ story }) => {
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

  const getOriginalStyle = () => {
    return {
      backgroundColor: 'rgba(22, 156, 249, 0.3)',
      color: '#333',
      fontSize: '21px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold'
    };
  };

  return (
    <Card className="w-full mb-4" style={{
      borderColor: '#F97316',
      borderWidth: '3px'
    }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-xl font-bold" style={{
          color: '#F97316',
          fontSize: '21px',
          fontFamily: 'Arial, sans-serif'
        }}>
          Last Updates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full" style={{
          border: '2px solid #9c441a'
        }}>
          <tbody>
            {/* First Row - Headers */}
            <tr>
              <td className="text-center font-bold px-2 py-1 w-1/3" style={{
                borderRight: '1px solid #9c441a',
                ...getLastUpdateStyle()
              }}>
                Last Text
              </td>
              <td className="text-center font-bold px-2 py-1 w-1/3" style={{
                borderRight: '1px solid #9c441a',
                ...getAudioStatusStyle()
              }}>
                Last Audio
              </td>
              <td className="text-center font-bold px-2 py-1 w-1/3" style={{
                ...getOriginalStyle()
              }}>
                Original
              </td>
            </tr>
            {/* Second Row - Values */}
            <tr>
              <td className="text-center font-bold px-2 py-1" style={{
                borderTop: '1px solid #9c441a',
                borderRight: '1px solid #9c441a',
                ...getLastUpdateStyle()
              }}>
                {formatDateTime(story?.updated_at).date} {formatDateTime(story?.updated_at).time}
              </td>
              <td className="text-center font-bold px-2 py-1" style={{
                borderTop: '1px solid #9c441a',
                borderRight: '1px solid #9c441a',
                ...getAudioStatusStyle()
              }}>
                {formatDateTime(story?.audio_generated_at).date} {formatDateTime(story?.audio_generated_at).time}
              </td>
              <td className="text-center font-bold px-2 py-1" style={{
                borderTop: '1px solid #9c441a',
                ...getOriginalStyle()
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