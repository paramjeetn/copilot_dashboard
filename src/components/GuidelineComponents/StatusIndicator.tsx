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
        "font-medium mr-2 w-[7rem] text-center flex justify-center items-center gap-2 rounded-full",
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
          ? "Verified-LGTM" 
          : "Verified-DLGTM"
      }
    </Badge>
      </div>
      <div className="flex space-x-1">
      <TooltipProvider>
        {/* Thumbs Up */}
        {(!verified || (verified && !lgtm)) ? (
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdate(true, true)}
                className="rounded-full p-2 hover:bg-gray-200 active:bg-gray-300"
              >
                <ThumbsUp size={16} className="text-green-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark as Verified-LGTM</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="rounded-full p-2 cursor-not-allowed"
          >
            <ThumbsUp size={16} className="text-gray-400" />
          </Button>
        )}

        {/* Thumbs Down */}
        {(!verified || (verified && lgtm)) ? (
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdate(true, false)}
                className="rounded-full p-2 hover:bg-gray-200 active:bg-gray-300"
              >
                <ThumbsDown size={16} className="text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark as Verified-DLGTM</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="rounded-full p-2 cursor-not-allowed"
          >
            <ThumbsDown size={16} className="text-gray-400" />
          </Button>
        )}

        {/* Reset */}
        {verified ? (
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="rounded-full p-2 hover:bg-gray-200 active:bg-gray-300"
              >
                <RotateCcw size={16} className="text-blue-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset verification</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="rounded-full p-2 cursor-not-allowed"
          >
            <RotateCcw size={16} className="text-gray-400" />
          </Button>
        )}
      </TooltipProvider>
    </div>
    </div>
  );
};

export default StatusIndicator;