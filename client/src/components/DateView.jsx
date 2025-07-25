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
        <div className={className}>
            <h2 className="text-5xl font-semibold">{day}</h2>
            <h2 className="text-4xl">{month}</h2>
        </div>
    );
};