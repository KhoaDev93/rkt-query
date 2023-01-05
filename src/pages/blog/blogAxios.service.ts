import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import axios from 'axios'
import type { AxiosRequestConfig, AxiosError } from 'axios'

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string
      method: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    return await axiosClient({ url, method, data, params })
  }

import { Post } from 'types/blog.type'
import axiosClient from 'api/axiosClient'
export const blogAxiosAPI = createApi({
  reducerPath: 'blogAxiosAPI',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Posts'],
  endpoints: (build) => ({
    getPostList: build.query<Post[], void>({
      query() {
        return {
          url: 'posts',
          method: 'get'
        }
      },
      providesTags(result) {
        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
            { type: 'Posts' as const, id: 'LIST' }
          ]
          return final
        }
        return [{ type: 'Posts', id: 'LIST' }]
      }
    }),

    getPost: build.query<Post, string>({
      query(id) {
        return {
          url: `posts/${id}`,
          method: 'get'
        }
      },
      keepUnusedDataFor: 5
    }),

    addPost: build.mutation<Post, Post>({
      query(body) {
        return {
          url: 'posts',
          method: 'POST',
          data: body
        }
      },
      invalidatesTags: (result, error, body) => (error ? [] : [{ type: 'Posts', id: 'LIST' }])
    }),

    updatePost: build.mutation<Post, { id: string; body: Post }>({
      query: (data) => {
        return {
          url: `posts/${data.id}`,
          method: 'put',
          data: data.body
        }
      },
      invalidatesTags: (result, error, data) => (error ? [] : [{ type: 'Posts', id: data.id }])
    }),

    deletePost: build.mutation<{}, string>({
      query: (id) => {
        return {
          url: `posts/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: (result, error, id) => (error ? [] : [{ type: 'Posts', id }])
    })
  })
})

export const {
  useGetPostListQuery,
  useAddPostMutation,
  useGetPostQuery,
  useUpdatePostMutation,
  useDeletePostMutation
} = blogAxiosAPI
