import {AvailableResolutions} from "../src/app";
import {Request} from 'express'

export type VideoType = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: null
    createdAt: string
    publicationDate: string
    availableResolutions: typeof AvailableResolutions
}

export type CreateVideoType = {
    title: string
    author: string
    availableResolutions: typeof AvailableResolutions
}

export type Param = { id: number }


export type RequestWithBody<B> = Request<unknown, unknown, B, unknown>

export type ErrorMessageType = {
    field: string
    message: string
}

export type ErrorType = {
    errorMessages: ErrorMessageType[]
}