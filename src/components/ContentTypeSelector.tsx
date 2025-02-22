
import { Button } from "./ui/button";

interface ContentTypeSelectorProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

const ContentTypeSelector = ({ selectedType, onSelect }: ContentTypeSelectorProps) => {
  const types = ["news", "jokes", "music"];

  return (
    <div className="flex justify-center space-x-2">
      {types.map((type) => (
        <Button
          key={type}
          variant={selectedType === type ? "default" : "outline"}
          onClick={() => onSelect(type)}
          className="capitalize transition-all duration-300"
        >
          {type}
        </Button>
      ))}
    </div>
  );
};

export default ContentTypeSelector;
