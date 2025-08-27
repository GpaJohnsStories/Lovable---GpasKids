import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IsolatedStoryRenderer from "@/components/story/IsolatedStoryRenderer";

interface AdminStoryPreviewProps {
  content: string;
  title?: string;
}

/**
 * Preview component for admin that uses the exact same rendering as public story pages
 */
const AdminStoryPreview: React.FC<AdminStoryPreviewProps> = ({ content, title }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {title ? `Preview: ${title}` : 'Story Preview'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <IsolatedStoryRenderer
          content={content}
          useRichCleaning={true}
          showHeaderPreview={true}
        />
      </CardContent>
    </Card>
  );
};

export default AdminStoryPreview;