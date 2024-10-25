// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Plus, MessageSquare, X } from "lucide-react";

// interface GuidelineCommentsProps {
//   comments: Record<string, string>;
//   userEmail: string;
//   onSaveComment: (newComment: Record<string, string>) => void;
// }

// const GuidelineComments: React.FC<GuidelineCommentsProps> = ({
//   comments,
//   userEmail,
//   onSaveComment
// }) => {
//   const [isAddingComment, setIsAddingComment] = useState(false);
//   const [newComment, setNewComment] = useState('');

//   // Check if the current user already has a comment
//   const hasExistingComment = userEmail in comments;

//   const handleSaveComment = () => {
//     if (newComment.trim()) {
//       // Simply update/replace the comment for this user
//       const commentData = {
//         [userEmail]: newComment.trim()
//       };
//       onSaveComment(commentData);
//       setNewComment('');
//       setIsAddingComment(false);
//     }
//   };

//   return (
//     <Card className="mb-4">
//       <CardHeader className="flex flex-row items-center justify-between py-2">
//         <CardTitle className="text-xl font-semibold flex items-center">
//           <MessageSquare className="mr-2" size={20} />
//           Comments
//         </CardTitle>
//         {!isAddingComment && (
//           <Button 
//             variant="default"
//             size="sm"
//             onClick={() => {
//               setIsAddingComment(true);
//               // Pre-fill with existing comment if user has one
//               if (hasExistingComment) {
//                 setNewComment(comments[userEmail]);
//               }
//             }}
//           >
//             <Plus size={16} className="mr-2" />
//             {hasExistingComment ? 'Edit Comment' : 'Add Comment'}
//           </Button>
//         )}
//       </CardHeader>
//       <CardContent>
//         <ScrollArea className="max-h-60 pr-4">
//           {Object.entries(comments || {}).map(([email, comment], index) => (
//             <div 
//               key={index}
//               className="mb-4 p-3 bg-gray-50 rounded-lg"
//             >
//               <div className="text-sm font-semibold text-gray-600 mb-1">
//                 {email}
//                 {email === userEmail && 
//                   <span className="text-blue-500 ml-2">(You)</span>
//                 }
//               </div>
//               <div className="text-gray-800">
//                 {comment}
//               </div>
//             </div>
//           ))}
          
//           {isAddingComment && (
//             <div className="mt-4">
//               <Input
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 placeholder="Write your comment..."
//                 className="mb-2"
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter') {
//                     handleSaveComment();
//                   }
//                 }}
//               />
//               <div className="flex justify-end space-x-2">
//                 <Button 
//                   variant="outline" 
//                   size="sm"
//                   onClick={() => {
//                     setIsAddingComment(false);
//                     setNewComment('');
//                   }}
//                 >
//                   <X size={16} className="mr-2" /> Cancel
//                 </Button>
//                 <Button 
//                   variant="default" 
//                   size="sm"
//                   onClick={handleSaveComment}
//                   disabled={!newComment.trim()}
//                 >
//                   {hasExistingComment ? 'Update Comment' : 'Save Comment'}
//                 </Button>
//               </div>
//             </div>
//           )}
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   );
// };

// export default GuidelineComments;

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, X } from "lucide-react";

interface GuidelineCommentsProps {
  comments: Record<string, string>;  // This will be parsed comments
  userEmail: string;
  onSaveComment: (newComment: Record<string, string>) => void;
}

const GuidelineComments: React.FC<GuidelineCommentsProps> = ({
  comments,
  userEmail,
  onSaveComment
}) => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Check if the current user already has a comment
  const hasExistingComment = userEmail in comments;

  const handleSaveComment = () => {
    if (newComment.trim()) {
      const commentData = {
        [userEmail]: newComment.trim()
      };
      onSaveComment(commentData);
      setNewComment('');
      setIsAddingComment(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <CardTitle className="text-xl font-semibold flex items-center">
          <MessageSquare className="mr-2" size={20} />
          Comments
        </CardTitle>
        {!isAddingComment && (
          <Button 
            variant="default"
            size="sm"
            onClick={() => {
              setIsAddingComment(true);
              if (hasExistingComment) {
                setNewComment(comments[userEmail]);
              }
            }}
          >
            <Plus size={16} className="mr-2" />
            {hasExistingComment ? 'Edit Comment' : 'Add Comment'}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-60 pr-4">
          {Object.entries(comments || {}).map(([email, comment], index) => (
            <div 
              key={index}
              className="mb-4 p-3 bg-gray-50 rounded-lg"
            >
              <div className="text-sm font-semibold text-gray-600 mb-1">
                {email}
                {email === userEmail && 
                  <span className="text-blue-500 ml-2">(You)</span>
                }
              </div>
              <div className="text-gray-800">
                {comment}
              </div>
            </div>
          ))}
          
          {isAddingComment && (
            <div className="mt-4">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                className="mb-2"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveComment();
                  }
                }}
              />
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIsAddingComment(false);
                    setNewComment('');
                  }}
                >
                  <X size={16} className="mr-2" /> Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleSaveComment}
                  disabled={!newComment.trim()}
                >
                  {hasExistingComment ? 'Update Comment' : 'Save Comment'}
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GuidelineComments;