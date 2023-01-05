import { blogApi } from './pages/blog/blog.service'
import { blogAxiosAPI } from 'pages/blog/blogAxios.service'
import { useDispatch } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import blogReducer from 'pages/blog/blog.slice'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { rtkQueryErrorLogger } from 'middleware'

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [blogAxiosAPI.reducerPath]: blogAxiosAPI.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(blogAxiosAPI.middleware, rtkQueryErrorLogger)
})

setupListeners(store.dispatch)

// Get RootState and AppDispatch from store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
