export interface ContextTypes {
    req: { [key: string]: string },
    res: { [key: string]: string }
}

export interface ErrorResponse {
    name: string | string[]
}


