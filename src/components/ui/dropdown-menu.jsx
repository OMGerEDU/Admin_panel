import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../../lib/utils";

const DropdownMenuContext = React.createContext({});

export const DropdownMenu = ({ children, ...props }) => {
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
        <DropdownMenuContext.Provider value={{ isOpen, setIsOpen, triggerRef, contentRef }}>
            <div className="relative inline-block text-left" {...props}>
                {children}
            </div>
        </DropdownMenuContext.Provider>
    );
};

export const DropdownMenuTrigger = ({ asChild, children, ...props }) => {
    const { setIsOpen, triggerRef } = React.useContext(DropdownMenuContext);
    const child = asChild ? React.Children.only(children) : children;

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
};

export const DropdownMenuContent = ({ children, className, align = 'end', ...props }) => {
    const { isOpen, contentRef } = React.useContext(DropdownMenuContext);

    if (!isOpen) return null;

    const alignmentClass = align === 'start' ? 'left-0' : 'right-0';

    return (
        <div
            ref={contentRef}
            className={cn(
                "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
                alignmentClass,
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const DropdownMenuItem = ({ children, className, inset, onClick, ...props }) => {
    const { setIsOpen } = React.useContext(DropdownMenuContext);
    return (
        <div
            className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                inset && "pl-8",
                className
            )}
            onClick={(e) => {
                setIsOpen(false);
                onClick?.(e);
            }}
            {...props}
        >
            {children}
        </div>
    );
};

export const DropdownMenuCheckboxItem = ({ children, checked, onCheckedChange, className, ...props }) => {
    const { setIsOpen } = React.useContext(DropdownMenuContext);

    return (
        <div
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
            onClick={(e) => {
                e.preventDefault();
                onCheckedChange?.(!checked);
                setIsOpen(false);
            }}
            {...props}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <DropdownMenuItemIndicator>
                    {checked && <Check className="h-4 w-4" />}
                </DropdownMenuItemIndicator>
            </span>
            {children}
        </div>
    );
};

const DropdownMenuItemIndicator = ({ children, ...props }) => {
    return (
        <span className="flex h-3.5 w-3.5 items-center justify-center" {...props}>
            {children}
        </span>
    );
}


export const DropdownMenuLabel = ({ children, className, inset, ...props }) => {
    return (
        <div
            className={cn(
                "px-2 py-1.5 text-sm font-semibold",
                inset && "pl-8",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const DropdownMenuSeparator = ({ className, ...props }) => {
    return (
        <div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
    );
};
