import * as React from "react"
import { cn } from "../../lib/utils"

const Tabs = React.forwardRef(({ className, defaultValue, onValueChange, children, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue)

    // Allow controlled or uncontrolled
    const value = props.value !== undefined ? props.value : activeTab
    const setValue = (v) => {
        if (props.value === undefined) setActiveTab(v)
        onValueChange?.(v)
    }

    return (
        <div ref={ref} className={cn("", className)} data-state={value} {...props}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        value,
                        onValueChange: setValue
                    })
                }
                return child
            })}
        </div>
    )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value, onValueChange, ...props }, ref) => {
    // Note: In a real radix implementation, this context is passed down better.
    // For this simple custom implementation, we might need a context or verify prop passing.
    // Actually, Shadcn's Tabs is a wrapper around Radix.
    // Since we don't have Radix, I'll build a simplified Context-based Tabs.
    return (
        <button
            ref={ref}
            type="button"
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                props.contextValue === value && "bg-background text-foreground shadow",
                className
            )}
            onClick={() => onValueChange && onValueChange(value)}
            {...props}
        />
    )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value, contextValue, ...props }, ref) => {
    if (value !== contextValue) return null
    return (
        <div
            ref={ref}
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            {...props}
        />
    )
})
TabsContent.displayName = "TabsContent"

// Better implementation using Context
const TabsContext = React.createContext({ value: undefined, onValueChange: () => { } })

const SimpleTabs = React.forwardRef(({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const activeValue = value !== undefined ? value : internalValue
    const handleValueChange = (v) => {
        if (value === undefined) setInternalValue(v)
        onValueChange?.(v)
    }

    return (
        <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
            <div ref={ref} className={cn("", className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    )
})

const SimpleTabsList = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
))
SimpleTabsList.displayName = "TabsList"

const SimpleTabsTrigger = React.forwardRef(({ className, value, ...props }, ref) => {
    const { value: activeValue, onValueChange } = React.useContext(TabsContext)
    const isActive = activeValue === value
    return (
        <button
            ref={ref}
            type="button"
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50 hover:text-foreground",
                className
            )}
            onClick={() => onValueChange(value)}
            data-state={isActive ? "active" : "inactive"}
            {...props}
        />
    )
})
SimpleTabsTrigger.displayName = "TabsTrigger"

const SimpleTabsContent = React.forwardRef(({ className, value, ...props }, ref) => {
    const { value: activeValue } = React.useContext(TabsContext)
    if (activeValue !== value) return null
    return (
        <div
            ref={ref}
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            {...props}
        />
    )
})
SimpleTabsContent.displayName = "TabsContent"

export { SimpleTabs as Tabs, SimpleTabsList as TabsList, SimpleTabsTrigger as TabsTrigger, SimpleTabsContent as TabsContent }
