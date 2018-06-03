"use strict";

var express = require('express');
var app = express();
const path = require("path");
var fs = require('fs');

// external requests
var request = require('request-promise');
var url = require('url');
var querystring = require('querystring');
var http = require('http');

// jsdom
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));
app.set('trust proxy', true);

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

// YOUTUBE API AUTH
let ytToken = "abc";
const ytRedir = "http://localhost:8080/api/yt-auth";
let uploadPlaylist = "123";
let ytUploads = [];

// ALL API REQUESTS GO HERE, DO NOT MAKE views/pages/api/
// app.get('/api/*', function(req, res) {
//
//     res.send("APIIIII!!\n");
// });

// Request that does not match api/ folder,
// Attempts to grab the html from views/pages/
app.get(/^(?!\/api\/)/, function(req, res){
    let purl = url.parse(req.url, true);
    let pathname = 'pages' + purl.pathname;

     if((pathname)[pathname.length - 1] == '/') {
         pathname += 'index';
     }
     res.render(pathname, purl.query);
});

app.get('/api/redir', function(req, res) {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    //res.status(200).send("REDIRRRRRR");
    return request({
        "method": "GET",
      "uri": "http://api.ipstack.com/" + ip + "?access_key=7a580c7a660c0e54158725e9c8aaff6d",
      "json": true,
      "resolveWithFullResponse": true,
  }).then(function(response) {
        let country = response.body.country_code;
        let type = req.query.type;

        if(type == null) {
            res.status(400).send("NULLLL type");
        }
        else {
            type = type.substring(1, type.length - 1);

            let links = [ ["GPU","https://www.amazon.ca/gp/product/B01KMVHB6M/ref=as_li_tl?ie=UTF8&camp=15121&creative=330641&creativeASIN=B01KMVHB6M&linkCode=as2&tag=devoncrawford-20&linkId=e224ff8d8df8b445b63aa5bc0ec2f7d9"],
                ["CPU","https://www.amazon.ca/gp/product/B0759FKH8K/ref=as_li_tl?ie=UTF8&camp=15121&creative=330641&creativeASIN=B0759FKH8K&linkCode=as2&tag=devoncrawford-20&linkId=8e1f7272e80712d083f6c9bc791577cb"],
                ["RAM","https://www.amazon.ca/gp/product/B0065HOT2W/ref=as_li_tl?ie=UTF8&camp=15121&creative=330641&creativeASIN=B0065HOT2W&linkCode=as2&tag=devoncrawford-20&linkId=24b40e6b6c30654a783853ce49867686"],
                ["MOTH","https://www.amazon.ca/gp/product/B01NAK6CG2/ref=as_li_tl?ie=UTF8&camp=15121&creative=330641&creativeASIN=B01NAK6CG2&linkCode=as2&tag=devoncrawford-20&linkId=de7f2a63707a82ad8cb4abac5f969c80"],
                ["CASE","https://www.amazon.ca/gp/product/B00Q2Z143Y/ref=as_li_tl?ie=UTF8&camp=15121&creative=330641&creativeASIN=B00Q2Z143Y&linkCode=as2&tag=devoncrawford-20&linkId=1f401232237c231e42e7132eb9bb72a2"],
                ["HDD","https://www.amazon.ca/gp/product/B00FJRS628/ref=as_li_tl?ie=UTF8&camp=15121&creative=330641&creativeASIN=B00FJRS628&linkCode=as2&tag=devoncrawford-20&linkId=4f586507c6826001d87f446c62855f3b"],
                ["SINK","https://www.amazon.ca/gp/product/B005O65JXI/ref=as_li_tl?ie=UTF8&camp=15121&creative=330641&creativeASIN=B005O65JXI&linkCode=as2&tag=devoncrawford-20&linkId=0031b81eef4e31b9ebad745e8ac9f918"],
                ["PSU","https://www.amazon.ca/gp/product/B01MRW2K7E/ref=as_li_tl?ie=UTF8&camp=15121&creative=330641&creativeASIN=B01MRW2K7E&linkCode=as2&tag=devoncrawford-20&linkId=48370bcba806c2a46a0680429f35e01a"],
                ["SSD","https://www.amazon.ca/gp/product/B00LMXBOP4/ref=as_li_tl?ie=UTF8&camp=15121&creative=330641&creativeASIN=B00LMXBOP4&linkCode=as2&tag=devoncrawford-20&linkId=ab934c33b609f5f10cbd9b93f8206f3d"],
                ["DSLR","https://www.amazon.ca/gp/product/B00T3ER7QO/ref=as_li_tl?ie=UTF8&camp=15121&creative=330641&creativeASIN=B00T3ER7QO&linkCode=as2&tag=devoncrawford-20&linkId=232923fc49a8c9cae6d0971eabeb5dac"],
                ["G7X","https://www.amazon.ca/gp/product/B01BV14OXA/ref=as_li_tl?ie=UTF8&camp=15121&creative=330641&creativeASIN=B01BV14OXA&linkCode=as2&tag=devoncrawford-20&linkId=8096c580be6895fc35f9f2cbc1c48302"],
                ["HERO","https://www.amazon.ca/gp/product/B01M14ATO0/ref=as_li_tl?ie=UTF8&camp=15121&creative=330641&creativeASIN=B01M14ATO0&linkCode=as2&tag=devoncrawford-20&linkId=54236f0a68af94934e57b73fba44698d"],
                ["MAVI","https://www.amazon.ca/gp/product/B01LZ8QTSU/ref=as_li_tl?ie=UTF8&camp=15121&creative=330641&creativeASIN=B01LZ8QTSU&linkCode=as2&tag=devoncrawford-20&linkId=54de15f9910ddc8f7cfda1f7021f9d68"],
                ["2415","https://www.amazon.ca/gp/product/B006C661JK/ref=as_li_tl?ie=UTF8&camp=15121&creative=330641&creativeASIN=B006C661JK&linkCode=as2&tag=devoncrawford-20&linkId=247fd5f709518e90939187070c4b2eab"],
                ["RODE","https://www.amazon.ca/gp/product/B00YAZHRZM/ref=as_li_tl?ie=UTF8&camp=15121&creative=330641&creativeASIN=B00YAZHRZM&linkCode=as2&tag=devoncrawford-20&linkId=9730c5dd15878d9311ff166d4d43c3b0"],
                ["1116","https://www.amazon.ca/gp/product/B007ORXEIW/ref=as_li_tl?ie=UTF8&camp=15121&creative=330641&creativeASIN=B007ORXEIW&linkCode=as2&tag=devoncrawford-20&linkId=07ff8fa9708e13bdb8f41de6cda4e993"],
                ["LED","https://www.amazon.ca/gp/product/B018X04ES2/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B018X04ES2&linkCode=as2&tag=devoncrawford-20&linkId=3eaabffbf62d03bcdf4937f2d7c85848"],
                ["ARDU","https://www.amazon.ca/gp/product/B01EWOE0UU/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B01EWOE0UU&linkCode=as2&tag=devoncrawford-20&linkId=4ec914157b8eea949cd43b8125a2ddd5"] ];

            let localLink = null;

            for(let i = 0; i < links.length; i++) {
                let c = links[i];
                if(c[0] === type) {
                    localLink = convLocalLink(c[1], country, type);
                    res.redirect(localLink);
                    break;
                }
            }
            if(!localLink) {
                res.status(400).send();
            }
        }
    });
});

