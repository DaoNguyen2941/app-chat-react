import axios, { AxiosError } from "axios"

export function isAxiosError<T>(err: unknown): err is AxiosError<T> {
    return axios.isAxiosError(err)
}