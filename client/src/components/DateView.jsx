import React from 'react';
import '../styles/components.css';

export default function DateView ({className}) {
    const today = new Date();
    const day = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric'
    }).format(today);
    const month = new Intl.DateTimeFormat('en-GB', {
        month: 'long'
    }).format(today);

    return (
    <div className={`flex flex-col ${className}`}>
      <p className="text-base font-normal" style={{ color: '#C27082' }}>
        Welcome back 👋, Today’s
      </p>
      <h2 className="text-5xl font-normal text-primary">
        {day} {month}
      </h2>
    </div>
  );
};