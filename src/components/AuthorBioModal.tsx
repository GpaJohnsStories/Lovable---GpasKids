
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createSafeHtml } from "@/utils/xssProtection";

interface AuthorBio {
  id: string;
  author_name: string;
  bio_content: string | null;
  born_date: string | null;
  died_date: string | null;
  native_country_name: string | null;
  native_language: string | null;
}

interface AuthorBioModalProps {
  bio: AuthorBio | null;
  isOpen: boolean;
  onClose: () => void;
}

const AuthorBioModal = ({ bio, isOpen, onClose }: AuthorBioModalProps) => {
  if (!bio) return null;

  const formatLifeSpan = () => {
    if (!bio.born_date && !bio.died_date) return null;
    
    const born = bio.born_date ? new Date(bio.born_date).getFullYear() : '?';
    const died = bio.died_date ? new Date(bio.died_date).getFullYear() : 'present';
    
    return `${born} - ${died}`;
  };

  const getBioContent = () => {
    if (!bio.bio_content) return { __html: 'No biography content available.' };
    
    // Use safe HTML rendering for rich content
    const safeHtml = createSafeHtml(bio.bio_content);
    
    // Check if content starts with "Buddy says:"
    const htmlContent = safeHtml.__html;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    if (textContent.trim().toLowerCase().startsWith('buddy says:')) {
      // Find the first paragraph and style it differently
      const buddyRegex = /(.*?buddy says:.*?)(<\/p>|$)/i;
      const match = htmlContent.match(buddyRegex);
      
      if (match) {
        const buddyParagraph = match[0];
        const restContent = htmlContent.replace(buddyParagraph, '');
        
        return {
          __html: `
            <div class="bg-orange-100 p-4 rounded-lg border-2 border-orange-300 mb-4">
              <div class="text-orange-700 font-bold text-xl leading-relaxed" style="font-family: 'Caveat', cursive;">
                ${buddyParagraph.replace(/^<p[^>]*>/, '').replace(/<\/p>$/, '')}
              </div>
            </div>
            ${restContent}
          `
        };
      }
    }
    
    return safeHtml;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4 text-2xl font-bold text-amber-800 mb-4">
            <img 
              src="/lovable-uploads/57b61432-e031-442a-b917-352de9166e1b.png"
              alt="Buddy the dog"
              className="w-16 h-16 rounded-full object-cover"
            />
            About {bio.author_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {(bio.native_country_name || bio.native_language || formatLifeSpan()) && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {bio.native_country_name && (
                  <div>
                    <span className="font-semibold text-amber-800">Country: </span>
                    <span className="text-amber-700">{bio.native_country_name}</span>
                  </div>
                )}
                {bio.native_language && (
                  <div>
                    <span className="font-semibold text-amber-800">Language: </span>
                    <span className="text-amber-700">{bio.native_language}</span>
                  </div>
                )}
                {formatLifeSpan() && (
                  <div className="md:col-span-2">
                    <span className="font-semibold text-amber-800">Life Span: </span>
                    <span className="text-amber-700">{formatLifeSpan()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div 
            className="text-amber-700 leading-relaxed prose prose-amber max-w-none"
            dangerouslySetInnerHTML={getBioContent()}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthorBioModal;
