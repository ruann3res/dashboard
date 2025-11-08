import http from './http'
import type { AxiosRequestConfig } from 'axios'

export async function get<Output>(
  url: string,
  config?: AxiosRequestConfig
): Promise<Output> {
  const { data } = await http.get<Output>(url, config)
  return data
}

export async function post<Input, Output>(
  url: string,
  body?: Input,
  config?: AxiosRequestConfig
): Promise<Output> {
  const { data } = await http.post<Output>(url, body, config)
  return data
}

export async function put<Input, Output>(
  url: string,
  body?: Input,
  config?: AxiosRequestConfig
): Promise<Output> {
  const { data } = await http.put<Output>(url, body, config)
  return data
}

export async function patch<Input, Output>(
  url: string,
  body?: Input,
  config?: AxiosRequestConfig
): Promise<Output> {
  const { data } = await http.patch<Output>(url, body, config)
  return data
}

export async function del<Output>(
  url: string,
  config?: AxiosRequestConfig
): Promise<Output> {
  const { data } = await http.delete<Output>(url, config)
  return data
}
