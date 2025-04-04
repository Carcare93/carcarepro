
import * as React from "react"
import { State, Toast, ToasterToast } from "./types"
import { reducer } from "./toast-reducer"
import { genId } from "./utils"

// Create the context with a default value to avoid null checks
export const ToastContext = React.createContext<{
  state: State
  toast: (props: Toast) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void }
  dismiss: (toastId?: string) => void
}>({
  state: { toasts: [] },
  toast: () => ({ id: "", dismiss: () => {}, update: () => {} }),
  dismiss: () => {},
});

// Define the Provider component
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatchAction] = React.useReducer(reducer, { toasts: [] })

  const toast = React.useCallback((props: Toast) => {
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
  }, [])

  const dismiss = React.useCallback((toastId?: string) => {
    dispatchAction({ type: "DISMISS_TOAST", toastId })
  }, [])

  const contextValue = React.useMemo(() => ({
    state,
    toast,
    dismiss
  }), [state, toast, dismiss])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  )
}
