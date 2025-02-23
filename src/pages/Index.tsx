
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import AudioVisualizer from "@/components/AudioVisualizer";
import RadioControls from "@/components/RadioControls";
import ContentTypeSelector from "@/components/ContentTypeSelector";
import { Loader2 } from "lucide-react";
import { useAIServices } from "@/hooks/useAIServices";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const SAMPLE_PROMPTS = [
  "Tell me about the latest tech news",
  "Share a funny joke about programming",
  "Recommend a popular song from the 80s",
  "Give me today's weather forecast",
  "Tell me an interesting fact about space"
];

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contentType, setContentType] = useState("news");
  const [currentContent, setCurrentContent] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [volume, setVolume] = useState(1);
  
  const { generateContent, synthesizeSpeech } = useAIServices();
  const { toast } = useToast();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePromptClick = async (prompt: string) => {
    setCustomPrompt(prompt);
    await handleContentGeneration(prompt);
  };

  const handleContentGeneration = async (prompt: string) => {
    setIsLoading(true);
    try {
      const content = await generateContent(contentType, prompt);
      setCurrentContent(content);
      await synthesizeSpeech(content, volume);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate or play content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    await handleContentGeneration(customPrompt);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <Card className="glass-card w-full max-w-md p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">AI Radio Host</h1>
          <p className="text-muted-foreground">Your personal AI DJ companion</p>
        </div>

        <ContentTypeSelector selectedType={contentType} onSelect={setContentType} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Type your custom prompt or select from samples below..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full"
          />
          <ScrollArea className="h-24 rounded-md border p-2">
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((prompt, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </form>

        <div className="h-32 flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : isPlaying ? (
            <AudioVisualizer />
          ) : (
            <p className="text-center text-muted-foreground">
              {currentContent || "Select a prompt or type your own to start"}
            </p>
          )}
        </div>

        <RadioControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={() => handleContentGeneration(customPrompt)}
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />
      </Card>
    </div>
  );
};

export default Index;
