export interface Result<TValue, TError = string> {
    isSuccess: boolean;
    error?: TError;
    value?: TValue;
}