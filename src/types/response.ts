export type ApiResponse = {
  success: boolean;
  message?: string;
  [key: string]: unknown;
};

export type ErrorResponse = ApiResponse & {
  title?: string;
  stackTrace?: string;
};
