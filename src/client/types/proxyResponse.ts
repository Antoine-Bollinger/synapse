export interface ProxyResponse {
    remoteStatus: number
    remoteOk: boolean
    headers: Record<string, string>
    body: string
    time?: number
}