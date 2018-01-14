#! /usr/bin/env node

/**
 * Main file of application. Giving a path to a folder of mp3s,
 * tries to concat them together, create a video, and upload it to youtube.
 * @example youtube-album-uploader "/path/to/music/folder"
 * @example node index.js "/path/to/music/folder"
 */

var DEFAULT_PROPS = {
    help: undefined,
    albumPaths: [],
    albumRecursive: false,
    coverPaths: [],
    coverPathsRelative: false,
    output: 'multiple',
    title: '{filename}',
    desc: '{filename}',
    outputDir: 'yaumExport',
    credentials: 'credentials.json'
};

var LIEN_PROPS = {
    host: 'localhost',
    port: 5994
};

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
    upload = require('./upload');

module.exports = function start(argv, finalCallback) {

    var userProps = Object.assign({}, DEFAULT_PROPS, propsFromArgv(argv));
    if (!checkProps(userProps)) {
        return false;
    }

    console.log('props checked');

    if (userProps.output === 'allinone') {
        allinone(userProps);
    } else {
        return multiple(userProps);
    }

    function checkProps(props) {
        if (props.error) {
            console.log(props.error);
            return false;
        }
        if (props.help) {
            console.log(props.help);
            return false;
        }
        if (!props.albumPaths.length) {
            //aucun path renseigné
            console.log('albumPaths error');
            return false;
        }
        if (!props.coverPaths.length) {
            //aucun path renseigné
            console.log('coverPaths error');
            return false;
        }
        if (props.coverPathsRelative && props.coverPaths.length > 1) {
            console.log('coverPathsRelative error');
            //un unique path est requis
            return false;
        }
        if (props.output === 'allinone' && props.coverPaths.length > 1) {
            //un unique path est requis
            console.log('output error');
            return false;
        }
        return true;
    }

    /**
     * Removes any temporary files
     */
    function cleanUp(path) {
        if (fs.lstatSync(path).isFile()) {
            fs.unlink(path);
        }
        // if (fs.lstatSync('album.mp4').isFile()) {
        //     fs.unlink('album.mp4');
        // }
    }

    function multiple(props) {
        console.log('\nGO\n')
        var paths = allPaths(props);
        if (!paths) {
            return false;
        }

        try {
            fs.mkdirSync(props.outputDir);
        } catch (err) {
        }

        // console.log('Get album infos...', paths);

        return new Promise(function (mainResolve, mainRevert) {

            return Promise.all(paths.map(function (dPath) {
                return new Promise(function (resolve, revert) {
                    // console.log('infos...', dPath);
                    albumInfo(dPath.music, dPath.cover)
                        .then(function (albumData) {
                            console.log('then', albumData);
                            if (!albumData) {
                                revert('Could not read metadata of mp3s in given path.');
                                return;
                            }

                            // console.log('Get infos of' + dPath.music + '...');

                            var basename = path.basename(dPath.music, path.extname(dPath.music));

                            var outputPath = path.join(props.outputDir, basename + '.mp4');

                            console.log('Creating video of ' + dPath.music + ' to ' + outputPath + ' (this will take awhile)...');
                            convert(albumData.albumArt, dPath.music, outputPath, function (err, convertSuccess) {
                                if (err) {
                                    cleanUp(outputPath);
                                    revert(err);
                                    return;
                                }

                                resolve({
                                    outputPath: outputPath,
                                    basename: basename
                                });

                                // console.log('Uploading Video...');
                                //
                                // var uploadOptions = {
                                //     title: props.title.replace(/({filename})/g, basename),
                                //     description: props.desc.replace(/({filename})/g, basename)
                                // };
                                //
                                // var server = new Lien(LIEN_PROPS);
                                //
                                // auth(server, props, function(err, tokens) {
                                //     upload(server, props, outputPath, function (err, videoObj) {
                                //         if (err) {
                                //             cleanUp(outputPath);
                                //             revert(err);
                                //             return;
                                //         }
                                //         console.log('Video uploaded successfully!');
                                //         // cleanUp(outputPath);
                                //
                                //         resolve(convertSuccess);
                                //     });
                                // });
                            });
                        })
                        .catch(function (err) {
                            console.log('catch', err);
                            revert(err);
                        });
                    // console.log('ai', ai);
                });
            }))
                .then(function (data) {

                    console.log('All videos are created.');
                    console.log('It\'s time to upload them to youtube. Please give us the auth.');

                    var server = new Lien(LIEN_PROPS);

                    auth(server, props, function (err, lien) {

                        console.log('You are auth yeah ! All upload will begin.');

                        data.forEach(function (out) {

                            var uploadOptions = {
                                title: props.title.replace(/({filename})/g, out.basename),
                                description: props.desc.replace(/({filename})/g, out.basename)
                            };

                            upload(lien, uploadOptions, out.outputPath, function (err, videoObj) {
                                if (err) {
                                    cleanUp(out.outputPath);
                                    revert(err);
                                    return;
                                }
                                console.log('Video uploaded successfully!');
                                // cleanUp(outputPath);

                                mainResolve(videoObj);
                            });

                        });
                    });

                })
                .catch(function (err) {
                    mainRevert(err);
                });
        });
    }

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