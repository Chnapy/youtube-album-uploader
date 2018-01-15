#! /usr/bin/env node

/**
 * Main file of application.
 * Giving args, then act in consequences.
 * @example youtube-album-uploader --albumPaths "my/path" "my/other/path" --coverPaths "cover/path" "other/cover/path"
 */

/**
 * Props by default. Overwritten by the user'props when he call the app.
 *
 * @type {{help: undefined, albumPaths: Array, albumRecursive: boolean, coverPaths: Array, coverPathsRelative: boolean, output: string, title: string, desc: string, outputDir: string, credentials: string}}
 */
var DEFAULT_PROPS = {
    port: 5994,
    help: undefined,
    albumPaths: [],
    albumRecursive: false,
    coverPaths: [],
    coverPathsRelative: false,
    output: 'multiple',
    title: '{filename}',
    desc: '{filename}\n\nThis video was created and uploaded with youtube-album-uploader-multiple (YAUM).',
    privacy: 'private',
    outputDir: 'yaumExport',
    credentials: 'credentials.json',
    cleanOnEnd: true,
    tags: ['YAUM'],
    categoryId: 10,  //Music
    noUpload: false
};

/**
 * Lib and other files
 */
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

/**
 * Main function.
 * Return false if error.
 * @param argv
 * @returns {boolean}
 */
module.exports = function start(argv) {

    var userProps = Object.assign({}, DEFAULT_PROPS, propsFromArgv(argv));
    if (!checkProps(userProps, DEFAULT_PROPS)) {
        return false;
    }

    if (userProps.output === 'allinone') {
        //not working atm
        // allinone(userProps);
        console.warn('--output=allinone doesn\'t work in this version. Please upgrade if possible, or wait :(');
        return false;
    } else {
        return multiple(userProps)
            .then(function () {
                console.log('END WITH SUCCESS.');
            })
            .catch(function () {
                console.log('END WITH FAILURE.');
            });
    }

    /**
     * Removes any temporary files
     */
    function cleanUp(path) {
        if (fs.lstatSync(path).isFile()) {
            fs.unlink(path);
        }
    }

    /**
     * Function used when --ouput=allinone
     *
     * @param {object} props
     */
    function allinone(props) {
        var albumDir = props.albumPaths[0];

        albumInfo(albumDir, 'folder.jpg', true)
            .then(function (err, albumData) {
                if (!albumData) {
                    console.log('Could not read metadata of mp3s in given directory.');
                    return;
                }

                console.log('Creating video (this will take awhile)...');
                concatMp3s(albumDir, 'album.mp3', function (err, concatSuccess) {
                    if (err) {
                        console.log(err);
                        cleanUp();
                        return;
                    }

                    convert(albumData.albumArt, 'album.mp3', 'album.mp4', function (err, convertSuccess) {
                        if (err) {
                            console.log(err);
                            cleanUp();
                            return;
                        }

                        console.log('Uploading Video...');

                        var uploadOptions = {
                            title: albumData.artist + " - " + albumData.album + ' [FULL ALBUM]',
                            description: createVideoDescription(albumData.tracks)
                        };

                        upload('credentials.json', 'album.mp4', uploadOptions, function (err, videoObj) {
                            if (err) {
                                console.log(err);
                                cleanUp();
                                return;
                            }
                            console.log('Video uploaded successfully!');
                            cleanUp();
                            return true;
                        });
                    });
                });
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    return true;

};