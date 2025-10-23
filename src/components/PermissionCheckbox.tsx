import React from 'react';
import { Check } from 'lucide-react';

interface PermissionCheckboxProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function PermissionCheckbox({ label, description, checked, onChange }: PermissionCheckboxProps) {
  return (
    <label className="flex items-start space-x-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
          checked
            ? 'bg-blue-600 border-blue-600 text-white'
            : 'border-gray-300 dark:border-slate-500 group-hover:border-blue-400'
        }`}>
          {checked && <Check className="w-3 h-3" />}
        </div>
      </div>
      
      <div className="flex-1">
        <div className="font-medium text-sm text-gray-900 dark:text-white">
          {label}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </div>
      </div>
    </label>
  );
}