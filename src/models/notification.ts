export interface Notification {
  id: number;
  userId: number;
  title: string;
  body: string;
  metadata: Record<string, any>;
  read: boolean;
  createdAt: string;
}

interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface NotificationPage {
  collection: Notification[];
  pagination: Pagination;
}