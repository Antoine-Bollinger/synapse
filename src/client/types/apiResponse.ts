export interface ApiResponse {
    status: number,
    headers: Record<string, string>
    body: string
    time?: number
}