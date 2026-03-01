import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { useForm } from '../context/FormContext';

const LivePreview: React.FC = () => {
  const { previewUrl, status } = useForm();
  const loadingRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const airplaneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'loading' && loadingRef.current) {
      // Origami folding metaphor animation
      anime.remove('.paper-piece');
      anime({
        targets: '.paper-piece',
        rotateX: ['0deg', '180deg'],
        rotateY: ['0deg', '180deg'],
        scale: [1, 0.5, 1],
        opacity: [0.8, 1],
        easing: 'easeInOutQuad',
        duration: 1200,
        loop: true,
        delay: anime.stagger(200)
      });
    }

    if (status === 'success' && successRef.current && airplaneRef.current) {
      // Paper airplane metaphor: Fold, Fly, and Success
      const tl = anime.timeline({
        easing: 'easeOutExpo'
      });

      tl.add({
        targets: airplaneRef.current,
        display: 'block',
        scale: [0, 1.2, 1],
        rotate: '-45deg',
        duration: 800
      })
      .add({
        targets: airplaneRef.current,
        translateX: [0, 800],
        translateY: [0, -400],
        rotate: '-30deg',
        opacity: [1, 0],
        duration: 1500,
        easing: 'easeInSine'
      })
      .add({
        targets: '.success-checkmark',
        opacity: [0, 1],
        scale: [0, 1.5, 1],
        duration: 1000,
        easing: 'spring(1, 80, 10, 0)'
      });
    }
  }, [status]);

  return (
    <div className="preview-container" style={{
      width: '100%',
      maxWidth: '800px',
      margin: '3rem auto 0',
      textAlign: 'center'
    }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', opacity: 0.8 }}>Certificate Preview</h3>
      
      <div className="preview-window" style={{
        aspectRatio: '3/2',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: '3px solid white'
      }}>
        {status === 'loading' ? (
          <div ref={loadingRef} className="loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="paper-fold-container">
              <div className="paper-piece" style={{ top: 0, left: 0, backgroundColor: 'var(--surface-color)' }}></div>
              <div className="paper-piece" style={{ top: 0, right: 0, backgroundColor: 'var(--accent-color)' }}></div>
              <div className="paper-piece" style={{ bottom: 0, left: 0, backgroundColor: 'var(--primary-action)' }}></div>
              <div className="paper-piece" style={{ bottom: 0, right: 0, backgroundColor: 'var(--white)' }}></div>
            </div>
            <p style={{ fontWeight: 600, color: 'var(--accent-color)', marginTop: '1.5rem' }}>Preparing Preview...</p>
          </div>
        ) : status === 'success' ? (
          <div ref={successRef} className="success-state">
            <div ref={airplaneRef} className="airplane-container">✈️</div>
            <div className="success-checkmark">✅</div>
            <h2 style={{ color: 'var(--primary-action)', marginTop: '1rem' }}>Success!</h2>
            <p>Your certificates have been sent.</p>
          </div>
        ) : previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Certificate Preview" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div className="empty-state" style={{ opacity: 0.3, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
            <p>Preview will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePreview;
