import React, { useState, useRef, useEffect } from 'react';

const PopoverContext = React.createContext({});

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

export function PopoverContent({ children, className, ...props }) {
    const { isOpen, contentRef } = React.useContext(PopoverContext);

    if (!isOpen) return null;

    return (
        <div
            ref={contentRef}
            className={`absolute z-50 mt-2 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
}
