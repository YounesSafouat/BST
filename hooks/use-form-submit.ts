import { useCallback } from 'react';

export interface StandardFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

export interface StandardFormSubmit {
  event: 'formSubmit';
  formData: StandardFormData;
  additionalData?: {
    countryCode?: string;
    countryName?: string;
    city?: string;
    source?: string;
    page?: string;
    submitted_at?: string;
    userBehavior?: string;
    brief_description?: string;
    firstname?: string;
    lastname?: string;
  };
}

export const useFormSubmit = () => {
  const createStandardSubmit = useCallback((
    formData: StandardFormData,
    additionalData?: StandardFormSubmit['additionalData']
  ): StandardFormSubmit => {
    return {
      event: 'formSubmit',
      formData,
      additionalData
    };
  }, []);

  const trackFormSubmit = useCallback((
    standardSubmit: StandardFormSubmit,
    formName: string = 'contact_form'
  ) => {
    // Log the standardized format
    console.log(`[${formName}] Standardized form submit:`, standardSubmit);
    
    // Track with Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_submit', {
        event_category: 'engagement',
        event_label: formName,
        form_name: formName,
        form_data: standardSubmit.formData,
        additional_data: standardSubmit.additionalData
      });
    }

    // Track with dataLayer for GTM if available
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'formSubmit',
        formName,
        formData: standardSubmit.formData,
        additionalData: standardSubmit.additionalData
      });
    }

    return standardSubmit;
  }, []);

  const submitForm = useCallback(async (
    formData: StandardFormData,
    additionalData?: StandardFormSubmit['additionalData'],
    apiEndpoint: string = '/api/contact',
    formName: string = 'contact_form'
  ) => {
    try {
      // Create standardized format
      const standardSubmit = createStandardSubmit(formData, additionalData);
      
      // Track the submission
      trackFormSubmit(standardSubmit, formName);
      
      // Submit to API
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(standardSubmit),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`[${formName}] API response:`, result);
      
      return { success: true, data: result, standardSubmit };
    } catch (error) {
      console.error(`[${formName}] Form submission error:`, error);
      return { success: false, error, standardSubmit: null };
    }
  }, [createStandardSubmit, trackFormSubmit]);

  return {
    createStandardSubmit,
    trackFormSubmit,
    submitForm
  };
};
