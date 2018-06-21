"use strict";
// import * as config from './_config/config.js'
const config = require('./_config/config.js');
const express = require('express');
const app = express();
const path = require("path");
const fs = require('fs');

// external requests
const request = require('request-promise');
const url = require('url');
const querystring = require('querystring');
const http = require('http');

// jsdom
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));
app.set('trust proxy', true);

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});

// YOUTUBE API AUTH
let youtubeToken = "abc";
const youtubeRedirect = "http://localhost:8080/api/yt-auth";
let uploadPlaylist = "123";
let youtubeUploads = [];

// ALL API REQUESTS GO HERE, DO NOT MAKE views/pages/api/
// app.get('/api/*', function(req, res) {
//
//     res.send("APIIIII!!\n");
// });

// Request that does not match api/ folder,
// Attempts to grab the html from views/pages/
app.get(/^(?!\/api\/)/, (req, res) => {
    let purl = url.parse(req.url, true);
    let pathname = 'pages' + purl.pathname;

    if ((pathname)[pathname.length - 1] === '/') {
        pathname += 'index';
    }
    res.render(pathname, purl.query);
});

app.get('/api/redir', (req, res) => {
    const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    //res.status(200).send("REDIRRRRRR");
    return request({
        "method": "GET",
        "uri": "http://api.ipstack.com/" + ip + "?access_key=7a580c7a660c0e54158725e9c8aaff6d",
        "json": true,
        "resolveWithFullResponse": true,
    }).then((response) => {
        let country = response.body.country_code;
        let type = req.query.type;

        if (typeof type === 'undefined' || !type) {
            res.status(400).send("NULLLL type");
        }
        else {
            type = type.substring(1, type.length - 1);
            const links = config.links();

            let localLink = null;

            for (let i = 0; i < links.length; i++) {
                let c = links[i];
                if (c[0] === type) {
                    localLink = convLocalLink(c[1], country, type);
                    res.redirect(localLink);
                    break;
                }
            }
            if (!localLink) {
                res.status(400).send();
            }
        }
    });
});

app.get('/api/testing', (req, res) => {
    res.status(200).send('Hello world!');
});

function convLocalLink(link, country, type) {
    if (country === "US" || (country !== "US" && country !== "CA")) {
        if (type === "2415") {
            link = "https://www.amazon.com/Canon-24-105mm-USM-Zoom-Lens/dp/B000B84KAW/ref=sr_1_3?ie=UTF8&qid=1518289159&sr=8-3&tag=devoncrawfo05-20";
        }
        else {
            link = link.replace("www.amazon.ca", "www.amazon.com");
            link = link.replace("tag=devoncrawford-20", "tag=devoncrawfo05-20");
        }
    }
    return link;
}

// TODO EMAILSSSS
app.get('/api/email/:name?/:email?/:subject?/:message?', function (req, res) {
    console.log(req.name);
    console.log(req.email);
    console.log(req.subject);
    console.log(req.message);

});

app.get('/api/fetchDesc/:dir*', (req, res) => {
    let file = 'views/pages/' + req.params.dir + req.params[0] + '/index.ejs';
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            res.status(400).send(`Error: ${err}`);
        }
        else {
            const dom = new JSDOM(data);
            let desc = dom.window.document.querySelector("#desc").innerHTML;
            let len = 300;
            if (desc.length > len) {
                desc = desc.substring(0, len) + " ..";
            }
            res.status(200).send(desc);
        }
    });
});

app.get('/api/yt-auth', (req, res) => {
    let urlParse = url.parse(req.url, true);
    let authCode = urlParse.query.code;
    const uri = (auth_uri, scope, access, youtubeRedirect, clientId) => {
        return `${auth_uri}?scope=${scope}&access_type=${access}&include_granted_scopes=true&state=` +
            `state_parameter_passthrough_value&redirect_uri=${youtubeRedirect}&response_type=code&client_id=${clientId}`;
    };
    let json = JSON.parse(fs.readFileSync("YouTubeMod/client_secret.json"));

    if (typeof json === 'undefined' || !json) {
        return res.status(400).send("client_secret.json is invalid");
    }
    json = json.web;

    if (typeof authCode === 'undefined' || !authCode) {
        let scope = "https://www.googleapis.com/auth/youtubepartner";
        let access = "online";
        // let uri = json.auth_uri + "?scope=" + scope +
        //     "&access_type=" + access + "&include_granted_scopes=true&state=state_parameter_" +
        //     "passthrough_value&redirect_uri=" + ytRedir + "&response_type=code&client_id=" + json.client_id;
        res.redirect(uri(json.auth_uri, scope, access, youtubeRedirect, json.client_id));
    }
    else {
        request.post({
            url: json.token_uri,
            form: {
                code: authCode,
                client_id: json.client_id,
                client_secret: json.client_secret,
                redirect_uri: youtubeRedirect,
                grant_type: 'authorization_code'
            }
        }, (err, httpResponse, body) => {
            if (err) {
                return res.status(400).send(`Authentication error: ${err}`);
            }
            youtubeToken = (JSON.parse(body)).access_token;
            res.redirect('/software/yt-desc/app/');
        });
    }
});

