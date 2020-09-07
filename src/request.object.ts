/** Request headers. */
export interface RequestHeaders {
    [key: string]: any;
}

/** Request object. */
export interface RequestObject {
    agent?: any;
    url: string;
    method: string;
    log: boolean;
    headers?: RequestHeaders;
    body?: any;
}
