import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import StatusIndicator from '@/components/GuidelineComponents/StatusIndicator';
import { Button } from "@/components/ui/button";
import { Pencil, X, Check, Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MedicalConditionProps {
  condition: string;
  verified: boolean;
  lgtm: boolean;
  onUpdate: (newVerified: boolean, newLgtm: boolean) => void;
  onReset: () => void;
  onTextChange: (newText: string) => void;
}

const MedicalCondition: React.FC<MedicalConditionProps> = ({
  condition,
  verified,
  lgtm,
  onUpdate,
  onReset,
  onTextChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedConditions, setEditedConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');

  const parseConditions = useCallback((conditionString: string): string[] => {
    return conditionString
      .replace(/^Medical Conditions:\s*/, '')
      .split(',')
      .map(c => c.trim())
      .filter(c => c !== '');
  }, []);

  useEffect(() => {
    setEditedConditions(parseConditions(condition));
  }, [condition, parseConditions]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setEditedConditions(parseConditions(condition));
    setNewCondition('');
  };

  const handleSave = () => {
    setIsEditing(false);
    const trimmedConditions = editedConditions
      .map(c => c.trim())
      .filter(c => c !== '');
    const uniqueConditions = Array.from(new Set(trimmedConditions));
    onTextChange(`Medical Conditions: ${uniqueConditions.join(', ')}`);
    setNewCondition('');
  };

  const cleanInput = (input: string): string[] => {
    const parts = input.split(',');
    return parts.map(part => part.trim()).filter(part => part !== '');
  };

  const handleAddCondition = () => {
    if (newCondition.trim() !== '') {
      const newConditions = cleanInput(newCondition);
      setEditedConditions(prev => [...prev, ...newConditions]);
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (index: number) => {
    setEditedConditions(prev => prev.filter((_, i) => i !== index));
  };

  // const handleConditionChange = (index: number, value: string) => {
  //   setEditedConditions(prev => prev.map((c, i) => i === index ? value : c));
  // };

  return (
    <Card 
    className={cn(
      "mb-4 transition-all duration-200",
      !verified 
        ? "" 
        : lgtm 
          ? "bg-gradient-to-r from-green-50/50 via-green-50/30 to-transparent" 
          : "bg-gradient-to-r from-red-50/50 via-red-50/30 to-transparent",
      !verified 
        ? "" 
        : lgtm 
          ? "border-l-4 border-l-green-500 border-y-0 border-r-0"
          : "border-l-4 border-l-red-500 border-y-0 border-r-0"
    )}
  >
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <CardTitle className="text-xl font-semibold">Medical Condition</CardTitle>
        <div className="flex items-center space-x-2 flex-grow mr-2 ml-2">
          <StatusIndicator
            verified={verified}
            lgtm={lgtm}
            onUpdate={onUpdate}
            onReset={onReset}
          />
          {!isEditing && (
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              <Pencil size={16} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-50 pr-4">
          <div className="flex flex-wrap gap-2 mt-2">
            {editedConditions.map((condition, index) => (
              <div key={index} className="relative group inline-flex">
                  <div className="rounded-full m-1 bg-gray-200 text-gray-800 flex items-center h-auto py-0.5 px-2.5 text-[.9rem] font-bold max-w-xs break-all">
                    {condition}
                  </div>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-1 -right-1 rounded-full p-0 w-4 h-4 hover:bg-red-500 text-red-500 bg-red-100 hover:text-white flex items-center justify-center border border-red-200 hover:border-red-500 transition-colors duration-200"
                    onClick={() => handleRemoveCondition(index)}
                  >
                    <Minus size={10} />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="m-1 mt-4 flex items-center">
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Add new condition(s)"
                className="flex-grow mr-2"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCondition();
                  }
                }}
              />
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleAddCondition}
                className="bg-black text-white"
              >
                <Plus size={16} className="mr-2" /> Add
              </Button>
            </div>
          )}
        </ScrollArea>
        {isEditing && (
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X size={16} className="mr-2" /> Cancel
            </Button>
            <Button variant="default" size="sm" onClick={handleSave}>
              <Check size={16} className="mr-2" /> Save
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalCondition;