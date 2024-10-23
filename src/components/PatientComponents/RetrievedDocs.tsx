import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import StatusIndicator from './StatusIndicator'; // Ensure this component is created
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface RetrievedDoc {
  item: {
    id: string;
    document: string;
    embeddings: null;
    meta: {
      guideline: string;
    };
  };
  score: number;
}

interface RetrievedDocsProps {
  docs: string; // Stringified JSON of retrieved docs
  verified: boolean;
  lgtm: boolean;
  onUpdate: (newVerified: boolean, newLgtm: boolean) => void;
  onReset: () => void;

}

const RetrievedDocs: React.FC<RetrievedDocsProps> = ({ docs, verified, lgtm, onUpdate, onReset }) => {
  const [selectedDoc, setSelectedDoc] = useState<RetrievedDoc | null>(null);

  const parsedDocs: RetrievedDoc[] = JSON.parse(docs);

  const extractLabel = (path: string) => {
    const parts = path.split('/');
    return parts[parts.length - 2]; // Get the second to last part of the path
  };

  
  const handleThumbsUp = () => {
    onUpdate(true, true);
  };

  const handleThumbsDown = () => {
    onUpdate(true, false);
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
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <CardTitle className="text-xl font-semibold">Retrieved Docs</CardTitle>
          <div className="flex items-center space-x-2 flex-grow mr-2 ml-2"> {/* Added flex-grow here */}
        <StatusIndicator
          verified={verified}
          lgtm={lgtm}
          onThumbsUp={handleThumbsUp}
          onThumbsDown={handleThumbsDown}
          onReset={onReset}

        />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-60 pr-4">
          <div className="space-y-2">
            {parsedDocs.map((doc, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <FileText className="h-5 mr-2 text-blue-500" />
                    <span className="font-semibold">{extractLabel(doc.item.id)}</span>
                    <span className="text-sm ml-auto text-gray-500">Score: {doc.score.toFixed(2)}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="">
                  <DialogHeader>
                    <DialogTitle>{extractLabel(doc.item.id)}</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="text-sm h-[250px] w-full rounded-md border p-4 whitespace-pre-wrap">
                    <p>{doc.item.meta.guideline || "No guideline available"}</p>
                  </ScrollArea>
                  <div className="text-sm text-gray-500">
                    Score: {doc.score.toFixed(6)}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RetrievedDocs;