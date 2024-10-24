import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StatusIndicator from '@/components/PatientComponents/StatusIndicator'; 
import { Button } from "@/components/ui/button";
import { Pencil, X, Check, Calendar, Activity, AlertTriangle, Pill, Droplet, Stethoscope, FileText, Plus, Minus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PatientTextProps {
  text: string;
  verified: boolean;
  lgtm: boolean;
  onUpdate: (newVerified: boolean, newLgtm: boolean) => void;
  onReset: () => void;
  onTextChange: (newText: string) => void;
}

interface PatientData {
  [key: string]: any;
}

const PatientText: React.FC<PatientTextProps> = ({ text, verified, lgtm, onUpdate, onReset, onTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [jsonData, setJsonData] = useState<PatientData>({});
  const [editedData, setEditedData] = useState<PatientData>({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showAddField, setShowAddField] = useState(false);
  const [addFieldError, setAddFieldError] = useState('');

  // Custom SVG Icons Components
  const ProfileIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeWidth="1.5"/>
      <path d="M12 6a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" strokeWidth="1.5"/>
      <path d="M19 19v-.5c0-2.5-3.5-4-7-4s-7 1.5-7 4v.5" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const MaleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10">
      <circle cx="12" cy="12" r="4" strokeWidth="1.5"/>
      <path d="M15.5 8.5l4-4M19.5 8.5v-4h-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const FemaleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10">
      <circle cx="12" cy="10" r="4" strokeWidth="1.5"/>
      <path d="M12 14v7M9 18h6" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  useEffect(() => {
    try {
      const parsedData = JSON.parse(text);
      setJsonData(parsedData);
      setEditedData(parsedData);
    } catch (error) {
      console.error("Error parsing initial JSON:", error);
      setJsonData({});
      setEditedData({});
    }
  }, [text]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({...jsonData});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewKey('');
    setNewValue('');
    setShowAddField(false);
    setAddFieldError('');
    setEditedData(jsonData);
  };

  const cleanJsonFields = (
    json: PatientData,
    fieldsToClean: string[]
  ): PatientData => {
    const cleanedJson = { ...json };
    fieldsToClean.forEach(field => {
      if (field in cleanedJson && typeof cleanedJson[field] === 'string') {
        const cleanedArray = cleanedJson[field]
          .split(',')
          .map((item: string) => item.trim())
          .filter((item: string) => item !== '');
        cleanedJson[field] = cleanedArray.join(', ');
      }
    });
    return cleanedJson;
  };

  const handleSave = () => {
    const cleanedData = cleanJsonFields(editedData, ['current_symptoms', 'current_medications', 'patient_risk_factors']);
    setIsEditing(false);
    setNewKey('');
    setNewValue('');
    setShowAddField(false);
    setAddFieldError('');
    setJsonData(cleanedData);
    setEditedData(cleanedData);
    const updatedText = JSON.stringify(cleanedData, null, 2);
    onTextChange(updatedText);
  };

  const handleThumbsUp = () => onUpdate(true, true);
  const handleThumbsDown = () => onUpdate(true, false);
  const handleFieldChange = (key: string, value: any) => setEditedData(prev => ({ ...prev, [key]: value }));

  const handleAddNewField = () => {
    if (!newKey.trim() || !newValue.trim()) {
      setAddFieldError('Both key and value must be non-empty.');
      return;
    }
    setEditedData(prev => ({
      ...prev,
      [newKey.trim()]: newValue.trim()
    }));
    setNewKey('');
    setNewValue('');
    setShowAddField(false);
    setAddFieldError('');
  };

  const handleDeleteField = (keyToDelete: string) => {
    setEditedData(prev => {
      const { [keyToDelete]: _, ...rest } = prev;
      return rest;
    });
  };

  const getIcon = (key: string) => {
    switch (key) {
      case 'current_symptoms': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'current_medications': return <Pill className="h-5 w-5 text-green-500" />;
      case 'patient_risk_factors': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'lab_reports': return <Droplet className="h-5 w-5 text-blue-500" />;
      case 'diagnostic_tests_and_results': return <Stethoscope className="h-5 w-5 text-purple-500" />;
      default: return <FileText className="h-5 w-5 text-cyan-500 shadow-sm" />;
    }
  };

  const renderEditableField = (key: string, value: any) => {
    if (['current_symptoms', 'current_medications', 'patient_risk_factors'].includes(key)) {
      const items = value ? value.split(',') : [''];
      return (
        <div className="space-y-2">
          {items.map((item: string, index: number) => (
            <div key={index} className="relative">
              <Input
                value={item}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index] = e.target.value;
                  handleFieldChange(key, newItems.join(','));
                }}
                className="w-full pr-8"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute -top-2 -right-2 rounded-full p-0 w-4 h-4 bg-gray-200 hover:bg-red-400 text-red-500 hover:text-white"
                onClick={() => {
                  const newItems = items.filter((_: string, i: number) => i !== index);
                  handleFieldChange(key, newItems.join(','));
                }}
              >
                <Minus size={10} />
              </Button>
            </div>
          ))}
          <div className="flex justify-end mt-2">
            <Button
              onClick={() => {
                const newItems = [...items, ''];
                handleFieldChange(key, newItems.join(','));
              }}
              size="sm"
              className="flex items-center"
            >
              <Plus size={14} className="mr-1" /> Add {key.replace(/_/g, ' ')}
            </Button>
          </div>
        </div>
      );
    }
    return (
      <Textarea
        value={value}
        onChange={(e) => handleFieldChange(key, e.target.value)}
        className="w-full mt-2 h-[7rem] px-3 py-2 resize-none overflow-y-auto border border-gray-300 rounded-md"
        style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
      />
    );
  };

  const capitalizeFieldName = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const renderField = (key: string, value: any) => {
    if (['current_symptoms', 'current_medications', 'patient_risk_factors'].includes(key)) {
      const items = value ? value.split(',').map((item: string) => item.trim()).filter((item: string) => item !== '') : [];
      return items.length > 0 ? (
        <ul className="list-disc list-inside mt-2">
          {items.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-gray-500 italic">No {key.replace(/_/g, ' ')} listed</p>
      );
    }
    return <p className="mt-2">{value || `No ${key.replace(/_/g, ' ')} provided`}</p>;
  };

  return (
    <Card className={cn(
      "mb-4 transition-all duration-200",
      !verified 
        ? "" 
        : lgtm 
          ? "bg-gradient-to-r from-green-50/50 via-green-50/30 to-transparent" 
          : "bg-gradient-to-r from-red-50/50 via-red-50/30 to-transparent",
      !verified 
        ? "" 
        : lgtm 
          ? "border-l-4 border-l-green-500 border-y-0 border-r-0"
          : "border-l-4 border-l-red-500 border-y-0 border-r-0"
    )}>
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <CardTitle className="text-xl font-semibold">Patient Details</CardTitle>
        <div className="flex items-center space-x-2 flex-grow mr-2 ml-2">
          <StatusIndicator
            verified={verified}
            lgtm={lgtm}
            onThumbsUp={handleThumbsUp}
            onThumbsDown={handleThumbsDown}
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
      <div className="space-y-6">
    {/* Top Cards Section */}
    <div className="grid grid-cols-2 gap-4">
      {/* Patient Name Card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 to-transparent dark:from-blue-950/20"/>
        <div className="relative flex items-center p-4 space-x-4">
          <div className="text-blue-500 dark:text-blue-400">
            <div className={editedData.gender === 'Male' ? 'text-blue-500 dark:text-blue-400' : 'text-purple-500 dark:text-purple-400'}>
            {editedData.gender === 'Male' ? <MaleIcon /> : <FemaleIcon />}
          </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Patient Name
            </h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-0.5">
              {editedData.patient_name}
            </p>
          </div>
        </div>
      </div>

      {/* Gender Icon with Age Card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/80 to-transparent dark:from-purple-950/20"/>
        <div className="relative flex items-center p-4 space-x-4">
        {/* <ProfileIcon /> */}<Calendar className="text-green-500" size={30} />
          <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Age
            </h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {editedData.age} years
            </p>
          </div>
        </div>
      </div>
    </div>

          {Object.entries(editedData).map(([key, value]) => {
            if (!['patient_id', 'patient_name', 'age', 'gender'].includes(key)) {
              return (
                <div
                  key={key}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-600 relative"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {getIcon(key)}
                    <h3 className="text-lg font-semibold">{capitalizeFieldName(key)}</h3>
                  </div>
                  {isEditing && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteField(key)}
                      className="absolute -top-3 -right-3 rounded-full p-0 w-6 h-6 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center border border-red-200 hover:border-red-500 transition-colors duration-200"
                    >
                      <Minus size={10} />
                    </Button>
                  )}
                  {isEditing ? renderEditableField(key, value) : renderField(key, value)}
                </div>
              );
            }
            return null;
          })}
          {isEditing && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
              {!showAddField ? (
                <Button onClick={() => setShowAddField(true)} className="w-full">
                  <Plus size={16} className="mr-2" /> Add Field
                </Button>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold mb-2">Add New Field</h3>
                  <Input
                    placeholder="Key"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="w-full"
                  />
                  <Textarea
                    placeholder="Value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full h-24 resize-none"
                  />
                  {addFieldError && (
                    <Alert variant="destructive">
                      <AlertDescription>{addFieldError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setShowAddField(false);
                      setNewKey('');
                      setNewValue('');
                      setAddFieldError('');
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddNewField}>
                      Add Field
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {isEditing && (
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X size={16} className="mr-2" /> Cancel
            </Button>
            <Button variant="default" size="sm" onClick={handleSave}>
              <Check size={16} className="mr-2" /> Save
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientText;