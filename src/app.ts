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

const errors: ErrorType = {
    errorsMessages: []
}


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

app.delete('/videos/:id', (req: Request<Param>, res: Response) => {
    const foundedVideo = videos.find(v => v.id === +req.params.id)
    if (!foundedVideo) {
        res.sendStatus(404)
        return
    }

    videos = videos.filter(v => v.id !== foundedVideo.id)
    console.log(videos)
    res.sendStatus(204).send("Video Deleted")
})

app.post('/videos', (req: RequestWithBody<CreateVideoType>, res: Response) => {


    let {title, author, availableResolutions} = req.body


    if (!title || typeof title !== 'string' || title.trim().length > 40) {
        errors.errorsMessages.push({message: 'Incorrect title!', field: 'title'})

    }

    if (!author || typeof author !== 'string' || author.trim().length > 20) {
        errors.errorsMessages.push({message: 'Incorrect author!', field: 'author'})
    }

    if (Array.isArray(availableResolutions)) {
        availableResolutions.forEach(r => {
            if (!AvailableResolutions.includes(r)) {
                errors.errorsMessages.push({message: 'Incorrect resolution', field: 'availableResolutions'})
                return
            }
        })
    } else {
        availableResolutions = []
    }

    if (errors.errorsMessages.length) {
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


app.put('/videos/:id', (req: Request<Param>, res: Response) => {


    const foundedVideo = videos.find(v => v.id === +req.params.id)
    if (!foundedVideo) {
        res.sendStatus(404)
        return
    } else {


        let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction} = req.body


        if (!title || typeof title !== 'string' || title.trim().length > 40) {
            errors.errorsMessages.push({message: 'Incorrect title!', field: 'title'})

        }

        if (!author || typeof author !== 'string' || author.trim().length > 20) {
            errors.errorsMessages.push({message: 'Incorrect author!', field: 'author'})
        }

        if (typeof canBeDownloaded !== 'boolean') {
            errors.errorsMessages.push({message: 'Incorrect can be downloaded!', field: 'canBeDownloaded'})
        }

        if (typeof minAgeRestriction !== 'number') {
            errors.errorsMessages.push({message: 'Incorrect minAgeRestriction', field: 'minAgeRestriction'})
        }


        foundedVideo.title = req.body.title
        foundedVideo.author = req.body.author
        foundedVideo.canBeDownloaded = req.body.canBeDownloaded
        foundedVideo.minAgeRestriction = req.body.minAgeRestriction

        if (Array.isArray(availableResolutions)) {
            availableResolutions.forEach(r => {
                if (!AvailableResolutions.includes(r)) {
                    errors.errorsMessages.push({message: 'Incorrect resolution', field: 'availableResolutions'})
                    return
                }
            })
        } else {
            foundedVideo.availableResolutions = req.body.availableResolutions
        }


        res.send(foundedVideo)

    }


})