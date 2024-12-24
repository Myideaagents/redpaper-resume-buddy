import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { interestSuggestions } from "@/lib/suggestions";

interface InterestsFormProps {
  interests: string[];
  onUpdate: (index: number, value: string) => void;
}

export function InterestsForm({ interests, onUpdate }: InterestsFormProps) {
  const placeholders = [
    "Things",
    "you want",
    "to",
    "learn",
    "about"
  ];

  return (
    <div className="space-y-4">
      <Label className="text-base">Areas of Interest</Label>
      <div className="space-y-2">
        {interests.map((value, index) => (
          <div key={index} className="relative">
            <Input
              value={value}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder={placeholders[index]}
              list={`interests-suggestions-${index}`}
              className="w-full"
            />
            <datalist id={`interests-suggestions-${index}`}>
              {interestSuggestions
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