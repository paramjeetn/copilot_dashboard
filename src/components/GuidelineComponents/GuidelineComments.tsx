import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, X, Plus, Minus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface GuidelineCommentsProps {
  comments: Record<string, string>;
  userEmail: string;
  onSaveComment: (newComment: Record<string, string>) => void;
  onDeleteComment: (email: string) => void;
}

const GuidelineComments: React.FC<GuidelineCommentsProps> = ({
  comments,
  userEmail,
  onSaveComment,
  onDeleteComment
}) => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const hasExistingComment = userEmail in comments;

  useEffect(() => {
    if (isAddingComment && hasExistingComment) {
      setNewComment(comments[userEmail]);
    }
  }, [isAddingComment, hasExistingComment, comments, userEmail]);

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

  const handleDelete = () => {
    onDeleteComment(userEmail);
    setIsAddingComment(false);
    setNewComment('');
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="mb-4 border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between py-2">
          <CardTitle className="text-xl font-semibold flex items-center">
            <MessageSquare className="mr-2" size={20} />
            Comments
          </CardTitle>
          {!isAddingComment && (
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-gray-100"
              onClick={() => setIsAddingComment(true)}
            >
              <Plus size={16} className="mr-2" />
              {hasExistingComment ? 'Edit Comment' : 'Add Comment'}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Existing Comments */}
            {Object.entries(comments || {}).map(([email, comment], index) => (
              <div 
                key={index}
                className={cn(
                  "p-4 rounded-lg",
                  email === userEmail 
                    ? "bg-gradient-to-r from-blue-50/50 via-blue-50/30 to-transparent border-l-4 border-l-blue-500" 
                    : "bg-gray-50"
                )}
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

            {/* Add/Edit Comment Section */}
            {isAddingComment && (
              <div className="mt-4 space-y-4">
                <div className="relative">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full pr-12"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveComment();
                      }
                    }}
                  />
                  {hasExistingComment && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-1 -right-1 rounded-full p-0 w-4 h-4 hover:bg-red-500 text-red-500 bg-red-100 hover:text-white flex items-center justify-center border border-red-200 hover:border-red-500 transition-colors duration-200"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Minus size={10} />
                    </Button>
                    
                  )}
                </div>
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
                    className="bg-black hover:bg-gray-800"
                    onClick={handleSaveComment}
                    disabled={!newComment.trim()}
                  >
                    {hasExistingComment ? 'Update Comment' : 'Save Comment'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GuidelineComments;