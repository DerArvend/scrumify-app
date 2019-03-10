export interface Result<TValue, TError = string> {
    isSuccess: boolean;
    error?: TError;
    value?: TValue;
}

export function success<TValue>(value?: TValue): Result<TValue, any> {
    return { isSuccess: true, value };
}

export function fail<TError>(error: TError): Result<any, TError> {
    return { isSuccess: false, error };
}
