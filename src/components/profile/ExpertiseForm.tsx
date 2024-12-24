import React from 'react';
import { Input } from "@/components/ui/input";
import { expertiseSuggestions } from "@/lib/suggestions";

interface ExpertiseFormProps {
  expertise: string[];
  onUpdate: (index: number, value: string) => void;
}

export const ExpertiseForm = ({ expertise, onUpdate }: ExpertiseFormProps) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Areas of Expertise (Things you know how to do)
      </label>
      <div className="space-y-2">
        {expertise.map((item, index) => (
          <Input
            key={`expertise-${index}`}
            value={item}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder={`Things ${index === 0 ? '' : index === 1 ? 'you' : index === 2 ? 'know' : index === 3 ? 'how to' : 'do'}`}
            list={`expertise-suggestions-${index}`}
          />
        ))}
        {expertise.map((_, index) => (
          <datalist key={`expertise-suggestions-${index}`} id={`expertise-suggestions-${index}`}>
            {expertiseSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        ))}
      </div>
    </div>
  );
};