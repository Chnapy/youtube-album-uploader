#! /usr/bin/env node

/**
 * Main file of application. Giving a path to a folder of mp3s,
 * tries to concat them together, create a video, and upload it to youtube.
 * @example youtube-album-uploader "/path/to/music/folder"
 * @example node index.js "/path/to/music/folder"
 */

// var DEFAULT_PROPS = {
//     help: undefined,
//     albumPaths: [],
//     albumRecursive: false,
//     coverPaths: [],
//     coverPathsRelative: false,
//     output: 'multiple'
// };
//
// var concatMp3s = require('./src/concatMp3s'),
//     propsFromArgv = require('./src/propsFromArgv'),
//     albumInfo = require('./src/albumInfo'),
//     createVideoDescription = require('./src/createVideoDescription'),
//     convert = require('./src/convert'),
//     fs = require('fs'),
//     path = require('path'),
//     upload = require('./src/upload');
//
// function start(argv) {
//
//     var userProps = Object.assign({}, DEFAULT_PROPS, propsFromArgv(argv));
//     if (!checkProps(userProps)) {
//         return;
//     }
//
//     var albumDir = argv[2];
//     if (albumDir === undefined) {
//         console.log('Missing required path to album!');
//         return;
//     }
//
//     function checkProps(props) {
//         if (props.error) {
//             console.log(props.error);
//             return false;
//         }
//         if (props.help) {
//             console.log(props.help);
//             return false;
//         }
//         if (!props.albumPaths.length) {
//             //aucun path renseigné
//             return false;
//         }
//         if (!props.coverPaths.length) {
//             //aucun path renseigné
//             return false;
//         }
//         if (props.coverPathsRelative && props.coverPaths.length > 1) {
//             //un unique path est requis
//             return false;
//         }
//         if (props.output === 'allinone' && props.coverPaths.length > 1) {
//             //un unique path est requis
//             return false;
//         }
//     }
//
//     /**
//      * Removes any temporary files
//      */
//     function cleanUp() {
//         if (fs.lstatSync('album.mp3').isFile()) {
//             fs.unlink('album.mp3');
//         }
//         if (fs.lstatSync('album.mp4').isFile()) {
//             fs.unlink('album.mp4');
//         }
//     }
//
//
//     albumInfo(albumDir, function (err, albumData) {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         if (!albumData) {
//             console.log('Could not read metadata of mp3s in given directory.');
//             return;
//         }
//
//         console.log('Creating video (this will take awhile)...');
//         concatMp3s(albumDir, 'album.mp3', function (err, concatSuccess) {
//             if (err) {
//                 console.log(err);
//                 cleanUp();
//                 return;
//             }
//
//             convert(albumData.albumArt, 'album.mp3', 'album.mp4', function (err, convertSuccess) {
//                 if (err) {
//                     console.log(err);
//                     cleanUp();
//                     return;
//                 }
//
//                 console.log('Uploading Video...');
//
//                 var uploadOptions = {
//                     title: albumData.artist + " - " + albumData.album + ' [FULL ALBUM]',
//                     description: createVideoDescription(albumData.tracks)
//                 };
//
//                 upload('credentials.json', 'album.mp4', uploadOptions, function (err, videoObj) {
//                     if (err) {
//                         console.log(err);
//                         cleanUp();
//                         return;
//                     }
//                     console.log('Video uploaded successfully!');
//                     cleanUp();
//                 });
//             });
//         });
//     });
//
// }

var start = require('./src/start');

start(process.argv);