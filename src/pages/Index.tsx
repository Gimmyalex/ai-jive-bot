
import { useState } from "react";
import { Card } from "@/components/ui/card";
import AudioVisualizer from "@/components/AudioVisualizer";
import RadioControls from "@/components/RadioControls";
import ContentTypeSelector from "@/components/ContentTypeSelector";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contentType, setContentType] = useState("news");
  const [currentContent, setCurrentContent] = useState("");

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = async () => {
    setIsLoading(true);
    // TODO: Implement content generation and voice synthesis
    setTimeout(() => {
      setCurrentContent("This is a placeholder for generated content.");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <Card className="glass-card w-full max-w-md p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">AI Radio Host</h1>
          <p className="text-muted-foreground">Your personal AI DJ companion</p>
        </div>

        <ContentTypeSelector selectedType={contentType} onSelect={setContentType} />

        <div className="h-32 flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : isPlaying ? (
            <AudioVisualizer />
          ) : (
            <p className="text-center text-muted-foreground">
              {currentContent || "Click play to start the AI Radio Host"}
            </p>
          )}
        </div>

        <RadioControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
        />
      </Card>
    </div>
  );
};

export default Index;
