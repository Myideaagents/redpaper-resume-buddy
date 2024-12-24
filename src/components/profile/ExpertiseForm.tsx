import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { expertiseSuggestions } from "@/lib/suggestions";

interface ExpertiseFormProps {
  expertise: string[];
  onUpdate: (index: number, value: string) => void;
}

export function ExpertiseForm({ expertise, onUpdate }: ExpertiseFormProps) {
  const placeholders = [
    "Things",
    "you know",
    "how",
    "to",
    "do"
  ];

  return (
    <div className="space-y-4">
      <Label className="text-base">Areas of Expertise</Label>
      <div className="space-y-2">
        {expertise.map((value, index) => (
          <div key={index} className="relative">
            <Input
              value={value}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder={placeholders[index]}
              list={`expertise-suggestions-${index}`}
              className="w-full"
            />
            <datalist id={`expertise-suggestions-${index}`}>
              {expertiseSuggestions
                .filter(suggestion => 
                  suggestion.toLowerCase().includes(value.toLowerCase()) && 
                  suggestion.toLowerCase() !== value.toLowerCase()
                )
                .map((suggestion, i) => (
                  <option key={i} value={suggestion} />
                ))}
            </datalist>
          </div>
        ))}
      </div>
    </div>
  );
}