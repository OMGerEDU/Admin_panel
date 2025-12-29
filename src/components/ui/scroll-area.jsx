import React from 'react';

export function ScrollArea({ children, className, ...props }) {
    return (
        <div className={`relative overflow-auto ${className || ''}`} {...props}>
            {children}
        </div>
    );
}
