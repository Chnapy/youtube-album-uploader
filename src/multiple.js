var concatMp3s = require('./concatMp3s'),
    propsFromArgv = require('./propsFromArgv'),
    allPaths = require('./allPaths'),
    albumInfo = require('./albumInfo'),
    createVideoDescription = require('./createVideoDescription'),
    convert = require('./convert'),
    fs = require('fs'),
    path = require('path'),
    auth = require('./auth'),
    Lien = require("lien"),
    upload = require('./upload'),
    checkProps = require('./checkProps'),
    multiple = require('./multiple');

var CREDITS = 'This video was created and uploaded with youtube-album-uploader-multiple (YAUM).';

/**
 * Function used when --ouput=multiple.
 *
 * @param {object} props
 * @returns {*}
 */
module.exports = function (props) {
    var paths = allPaths(props);
    if (!paths) {
        return false;
    }

    try {
        fs.mkdirSync(props.outputDir);
    } catch (err) {
    }

    return new Promise(function (mainResolve, mainRevert) {

        return Promise.all(paths.map(function (dPath) {
            return new Promise(function (resolve, revert) {
                albumInfo(dPath.music, dPath.cover)
                    .then(function (albumData) {
                        // console.log('then', albumData);
                        if (!albumData) {
                            revert('Could not read metadata of mp3s in given path.');
                            return;
                        }

                        var basename = path.basename(dPath.music, path.extname(dPath.music));

                        var outputPath = path.join(props.outputDir, basename + '.mp4');

                        console.log('Creating video from ' + dPath.music + ' to ' + outputPath + ' (this may take awhile)...');
                        convert(albumData.albumArt, dPath.music, outputPath, function (err, convertSuccess) {
                            if (err || !convertSuccess) {
                                cleanUp(outputPath);
                                revert(err);
                                return;
                            }

                            resolve({
                                outputPath: outputPath,
                                basename: basename
                            });
                        });
                    })
                    .catch(function (err) {
                        // console.log('catch', err);
                        revert(err);
                    });
            });
        }))
            .then(function (data) {

                console.log('All videos are now created (' + data.length + ').');
                console.log();
                console.log('It\'s time to upload them to youtube. Please give us the auth (your browser should open very soon).');

                if (props.noUpload) {
                    console.log('Wait, I see that you don\'t want to upload them. Okay, so we have finished. Bye !');
                    return mainResolve();
                }

                var server = new Lien({
                    host: 'localhost',
                    port: props.port
                });

                auth(server, props, function (err, lien) {

                    console.log('You are auth yeah ! All upload will begin.');
                    console.log();

                    Promise.all(data.map(function (out, index) {

                        return new Promise(function (resolve, revert) {

                            var uploadOptions = {
                                title: props.title.replace(/({filename})/g, out.basename),
                                description: props.desc.replace(/({filename})/g, out.basename).replace(/({credits})/g, CREDITS),
                                privacyStatus: props.privacy,
                                tags: props.tags,
                                categoryId: props.categoryId
                            };

                            console.log('[' + (index + 1) + '/' + data.length + '] Start the upload of ' + out.outputPath + ' ...');
                            console.log();
                            upload(lien, uploadOptions, out.outputPath, function (err) {
                                if (err) {
                                    cleanUp(out.outputPath);
                                    revert(err);
                                    return;
                                }
                                console.log('[' + (index + 1) + '/' + data.length + '] Video uploaded successfully!', out.outputPath);
                                if (props.cleanOnEnd) {
                                    cleanUp(out.outputPath);
                                }

                                resolve();
                            });


                        });
                    }))
                        .then(function () {
                            console.log('\nAll videos were uploaded.');
                            lien.end();
                            mainResolve();
                        })
                        .catch(function (err) {
                            lien.end();
                            mainRevert(err);
                        });
                });

            })
            .catch(function (err) {
                mainRevert(err);
            });
    });
};

/**
 * Removes any temporary files
 */
function cleanUp(path) {
    if (fs.lstatSync(path).isFile()) {
        console.log('Delete file', path);
        fs.unlink(path);
    }
}