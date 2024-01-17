import express, {Request, Response} from "express";
import {CreateVideoType, ErrorType, Param, RequestWithBody, VideoType} from "../types/types";

export const app = express()

app.use(express.json())

export const AvailableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']

let videos: VideoType[] = [
    {
        "id": 0,
        "title": "string",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2024-01-15T20:13:45.039Z",
        "publicationDate": "2024-01-15T20:13:45.039Z",
        "availableResolutions": [
            "P144"
        ]
    }
]


app.get('/', (req: Request, res: Response) => {
    res.send("Hello").status(200)
})


app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)

})

app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = []
    res.sendStatus(204)
})


app.get('/videos/:id', (req: Request<Param>, res: Response) => {

    const foundedVideo = videos.find(v => v.id === +req.params.id)
    if (!foundedVideo) {
        res.sendStatus(404)
        return
    }
    res.send(foundedVideo)
})

app.post('/videos', (req: RequestWithBody<CreateVideoType>, res: Response) => {
    const errors: ErrorType = {
        errorMessages: []
    }

    let {title, author, availableResolutions} = req.body

    const titleLength = title.trim().length
    const authorLength = author.trim().length

    if (!title || typeof title !== 'string' || titleLength > 40) {
        errors.errorMessages.push({message: 'Incorrect title!', field: title})
    }

    if (!title || typeof author !== 'string' || authorLength > 20) {
        errors.errorMessages.push({message: 'Incorrect author!', field: author})
    }

    if (Array.isArray(availableResolutions)) {
        availableResolutions.forEach(r => {
            if (!AvailableResolutions.includes(r)) {
                errors.errorMessages.push({message: 'Incorrect resolution', field: 'availableResolutions'})
                return
            }
        })
    } else {
        availableResolutions = []
    }

    if (errors.errorMessages.length) {
        res.status(400).send(errors)
        return
    }

    const createdAt = new Date()
    const publicationDate = new Date()

    publicationDate.setDate(createdAt.getDate() + 1)

    const newVideo: VideoType = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    }

    videos.push(newVideo)
    res.status(201).send(newVideo)


})
app.delete('/videos/:id', (req: Request<Param>, res: Response) => {

    const foundedVideo = videos.find(v => v.id === +req.params.id)
    if (!foundedVideo) {
        res.sendStatus(404)
        return
    }
    videos = videos.filter(v => v.id !== foundedVideo.id)
    res.send(videos).sendStatus(204)
})


app.put('/videos/:id', (req: Request<Param>, res: Response) => {

    const foundedVideo = videos.find(v => v.id === +req.params.id)
    if (!foundedVideo) {
        res.sendStatus(404)
        return
    }
    res.send(videos)
})