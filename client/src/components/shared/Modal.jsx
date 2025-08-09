import React, { Children } from 'react';

export default function Modal({children, onClose}) {
    return(
        <div 
            className='fixed inset-0 z-40 bg-black/50 flex items-center justify-center'
            onClick={onClose}
        >
            <div className='bg-card/90 backdrop-blur-sm rounded-lg p-6' onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}