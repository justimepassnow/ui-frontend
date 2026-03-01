import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'
import { FormProvider, useForm } from './context/FormContext'
import EventInput from './components/EventInput'
import TemplateSection from './components/TemplateSection'
import ParticipantSection from './components/ParticipantSection'
import ActionButtons from './components/ActionButtons'
import LivePreview from './components/LivePreview'
import LandingPage from './components/LandingPage'

function AppContent() {
  const { status } = useForm();
  const [showForm, setShowForm] = useState(false);
  const deskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleStart = () => setShowForm(true);
    window.addEventListener('start-form', handleStart);
    return () => window.removeEventListener('start-form', handleStart);
  }, []);

  useEffect(() => {
    if (status === 'success' && deskRef.current) {
      // The whole form folds and flies away
      anime.timeline({
        easing: 'easeInOutQuart'
      })
      .add({
        targets: deskRef.current,
        rotateX: '70deg',
        translateZ: -200,
        opacity: [1, 0.8],
        scale: 0.8,
        duration: 800
      })
      .add({
        targets: deskRef.current,
        rotateZ: '10deg',
        translateX: 1000,
        translateY: -500,
        opacity: 0,
        duration: 1200,
        easing: 'easeInBack'
      });
    } else if (status === 'idle' && deskRef.current && showForm) {
      // Entrance animation for the form
      anime({
        targets: deskRef.current,
        rotateX: [30, 0],
        translateY: [100, 0],
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 1000,
        easing: 'spring(1, 80, 10, 0)'
      });
    }
  }, [status, showForm]);

  if (!showForm) {
    return <LandingPage />;
  }

  return (
    <div className="app">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 700, 
          color: 'var(--primary-action)',
          marginBottom: '0.5rem'
        }}>
          Certificate Automation
        </h1>
        <p style={{ opacity: 0.6 }}>Generate and distribute event certificates with a single click.</p>
        <button 
          onClick={() => setShowForm(false)}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--primary-action)',
            cursor: 'pointer',
            fontWeight: 600,
            textDecoration: 'underline'
          }}
        >
          ← Back to Landing Page
        </button>
      </header>

      <main 
        ref={deskRef}
        className="desk" 
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderRadius: 'calc(var(--radius) * 2)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <EventInput />
        <TemplateSection />
        <ParticipantSection />
        <ActionButtons />
      </main>

      <LivePreview />
    </div>
  )
}

function App() {
  return (
    <FormProvider>
      <AppContent />
    </FormProvider>
  )
}

export default App
