import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

interface NotificationPayload {
  message: string
  type: 'success' | 'error' | 'info'
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {},
  reducers: {
    showNotification: (_, action: PayloadAction<NotificationPayload>) => {
      const { message, type } = action.payload
      if (type === 'success') toast.success(message)
      if (type === 'error') toast.error(message)
      if (type === 'info') toast.info(message)
    }
  }
})

export const { showNotification } = notificationsSlice.actions
export default notificationsSlice.reducer
