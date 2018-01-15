var fs = require('fs');
var path = require('path');

/**
 * Searches directory for files with given extension.
 * callback returns list of matching filenames in directory.
 * Used only in 'allinone' mode.
 *
 * @param {string} directory (eg. /path/to/music)
 * @param {string | string[]} extension (eg. 'mp3' or ['mp3', 'wav'])
 * @param {function} callback
 */
module.exports = function (directory, extension, callback) {
    extension = extension.constructor.name === 'Array' ? extension : [extension];

    fs.readdir(directory, function (err, list) {
        if (err) {
            return callback(err);
        }

        var results = [];
        list.forEach(function (val, index) {
            var valExt = path.extname(val);
            for(var i = 0; i < extension.length; i++) {
                if (valExt.toLowerCase() === '.' + extension[i].toLowerCase()) {
                    results.push(val);
                    break;
                }
            }
        });
        callback(err, results);
    });
};