export interface Task {
    id: string;
    title: string;
    tags: Array<{id: string, text: string}>
    description: string[];
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PrismaError {
    code: string;
    message: string;
}