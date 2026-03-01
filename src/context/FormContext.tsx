import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TemplateMode = 'link' | 'upload';

interface FormState {
  eventName: string;
  templateMode: TemplateMode;
  templateLink: string;
  templateFile: File | null;
  winnerTemplateFile: File | null;
  participantMode: TemplateMode;
  participantLink: string;
  participantFile: File | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  previewUrl: string | null;
}

interface FormContextType extends FormState {
  setEventName: (name: string) => void;
  setTemplateMode: (mode: TemplateMode) => void;
  setTemplateLink: (link: string) => void;
  setTemplateFile: (file: File | null) => void;
  setWinnerTemplateFile: (file: File | null) => void;
  setParticipantMode: (mode: TemplateMode) => void;
  setParticipantLink: (link: string) => void;
  setParticipantFile: (file: File | null) => void;
  setStatus: (status: FormState['status']) => void;
  setPreviewUrl: (url: string | null) => void;
  resetForm: () => void;
}

const initialState: FormState = {
  eventName: '',
  templateMode: 'link',
  templateLink: '',
  templateFile: null,
  winnerTemplateFile: null,
  participantMode: 'link',
  participantLink: '',
  participantFile: null,
  status: 'idle',
  previewUrl: null,
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FormState>(initialState);

  const setEventName = (eventName: string) => setState(prev => ({ ...prev, eventName }));
  const setTemplateMode = (templateMode: TemplateMode) => setState(prev => ({ ...prev, templateMode }));
  const setTemplateLink = (templateLink: string) => setState(prev => ({ ...prev, templateLink }));
  const setTemplateFile = (templateFile: File | null) => setState(prev => ({ ...prev, templateFile }));
  const setWinnerTemplateFile = (winnerTemplateFile: File | null) => setState(prev => ({ ...prev, winnerTemplateFile }));
  const setParticipantMode = (participantMode: TemplateMode) => setState(prev => ({ ...prev, participantMode }));
  const setParticipantLink = (participantLink: string) => setState(prev => ({ ...prev, participantLink }));
  const setParticipantFile = (participantFile: File | null) => setState(prev => ({ ...prev, participantFile }));
  const setStatus = (status: FormState['status']) => setState(prev => ({ ...prev, status }));
  const setPreviewUrl = (previewUrl: string | null) => setState(prev => ({ ...prev, previewUrl }));
  const resetForm = () => setState(initialState);

  return (
    <FormContext.Provider value={{
      ...state,
      setEventName,
      setTemplateMode,
      setTemplateLink,
      setTemplateFile,
      setWinnerTemplateFile,
      setParticipantMode,
      setParticipantLink,
      setParticipantFile,
      setStatus,
      setPreviewUrl,
      resetForm
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};
