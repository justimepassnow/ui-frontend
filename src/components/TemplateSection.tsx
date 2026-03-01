import React, { ChangeEvent, useRef } from 'react';
import anime from 'animejs';
import { useForm, TemplateMode } from '../context/FormContext';

const TemplateSection: React.FC = () => {
  const { 
    templateMode, setTemplateMode, 
    templateLink, setTemplateLink,
    templateFile, setTemplateFile,
    winnerTemplateFile, setWinnerTemplateFile
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
    if (mode === templateMode) return;
    
    // 3D Flip transition
    anime({
      targets: contentRef.current,
      rotateY: ['0deg', '90deg'],
      opacity: [1, 0],
      duration: 250,
      easing: 'easeInQuad',
      complete: () => {
        setTemplateMode(mode);
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'participant' | 'winner') => {
    const file = e.target.files?.[0] || null;
    if (type === 'participant') {
      setTemplateFile(file);
    } else {
      setWinnerTemplateFile(file);
    }
  };

  const validateLink = (link: string) => {
    const regex = /^(http|https):\/\/[^ "]+$/;
    return regex.test(link);
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
        <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Certificate Templates</h2>
        
        {/* Bouncy Toggle Switch */}
        <div style={{ 
          display: 'flex', 
          backgroundColor: 'rgba(255, 255, 255, 0.5)', 
          padding: '4px', 
          borderRadius: '50px',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <button
            onClick={() => handleToggle('link')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '50px',
              border: 'none',
              backgroundColor: templateMode === 'link' ? 'var(--primary-action)' : 'transparent',
              color: templateMode === 'link' ? 'white' : 'var(--text-primary)',
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
              backgroundColor: templateMode === 'upload' ? 'var(--primary-action)' : 'transparent',
              color: templateMode === 'upload' ? 'white' : 'var(--text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s var(--transition-bouncy)'
            }}
          >
            Upload
          </button>
        </div>
      </div>

      <div ref={contentRef} className="mode-content" style={{ transform: 'translateZ(10px)' }}>
        {templateMode === 'link' ? (
          <div className="form-group">
            <label htmlFor="templateLink" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Google Sheets/Drive Link</label>
            <input
              type="url"
              id="templateLink"
              value={templateLink}
              onChange={(e) => setTemplateLink(e.target.value)}
              placeholder="Paste your template link here..."
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: 'var(--radius)',
                border: '2px solid transparent',
                outline: 'none',
                fontSize: '0.9rem',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                borderBottom: templateLink && !validateLink(templateLink) ? '2px solid var(--accent-color)' : '2px solid transparent'
              }}
            />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Participant Template (Required)</label>
              <div className="file-dropzone" style={{
                border: '2px dashed rgba(0,0,0,0.1)',
                padding: '1.5rem',
                textAlign: 'center',
                borderRadius: 'var(--radius)',
                backgroundColor: 'rgba(255,255,255,0.3)'
              }}>
                <input 
                  type="file" 
                  accept=".ppt,.pptx" 
                  onChange={(e) => handleFileChange(e, 'participant')}
                  style={{ display: 'none' }}
                  id="participant-file"
                />
                <label htmlFor="participant-file" style={{ cursor: 'pointer' }}>
                  {templateFile ? templateFile.name : 'Select .pptx file'}
                </label>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Winner Template (Optional)</label>
              <div className="file-dropzone" style={{
                border: '2px dashed rgba(0,0,0,0.1)',
                padding: '1.5rem',
                textAlign: 'center',
                borderRadius: 'var(--radius)',
                backgroundColor: 'rgba(255,255,255,0.3)'
              }}>
                <input 
                  type="file" 
                  accept=".ppt,.pptx" 
                  onChange={(e) => handleFileChange(e, 'winner')}
                  style={{ display: 'none' }}
                  id="winner-file"
                />
                <label htmlFor="winner-file" style={{ cursor: 'pointer' }}>
                  {winnerTemplateFile ? winnerTemplateFile.name : 'Select .pptx file'}
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TemplateSection;
