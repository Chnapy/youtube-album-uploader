var fs = require('fs');
var path = require('path');

/**
 * Searches directory for files with given extension.
 * callback returns list of matching filenames in directory.
 * @param {string} directory (eg. /path/to/music)
 * @param {string | string[]} extension (eg. 'mp3' or ['mp3', 'wav'])
 * @param {filterFileList~requestCallback} callback
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

/**
 * This callback is displayed as part of the filterFileList class.
 * @callback filterFileList~requestCallback
 * @param {null|*} err
 * @param {array} data list of found file names
 */