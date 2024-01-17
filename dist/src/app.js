"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableResolutions = exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.AvailableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
let videos = [
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
];
exports.app.get('/', (req, res) => {
    res.send("Hello").status(200);
});
exports.app.get('/videos', (req, res) => {
    res.send(videos);
});
exports.app.delete('/testing/all-data', (req, res) => {
    videos = [];
    res.sendStatus(204);
});
exports.app.get('/videos/:id', (req, res) => {
    const foundedVideo = videos.find(v => v.id === +req.params.id);
    if (!foundedVideo) {
        res.sendStatus(404);
        return;
    }
    res.send(foundedVideo);
});
exports.app.delete('/videos/:id', (req, res) => {
    const foundedVideo = videos.find(v => v.id === +req.params.id);
    if (!foundedVideo) {
        res.sendStatus(404);
        return;
    }
    videos = videos.filter(v => v.id !== foundedVideo.id);
    console.log(videos);
    res.sendStatus(204).send("Video Deleted");
});
exports.app.post('/videos', (req, res) => {
    const errors = {
        errorMessages: []
    };
    let { title, author, availableResolutions } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length > 40) {
        errors.errorMessages.push({ message: 'Incorrect title!', field: 'title' });
    }
    if (!author || typeof author !== 'string' || author.trim().length > 20) {
        errors.errorMessages.push({ message: 'Incorrect author!', field: 'author' });
    }
    console.log(errors);
    if (Array.isArray(availableResolutions)) {
        availableResolutions.forEach(r => {
            if (!exports.AvailableResolutions.includes(r)) {
                errors.errorMessages.push({ message: 'Incorrect resolution', field: 'availableResolutions' });
                return;
            }
        });
    }
    else {
        availableResolutions = [];
    }
    if (errors.errorMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(createdAt.getDate() + 1);
    const newVideo = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
exports.app.put('/videos/:id', (req, res) => {
    const foundedVideo = videos.find(v => v.id === +req.params.id);
    if (!foundedVideo) {
        res.sendStatus(404);
        return;
    }
    res.send(videos);
});
