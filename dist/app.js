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
exports.app.get('/videos', (req, res) => {
    res.send(videos);
});
exports.app.get('/videos/:id', (req, res) => {
    const foundedVideo = videos.find(v => v.id === +req.params.id);
    if (!foundedVideo) {
        res.sendStatus(404);
        return;
    }
    res.send(foundedVideo);
});
exports.app.post('/videos', (req, res) => {
    const { title, author, availableResolutions } = req.body;
});
/*
app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = []
    res.status(204)
})*/
