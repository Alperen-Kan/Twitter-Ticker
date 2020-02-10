const express = require("express");
const app = express();

const { getToken, getTweets, filterTweets } = require("./twitter.js");
// console.log("getToken: ", getToken);

app.use(express.static("./ticker"));

// function logToken(token) {
//     console.log("I need the token to do something..", token);
// }

app.get("/data.json", (req, res) => {
    console.log("request for json received");

    // 4 things we want to do

    // 1. We need to get a bearerToken from twitter.
    getToken(function(err, bearerToken) {
        if (err) {
            console.log("error in getToken:", err);
            return;
        }
        console.log("bearerToken in index.js!!", bearerToken);
        // 2. With the bearerToker, we can ask for tweets.
        getTweets(bearerToken, function(err, tweets) {
            if (err) {
                console.log("error in getTweets:", err);
                return;
            }
            // 3. Once we have the tweets, we can tidy them up (filter them).
            const filteredTweets = filterTweets(tweets);
            console.log("filteredTweets:", filteredTweets);
            // 4. Send some json back as a response...
            res.json(filteredTweets);
        });
    });
});


app.listen(8080, () => console.log(
    "twitter ticker up and running"
));