app.get('/api/testing', function(req, res) {
    res.status(200).send("Hello world!");
});

function convLocalLink(link, country, type) {
    if(country == "US" || (country != "US" && country != "CA")) {
        if(type == "2415") {
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
app.get('/api/email/:name?/:email?/:subject?/:message?', function(req, res) {
    console.log(req.name);
    console.log(req.email);
    console.log(req.subject);
    console.log(req.message);

});

app.get('/api/fetchDesc/:dir*', function(req, res) {
    let file = 'views/pages/' + req.params.dir + req.params[0] + '/index.ejs';
    fs.readFile(file, 'utf8', function(err, data) {
        if(err) {
            res.status(400).send("ERRORRRR");
        }
        else {
            const dom = new JSDOM(data);
            let desc = dom.window.document.querySelector("#desc").innerHTML;
            let len = 300;
            if(desc.length > len) {
                desc = desc.substring(0,len) + " ..";
            }
            res.status(200).send(desc);
        }
    });
});

app.get('/api/yt-auth', function(req, res) {
    let urlParse = url.parse(req.url, true);
    let authCode = urlParse.query.code;
    let json = JSON.parse(fs.readFileSync("YouTubeMod/client_secret.json"));

    if(json == null) {
        return res.status(400).send("client_secret.json is invalid");
    }
    json = json.web;

    if(authCode == null) {
        let scope = "https://www.googleapis.com/auth/youtubepartner";
        let access = "online";
        let uri = json.auth_uri + "?scope=" + scope +
            "&access_type=" + access + "&include_granted_scopes=true&state=state_parameter_"+
            "passthrough_value&redirect_uri=" + ytRedir + "&response_type=code&client_id=" + json.client_id;
        res.redirect(uri);
    }
    else {
        request.post({url:json.token_uri, form: {
            code: authCode,
            client_id: json.client_id,
            client_secret: json.client_secret,
            redirect_uri: ytRedir,
            grant_type: 'authorization_code'
        }}, function(err,httpResponse,body){
            if(err) {
                return res.status(400).send("ERORRORR AUTH THE YOUTUBESS");
            }
            ytToken = (JSON.parse(body)).access_token;
            res.redirect('/software/yt-desc/app/');
        });
    }
});

app.get('/api/yt-desc/channel', function(req, res) {
    request({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/channels',
        qs: {
            access_token: ytToken,
            part: 'snippet,contentDetails,statistics',
            mine: true
        }
    }, function(error, response, body) {
        let apiErr = null;
        try {
            if(error) {
                return res.status(400).send("ERORRORR AUTH THE YOUTUBESS");
            }
            let json = JSON.parse(response.body);
            apiErr = json.error;

            if(apiErr) {
                var err = new Error('/api/yt-auth');
                throw err;
            }
            uploadPlaylist = json.items[0].contentDetails.relatedPlaylists.uploads;
            res.status(200).send(response);
        } catch (err) {
            console.log("There was an error stay calm");
            res.status(apiErr.code).send(ytRedir);
        }
    });
});


app.get('/api/yt-desc/uploads/:range/:nextPageToken/:all', function(req, res) {
    let params = {
        access_token: ytToken,
        part: 'snippet,contentDetails,status',
        playlistId: uploadPlaylist,
        maxResults: req.params.range
    };
    if(req.params.nextPageToken === 'first') {
        ytUploads = [];
    }
    else {
        params.pageToken = req.params.nextPageToken;
    }

    request({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/playlistItems',
        qs: params
    }, function(error, response, body) {
        if(error) {
            return res.status(400).send("ERORRORR AUTH THE YOUTUBESS");
        }
        let json = JSON.parse(response.body);
        let range = parseInt(req.params.range);

        for(let i = 0; (i < range) && (ytUploads.length < req.params.all); i++) {
            let vid = json.items[i];
            if(vid == null) {
                break;
            }
            ytUploads.push(json.items[i]);
        }
        // console.log(json.items.length + " === " + range + "; " + ytUploads.length);

        if((ytUploads.length == req.params.all) || json.nextPageToken == null) {
            res.status(200).send(ytUploads);
        }
        else {
            res.redirect('/api/yt-desc/uploads/' + range + '/' + json.nextPageToken + '/' + req.params.all);
        }
    });
});

app.get('/api/yt-desc/uploadRange/:startId/:endId/:nextPageToken', function(req, res) {
    let params = {
        access_token: ytToken,
        part: 'snippet,contentDetails,status',
        playlistId: uploadPlaylist,
        maxResults: '50'
    };
    if(req.params.nextPageToken === 'first') {
        ytUploads = [];
    }
    else {
        params.pageToken = req.params.nextPageToken;
    }

    request({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/playlistItems',
        qs: params
    }, function(error, response, body) {
        if(error) {
            return res.status(400).send("ERORRORR AUTH THE YOUTUBESS");
        }
        let json = JSON.parse(response.body);
        let startFlag = false;
        let endFlag = false;

        for(let i = 0; !endFlag; i++) {
            let vid = json.items[i];
            if(vid == null) {
                break;
            }
            let id = vid.snippet.resourceId.videoId;
            if(!startFlag && (id === req.params.startId)) {
                startFlag = true;
            }
            if(id === req.params.endId) {
                endFlag = true;
            }
            if(startFlag) {
                ytUploads.push(json.items[i]);
            }
        }
        // console.log(json.items.length + " === " + range + "; " + ytUploads.length);

        if(endFlag || json.nextPageToken == null) {
            if(!endFlag) {
                ytUploads = [];
            }
            res.status(200).send(ytUploads);
        }
        else {
            res.redirect('/api/yt-desc/uploadRange/' + req.params.startId + '/' + req.params.endId + '/' + json.nextPageToken);
        }
    });
})