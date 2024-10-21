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
import { Pencil, X, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface GuidelineTextProps {
  text: string;
  verified: boolean;
  lgtm: boolean;
  onUpdate: (newVerified: boolean, newLgtm: boolean) => void;
  onReset: () => void;
  onTextChange: (newText: string) => void;
}

const GuidelineText: React.FC<GuidelineTextProps> = ({ text, verified, lgtm, onUpdate, onReset, onTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  useEffect(() => {
    setEditedText(text);
  }, [text]);

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
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <CardTitle className="text-xl font-semibold">Guideline Text</CardTitle>
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