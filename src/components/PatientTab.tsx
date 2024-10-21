import React, { useState, useEffect, useCallback } from 'react';
import { auth } from '@/firebase';
import PatientText from '@/components/PatientComponents/PatientText';
import MedicalCondition from '@/components/PatientComponents/MedicalCondition';
import FinalRecommendation from '@/components/PatientComponents/FinalRecommendation';
import RetrievedDocs from '@/components/PatientComponents/RetrievedDocs';
import {PatientData, PatientTabProps,Notification} from '@/components/types'
import PatientDataLoading from '@/components/LoadingPages/PatientLoading';


const useDebounce = <T extends (...args: any[]) => any>(callback: T, delay: number) => {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
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



const PatientTab: React.FC<PatientTabProps> = ({ selectedItem }) => {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  

  useEffect(() => {
    if (selectedItem) {
      fetchPatientData(selectedItem);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 1000); // Hide notification after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchPatientData = async (patientId: string) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/get_patient/${patientId}`,
        {
          method: 'GET',
          cache: "no-cache"
        }
      );
      const stringData = await response.text(); 
      // console.log(stringData)// Get the response as text
    const data: PatientData = JSON.parse(stringData); // Parse the stringified JSON
      setPatientData(data);
      // Log the verification and lgtm status for each field
      // console.log('Patient Data Received:');
      // console.log('Patient Text - verified:', data.patient_data.patient_text_verified, 'lgtm:', data.patient_data.patient_text_lgtm);
      // console.log('Medical Condition - verified:', data.patient_data.medical_condition_verified, 'lgtm:', data.patient_data.medical_condition_lgtm);
      // console.log('Final Recommendation - verified:', data.patient_data.final_recommendation_verified, 'lgtm:', data.patient_data.final_recommendation_lgtm);
      // console.log('Retrieved Docs - verified:', data.patient_data.retrieved_docs_verified, 'lgtm:', data.patient_data.retrieved_docs_lgtm);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setNotification({ type: 'error', message: 'Failed to fetch patient data. Please try again.' });
    }
    finally {
      setLoading(false);
    }
  };

  const savePatientData = async (updatedData: PatientData) => {
    setIsSaving(true);

    try {
      const currentUser = auth.currentUser;
      const userEmail = currentUser ? currentUser.email : 'unknown';

      const response = await fetch(`/api/push_patient_data/${updatedData.patient_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_name: updatedData.patient_name,
          patient_text: updatedData.patient_data.patient_text,
          medical_condition: updatedData.patient_data.medical_condition,
          final_recommendation: updatedData.patient_data.final_recommendation,
          retrieved_docs: updatedData.patient_data.retrieved_docs,
          patient_text_verified: Number(updatedData.patient_data.patient_text_verified),
          medical_condition_verified: Number(updatedData.patient_data.medical_condition_verified),
          final_recommendation_verified: Number(updatedData.patient_data.final_recommendation_verified),
          retrieved_docs_verified: Number(updatedData.patient_data.retrieved_docs_verified),
          patient_text_lgtm: Number(updatedData.patient_data.patient_text_lgtm),
          medical_condition_lgtm: Number(updatedData.patient_data.medical_condition_lgtm),
          final_recommendation_lgtm: Number(updatedData.patient_data.final_recommendation_lgtm),
          retrieved_docs_lgtm: Number(updatedData.patient_data.retrieved_docs_lgtm),
          updated_by: userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save patient data');
      }

      setNotification({ type: 'success', message: 'Changes saved successfully' });
    } catch (error) {
      console.error('Error saving patient data:', error);
      setNotification({ type: 'error', message: 'Failed to save changes. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const debouncedSavePatientData = useDebounce(savePatientData, 1);

  const handleUpdate = (field: string) => (newVerified: boolean, newLgtm: boolean) => {
    if (patientData) {
      const updatedData = {
        ...patientData,
        patient_data: {
          ...patientData.patient_data,
          [`${field}_verified`]: newVerified,
          [`${field}_lgtm`]: newLgtm,
        },
      };
      setPatientData(updatedData);
      debouncedSavePatientData(updatedData);
    }
  };


  const handleReset = (field: string) => () => {
    if (patientData) {
      const updatedData = {
        ...patientData,
        patient_data: {
          ...patientData.patient_data,
          [`${field}_verified`]: false,
          [`${field}_lgtm`]: false,
        },
      };
      setPatientData(updatedData);
      debouncedSavePatientData(updatedData);
    }
  };

  const handleTextChange = (field: string) => (newText: string) => {
    console.log(typeof field)
    console.log(field)
    console.log(newText)
    if (patientData) {
      const updatedData = {
        ...patientData,
        patient_data: {
          ...patientData.patient_data,
          [field]: newText,
        },
      };
      setPatientData(updatedData);
      savePatientData(updatedData);
    }
  };


  if (loading) return <PatientDataLoading />;
  if (error) return <div>Error: {error}</div>;
  if (!patientData) return <div>No patient data available.</div>;


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
      {patientData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="space-y-4">
            <PatientText
              text={patientData.patient_data.patient_text}
              verified={patientData.patient_data.patient_text_verified}
              lgtm={patientData.patient_data.patient_text_lgtm}
              onUpdate={handleUpdate('patient_text')}
              onReset={handleReset('patient_text')}
              onTextChange={handleTextChange('patient_text')}

            />
          </section>
          <section className="space-y-4">
            <MedicalCondition
              condition={patientData.patient_data.medical_condition}
              verified={patientData.patient_data.medical_condition_verified}
              lgtm={patientData.patient_data.medical_condition_lgtm}
              onUpdate={handleUpdate('medical_condition')}
              onReset={handleReset('medical_condition')}
              onTextChange={handleTextChange('medical_condition')}

            />
            <FinalRecommendation
              recommendation={patientData.patient_data.final_recommendation}
              verified={patientData.patient_data.final_recommendation_verified}
              lgtm={patientData.patient_data.final_recommendation_lgtm}
              onUpdate={handleUpdate('final_recommendation')}
              onReset={handleReset('final_recommendation')}
              onTextChange={handleTextChange('final_recommendation')}

            />
            <RetrievedDocs
              docs={patientData.patient_data.retrieved_docs}
              verified={patientData.patient_data.retrieved_docs_verified}
              lgtm={patientData.patient_data.retrieved_docs_lgtm}
              onUpdate={handleUpdate('retrieved_docs')}
              onReset={handleReset('retrieved_docs')}
            />
          </section>
        </div>
      )}
      {isSaving && <p className="text-blue-500">Saving changes...</p>}
    </div>
  );
};

export default PatientTab;