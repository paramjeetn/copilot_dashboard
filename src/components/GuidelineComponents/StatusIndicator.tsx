import React from 'react';
import { HelpCircle, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusIndicatorProps {
  verified: boolean;
  lgtm: boolean;
  onUpdate: (newVerified: boolean, newLgtm: boolean) => void;
  onReset: () => void;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ verified, lgtm, onUpdate, onReset }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex-shrink-0 mb-2">
      <Badge 
      variant="outline" 
      className={cn(
        "font-medium",
        !verified 
          ? "text-blue-500 border-blue-500" 
          : lgtm 
            ? "text-green-500 border-green-500" 
            : "text-red-500 border-red-500"
      )}
    >
      {!verified 
        ? "Unverified" 
        : lgtm 
          ? "Verified-Looks Good" 
          : "Verified-Not Good"
      }
    </Badge>
      </div>
      <div className="flex space-x-4">
        {(!verified || (verified && !lgtm)) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdate(true, true)}
            className="p-0"
          >
            <ThumbsUp size={16} className="text-green-500" />
          </Button>
        )}
        {(!verified || (verified && lgtm)) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdate(true, false)}
            className="p-0"
          >
            <ThumbsDown size={16} className="text-red-500" />
          </Button>
        )}
        {verified && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  className="p-0"
                >
                  <RotateCcw size={16} className="text-blue-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Reset verification
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default StatusIndicator;