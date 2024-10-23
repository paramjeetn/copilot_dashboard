import React from 'react';
import { HelpCircle, ThumbsUp, ThumbsDown, XCircle } from "lucide-react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusIndicatorProps {
  verified: boolean;
  lgtm: boolean;
  onThumbsUp: () => void;
  onThumbsDown: () => void;
  onReset: () => void;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ verified, lgtm, onThumbsUp, onThumbsDown, onReset }) => (
  <div className="flex items-center justify-between w-full"> {/* Full width container with space-between */}
    <div className="flex-shrink-0 mb-2"> {/* TooltipProvider on the left */}
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
    <div className="flex space-x-4"> {/* Button group aligned to the right */}
      {!verified && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onThumbsUp}
            className="p-0"
          >
            <ThumbsUp size={16} className="text-green-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onThumbsDown}
            className="p-0"
          >
            <ThumbsDown size={16} className="text-red-500" />
          </Button>
        </>
      )}
      {verified && !lgtm && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onThumbsUp}
          className="p-0"
        >
          <ThumbsUp size={16} className="text-green-500" />
        </Button>
      )}
      {verified && lgtm && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onThumbsDown}
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
          <RotateCcw size={16} className="text-blue-500" /> {/* Changed color to blue */}
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

export default StatusIndicator;