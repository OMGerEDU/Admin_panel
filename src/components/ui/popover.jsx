import React, { useState, useRef, useEffect } from 'react';

const PopoverContext = React.createContext({});

// Hook to access popover controls (e.g., to close it programmatically)
export function usePopover() {
    return React.useContext(PopoverContext);
}

export function Popover({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (isOpen &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target) &&
                contentRef.current &&
                !contentRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <PopoverContext.Provider value={{ isOpen, setIsOpen, triggerRef, contentRef }}>
            <div className="relative inline-block">
                {children}
            </div>
        </PopoverContext.Provider>
    );
}

export function PopoverTrigger({ asChild, children, ...props }) {
    const { setIsOpen, triggerRef } = React.useContext(PopoverContext);

    const child = asChild ? React.Children.only(children) : children;

    // Clone child to add onClick and ref
    if (asChild && React.isValidElement(child)) {
        return React.cloneElement(child, {
            ref: triggerRef,
            onClick: (e) => {
                child.props.onClick?.(e);
                setIsOpen(prev => !prev);
            },
            ...props
        });
    }

    return (
        <button
            ref={triggerRef}
            onClick={() => setIsOpen(prev => !prev)}
            {...props}
        >
            {children}
        </button>
    );
}

export function PopoverContent({ children, className, align = 'end', ...props }) {
    const { isOpen, contentRef } = React.useContext(PopoverContext);

    if (!isOpen) return null;

    // Determine RTL based on document direction
    const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

    // Position based on alignment and RTL
    const alignmentClass = align === 'start'
        ? (isRtl ? 'right-0' : 'left-0')
        : (isRtl ? 'left-0' : 'right-0');

    return (
        <div
            ref={contentRef}
            className={`absolute z-50 mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 ${alignmentClass} ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
}

// Dropdown menu item that closes the popover on click
export function DropdownMenuItem({ children, onClick, className, ...props }) {
    const { setIsOpen } = React.useContext(PopoverContext);

    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        }
        setIsOpen(false);
    };

    return (
        <button
            onClick={handleClick}
            className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-muted transition-colors text-start rtl:text-right ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
}
