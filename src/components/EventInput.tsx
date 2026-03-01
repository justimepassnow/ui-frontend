import React from 'react';
import { useForm } from '../context/FormContext';

const EventInput: React.FC = () => {
  const { eventName, setEventName } = useForm();

  return (
    <div className="form-group" style={{ marginBottom: '2rem' }}>
      <label 
        htmlFor="eventName" 
        style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontWeight: 600,
          fontSize: '1.1rem'
        }}
      >
        Event Name
      </label>
      <input
        type="text"
        id="eventName"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        placeholder="Enter the name of your event..."
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '1rem',
          border: '2px solid transparent',
          borderRadius: 'var(--radius)',
          backgroundColor: 'white',
          boxShadow: 'var(--shadow)',
          outline: 'none',
          transition: 'all 0.3s var(--transition-bouncy)'
        }}
        className="bouncy-input"
      />
    </div>
  );
};

export default EventInput;
