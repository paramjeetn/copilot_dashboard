// import React, { useState } from 'react';
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import StatusIndicator from './StatusIndicator';
// import { Button } from "@/components/ui/button";
// import { Pencil, X, Check } from "lucide-react";
// import { Textarea } from "@/components/ui/textarea";

// interface GuidelineTextProps {
//   text: string;
//   verified: boolean;
//   lgtm: boolean;
//   onUpdate: (newVerified: boolean, newLgtm: boolean) => void;
//   onReset: () => void;
//   onTextChange: (newText: string) => void;
// }

// const GuidelineText: React.FC<GuidelineTextProps> = ({ text, verified, lgtm, onUpdate, onReset, onTextChange }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedText, setEditedText] = useState(text);

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditedText(text);
//   };

//   const handleSave = () => {
//     setIsEditing(false);
//     onTextChange(editedText);
//   };

//   return (
//     <Card className="mb-4">
//       <CardHeader className="flex flex-row mb-6 items-center justify-between py-2">
//         <CardTitle className="text-xl font-semibold">Guideline Text</CardTitle>
//           <div className="flex items-center space-x-2 flex-grow mr-2 ml-2"> {/* Added flex-grow here */}
//           <StatusIndicator
//             verified={verified}
//             lgtm={lgtm}
//             onUpdate={onUpdate}
//             onReset={onReset}
//           />
//           {!isEditing && (
//             <Button variant="ghost" size="sm" onClick={handleEdit}>
//               <Pencil size={16} />
//             </Button>
//           )}
//         </div>
//       </CardHeader>
//       <CardContent>
//         {isEditing ? (
//           <>
//             <Textarea
//               value={editedText}
//               onChange={(e) => setEditedText(e.target.value)}
//               className="min-h-[200px]"
//             />
//             <div className="mt-4 flex justify-end space-x-2">
//               <Button variant="outline" size="sm" onClick={handleCancel}>
//                 <X size={16} className="mr-2" /> Cancel
//               </Button>
//               <Button variant="default" size="sm" onClick={handleSave}>
//                 <Check size={16} className="mr-2" /> Save
//               </Button>
//             </div>
//           </>
//         ) : (
//           <p className="text-sm font-semibold">{text || 'No guideline text available.'}</p>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default GuidelineText;
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StatusIndicator from './StatusIndicator';
import { Button } from "@/components/ui/button";
import { Pencil, X, Check, ExternalLink } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface GuidelineTextProps {
  name: string;
  pdfUrl: string;
  text: string;
  verified: boolean;
  lgtm: boolean;
  onUpdate: (newVerified: boolean, newLgtm: boolean) => void;
  onReset: () => void;
  onTextChange: (newText: string) => void;
}

const GuidelineText: React.FC<GuidelineTextProps> = ({ pdfUrl, name, text, verified, lgtm, onUpdate, onReset, onTextChange }) => {
  console.log("guideline",text)
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  useEffect(() => {
    setEditedText(text);
  }, [text]);

  const handleLinkClick = () => {
    // const url = pdfUrl; // Replace with your actual URL
    window.open(pdfUrl, '_blank');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText(text);
  };

  const handleSave = () => {
    setIsEditing(false);
    onTextChange(editedText);
  };

  const renderText = (content: string) => {
    // Replace newline characters with <br /> tags
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
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
          <CardHeader className="flex flex-row items-center py-2">
      <div className="min-w-0 mr-2 max-w-[14rem] flex items-center">
      <CardTitle className="text-xl font-semibold">
        <span>
            {name?.replace(/_/g, ' ')} 
        </span>
        <ExternalLink 
            size={16} 
            className="text-blue-500 cursor-pointer hover:text-blue-600" 
            style={{ display: 'inline-block', marginLeft: '.7rem', marginBottom: '.25rem' }} // Adjust margin as needed
            onClick={handleLinkClick}
        />
       </CardTitle>
        
      </div>
      <StatusIndicator
        verified={verified}
        lgtm={lgtm}
        onUpdate={onUpdate}
        onReset={onReset}
      />
      <div className="flex-1" />
      {!isEditing && (
        <Button variant="ghost" size="sm" onClick={handleEdit}>
          <Pencil size={16} />
        </Button>
      )}
    </CardHeader>
      <CardContent>
        {isEditing ? (
          <>
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full h-full min-h-[480px] text-sm whitespace-pre-wrap"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X size={16} className="mr-2" /> Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSave}>
                <Check size={16} className="mr-2" /> Save
              </Button>
            </div>
          </>
        ) : (
          <div className="text-sm whitespace-pre-wrap p-4 h-full min-h-[180px] overflow-y-auto">
            {text ? renderText(text) : 'No guideline text available.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GuidelineText;