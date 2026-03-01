import React, { useRef } from 'react';
import anime from 'animejs';
import { useForm } from '../context/FormContext';
import { generatePreview, massDistribute } from '../api/mockBackend';

const ActionButtons: React.FC = () => {
  const { 
    status, setStatus, setPreviewUrl,
    eventName, templateMode, templateLink, templateFile,
    participantMode, participantLink, participantFile
  } = useForm();
  
  const previewBtnRef = useRef<HTMLButtonElement>(null);
  const distributeBtnRef = useRef<HTMLButtonElement>(null);

  const animateButton = (el: HTMLElement, scale: number) => {
    anime({
      targets: el,
      scale: scale,
      duration: 400,
      easing: 'spring(1, 80, 10, 0)'
    });
  };

  const handleGeneratePreview = async () => {
    setStatus('loading');
    if (previewBtnRef.current) animateButton(previewBtnRef.current, 0.95);
    
    const formData = new FormData();
    formData.append('eventName', eventName);
    formData.append('templateMode', templateMode);
    
    if (templateMode === 'link') {
      formData.append('templateLink', templateLink);
    } else if (templateFile) {
      formData.append('templateFile', templateFile);
    }
    
    try {
      const url = await generatePreview(formData);
      setPreviewUrl(url);
      setStatus('idle');
      if (previewBtnRef.current) animateButton(previewBtnRef.current, 1);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleMassDistribute = async () => {
    setStatus('loading');
    if (distributeBtnRef.current) animateButton(distributeBtnRef.current, 0.95);
    
    const formData = new FormData();
    formData.append('eventName', eventName);
    
    if (participantMode === 'link') {
      formData.append('participantLink', participantLink);
    } else if (participantFile) {
      formData.append('participantFile', participantFile);
    }
    
    try {
      const response = await massDistribute(formData);
      if (response.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
      <button
        ref={previewBtnRef}
        onMouseEnter={(e) => animateButton(e.currentTarget, 1.05)}
        onMouseLeave={(e) => animateButton(e.currentTarget, 1)}
        onClick={handleGeneratePreview}
        disabled={status === 'loading'}
        style={{
          flex: 1,
          padding: '1.25rem',
          borderRadius: 'var(--radius)',
          border: '2px solid var(--primary-action)',
          backgroundColor: 'transparent',
          color: 'var(--primary-action)',
          fontSize: '1.1rem',
          fontWeight: 700,
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          transition: 'border 0.3s ease',
          opacity: status === 'loading' ? 0.6 : 1
        }}
      >
        {status === 'loading' ? 'Processing...' : 'Generate Preview'}
      </button>

      <button
        ref={distributeBtnRef}
        onMouseEnter={(e) => animateButton(e.currentTarget, 1.05)}
        onMouseLeave={(e) => animateButton(e.currentTarget, 1)}
        onClick={handleMassDistribute}
        disabled={status === 'loading'}
        style={{
          flex: 1.5,
          padding: '1.25rem',
          borderRadius: 'var(--radius)',
          border: 'none',
          backgroundColor: 'var(--primary-action)',
          color: 'white',
          fontSize: '1.1rem',
          fontWeight: 700,
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s ease',
          boxShadow: 'var(--shadow)',
          opacity: status === 'loading' ? 0.6 : 1
        }}
      >
        {status === 'loading' ? 'Distributing...' : 'Mass Distribute Certificates'}
      </button>
    </div>
  );
};

export default ActionButtons;
