var Youtube = require("youtube-api"),
    Fs = require("fs"),
    Lien = require("lien");

/**
 * Upload a video to Youtube, then call the callback.
 *
 * @param {Lien} lien
 * @param {object} options
 * @param {string} videoPath (eg. video.mp4)
 * @param {function} callback
 */
module.exports = function (lien, options, videoPath, callback) {

    var title = options.title,
        description = options.description,
        privacyStatus = options.privacyStatus,
        tags = options.tags,
        categoryId = options.categoryId;

    // Finally upload the video! Yay!
    Youtube.videos.insert({
        resource: {
            // Video title and description
            snippet: {
                title: title,
                description: description,
                tags: tags,
                categoryId: categoryId
            },
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
