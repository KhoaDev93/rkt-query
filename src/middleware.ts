import { MiddlewareAPI, isRejectedWithValue, AnyAction } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  console.log('action :>> ', action);
  if (isRejectedWithValue(action)) {
    console.log('2 :>> ', 2);
    toast.warn('Some thing went wrong!')
  }

  return next(action)
}
