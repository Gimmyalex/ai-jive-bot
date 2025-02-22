
import { Play, Pause, SkipForward, Volume2 } from "lucide-react";
import { Button } from "./ui/button";

interface RadioControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
}

const RadioControls = ({ isPlaying, onPlayPause, onNext }: RadioControlsProps) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPlayPause}
        className="h-12 w-12 rounded-full hover:scale-105 transition-transform"
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        className="h-12 w-12 rounded-full hover:scale-105 transition-transform"
      >
        <SkipForward className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-full hover:scale-105 transition-transform"
      >
        <Volume2 className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default RadioControls;
