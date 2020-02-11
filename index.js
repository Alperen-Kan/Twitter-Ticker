const express = require("express");
const {promisify} = require("util");
const app = express();

const { getToken, getTweets, filterTweets } = require("./twitter.js");

const getTokenProm = promisify(getToken);
const getTweetsProm = promisify(getTweets);

app.use(express.static("./ticker"));

app.get("/data.json", (req, res) => {
    console.log("request for json received");
    // 4 things we want to do

    // 1. We need to get a bearerToken from twitter.
    getTokenProm().then(token => {
        console.log("bearerToken in index.js!!", token);

        return Promise.all([
            getTweetsProm(token, "bbcworld"),
            getTweetsProm(token, "nytimes"),
            getTweetsProm(token, "forbes")
        ]);
    }).then(results => {
        let bbcworld = results[0];
        let nytimes = results[1];
        let forbes = results[2];

        // Optiions to merge arrays into one big array

        // Option #1: concat
        // let mergedResults = bbcworld.concat(nytimes, forbes);

        // Option #2: spread operator
        let mergedResults = [...bbcworld, ...nytimes, ...forbes];

        let sorted = mergedResults.sort((a, b) => {
            // b - a : reverse chronological order (new -> old)
            // a - b : chronological order (old -> new)
            return new Date(b.created_at) - new Date(a.created_at);
        });

        res.json(filterTweets(sorted));

    }).catch(err => console.log("error in catch:", err));
});

app.listen(8080, () => console.log(
    "twitter ticker up and running"
));




// Backup of callback version
// app.get("/data.json", (req, res) => {
//     console.log("request for json received");
//
//     // 4 things we want to do
//
//     // 1. We need to get a bearerToken from twitter.
//     getToken(function(err, bearerToken) {
//         if (err) {
//             console.log("error in getToken:", err);
//             return;
//         }
//         console.log("bearerToken in index.js!!", bearerToken);
//         // 2. With the bearerToker, we can ask for tweets.
//         getTweets(bearerToken, function(err, tweets) {
//             if (err) {
//                 console.log("error in getTweets:", err);
//                 return;
//             }
//             // 3. Once we have the tweets, we can tidy them up (filter them).
//             const filteredTweets = filterTweets(tweets);
//             console.log("filteredTweets:", filteredTweets);
//             // 4. Send some json back as a response...
//             res.json(filteredTweets);
//         });
//     });
// });
