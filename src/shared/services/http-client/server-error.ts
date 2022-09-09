import { AxiosError } from "axios";
import {
  ErrorResponse,
  ErrorResponseMessage,
} from "../../models/error-response";

export default class ServerError<T = ErrorResponse> extends Error {
  public constructor(e: AxiosError<ErrorResponse>, public type?: string) {
    super(e.message);

    this.messages = e.response?.data?.messages || [];
    this.errorCode = e.response?.data?.errorCode as number;
    this.error = e.response?.data as T;
  }

  public messages: Array<ErrorResponseMessage>;
  public errorCode: number;
  public error: T;
}
