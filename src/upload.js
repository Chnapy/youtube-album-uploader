var Youtube = require("youtube-api"),
    Fs = require("fs"),
    Lien = require("lien");

/**
 * @param {Lien} lien
 * @param {object} options
 * @param {string} videoPath (eg. video.mp4)
 * @param {upload~requestCallback} callback
 */
module.exports = function (lien, options, videoPath, callback) {

    var title = options.title || '';
    var description = options.description || 'video upload via youtube-album-uploader-multiple';
    var privacyStatus = options.privacyStatus || "private";

    // And finally upload the video! Yay!
    Youtube.videos.insert({
        resource: {
            // Video title and description
            snippet: {
                title: title,
                description: description
            },
            // I don't want to spam my subscribers
            status: {
                privacyStatus: privacyStatus
            }
        },
        // This is for the callback function
        part: "snippet,status",
        // Create the readable stream to upload the video
        media: {
            body: Fs.createReadStream(videoPath)
        }
    }, function (err, data) {
        if (err) {
            return lien.end(err, 400);
        }
        callback(err, data);
    });
};

/**
 * This callback is displayed as part of the upload class.
 * @callback upload~requestCallback
 * @param {null|*} err
 * @param {object} data the video resource
 */
