export interface SessionError extends Error {
  statusCode: number,
  message: string
}