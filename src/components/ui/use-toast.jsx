import { useState, useEffect } from "react"

// Simple event emitter for toasts
const listeners = new Set()
let memoryToasts = []

function emitChange() {
    listeners.forEach((listener) => listener(memoryToasts))
}

function toast({ title, description, variant = "default", duration = 3000 }) {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, variant, open: true }

    memoryToasts = [...memoryToasts, newToast]
    emitChange()

    if (duration !== Infinity) {
        setTimeout(() => {
            dismiss(id)
        }, duration)
    }

    return {
        id,
        dismiss: () => dismiss(id),
        update: (props) => {
            memoryToasts = memoryToasts.map((t) =>
                t.id === id ? { ...t, ...props } : t
            )
            emitChange()
        }
    }
}

function dismiss(id) {
    memoryToasts = memoryToasts.filter((t) => t.id !== id)
    emitChange()
}

function useToast() {
    const [toasts, setToasts] = useState(memoryToasts)

    useEffect(() => {
        listeners.add(setToasts)
        return () => listeners.delete(setToasts)
    }, [])

    return {
        toast,
        dismiss,
        toasts,
    }
}

export { useToast, toast }
