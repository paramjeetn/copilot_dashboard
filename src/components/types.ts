
export interface PatientData {
    patient_key: number;
    patient_id: string;
    patient_name: string;
    patient_data: {
      patient_text: string;
      medical_condition: string;
      final_recommendation: string;
      retrieved_docs: string;
      patient_text_verified: boolean;
      medical_condition_verified: boolean;
      final_recommendation_verified: boolean;
      retrieved_docs_verified: boolean;
      patient_text_lgtm: boolean;
      medical_condition_lgtm: boolean;
      final_recommendation_lgtm: boolean;
      retrieved_docs_lgtm: boolean;
    };
    updated_by: string | null;
    timestamp: string;
  }

  export interface PatientTabProps {
    selectedItem: string | null;
  }
  
  export interface GuidelineData {
    guideline_key: number;
    guideline_id: string;
    guideline_name: string;
    guideline_data: {
      guideline_text: string;
      guideline_medical_condition: string;
      guideline_criteria: string;
      guideline_pdf: string;
      guideline_text_verified: boolean;
      guideline_medical_condition_verified: boolean;
      guideline_criteria_verified: boolean;
      guideline_text_lgtm: boolean;
      guideline_medical_condition_lgtm: boolean;
      guideline_criteria_lgtm: boolean;
    };
    updated_by: string | null;
    timestamp: string;
  }

  export interface GuidelineTabProps {
    selectedItem: string | null;
  }

  export interface Notification {
    type: 'success' | 'error';
    message: string;
  }