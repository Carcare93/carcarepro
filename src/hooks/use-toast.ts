
import * as React from "react"
import { ToastContext } from "./toast/toast-context"
import { dispatch, memoryState, listeners } from "./toast/toast-reducer"
import { Toast, ToasterToast } from "./toast/types"
import { genId } from "./toast/utils"

// Function to be used outside of components for showing toasts
function toast(props: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
    
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
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

// The hook that components should use to access toast functionality
function useToast() {
  const context = React.useContext(ToastContext)
  
  // If within the context provider, use that context
  if (context) {
    return {
      ...context.state,
      toast: context.toast,
      dismiss: context.dismiss,
    }
  }
  
  // Fallback to the stateful implementation for backwards compatibility
  const [state, setState] = React.useState(memoryState)

  React.useEffect(() => {
    const listener = (newState: typeof memoryState) => setState(newState)
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
