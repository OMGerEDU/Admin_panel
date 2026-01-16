import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const SheetContext = React.createContext({})

const Sheet = ({ children, open, onOpenChange }) => {
    return (
        <SheetContext.Provider value={{ open, onOpenChange }}>
            {children}
        </SheetContext.Provider>
    )
}

const SheetTrigger = React.forwardRef(({ className, children, asChild, ...props }, ref) => {
    const { onOpenChange } = React.useContext(SheetContext)
    return (
        <React.Fragment>
            {asChild ? (
                React.cloneElement(children, {
                    onClick: () => onOpenChange(true),
                    ...props,
                    ref
                })
            ) : (
                <button
                    ref={ref}
                    className={className}
                    onClick={() => onOpenChange(true)}
                    {...props}
                >
                    {children}
                </button>
            )}
        </React.Fragment>
    )
})
SheetTrigger.displayName = "SheetTrigger"

const SheetContent = React.forwardRef(({ className, children, side = "right", ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(SheetContext)

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in"
                onClick={() => onOpenChange(false)}
            />

            {/* Content Sidebar */}
            <div
                ref={ref}
                className={cn(
                    "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
                    className
                )}
                {...props}
            >
                {children}
                <button
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
                    onClick={() => onOpenChange(false)}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
            </div>
        </div>
    )
})
SheetContent.displayName = "SheetContent"

const SheetHeader = ({ className, ...props }) => (
    <div
        className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
        {...props}
    />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({ className, ...props }) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("text-lg font-semibold text-foreground", className)}
        {...props}
    />
))
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
SheetDescription.displayName = "SheetDescription"

export {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
}