app.get('/api/yt-desc/channel', (req, res) => {
    request({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/channels',
        qs: {
            access_token: youtubeToken,
            part: 'snippet,contentDetails,statistics',
            mine: true
        }
    }, (error, response, body) => {
        let apiErr = null;
        try {
            if (error) {
                return res.status(400).send(`Authentication error: ${error}`);
            }
            let json = JSON.parse(response.body);
            apiErr = json.error;

            //This part is not needed 'cos you handle err in catch

            // if (apiErr) {
            //     let err = new Error('/api/yt-auth');
            //     throw err;
            // }
            uploadPlaylist = json.items[0].contentDetails.relatedPlaylists.uploads;
            res.status(200).send(response);
        } catch (err) {
            console.log(`There was an error: ${err} stay calm`);
            res.status(apiErr.code).send(youtubeRedirect);
        }
    });
});


app.get('/api/yt-desc/uploads/:range/:nextPageToken/:all', (req, res) => {
    let params = {
        access_token: youtubeToken,
        part: 'snippet,contentDetails,status',
        playlistId: uploadPlaylist,
        maxResults: req.params.range
    };

    if (req.params.nextPageToken === 'first') youtubeUploads = [];

    else params.pageToken = req.params.nextPageToken;


    request({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/playlistItems',
        qs: params
    }, function (error, response, body) {
        if (error) {
            return res.status(400).send("ERORRORR AUTH THE YOUTUBESS");
        }
        let json = JSON.parse(response.body);
        let range = parseInt(req.params.range);

        for (let i = 0; (i < range) && (youtubeUploads.length < req.params.all); i++) {
            let vid = json.items[i];
            if (typeof vid === 'undefined' || !vid) break;

            youtubeUploads.push(json.items[i]);
        }
        // console.log(json.items.length + " === " + range + "; " + ytUploads.length);

        if ((youtubeUploads.length === req.params.all) || typeof json.nextPageToken === 'undefined') {
            res.status(200).send(youtubeUploads);
        }
        else {
            res.redirect('/api/yt-desc/uploads/' + range + '/' + json.nextPageToken + '/' + req.params.all);
        }
    });
});

app.get('/api/yt-desc/uploadRange/:startId/:endId/:nextPageToken', (req, res) => {
    let params = {
        access_token: youtubeToken,
        part: 'snippet,contentDetails,status',
        playlistId: uploadPlaylist,
        maxResults: '50'
    };
    if (req.params.nextPageToken === 'first') youtubeUploads = [];

    else params.pageToken = req.params.nextPageToken;

    request({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/playlistItems',
        qs: params
    }, (error, response, body) => {
        if (error) {
            return res.status(400).send("ERORRORR AUTH THE YOUTUBESS");
        }
        let json = JSON.parse(response.body);
        let startFlag = false;
        let endFlag = false;

        for (let i = 0; !endFlag; i++) {
            let vid = json.items[i];
            if (typeof vid === 'undefined') {
                break;
            }
            let id = vid.snippet.resourceId.videoId;
            if (!startFlag && (id === req.params.startId)) {
                startFlag = true;
            }
            if (id === req.params.endId) {
                endFlag = true;
            }
            if (startFlag) {
                youtubeUploads.push(json.items[i]);
            }
        }
        // console.log(json.items.length + " === " + range + "; " + ytUploads.length);

        if (endFlag || typeof json.nextPageToken === 'undefined') {
            if (!endFlag) {
                youtubeUploads = [];
            }
            res.status(200).send(youtubeUploads);
        }
        else res.redirect(`/api/yt-desc/uploadRange/${req.params.startId}/${req.params.endId}/${json.nextPageToken}`);

    });
});