import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileText, Headphones, Video } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CopyrightControl from "@/components/story-form/CopyrightControl";

const SuperTextStoryStatus = () => {
  const getLastUpdateStyle = () => {
    // Default styling for placeholder state
    return {
      backgroundColor: '#F2BA15',
      color: 'black'
    };
  };

  const getAudioStatusStyle = () => {
    // Default styling for placeholder state
    return {
      backgroundColor: '#DC2626',
      color: '#FFFF00'
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
      borderColor: '#F97316',
      borderWidth: '2px'
    }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-semibold" style={{
          color: '#F97316'
        }}>
          <FileText className="h-5 w-5" />
          Story Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <table className="w-full text-xs" style={{
          border: '2px solid #9c441a'
        }}>
          <tbody>
            <tr>
              <td colSpan={2} className="text-center font-bold px-1 py-1" style={{
                borderRight: '1px solid #9c441a',
                ...getLastUpdateStyle()
              }}>
                Last Update
              </td>
              <td colSpan={2} className="text-center font-bold text-gray-700 px-1 py-1" style={{
                borderRight: '1px solid #9c441a',
                backgroundColor: 'rgba(22, 156, 249, 0.3)'
              }}>
                Original Upload
              </td>
              <td colSpan={2} className="text-center font-bold px-1 py-1" style={getAudioStatusStyle()}>
                Last Audio Gen
              </td>
            </tr>
            <tr>
              <td className="text-center font-bold px-1 py-1" style={{
                borderRight: '1px solid #9c441a',
                borderTop: '1px solid #9c441a',
                ...getLastUpdateStyle()
              }}>
                --/--/--
              </td>
              <td className="text-center font-bold px-1 py-1" style={{
                borderRight: '1px solid #9c441a',
                borderTop: '1px solid #9c441a',
                ...getLastUpdateStyle()
              }}>
                --:--
              </td>
              <td className="text-center text-gray-600 font-bold px-1 py-1" style={{
                borderRight: '1px solid #9c441a',
                borderTop: '1px solid #9c441a',
                backgroundColor: 'rgba(22, 156, 249, 0.3)'
              }}>
                --/--/--
              </td>
              <td className="text-center text-gray-600 font-bold px-1 py-1" style={{
                borderRight: '1px solid #9c441a',
                borderTop: '1px solid #9c441a',
                backgroundColor: 'rgba(22, 156, 249, 0.3)'
              }}>
                --:--
              </td>
              <td className="text-center font-bold px-1 py-1" style={{
                borderRight: '1px solid #9c441a',
                borderTop: '1px solid #9c441a',
                ...getAudioStatusStyle()
              }}>
                --/--/--
              </td>
              <td className="text-center font-bold px-1 py-1" style={{
                borderTop: '1px solid #9c441a',
                ...getAudioStatusStyle()
              }}>
                --:--
              </td>
            </tr>
          </tbody>
        </table>
        
        <div className="flex gap-3">
          <div className="space-y-1 flex-1">
            <Label className="text-xs font-bold text-gray-700">Copyright Status</Label>
            <CopyrightControl value="©" onChange={() => {}} />
          </div>
          
          <div className="space-y-1 flex-1">
            <Label htmlFor="published" className="text-xs font-bold text-gray-700">Publication Status</Label>
            <div className="flex items-center gap-2">
              <Select value="N" onValueChange={() => {}}>
                <SelectTrigger className={`w-auto min-w-[140px] text-xs font-bold ${getPublishedColor('N')}`}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white border shadow-lg">
                  <SelectItem value="N">Not Published</SelectItem>
                  <SelectItem value="Y">Published</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-1">
                <div className="flex items-center justify-center w-6 h-6 rounded bg-gray-100 border border-gray-300">
                  <Headphones className="h-3 w-3 text-gray-400" />
                </div>
                <div className="flex items-center justify-center w-6 h-6 rounded bg-gray-100 border border-gray-300">
                  <Video className="h-3 w-3 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="google_drive_link" className="text-xs font-bold text-gray-700">Google Drive Link</Label>
          <input 
            id="google_drive_link" 
            type="url" 
            value="" 
            onChange={() => {}}
            placeholder="https://drive.google.com/..." 
            className="w-full p-2 text-xs border rounded-md" 
            style={{
              borderColor: '#9c441a',
              borderWidth: '2px'
            }} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SuperTextStoryStatus;