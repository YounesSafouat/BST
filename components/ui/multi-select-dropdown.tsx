import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, ChevronDown, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder: string;
  addButtonText: string;
  emptyMessage?: string;
  className?: string;
}

export function MultiSelectDropdown({
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
  addButtonText,
  emptyMessage = "Aucun élément sélectionné",
  className = ""
}: MultiSelectDropdownProps) {
  const addItem = (value: string) => {
    if (!selectedValues.includes(value)) {
      onSelectionChange([...selectedValues, value]);
    }
  };

  const removeItem = (value: string) => {
    onSelectionChange(selectedValues.filter(v => v !== value));
  };

  const getSelectedOption = (value: string) => {
    return options.find(option => option.value === value);
  };

  const availableOptions = options.filter(option => !selectedValues.includes(option.value));

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Selected Items */}
      {selectedValues.length > 0 ? (
        <div className="space-y-2">
          {selectedValues.map((value) => {
            const option = getSelectedOption(value);
            return (
              <div key={value} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium text-sm">{option?.label || "Témoignage inconnu"}</div>
                  {option?.description && (
                    <div className="text-xs text-gray-600">{option.description}</div>
                  )}
                  {!option && (
                    <div className="text-xs text-gray-400 italic">ID: {value}</div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(value)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">{emptyMessage}</div>
      )}
      
      {/* Add Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            {addButtonText}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 max-h-60 overflow-y-auto">
          {availableOptions.length > 0 ? (
            availableOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => addItem(option.value)}
                className="flex flex-col items-start p-3 space-y-1"
              >
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-600">{option.description}</div>
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-3 text-sm text-gray-500">
              {placeholder}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 