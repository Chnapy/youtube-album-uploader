/**
 * @example youtube-album-uploader-multiple --help --albumPaths path1 path2 --albumRecursive true
 *
 * Parse the user arguments and return a properties object.
 *
 * Wait these args (maybe more; check DEFAULT_PROPS in start.js):
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
 * You can simply add a property with his function. Check the 2nd part of the file, you'll understand quickly ;)
 *
 * @param {string[]} argv
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
        if (commandList[command]) {
            commandList[command](params, props);
        } else {
            _default(params, props, command);
        }
        // switch (command) {
        //     case 'help':
        //         help(params, props);
        //         break;
        //     case 'albumPaths':
        //         albumPaths(params, props);
        //         break;
        //     case 'albumRecursive':
        //         albumRecursive(params, props);
        //         break;
        //     case 'coverPaths':
        //         coverPaths(params, props);
        //         break;
        //     case 'coverPathsRelative':
        //         coverPathsRelative(params, props);
        //         break;
        //     case 'output':
        //         output(params, props);
        //         break;
        //     case 'title':
        //         title(params, props);
        //         break;
        //     case 'desc':
        //         desc(params, props);
        //         break;
        //     case 'outputDir':
        //         outputDir(params, props);
        //         break;
        //     case 'privacy':
        //         privacy(params, props);
        //         break;
        //     case 'cleanOnEnd':
        //         cleanOnEnd(params, props);
        //         break;
        //     case 'tags':
        //         tags(params, props);
        //         break;
        //     case 'categoryId':
        //         categoryId(params, props);
        //         break;
        //     default:
        //         _default(params, props, command);
        //         break;
        // }
    }

    return compute({});
};

var commandList = {};

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

commandList.help = function (params, props) {
    //TODO
    props.help = 'List of commands:' +
        '\n\t--help\tshow this list\ndon\'t need any arg' +
        '\n\t--albumPaths\tpaths that will be check for the album content\nneed one or more paths';
};

commandList.albumPaths = function (params, props) {
    params = parseListPath(params);
    if (!params.length) {
        errorParams(props, 'albumPaths');
    } else {
        props.albumPaths = params;
    }
};

commandList.albumRecursive = function (params, props) {
    if (params.length > 1) {
        errorParams(props, 'albumRecursive');
    } else {
        if (!params.length || params[0] === 'true' || params[0] === '1') {
            props.albumRecursive = true;
        } else if (params[0] === 'false' || params[0] === '0') {
            props.albumRecursive = false;
        } else {
            errorParams(props, 'albumRecursive');
        }
    }
};

commandList.coverPaths = function (params, props) {
    params = parseListPath(params);
    if (!params.length) {
        errorParams(props, 'coverPaths');
    } else {
        props.coverPaths = params;
    }
};

commandList.coverPathsRelative = function (params, props) {
    if (params.length > 1) {
        errorParams(props, 'coverPathsRelative');
    } else {
        if (!params.length || params[0] === 'true' || params[0] === '1') {
            props.coverPathsRelative = true;
        } else if (params[0] === 'false' || params[0] === '0') {
            props.coverPathsRelative = false;
        } else {
            errorParams(props, 'coverPathsRelative');
        }
    }
};

commandList.output = function (params, props) {
    if (params.length !== 1) {
        errorParams(props, 'output');
    } else {
        if (params[0] === 'multiple' || params[0] === 'allinone') {
            props.output = params[0];
        } else {
            errorParams(props, 'output');
        }
    }
};

commandList.title = function (params, props) {
    if (!params.length) {
        errorParams(props, 'title');
    } else {
        props.title = params.join(' ');
    }
};

commandList.desc = function (params, props) {
    if (!params.length) {
        errorParams(props, 'desc');
    } else {
        props.desc = params.join(' ');
    }
};

commandList.privacy = function (params, props) {
    if (params.length !== 1) {
        errorParams(props, 'privacy');
    } else {
        props.privacy = params[0];
    }
};

commandList.outputDir = function (params, props) {
    if (params.length !== 1) {
        errorParams(props, 'outputDir');
    } else {
        props.outputDir = params[0];
    }
};

commandList.credentials = function (params, props) {
    if (params.length !== 1) {
        errorParams(props, 'credentials');
    } else {
        props.credentials = params[0];
    }
};

commandList.cleanOnEnd = function (params, props) {
    if (params.length > 1) {
        errorParams(props, 'cleanOnEnd');
    } else {
        if (!params.length || params[0] === 'true' || params[0] === '1') {
            props.cleanOnEnd = true;
        } else if (params[0] === 'false' || params[0] === '0') {
            props.cleanOnEnd = false;
        } else {
            errorParams(props, 'cleanOnEnd');
        }
    }
};

commandList.tags = function (params, props) {
    params = parseListPath(params);
    props.tags = params;
};

commandList.categoryId = function (params, props) {
    if (params.length !== 1 || isNaN(params[0])) {
        errorParams(props, 'categoryId');
    } else {
        props.categoryId = params[0];
    }
};

commandList.port = function (params, props) {
    if (params.length !== 1 || isNaN(params[0])) {
        errorParams(props, 'port');
    } else {
        props.port = params[0];
    }
};

commandList.noUpload = function (params, props) {
    if (params.length > 1) {
        errorParams(props, 'noUpload');
    } else {
        if (!params.length || params[0] === 'true' || params[0] === '1') {
            props.noUpload = true;
        } else if (params[0] === 'false' || params[0] === '0') {
            props.noUpload = false;
        } else {
            errorParams(props, 'noUpload');
        }
    }
};

commandList.noUpload = function (params, props) {
    if (params.length > 1) {
        errorParams(props, 'noUpload');
    } else {
        if (!params.length || params[0] === 'true' || params[0] === '1') {
            props.noUpload = true;
        } else if (params[0] === 'false' || params[0] === '0') {
            props.noUpload = false;
        } else {
            errorParams(props, 'noUpload');
        }
    }
};

commandList.parallelProcess = function(params, props) {
    if (params.length !== 1 || isNaN(params[0])) {
        errorParams(props, 'parallelProcess');
    } else {
        props.parallelProcess = params[0];
    }
};