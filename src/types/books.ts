export interface Book {
    _id: string;
    title: string;
    author: string;
    description?: string;
    publishedDate?: string;
    coverImage?: string;
    user: {
        _id: string;
        name: string;
        lastName: string;
    };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}