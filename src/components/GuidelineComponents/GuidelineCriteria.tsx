import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StatusIndicator from '@/components/GuidelineComponents/StatusIndicator';
import { Button } from "@/components/ui/button";
import { Pencil, X, Check } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import MDEditor from '@uiw/react-md-editor';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface GuidelineCriteriaProps {
  criteria: string;
  verified: boolean;
  lgtm: boolean;
  onUpdate: (newVerified: boolean, newLgtm: boolean) => void;
  onReset: () => void;
  onTextChange: (newText: string) => void;
}

const GuidelineCriteria: React.FC<GuidelineCriteriaProps> = ({ criteria, verified, lgtm, onUpdate, onReset, onTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCriteria, setEditedCriteria] = useState(criteria);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedCriteria(criteria);
  };

  const handleSave = () => {
    setIsEditing(false);
    onTextChange(editedCriteria);
  };

  return (
    <Card 
    className={cn(
      "mb-4 transition-all duration-200",
      // Background gradient based on verification status
      !verified 
        ? "" // No background for unverified
        : lgtm 
          ? "bg-gradient-to-r from-green-50/50 via-green-50/30 to-transparent" 
          : "bg-gradient-to-r from-red-50/50 via-red-50/30 to-transparent",
      // Border color based on verification status    
      !verified 
        ? "" // No border color for unverified
        : lgtm 
          ? "border-l-4 border-l-green-500 border-y-0 border-r-0"
          : "border-l-4 border-l-red-500 border-y-0 border-r-0"
    )}
  >
      <CardHeader className="flex flex-row  items-center justify-between py-2">
        <CardTitle className="text-xl font-semibold">Guideline Criteria</CardTitle>
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
        {isEditing ? (
          <div data-color-mode="light">
            <MDEditor
              value={editedCriteria}
              onChange={(value) => setEditedCriteria(value || '')}
              preview="edit"
              height={340}
            />
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X size={16} className="mr-2" /> Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSave}>
                <Check size={16} className="mr-2" /> Save
              </Button>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                  h2: ({ ...props}) => <h2 className="text-xl font-semibold mt-3 mb-2" {...props} />,
                  h3: ({ ...props}) => <h3 className="text-lg font-medium mt-2 mb-1" {...props} />,
                  p: ({ ...props}) => <p className="mb-2 text-sm" {...props} />,
                  ul: ({ ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                  ol: ({ ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                  li: ({ ...props}) => <li className="mb-1 text-sm" {...props} />,
                }}
              >
                {criteria}
              </ReactMarkdown>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default GuidelineCriteria;