export interface ErrorResponseMessage {
  errorMessage: string;
}

export interface ErrorResponse {
  returnCode?: number;
  errorCode?: number;
  messages?: Array<ErrorResponseMessage>;
  trmMaintenanceFlag?: boolean;
}
