export interface TaskSearchQuery {
    skip: number;
    take: number;
    userId: string;
    startIsoDate?: string;
    endIsoDate?: string;
    userNames?: string[];
}
