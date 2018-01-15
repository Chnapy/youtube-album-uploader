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

    function addDoublePath(filepath) {
        var doublePath = {
            music: filepath,
            cover: cRelative
                ? path.join(filepath, cPaths[0])
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

        if (recursive) {
            fs.recurseSync(apath, function (filepath, relative, filename) {
                if (filename) {
                    // it's file
                    var valExt = path.extname(filepath);
                    for (var i = 0; i < extensions.length; i++) {
                        if (valExt.toLowerCase() === '.' + extensions[i].toLowerCase()) {
                            addDoublePath(path.join(filepath));
                            break;
                        }
                    }
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
                var valExt = path.extname(filepath);
                for (var i = 0; i < extensions.length; i++) {
                    if (valExt.toLowerCase() === '.' + extensions[i].toLowerCase()) {
                        addDoublePath(path.join(apath, filepath));
                        break;
                    }
                }
            });
        }

    });

    if (!run) {
        return false;
    }
    return doublePaths;
};