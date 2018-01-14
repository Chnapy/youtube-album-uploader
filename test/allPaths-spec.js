var chai = require('chai');
var expect = chai.expect;

var allPaths = require('../src/allPaths');
var propsFromArgv = require('../src/propsFromArgv');

describe('allPaths', function () {

    var argvs = [
        '--albumPaths test/album1 test/album2 --albumRecursive true --coverPaths test/folder.jpg'
    ];

    for (var i = 0; i < argvs.length; i++) {
        if (argvs[i].length)
            argvs[i] = propsFromArgv(['node', 'youtube-etc'].concat(argvs[i].split(' ')));
    }

    it('should return false', function () {
        var paths = allPaths(argvs[0]);
        console.log(paths);
        expect(paths).to.not.be.false;
    });
});