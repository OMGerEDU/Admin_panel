import { useToast } from "./use-toast"
import { X, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "../../lib/utils"
import { useEffect, useState } from "react"

export function Toaster() {
    const { toasts, dismiss } = useToast()

    // Clean up any potential stale toasts on mount
    useEffect(() => {
        // Optional: clear on mount? No, better keep them if they were triggered just before nav
    }, [])

    if (toasts.length === 0) return null

    return (
        <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
            {toasts.map(({ id, title, description, variant }) => (
                <div
                    key={id}
                    className={cn(
                        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full mt-2",
                        variant === "destructive"
                            ? "destructive group border-destructive bg-destructive text-destructive-foreground"
                            : "bg-background border-border text-foreground"
                    )}
                >
                    <div className="flex gap-3">
                        {variant === 'destructive' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                        {variant === 'default' && <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-primary" />}
                        <div className="grid gap-1">
                            {title && <div className="text-sm font-semibold">{title}</div>}
                            {description && (
                                <div className="text-sm opacity-90">{description}</div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => dismiss(id)}
                        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    )
}
