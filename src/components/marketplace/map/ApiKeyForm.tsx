
import React from 'react';
import { MapIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyFormProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  loadError?: Error | null;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ apiKey, setApiKey, loadError }) => {
  const { toast } = useToast();

  const saveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey) {
      localStorage.setItem('googleMapsApiKey', apiKey);
      toast({
        title: "API Key Saved",
        description: "Your Google Maps API key has been saved for this session.",
      });
      // Force re-render to load the map
      window.location.reload();
    }
  };

  return (
    <div className="bg-secondary rounded-xl flex items-center justify-center h-[600px] mt-4 relative overflow-hidden">
      <div className="text-center z-10 max-w-md mx-auto p-6">
        <MapIcon className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
        <h3 className="text-xl font-medium mb-2">
          {loadError ? "Google Maps Loading Error" : "Google Maps API Key Required"}
        </h3>
        <p className="text-muted-foreground mb-6">
          {loadError 
            ? (loadError.message || "There was an error loading Google Maps. Please check your API key and try again.")
            : "To use the interactive map, you need to add your Google Maps API key:"}
        </p>
        <form onSubmit={saveApiKey} className="space-y-4">
          <Input 
            type="text" 
            placeholder="Enter your Google Maps API Key" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full"
          />
          <Button type="submit" className="w-full">
            {loadError ? "Update API Key" : "Save API Key"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-4">
          Get your API key from the <a href="https://console.cloud.google.com/google/maps-apis" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyForm;
