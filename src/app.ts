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
    const postErrors: ErrorType = {
        errorsMessages: []
    }


    let {title, author, availableResolutions} = req.body


    if (!title || typeof title !== 'string' || title.trim().length > 40) {

        postErrors.errorsMessages.push({message: 'Incorrect title!', field: 'title'})

    }

    if (!author || typeof author !== 'string' || author.trim().length > 20) {
        postErrors.errorsMessages.push({message: 'Incorrect author!', field: 'author'})
    }


    if (Array.isArray(availableResolutions)) {
        availableResolutions.forEach(r => {
            if (!AvailableResolutions.includes(r)) {
                postErrors.errorsMessages.push({message: 'Incorrect resolution', field: 'availableResolutions'})
                return
            }
        })
    } else {
        availableResolutions = []
    }


    if (postErrors.errorsMessages.length) {
        res.status(400).send(postErrors)
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

    const putErrors: ErrorType = {
        errorsMessages: []
    }
    const foundedVideo = videos.find(v => v.id === +req.params.id)
    if (!foundedVideo) {
        res.sendStatus(404)
        return
    } else {


        let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body

        if (Array.isArray(availableResolutions)) {
            const validResolutions = availableResolutions.every(r => AvailableResolutions.includes(r));
            if (!validResolutions) {
                putErrors.errorsMessages.push({message: 'Incorrect resolution', field: 'availableResolutions'});
            }
        } else {
            putErrors.errorsMessages.push({
                message: 'Available resolutions must be an array',
                field: 'availableResolutions'
            });
        }


        if (!title || typeof title !== 'string' || title.trim().length > 40) {
            putErrors.errorsMessages.push({message: 'Incorrect title!', field: 'title'})
        }

        if (!author || typeof author !== 'string' || author.trim().length > 20) {
            putErrors.errorsMessages.push({message: 'Incorrect author!', field: 'author'})
        }

        if (canBeDownloaded && typeof canBeDownloaded !== 'boolean') {
            putErrors.errorsMessages.push({message: 'Incorrect can be downloaded!', field: 'canBeDownloaded'})
        }

        if (minAgeRestriction && typeof minAgeRestriction !== 'number' || minAgeRestriction > 18 || minAgeRestriction < 0) {
            putErrors.errorsMessages.push({message: 'Incorrect minAgeRestriction', field: 'minAgeRestriction'})
        }

        const isValidDate = (dateString: string) => {
            const dateObject = new Date(dateString);
            return !isNaN(dateObject.getTime());
        }

        if (publicationDate !== undefined && typeof publicationDate !== 'string' || !isValidDate(publicationDate)) {
            putErrors.errorsMessages.push({message: 'Incorrect publicationDate', field: 'publicationDate'});
        }


        if (putErrors.errorsMessages.length) {
            res.status(400).send(putErrors)
            return
        }


        foundedVideo.title = title
        foundedVideo.author = author
        foundedVideo.availableResolutions = availableResolutions
        foundedVideo.canBeDownloaded = canBeDownloaded
        foundedVideo.minAgeRestriction = minAgeRestriction
        foundedVideo.publicationDate = publicationDate


        res.status(204).send(foundedVideo)
    }


})