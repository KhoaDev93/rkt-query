import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'

const axiosClient = axios.create({
  baseURL: 'http://localhost:4000'
})
let controller: any

axiosClient.interceptors.request.use(async (config) => {
  if (controller !== undefined) {
    controller.abort()
    controller = undefined
  }
  controller = new AbortController()

  return {
    ...config,
    signal: controller.signal
  }
})

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // if (response && response.data) {
    //   return response.data
    // }

    return response
  },
  (error) => {
    // Handle errors
    let errorMessage = error
    if (error.response) {
      errorMessage = error.response.data ? error.response.data.error : error.response.data
    }
    toast.warn('Some thing went wrong!')
    throw errorMessage
  }
)

export default axiosClient
