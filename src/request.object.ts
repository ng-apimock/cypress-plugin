/** Request object. */
export interface RequestObject {
    url: string;
    method: string;
    log: boolean;
    headers?: RequestHeaders;
    body?: any;
}

/** Request headers. */
export interface RequestHeaders {
    [key: string]: string;
}