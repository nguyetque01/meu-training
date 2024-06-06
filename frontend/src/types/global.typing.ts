export interface ApiResponse<T> {
  status: string;
  message: string;
  responseData: T;
  timeStamp: string;
}
