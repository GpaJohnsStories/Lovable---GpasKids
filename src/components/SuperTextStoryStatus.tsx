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
}

interface SuperTextStoryStatusProps {
  story?: Story | null;
}

const SuperTextStoryStatus: React.FC<SuperTextStoryStatusProps> = ({ story }) => {
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
      color: 'black'
    };
  };

  const getAudioStatusStyle = () => {
    const hasAudio = story?.audio_generated_at;
    return {
      backgroundColor: hasAudio ? '#22c55e' : '#DC2626',
      color: hasAudio ? 'black' : '#FFFF00'
    };
  };

  const getPublishedColor = (publishedStatus: string) => {
    switch (publishedStatus) {
      case 'Y':
        return 'text-white bg-green-600 border-green-700';
      case 'N':
        return 'text-white bg-red-600 border-red-700';
      default:
        return 'text-white bg-red-600 border-red-700';
    }
  };

  return (
    <Card className="h-fit relative" style={{
      borderColor: '#3b82f6',
      borderWidth: '4px'
    }}>
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{
          color: '#3b82f6'
        }}>
          <FileText className="h-5 w-5" />
          Text Status
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="published" className="text-xs font-bold text-gray-700">Publication Status</Label>
          <div className="flex items-center gap-2">
            <Select value={story?.published || "N"} onValueChange={() => {}}>
              <SelectTrigger className={`w-1/2 text-xs font-bold ${getPublishedColor(story?.published || 'N')}`}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white border shadow-lg">
                <SelectItem value="N">Not Published</SelectItem>
                <SelectItem value="Y">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-1" style={{
            color: '#F97316',
            fontSize: '21px',
            fontFamily: 'Arial, sans-serif'
          }}>
            Last Updates
          </h3>
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
                  backgroundColor: 'rgba(22, 156, 249, 0.3)'
                }}>
                  Original
                </td>
              </tr>
              <tr>
                <td className="text-center font-bold px-1 py-1 text-gray-600" style={{
                  borderTop: '1px solid #9c441a',
                  backgroundColor: 'rgba(22, 156, 249, 0.3)'
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