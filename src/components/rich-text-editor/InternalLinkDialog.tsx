import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link2 } from "lucide-react";

interface InternalLinkDialogProps {
  onInsertLink: (url: string, text: string) => void;
  children?: React.ReactNode;
}

const InternalLinkDialog: React.FC<InternalLinkDialogProps> = ({ onInsertLink, children }) => {
  const [open, setOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkType, setLinkType] = useState<'page' | 'section'>('page');
  const [selectedPage, setSelectedPage] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // Define available pages and their sections
  const pages = [
    { value: '/', label: 'Home Page' },
    { value: '/library', label: 'Story Library' },
    { value: '/about', label: 'About Page' },
    { value: '/writing', label: 'Writing Page' },
    { value: '/help-gpa', label: 'Help Gpa Page' },
    { value: '/guide', label: 'Guide Page' },
    { value: '/public-author-bios', label: 'Author Bios' },
    { value: '/security', label: 'Privacy Policy' }
  ];

  const sections = {
    '/': [
      { value: '#welcome', label: 'Welcome Section' },
      { value: '#featured-stories', label: 'Featured Stories' },
      { value: '#about-grandpa', label: 'About Grandpa Section' }
    ],
    '/library': [
      { value: '#story-categories', label: 'Story Categories' },
      { value: '#recent-stories', label: 'Recent Stories' },
      { value: '#popular-stories', label: 'Popular Stories' }
    ],
    '/about': [
      { value: '#about-site', label: 'About This Site' },
      { value: '#about-author', label: 'About the Author' },
      { value: '#contact', label: 'Contact Information' }
    ],
    '/writing': [
      { value: '#copyright', label: 'Copyright Section' },
      { value: '#write-story', label: 'Write a Story Section' },
      { value: '#submission-guidelines', label: 'Submission Guidelines' }
    ],
    '/help-gpa': [
      { value: '#getting-started', label: 'Getting Started' },
      { value: '#navigation-help', label: 'Navigation Help' },
      { value: '#troubleshooting', label: 'Troubleshooting' }
    ],
    '/guide': [
      { value: '#getting-started', label: 'Getting Started' },
      { value: '#home-page-guide', label: 'Home Page Guide' },
      { value: '#story-library-guide', label: 'Story Library Guide' },
      { value: '#navigation-guide', label: 'Navigation Guide' },
      { value: '#writing-guide', label: 'Writing Guide' }
    ]
  };

  const handleInsert = () => {
    let url = '';
    
    if (linkType === 'page') {
      url = selectedPage;
    } else if (linkType === 'section') {
      url = selectedPage + selectedSection;
    }

    if (url && linkText) {
      onInsertLink(url, linkText);
      setOpen(false);
      // Reset form
      setLinkText('');
      setSelectedPage('');
      setSelectedSection('');
      setLinkType('page');
    }
  };

  const currentPageSections = selectedPage && sections[selectedPage] ? sections[selectedPage] : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Link2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-800">Insert Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="link-text" className="text-lg font-semibold text-amber-700">Link Text</Label>
            <Input
              id="link-text"
              placeholder="Enter the text to display"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="mt-1 text-lg"
            />
          </div>

          <div>
            <Label className="text-lg font-semibold text-amber-700">Link Type</Label>
            <Select value={linkType} onValueChange={(value: 'page' | 'section') => setLinkType(value)}>
              <SelectTrigger className="mt-1 text-lg">
                <SelectValue placeholder="Select link type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="page">Page on this website</SelectItem>
                <SelectItem value="section">Section on a page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(linkType === 'page' || linkType === 'section') && (
            <div>
              <Label className="text-lg font-semibold text-amber-700">Select Page</Label>
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger className="mt-1 text-lg">
                  <SelectValue placeholder="Choose a page" />
                </SelectTrigger>
                <SelectContent>
                  {pages.map((page) => (
                    <SelectItem key={page.value} value={page.value}>
                      {page.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {linkType === 'section' && selectedPage && currentPageSections.length > 0 && (
            <div>
              <Label className="text-lg font-semibold text-amber-700">Select Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="mt-1 text-lg">
                  <SelectValue placeholder="Choose a section" />
                </SelectTrigger>
                <SelectContent>
                  {currentPageSections.map((section) => (
                    <SelectItem key={section.value} value={section.value}>
                      {section.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}


          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="text-lg px-6 py-3">
              Cancel
            </Button>
            <Button 
              onClick={handleInsert} 
              disabled={!linkText || !selectedPage}
              className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-6 py-3"
            >
              Insert Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InternalLinkDialog;