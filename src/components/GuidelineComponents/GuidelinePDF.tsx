import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface GuidelinePDFProps {
  pdfUrl: string;
}

const GuidelinePDF: React.FC<GuidelinePDFProps> = ({ pdfUrl }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <CardTitle className="text-xl font-semibold">Guideline PDF</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.open(pdfUrl, '_blank')}
        >
          <FileText className="mr-2 h-4 w-4" />
          View PDF
        </Button>
      </CardContent>
    </Card>
  );
};

export default GuidelinePDF;