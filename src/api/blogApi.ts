import { Post } from 'types/blog.type'
import axiosClient from './axiosClient'

class BlogApi {
  getPostList = () => {
    return axiosClient.get<Post[]>(`/posts`)
  }
  addPost = (body: Post) => {
    return axiosClient.post<Post>(`/posts`, body)
  }
  deletePost = (postID: string) => {
    return axiosClient.delete<Post>(`/posts/${postID}`)
  }
  updatePost = (body: Post) => {
    return axiosClient.put<Post>(`/posts/${body.id}`, body)
  }
}

export default new BlogApi()
