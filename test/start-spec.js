var chai = require('chai');
var expect = chai.expect;
var ffmpeg = require('fluent-ffmpeg');

var start = require('../src/start');

describe('start', function () {

    var argvs = [
        '',
        '--albumPaths test/album1 test/album2 --albumRecursive true --coverPaths test/folder.jpg'
    ];

    for (var i = 0; i < argvs.length; i++) {
        if (argvs[i].length)
            argvs[i] = ['node', 'youtube-etc'].concat(argvs[i].split(' '));
    }

    describe('on success', function () {
        var data = null, err;
        beforeEach(function (done) {
            this.timeout(500000);
            var props = start(argvs[1]);
            // expect(props).to.not.be.false;
            props.then(function (_data) {
                data = _data;
                done();
            }).catch(function (_err) {
                err = _err;
                done();
            });
        });

        it('temp', function () {
            expect(data).to.not.be.null;
        });

    });

    // it('should return error (no command)', function () {
    //     var props = start(argvs[0]);
    //     expect(props).to.be.false;
    // });
    //
    // it('should return true and create video', function () {
    //     var props = start(argvs[1]);
    //     // expect(props).to.not.be.false;
    //     props.then(function (data) {
    //         console.log(data);
    //     }).catch(function (err) {
    //         console.warn(err);
    //     });
    // });
});