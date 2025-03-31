
import * as React from "react"
import { State, Toast, ToasterToast } from "./types"
import { reducer, dispatch, listeners } from "./toast-reducer"
import { genId } from "./utils"

// Create the Context
export const ToastContext = React.createContext<{
  state: State
  toast: (props: Toast) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void }
  dismiss: (toastId?: string) => void
}>({
  state: { toasts: [] },
  toast: () => ({ id: '', dismiss: () => {}, update: () => {} }),
  dismiss: () => {},
})

// Define the Provider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, dispatchAction] = React.useReducer(reducer, { toasts: [] })

  React.useEffect(() => {
    listeners.forEach((listener) => {
      listener(state)
    })
  }, [state])

  const toast = (props: Toast) => {
    const id = genId()

    const update = (props: ToasterToast) =>
      dispatchAction({
        type: "UPDATE_TOAST",
        toast: { ...props, id },
      })
      
    const dismiss = () => dispatchAction({ type: "DISMISS_TOAST", toastId: id })

    dispatchAction({
      type: "ADD_TOAST",
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) dismiss()
        },
      },
    })

    return {
      id,
      dismiss,
      update,
    }
  }

  const dismiss = (toastId?: string) => {
    dispatchAction({ type: "DISMISS_TOAST", toastId })
  }

  return (
    <ToastContext.Provider value={{ state, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

// Export the custom hook to use the toast context
export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return {
    ...context.state,
    toast: context.toast,
    dismiss: context.dismiss,
  }
}
