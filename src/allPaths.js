var fs = require('file-system');
var path = require('path');
var fileExists = require('./fileExists');

/**
 * Get list of all paths of tracks and covers from props.
 *
 * @param {object} props
 * @returns {{music: string, cover: string}[] | false} doublePaths
 */
module.exports = function allPaths(props) {
    var recursive = props.albumRecursive,
        cPaths = props.coverPaths,
        cRelative = props.coverPathsRelative;

    var extensions = ['mp3'];

    var cIndex = 0;
    var doublePaths = [];

    var run = true;

    function addDoublePath(filepath, dirpath) {
        var doublePath = {
            music: filepath,
            cover: cRelative
                ? path.join(dirpath, cPaths[0])
                : cPaths[cIndex % cPaths.length]
        };
        if (!fileExists(doublePath.cover)) {
            console.log('file doesn\'t exist:', doublePath.cover);
            run = false;
        } else {
            doublePaths.push(doublePath);
        }
        cIndex++;
    }

    props.albumPaths.forEach(function (apath) {

        if (!fs.existsSync(apath)) {
            console.log('File or directory doesn\'t exist:', apath);
            run = false;
            return run;
        }

        var computeFile = function (filepath, apath) {
            var valExt = path.extname(filepath);
            for (var i = 0; i < extensions.length; i++) {
                if (valExt.toLowerCase() === '.' + extensions[i].toLowerCase()) {
                    addDoublePath(filepath, apath);
                    return;
                }
            }
            console.log('No file is compatible in ', apath, '. Only files with these extensions can be used: ', extensions);
        };

        if (fileExists(apath)) {
            return computeFile(apath);
        }

        if (recursive) {
            fs.recurseSync(apath, function (filepath, relative, filename) {
                if (filename) {
                    // it's file
                    computeFile(filepath, apath);
                } else {
                    // it's folder
                }
            });
        } else {
            var list;
            try {
                list = fs.readdirSync(apath);
            } catch (err) {
                err = 'file doesn\'t exist ' + err.message;
                console.log(err);
                run = false;
                return run;
            }

            list.forEach(function (filepath) {
                computeFile(path.join(apath, filepath), apath);
            });
        }

    });

    if (!run) {
        return false;
    }
    return doublePaths;
};