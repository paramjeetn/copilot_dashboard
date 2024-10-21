import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import StatusIndicator from '@/components/GuidelineComponents/StatusIndicator';
import { Button } from "@/components/ui/button";
import { Pencil, X, Check, Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";

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
    <Card className="mb-4">
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
                  <Button
                    variant="secondary"
                    className="rounded-full m-1 bg-gray-100 text-gray-800 hover:bg-gray-200 font-bold flex items-center h-auto py-1 px-3 max-w-xs break-all" // Change break-words to break-all
                    >
                    {condition}
                  </Button>                
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-1 -right-1 rounded-full p-0 w-4 h-4 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center border border-red-200 hover:border-red-500 transition-colors duration-200"
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
                className="bg-black text-white hover:bg-gray-800"
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