export type Project = {
        id: string,
        userId: string,
        name: string,
        description: string,
        visibility: ProjectVisibility,
        tags: string[],
        createdAt: string,
        updatedAt: string,
}

type ProjectVisibility = 'public' | 'private'