var Youtube = require("youtube-api"),
    Fs = require("fs"),
    ReadJson = require("r-json"),
    Lien = require("lien"),
    Opn = require("opn");

/**
 * @param {Lien} server
 * @param {object} props
 * @param {upload~requestCallback} callback
 */
module.exports = function (server, props, callback) {
    var credentialsPath = props.credentials;

    // Copy the downloaded JSON file in `credentials.json`
    var CREDENTIALS = ReadJson(credentialsPath);

    // Authenticate using the credentials
    var oauth = Youtube.authenticate({
        type: "oauth",
        client_id: CREDENTIALS.web.client_id,
        client_secret: CREDENTIALS.web.client_secret,
        redirect_url: CREDENTIALS.web.redirect_uris[0]
    });

    // Open the authentication url in the default browser
    Opn(oauth.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/youtube.upload"]
    }));

    // Here we're waiting for the OAuth2 redirect containing the auth code
    server.page.add("/oauth2callback", function (lien) {
        //console.log("Trying to get the token using the following code: " + lien.search.code);

        // Get the access token
        oauth.getToken(lien.search.code, function (err, tokens) {
            if (err) {
                lien.end(err, 400);
                callback(err, tokens);
                return console.log(err);
            }

            // Set the credentials
            oauth.setCredentials(tokens);

            callback(null, lien);
        });
    });
};