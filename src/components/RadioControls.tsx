
import { Play, Pause, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { useState } from "react";

interface RadioControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const RadioControls = ({ 
  isPlaying, 
  onPlayPause, 
  onNext,
  volume,
  onVolumeChange 
}: RadioControlsProps) => {
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);

  const toggleVolumeControl = () => {
    setIsVolumeVisible(!isVolumeVisible);
  };

  return (
    <div className="space-y-4">
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
          onClick={toggleVolumeControl}
          className="h-12 w-12 rounded-full hover:scale-105 transition-transform"
        >
          {volume === 0 ? (
            <VolumeX className="h-6 w-6" />
          ) : (
            <Volume2 className="h-6 w-6" />
          )}
        </Button>
      </div>
      
      {isVolumeVisible && (
        <div className="w-full px-4">
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={(value) => onVolumeChange(value[0])}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default RadioControls;
