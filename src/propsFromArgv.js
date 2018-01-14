/**
 * youtube-album-uploader-multiple --help --albumPaths path1 path2 --albumRecursive true
 *
 * Wait these args:
 * {
 *     help: void;
 *     albumPaths: string[]; default: []
 *     albumRecursive: boolean; default: false
 *     coverPaths: string[]; default: albumPaths
 *     coverPathsRelative: boolean; default: false
 *     output: 'multiple' | 'allinone'; default: 'multiple'
 *     title: string; default: '{filename}'
 *     desc: string; default: '{filename}'
 * }
 *
 * @param argv
 */
module.exports = function (argv) {
    var index = 2;
    var command;
    var temp;
    var tempParams;

    function compute(props) {
        temp = argv[index];
        if (temp === undefined) {
            commandEnd(command, tempParams, props);
            return props;
        }
        if (temp[0] === '-' && temp[1] === '-') {
            if (command) {
                commandEnd(command, tempParams, props);
                if (props.error) {
                    return props;
                }
            }
            tempParams = [];
            command = temp.substr(2);
        } else {
            if (!command) {
                props.error = 'no command. Please use --help if needed.';
                return props;
            }
            tempParams.push(temp);
        }
        index++;
        return compute(props);
    }

    function commandEnd(command, params, props) {
        if (!command) {
            props.error = 'no command specified. Please use --help if needed.';
            return;
        }
        switch (command) {
            case 'help':
                help(params, props);
                break;
            case 'albumPaths':
                albumPaths(params, props);
                break;
            case 'albumRecursive':
                albumRecursive(params, props);
                break;
            case 'coverPaths':
                coverPaths(params, props);
                break;
            case 'coverPathsRelative':
                coverPathsRelative(params, props);
                break;
            case 'output':
                output(params, props);
                break;
            case 'title':
                title(params, props);
                break;
            case 'desc':
                desc(params, props);
                break;
            case 'outputDir':
                outputDir(params, props);
                break;
            default:
                _default(params, props, command);
                break;
        }
    }

    var p = compute({});
    return p;
};

function parseListPath(paths) {
    return paths.map(function (p) {
        return p.trim();
    }).filter(function (p) {
        return p.length > 0
    });
}

function errorParams(props, command) {
    props.error = 'bad params for ' + command + '. Please use --help if needed.';
}

function _default(params, props, command) {
    props.error = 'command not recognized: ' + command + '. Please use --help if needed.';
}

function help(params, props) {
    props.help = 'List of commands:' +
        '\n\t--help\tshow this list\ndon\'t need any arg' +
        '\n\t--albumPaths\tpaths that will be check for the album content\nneed one or more paths';
}

function albumPaths(params, props) {
    params = parseListPath(params);
    if (!params.length) {
        errorParams(props, 'albumPaths');
    } else {
        props.albumPaths = params;
    }
}

function albumRecursive(params, props) {
    if (params.length !== 1) {
        errorParams(props, 'albumRecursive');
    } else {
        if (params[0] === 'true' || params[0] === '1') {
            props.albumRecursive = true;
        } else if (params[0] === 'false' || params[0] === '0') {
            props.albumRecursive = false;
        } else {
            errorParams(props, 'albumRecursive');
        }
    }
}

function coverPaths(params, props) {
    params = parseListPath(params);
    if (!params.length) {
        errorParams(props, 'coverPaths');
    } else {
        props.coverPaths = params;
    }
}

function coverPathsRelative(params, props) {
    if (params.length !== 1) {
        errorParams(props, 'coverPathsRelative');
    } else {
        if (params[0] === 'true' || params[0] === '1') {
            props.coverPathsRelative = true;
        } else if (params[0] === 'false' || params[0] === '0') {
            props.coverPathsRelative = false;
        } else {
            errorParams(props, 'coverPathsRelative');
        }
    }
}

function output(params, props) {
    if (params.length !== 1) {
        errorParams(props, 'output');
    } else {
        if (params[0] === 'multiple' || params[0] === 'allinone') {
            props.output = params[0];
        } else {
            errorParams(props, 'output');
        }
    }
}

function title(params, props) {
    if(!params.length) {
        errorParams(props, 'title');
    } else {
        props.title = params.join(' ');
    }
}

function desc(params, props) {
    if(!params.length) {
        errorParams(props, 'desc');
    } else {
        props.desc = params.join(' ');
    }
}

function outputDir(params, props) {
    if(params.length !== 1) {
        errorParams(props, 'outputDir');
    } else {
        props.outputDir = params[0];
    }
}