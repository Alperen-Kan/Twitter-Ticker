const secrets = require("./secrets");
const https = require("https");

module.exports.getToken = function(callback) {
    // this function gets the bearerToken from twitter
    // this we will write in class

    let creds = `${secrets.Key}:${secrets.Secret}`;
    let encodedCreds = Buffer.from(creds).toString("base64");

    const options = {
        host: "api.twitter.com",
        path: "/oauth2/token",
        method: "POST",
        headers: {
            Authorization: `Basic ${encodedCreds}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
    };

    const cb = function(response) {
        if (response.statusCode != 200) {
            // this means that something has gone wrong...
            // maybe wrong creds?
            callback(response.statusCode);
            return;
        }

        let body = "";

        response.on("data", function(chunk) {
            body += chunk;
        });

        response.on("end", function() {
            // console.log("body when response is finished: ", body);
            let parsedBody = JSON.parse(body);
            console.log("parsedBody.access_token: ", parsedBody.access_token);
            callback(null, parsedBody.access_token);
        });
    };

    const req = https.request(options, cb);

    req.end("grant_type=client_credentials");
};



module.exports.getTweets = function(bearerToken, screen_name, callback) {
    // this function will use the token to get tweets from twitter.
    // you will write this yourself

    const qs = `?screen_name=${screen_name}&tweet_mode=extended`;

    const options = {
        host: "api.twitter.com",
        path: `/1.1/statuses/user_timeline.json${qs}`,
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    };

    console.log("request url: ", options.host+options.path);

    const cb = (response) => {
        if (response.statusCode != 200) {
            callback(response.statusCode);
            return;
        }

        let body = "";

        response.on("data", function(chunk) {
            body += chunk;
        });

        response.on("end", function() {
            // console.log("body when response is finished: ", body);
            let parsedBody = JSON.parse(body);
            // console.log("parsedBody: ", parsedBody);
            callback(null, parsedBody);
        });
    };

    const req = https.request(options, cb);
    req.end();
};


module.exports.filterTweets = function(tweets) {
    // this function will filter tweets (clean up)/
    // this is after for you to complete
    const filteredTweets = [];

    for (let i = 0; i < tweets.length; i++) {
        let t = tweets[i];
        let headline;
        let url;
        // console.log(t);

        if (t.entities.urls.length == 1) {
            headline = t.full_text.replace(t.entities.urls[0].url, "");
            url = t.entities.urls[0].url;

            if (t.entities.media) {
                for (var j = 0; j < t.entities.media.length; j++) {
                    headline = headline.replace(t.entities.media[j].url, "");
                }
            }
            if (headline.length > 0) {
                let screen_name = t.user.name;
                headline = headline + ` (${screen_name})`;
                filteredTweets.push({"url": url, "headline": headline});
            }
        }
    }

    return filteredTweets;
};
