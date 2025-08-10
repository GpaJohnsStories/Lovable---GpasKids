import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Image } from "lucide-react";
import { useCachedIcon } from "@/hooks/useCachedIcon";

interface Icon {
  id: string;
  icon_code: string;
  icon_name: string;
  file_path: string;
  created_at: string;
}

const IconCard = ({ icon }: { icon: Icon }) => {
  const { iconUrl, isLoading, error } = useCachedIcon(icon.file_path);

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden">
            {isLoading ? (
              <div className="animate-pulse bg-muted-foreground/20 w-full h-full rounded"></div>
            ) : error ? (
              <div className="text-muted-foreground text-xs text-center p-2">
                <Image className="h-8 w-8 mx-auto mb-1" />
                Error loading
              </div>
            ) : iconUrl ? (
              <img 
                src={iconUrl} 
                alt={icon.icon_name}
                className="w-full h-full object-contain"
              />
            ) : null}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {icon.icon_code}
              </Badge>
            </div>
            <h4 className="font-medium text-sm">{icon.icon_name}</h4>
            <p className="text-xs text-muted-foreground">{icon.file_path.split('/').pop()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const IconLibrarySection = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: icons, isLoading } = useQuery<Icon[]>({
    queryKey: ["icons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("icon_library")
        .select("*")
        .order("icon_code", { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch icons: ${error.message}`);
      }

      return data || [];
    },
  });

  const filteredIcons = icons?.filter(icon => 
    icon.icon_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.icon_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.file_path.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Icon Library
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        ) : filteredIcons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? `No icons found matching "${searchTerm}"` : "No icons uploaded yet"}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredIcons.map((icon) => (
              <IconCard key={icon.id} icon={icon} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IconLibrarySection;