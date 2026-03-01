import React, { ChangeEvent, useRef } from 'react';
import anime from 'animejs';
import { useForm, TemplateMode } from '../context/FormContext';

const ParticipantSection: React.FC = () => {
  const { 
    participantMode, setParticipantMode, 
    participantLink, setParticipantLink,
    participantFile, setParticipantFile 
  } = useForm();

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTilt = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const rotateX = (y - rect.height / 2) / 10;
    const rotateY = (rect.width / 2 - x) / 10;

    anime({
      targets: sectionRef.current,
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 100,
      easing: 'linear'
    });
  };

  const resetTilt = () => {
    anime({
      targets: sectionRef.current,
      rotateX: 0,
      rotateY: 0,
      duration: 500,
      easing: 'spring(1, 80, 10, 0)'
    });
  };

  const handleToggle = (mode: TemplateMode) => {
    if (mode === participantMode) return;
    
    anime({
      targets: contentRef.current,
      rotateY: ['0deg', '90deg'],
      opacity: [1, 0],
      duration: 250,
      easing: 'easeInQuad',
      complete: () => {
        setParticipantMode(mode);
        anime({
          targets: contentRef.current,
          rotateY: ['-90deg', '0deg'],
          opacity: [0, 1],
          duration: 250,
          easing: 'easeOutQuad'
        });
      }
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setParticipantFile(file);
  };

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
      className="section section-3d" 
      style={{ 
        backgroundColor: 'var(--surface-color)', 
        padding: '2rem', 
        borderRadius: 'var(--radius)', 
        marginBottom: '2rem',
        boxShadow: 'var(--shadow)',
        transformStyle: 'preserve-3d'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', transform: 'translateZ(20px)' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Participant List</h2>
        
        {/* Toggle switch */}
        <div style={{ 
          display: 'flex', 
          backgroundColor: 'rgba(255, 255, 255, 0.5)', 
          padding: '4px', 
          borderRadius: '50px' 
        }}>
          <button
            onClick={() => handleToggle('link')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '50px',
              border: 'none',
              backgroundColor: participantMode === 'link' ? 'var(--primary-action)' : 'transparent',
              color: participantMode === 'link' ? 'white' : 'var(--text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s var(--transition-bouncy)'
            }}
          >
            Link
          </button>
          <button
            onClick={() => handleToggle('upload')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '50px',
              border: 'none',
              backgroundColor: participantMode === 'upload' ? 'var(--primary-action)' : 'transparent',
              color: participantMode === 'upload' ? 'white' : 'var(--text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s var(--transition-bouncy)'
            }}
          >
            Upload
          </button>
        </div>
      </div>

      <div ref={contentRef} style={{ transform: 'translateZ(10px)' }}>
        {participantMode === 'link' ? (
          <div className="form-group">
            <label htmlFor="participantLink" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Google Sheets Link</label>
            <input
              type="url"
              id="participantLink"
              value={participantLink}
              onChange={(e) => setParticipantLink(e.target.value)}
              placeholder="Paste link to participant spreadsheet..."
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: 'var(--radius)',
                border: '2px solid transparent',
                outline: 'none',
                fontSize: '0.9rem',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
              }}
            />
          </div>
        ) : (
          <div className="file-dropzone" style={{
            border: '2px dashed rgba(0,0,0,0.1)',
            padding: '2rem',
            textAlign: 'center',
            borderRadius: 'var(--radius)',
            backgroundColor: 'rgba(255,255,255,0.3)'
          }}>
            <input 
              type="file" 
              accept=".xls,.xlsx" 
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="participant-file-input"
            />
            <label htmlFor="participant-file-input" style={{ cursor: 'pointer', display: 'block' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>📄</div>
              <strong>{participantFile ? participantFile.name : 'Select Excel (.xls, .xlsx) file'}</strong>
              <p style={{ margin: '0.5rem 0 0', opacity: 0.6, fontSize: '0.85rem' }}>Click or drag file to upload</p>
            </label>
          </div>
        )}
      </div>
    </section>
  );
};

export default ParticipantSection;
