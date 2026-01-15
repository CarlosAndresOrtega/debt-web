export interface Book {
    id: number;
    title: string;
    price: string;
    rating: string;
    stock: number;
    category: string;
}
export interface debtsResponse {
    items: Book[];
    pagination: {
        pageSize: number,
        totalItems:number,
        totalPages: number,
        currentPage:number,
    };
}