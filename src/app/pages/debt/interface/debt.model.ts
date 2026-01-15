import { User } from "./user.model";

export interface Debt {
    id: string; 
    description: string;
    amount: number; 
    isPaid: boolean;
    createdAt: string | Date;
    userId: string;
    user?: User; 
    paidByUserId?: string | null;
    paidByUser?: User | null; 
}
export interface DebtsResponse {
    items: Debt[];
    pagination: {
        pageSize: number;
        totalItems: number;
        totalPages: number;
        currentPage: number;
    };
}