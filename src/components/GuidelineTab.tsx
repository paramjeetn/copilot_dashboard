import React, { useState, useEffect, useCallback } from 'react';
import { auth } from '@/firebase';
import GuidelineText from '@/components/GuidelineComponents/GuidelineText';
import MedicalCondition from '@/components/GuidelineComponents/MedicalCondition';
import GuidelineCriteria from '@/components/GuidelineComponents/GuidelineCriteria';
import GuidelinePDF from '@/components/GuidelineComponents/GuidelinePDF';
import GuidelineComments from '@/components/GuidelineComponents/GuidelineComments';
import { GuidelineData, GuidelineTabProps, Notification } from '@/components/types';
import GuidelineDataLoading from '@/components/LoadingPages/GuidelineLoading';

// Debounce hook implementation
const useDebounce = <T extends (...args: any[]) => void>(callback: T, delay: number) => {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback((...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);
    setTimer(newTimer);
  }, [callback, delay, timer]);

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return debouncedCallback;
};

const GuidelineTab: React.FC<GuidelineTabProps> = ({ selectedItem }) => {
  const [guidelineData, setGuidelineData] = useState<GuidelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Function to parse stringified comments
  const parseComments = (commentsString: string | null): Record<string, string> => {
    if (!commentsString) return {};
    try {
      return JSON.parse(commentsString);
    } catch (error) {
      console.error('Error parsing comments:', error);
      return {};
    }
  };

  // Function to stringify comments
  const stringifyComments = (comments: Record<string, string>): string => {
    try {
      return JSON.stringify(comments);
    } catch (error) {
      console.error('Error stringifying comments:', error);
      return '{}';
    }
  };

  useEffect(() => {
    if (selectedItem) {
      fetchGuidelineData(selectedItem);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchGuidelineData = async (guidelineId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/get_guideline/${guidelineId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: GuidelineData = await response.json();
      console.log("Fetched data:", data);
      setGuidelineData(data);
    } catch (error) {
      console.error('Error fetching guideline data:', error);
      setError('Failed to fetch guideline data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveGuidelineData = async (updatedData: GuidelineData) => {
    setIsSaving(true);
    try {
      const currentUser = auth.currentUser;
      const userEmail = currentUser ? currentUser.email : 'unknown';

      const response = await fetch(`/api/push_guideline_data/${updatedData.guideline_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guideline_name: updatedData.guideline_name,
          guideline_text: updatedData.guideline_data.guideline_text,
          guideline_medical_condition: updatedData.guideline_data.guideline_medical_condition,
          guideline_criteria: updatedData.guideline_data.guideline_criteria,
          guideline_pdf: updatedData.guideline_data.guideline_pdf,
          guideline_comments: updatedData.guideline_data.guideline_comments,
          guideline_text_verified: Number(updatedData.guideline_data.guideline_text_verified),
          guideline_medical_condition_verified: Number(updatedData.guideline_data.guideline_medical_condition_verified),
          guideline_criteria_verified: Number(updatedData.guideline_data.guideline_criteria_verified),
          guideline_text_lgtm: Number(updatedData.guideline_data.guideline_text_lgtm),
          guideline_medical_condition_lgtm: Number(updatedData.guideline_data.guideline_medical_condition_lgtm),
          guideline_criteria_lgtm: Number(updatedData.guideline_data.guideline_criteria_lgtm),
          updated_by: userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save guideline data');
      }

      setNotification({ type: 'success', message: 'Changes saved successfully' });
    } catch (error) {
      console.error('Error saving guideline data:', error);
      setNotification({ type: 'error', message: 'Failed to save changes. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const debouncedSaveGuidelineData = useDebounce(saveGuidelineData, 1000);

  const handleDeleteComment = (email: string) => {
    if (guidelineData) {
      const currentComments = parseComments(guidelineData.guideline_data.guideline_comments);
      
      // Remove the comment for this email
      delete currentComments[email];
      
      // Update the data with the comment removed
      const updatedData = {
        ...guidelineData,
        guideline_data: {
          ...guidelineData.guideline_data,
          guideline_comments: stringifyComments(currentComments)
        }
      };
  
      setGuidelineData(updatedData);
      saveGuidelineData(updatedData);
    }
  };

  const handleUpdate = (field: string) => (newVerified: boolean, newLgtm: boolean) => {
    if (guidelineData) {
      const updatedData = {
        ...guidelineData,
        guideline_data: {
          ...guidelineData.guideline_data,
          [`${field}_verified`]: newVerified,
          [`${field}_lgtm`]: newLgtm,
        },
      };
      setGuidelineData(updatedData);
      debouncedSaveGuidelineData(updatedData);
    }
  };

  const handleReset = (field: string) => () => {
    if (guidelineData) {
      const updatedData = {
        ...guidelineData,
        guideline_data: {
          ...guidelineData.guideline_data,
          [`${field}_verified`]: false,
          [`${field}_lgtm`]: false,
        },
      };
      setGuidelineData(updatedData);
      debouncedSaveGuidelineData(updatedData);
    }
  };

  const handleTextChange = (field: string) => (newText: string) => {
    if (guidelineData) {
      const updatedData = {
        ...guidelineData,
        guideline_data: {
          ...guidelineData.guideline_data,
          [field]: newText,
        },
      };
      setGuidelineData(updatedData);
      saveGuidelineData(updatedData);
    }
  };

  const handleSaveComment = (newComment: Record<string, string>) => {
    if (guidelineData) {
      // Parse existing comments
      const currentComments = parseComments(guidelineData.guideline_data.guideline_comments);
      
      // Merge with new comment
      const updatedComments = {
        ...currentComments,
        ...newComment
      };

      // Create updated data with stringified comments
      const updatedData = {
        ...guidelineData,
        guideline_data: {
          ...guidelineData.guideline_data,
          guideline_comments: stringifyComments(updatedComments)
        }
      };

      setGuidelineData(updatedData);
      saveGuidelineData(updatedData);
    }
  };

  if (loading) return <GuidelineDataLoading />;
  if (error) return <div>Error: {error}</div>;
  if (!guidelineData) return <div>No guideline data available.</div>;

  return (
    <div className="p-4 relative">
      {notification && (
        <div 
          className={`fixed bottom-4 right-4 p-2 rounded-md shadow-md ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white z-50`}
        >
          {notification.message}
        </div>
      )}
         
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="space-y-4">
          <GuidelineText
            pdfUrl={guidelineData.guideline_data.guideline_pdf}
            name={guidelineData.guideline_name}
            text={guidelineData.guideline_data.guideline_text}
            verified={guidelineData.guideline_data.guideline_text_verified}
            lgtm={guidelineData.guideline_data.guideline_text_lgtm}
            onUpdate={handleUpdate('guideline_text')}
            onReset={handleReset('guideline_text')}
            onTextChange={handleTextChange('guideline_text')}
          />
        </section>
        <section className="space-y-4">
          <MedicalCondition
            condition={guidelineData.guideline_data.guideline_medical_condition}
            verified={guidelineData.guideline_data.guideline_medical_condition_verified}
            lgtm={guidelineData.guideline_data.guideline_medical_condition_lgtm}
            onUpdate={handleUpdate('guideline_medical_condition')}
            onReset={handleReset('guideline_medical_condition')}
            onTextChange={handleTextChange('guideline_medical_condition')}
          />
          <GuidelineCriteria
            criteria={guidelineData.guideline_data.guideline_criteria}
            verified={guidelineData.guideline_data.guideline_criteria_verified}
            lgtm={guidelineData.guideline_data.guideline_criteria_lgtm}
            onUpdate={handleUpdate('guideline_criteria')}
            onReset={handleReset('guideline_criteria')}
            onTextChange={handleTextChange('guideline_criteria')}
          />
          <GuidelinePDF 
            pdfUrl={guidelineData.guideline_data.guideline_pdf} 
          />
          <GuidelineComments
            comments={parseComments(guidelineData.guideline_data.guideline_comments)}
            userEmail={auth.currentUser?.email || 'anonymous'}
            onSaveComment={handleSaveComment}
            onDeleteComment={handleDeleteComment}  // Add this line
          />
        </section>
      </div>
    </div>
  );
};

export default GuidelineTab;