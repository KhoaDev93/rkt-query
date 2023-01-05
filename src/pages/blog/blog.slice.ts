import { createAsyncThunk, createSlice, PayloadAction, AsyncThunk } from '@reduxjs/toolkit'
import { blogApi } from 'api'
import { Post } from 'types/blog.type'

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

interface BlogState {
  postList: Post[]
  editingPost: Post | null
  loading: boolean
  currentRequestId: string | undefined
  postId: string
}

const initialState: BlogState = {
  postList: [],
  editingPost: null,
  loading: false,
  currentRequestId: undefined,
  postId: ''
}

export const getPostList = createAsyncThunk('blog/getPostList', async () => {
  const response = await blogApi.getPostList()
  return response.data
})

const blockSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    startEditing: (state, action: PayloadAction<string>) => {
      state.postId = action.payload
    },
    cancelEditing: (state) => {
      state.postId = ''
    }
  },
  extraReducers(builder) {
    builder.addCase(getPostList.fulfilled, (state, { payload }) => {
      state.postList = payload
    })
    builder.addMatcher<PendingAction>(
      (action) => action.type.endsWith('/pending'),
      (state, action) => {
        state.loading = true
        state.currentRequestId = action.meta.requestId
      }
    )
    builder.addMatcher<RejectedAction | FulfilledAction>(
      (action) => action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'),
      (state, action) => {
        if (state.loading && state.currentRequestId === action.meta.requestId) {
          state.loading = false
          state.currentRequestId = undefined
        }
      }
    )
  }
})

export const { cancelEditing, startEditing } = blockSlice.actions
const blogReducer = blockSlice.reducer

export default blogReducer
