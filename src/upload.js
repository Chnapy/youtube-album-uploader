var Youtube = require("youtube-api"),
    fs = require("fs"),
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
    var req = Youtube.videos.insert({
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
            body: fs.createReadStream(videoPath)
        }
    }, function (err) {
        if (err) {
            console.error(err);
            lien.end(err, 400);
            callback(err);
        }
    });

    var fileSize = fs.statSync(videoPath).size;
    // show some progress
    var id = setInterval(function () {
        var uploadedBytes = req.req.connection._bytesDispatched;
        var uploadedMBytes = uploadedBytes / 1000000;
        var progress = uploadedBytes > fileSize
            ? 100 : (uploadedBytes / fileSize) * 100;
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write('\t' + videoPath + ' ..... ' + progress + '% - ' + uploadedMBytes.toFixed(2) + '/' + (fileSize / 1000000).toFixed(2) + 'MBs uploaded.');
        if (progress === 100) {
            process.stdout.write('\n\t' + videoPath + ' ..... Done.\n');
            clearInterval(id);
            callback();
        }
    }, 1000);
};
