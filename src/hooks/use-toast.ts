
import * as React from "react"
import { ToastContext } from "./toast/toast-context"
import { dispatch, memoryState } from "./toast/toast-reducer"
import { Toast, ToasterToast } from "./toast/types"
import { genId } from "./toast/utils"

// Function to be used outside of components for showing toasts
export function toast(props: Toast) {
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
export function useToast() {
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
