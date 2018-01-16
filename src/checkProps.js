var fs = require('fs');
var fileExists = require('./fileExists');

/**
 * Check properties and format them if needed.
 *
 * @param props
 * @param defaultProps
 * @returns {boolean}
 */
module.exports = function (props, defaultProps) {
    if (!check(props)) {
        return false;
    }

    props.albumPaths = Array.from(new Set(props.albumPaths));
    props.coverPaths = Array.from(new Set(props.coverPaths));
    props.tags = Array.from(new Set(props.tags.concat(defaultProps.tags)));

    props.desc = props.desc.replace(/(\\n)/g, '\n');

    if (props.credentials[0] !== '{') {
        //is a file path
        if (!fileExists(props.credentials)) {
            console.log('the credentials file doesn\'t exist', props.credentials);
            return false;
        }
    }

    try {
        var errr = false;
        fs.readdirSync(props.outputDir, function (err, files) {
            if (err) {
                console.log(err);
                errr = true;
            } else if (files.length) {
                console.log('outputDir is not empty', props.outputDir);
                errr = true;
            }
        });
        if (errr) {
            return false;
        }
    } catch (e) {
    }

    return true;
};

function check(props) {
    if (props.error) {
        console.log(props.error);
        return false;
    }
    if (props.help) {
        console.log(props.help);
        return false;
    }
    if (!props.albumPaths.length) {
        //no path
        console.log('albumPaths error');
        return false;
    }
    if (!props.coverPaths.length) {
        //no path
        console.log('coverPaths error');
        return false;
    }
    if (props.coverPathsRelative && props.coverPaths.length > 1) {
        console.log('coverPathsRelative error');
        //only one path is admit
        return false;
    }
    if (props.output === 'allinone' && props.coverPaths.length > 1) {
        //only one path is admit
        console.log('output error');
        return false;
    }
    if (props.port <= 0) {
        console.log('port error');
        return false;
    }
    if (props.parallelProcess <= 0) {
        console.log('parallelProcess error');
        return false;
    }
    return true;
}