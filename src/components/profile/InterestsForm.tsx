import React from 'react';
import { Input } from "@/components/ui/input";
import { interestSuggestions } from "@/lib/suggestions";

interface InterestsFormProps {
  interests: string[];
  onUpdate: (index: number, value: string) => void;
}

export const InterestsForm = ({ interests, onUpdate }: InterestsFormProps) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Areas of Interest (Things you want to do)
      </label>
      <div className="space-y-2">
        {interests.map((item, index) => (
          <Input
            key={`interest-${index}`}
            value={item}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder={`Things ${index === 0 ? '' : index === 1 ? 'you' : index === 2 ? 'want' : index === 3 ? 'to' : 'do'}`}
            list={`interest-suggestions-${index}`}
          />
        ))}
        {interests.map((_, index) => (
          <datalist key={`interest-suggestions-${index}`} id={`interest-suggestions-${index}`}>
            {interestSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        ))}
      </div>
    </div>
  );
};