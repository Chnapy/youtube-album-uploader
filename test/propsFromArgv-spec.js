var chai = require('chai');
var expect = chai.expect;

var propsFromArgv = require('../src/propsFromArgv');

describe('propsFromArgv', function () {

    var argvs = [
        '',
        '--help',
        'toto',
        '--blabla',
        '--albumPaths   ',
        '--albumPaths path1 path2 etc',
        '--albumRecursive true',
        '--albumPaths path1 path2 etc --albumRecursive false',
        '--albumPaths path1 path2 etc --albumRecursive false --coverPaths path3 path4 etc --coverPathsRelative true --output multiple'
    ];

    for (var i = 0; i < argvs.length; i++) {
        if (argvs[i].length)
            argvs[i] = ['node', 'youtube-etc'].concat(argvs[i].split(' '));
    }

    it('should return error (no command)', function () {
        var props = propsFromArgv(argvs[0]);
        expect(props).to.have.property('error');
    });

    it('should return error (bad command)', function () {
        var props = propsFromArgv(argvs[2]);
        expect(props).to.have.property('error');
    });

    it('should return error (bad command, again)', function () {
        var props = propsFromArgv(argvs[3]);
        expect(props).to.have.property('error');
    });

    it('should show help', function () {
        var props = propsFromArgv(argvs[1]);
        expect(props).to.have.property('help');
    });

    it('should return error (albumPaths)', function () {
        var props = propsFromArgv(argvs[4]);
        expect(props).to.have.property('error');
    });

    it('should define albumPaths', function () {
        var props = propsFromArgv(argvs[5]);
        expect(props).to.have.property('albumPaths');
    });

    it('should define albumRecursive', function () {
        var props = propsFromArgv(argvs[6]);
        expect(props).to.have.property('albumRecursive');
    });

    it('should define albumPaths and albumRecursive', function () {
        var props = propsFromArgv(argvs[7]);
        expect(props).to.have.all.keys('albumPaths', 'albumRecursive');
    });

    it('should define ALL but help', function () {
        var props = propsFromArgv(argvs[8]);
        expect(props).to.have.all.keys('albumPaths', 'albumRecursive',
            'coverPaths', 'coverPathsRelative', 'output');
    });
});