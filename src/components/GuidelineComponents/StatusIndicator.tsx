import React from 'react';
import { HelpCircle, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="flex-shrink-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle
                size={16}
                className={`${
                  !verified ? "text-blue-500" : lgtm ? "text-green-500" : "text-red-500"
                }`}
              />
            </TooltipTrigger>
            <TooltipContent
              className={`px-3 py-1.5 text-xs text-white rounded-md ${
                !verified ? 'bg-blue-500' : lgtm ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {!verified 
                ? "Unverified"
                : lgtm 
                  ? "Looks Good" 
                  : "Doesn't Look Good"
              }
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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