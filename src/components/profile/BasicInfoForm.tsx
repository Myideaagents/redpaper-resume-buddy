import React from 'react';
import { Input } from "@/components/ui/input";

interface BasicInfoFormProps {
  fullName: string;
  phone: string;
  linkedin: string;
  experience: string;
  onUpdate: (field: string, value: string) => void;
}

export const BasicInfoForm = ({ 
  fullName, 
  phone, 
  linkedin, 
  experience, 
  onUpdate 
}: BasicInfoFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <Input
          value={fullName}
          onChange={(e) => onUpdate('full_name', e.target.value)}
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <Input
          value={phone}
          onChange={(e) => onUpdate('phone', e.target.value)}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          LinkedIn Profile
        </label>
        <Input
          value={linkedin}
          onChange={(e) => onUpdate('linkedin', e.target.value)}
          placeholder="https://linkedin.com/in/johndoe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Years of Experience
        </label>
        <Input
          value={experience}
          onChange={(e) => onUpdate('experience', e.target.value)}
          placeholder="5 years"
        />
      </div>
    </div>
  );
};