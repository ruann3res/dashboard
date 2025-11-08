import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { get, post, put, del } from '@/services/api'
import { QueryKeys } from '@/lib/query-keys'
import { useToast } from '@/hooks'
import { extractErrorMessage } from '@/lib/error-utils'
import type { Project } from '@/types'

interface ProjectsResponse {
  success: boolean
  data: {
    projects: Project[]
    total: number
    page: number
    limit: number
  }
  timestamp: string
}

interface ProjectResponse {
  success: boolean
  data: {
    project: Project
  }
  timestamp: string
}

interface CreateProjectRequest {
  name: string
  description: string
  visibility: 'public' | 'private'
  tags?: string[]
}

interface UpdateProjectRequest {
  name?: string
  description?: string
  visibility?: 'public' | 'private'
  tags?: string[]
}

interface ProjectsParams {
  page?: number
  limit?: number
  search?: string
  type?: 'user' | 'public'
  tags?: string
}

export const useProjects = (params?: ProjectsParams) => {
  return useQuery({
    queryKey: [QueryKeys.PROJECTS, params],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.type) queryParams.append('type', params.type)
      if (params?.tags) queryParams.append('tags', params.tags)

      const url = `/projects${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      return get<ProjectsResponse>(url)
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false
      }
      return failureCount < 2
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export const useProject = (id: string) => {
  return useQuery({
    queryKey: [QueryKeys.PROJECTS, id],
    queryFn: async () => {
      return get<ProjectResponse>(`/projects/${id}`)
    },
    enabled: !!id,
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (data: CreateProjectRequest) => {
      return post<CreateProjectRequest, ProjectResponse>('/projects', data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECTS] })
      await queryClient.refetchQueries({ 
        queryKey: [QueryKeys.PROJECTS],
        type: 'active'
      })
      showToast('Projeto criado com sucesso!', 'success')
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error)
      showToast(message, 'error')
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProjectRequest }) => {
      return put<UpdateProjectRequest, ProjectResponse>(`/projects/${id}`, data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECTS] })
      await queryClient.refetchQueries({ 
        queryKey: [QueryKeys.PROJECTS],
        type: 'active'
      })
      showToast('Projeto atualizado com sucesso!', 'success')
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error)
      showToast(message, 'error')
    },
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      return del<{ success: boolean; data: { message: string }; timestamp: string }>(`/projects/${id}`)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECTS] })
      await queryClient.refetchQueries({ 
        queryKey: [QueryKeys.PROJECTS],
        type: 'active'
      })
      showToast('Projeto excluído com sucesso!', 'success')
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error)
      showToast(message, 'error')
    },
  })
}

