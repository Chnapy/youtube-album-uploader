# youtube-album-uploader-multiple

But please, call it YAUM.

It is a fork of **[youtube-album-uploader](https://github.com/jpchip/youtube-album-uploader)** (created by [jpchip](https://github.com/jpchip), good job guy !).

Where the original youtube-album-uploader create a compilation of the album in a single video, YAUM create one video per music file and upload them all.
YAUM is also a lot more configurable and personnalizable (recursive dir browse, multiple cover, path to credentials...).

A second goal to this tools will be to permit to create a compilation like youtube-album-uploader does, but with the flexibility of YAUM.

**WIP**

[![Build
Status](https://travis-ci.org/Chnapy/youtube-album-uploader-multiple.svg?branch=master)](https://travis-ci.org/Chnapy/youtube-album-uploader-multiple)

A node CLI to upload multiple mp3 files to youtube. 

`youtube-album-uploader-multiple --albumPaths "my/path" "my/other/path" --coverPaths "cover/path" "other/cover/path" --credentials "path/to/cred.json"`

## Getting Started

Requires [ffmpeg](https://www.ffmpeg.org/) be installed. On windows, make sure to add the following PATHs (with actual paths to whereever you installed ffmpeg):

    FFPROBE_PATH - C:\ffmpeg\bin\ffprobe.exe
    FFMPEG_PATH - C:\ffmpeg\bin\ffmpeg.exe

It also requires Google OAuth2 credentials. The basics of Google's OAuth2 implementation is explained on [Google Authorization and Authentication documentation](https://developers.google.com/accounts/docs/OAuth2Login). 

There is a [good tutorial here](https://www.codementor.io/nodejs/tutorial/uploading-videos-to-youtube-with-nodejs-google-api) on getting a credentials.json file. Once you download it, put in the root of the youtube-album-uploader directory.

If you happen to already have a CLIENT_ID, PROJECT_ID, and CLIENT_SECRET you can just copy `credentials.json.example` to `credentials.json` and replace these parameters.

## Installation

You can install YAUM using npm:

    npm install -g youtube-album-uploader-multiple
    
## Usage 

**Windows users, please use "" for paths.**

### Shorter is better

    youtube-album-uploader-multiple ...
    
    yaum ...
    
It's the same.

### The easy way

    youtube-album-uploader-multiple --albumPaths "path/to/folder" --coverPaths "path/to/cover.jpg"

It will get all music files in `path/to/folder` and for each YAUM will create a video with `path/to/cover.jpg` as background image.
The title of each video will be the name of the music file, and default descriptions, tags, and category will be used. 
The authenticate will be done with credentials.json (in root of YAUM folder).

### The powerful way (and much funnier !)

    youtube-album-uploader-multiple 
    --help
    --albumPaths "path/to/folder" "or/to/file.mp3" "or/twice" 
    --coverPaths "first/cover.jpg" "second/cover.jpg" "and/more.jpg" 
    --albumRecursive
    --coverPathsRelative
    --outputDir "where/videos/will/go"
    --credentials "path/to/credentials.json"
    --cleanOnEnd
    --noUpload
    --port 5994
    --title "title of youtube video with {filename}"
    --desc "description of youtube video with {filename}"
    --privacy "private"
    --tags rock soundtrack whatever
    --categoryId 10
    --parallelProcess 1
    --output "multiple"
    
Don't worry, all of that is optional but `--albumPaths` and `--coverPaths`.
Explanation.

#### Arguments is power

* `--help`

Use it alone. It will show you all the arguments you can use with YAUM.

* `--albumPaths "path/to/folder" "or/to/file.mp3" "or/twice"`

Need a minimum of 1 path. YAUM will use these music files, or, if directory, the content of it.

* `--coverPaths "first/cover.jpg" "second/cover.jpg" "and/more.jpg"`

Need a minimum of 1 path. YAUM will use these pictures as background image for youtube videos.
If multiple pictures are given, they will be shared to all videos like a loop.

* `--albumRecursive`

Use as that it is equivalent as `--albumRecursive true` or `--albumRecursive 1`. 
If specified and true, the folders, if isset, specified in `--albumPaths` will be browsed by YAUM recursively (deep browse).
You can explicitly turn off that with `--albumRecursive false` or `--albumRecursive 0`.
Default value: `false`.

* `--coverPathsRelative`

Use similar as `--albumRecursive`.
If specified and true, the cover will be search in the album folder specified (so you have to specify a folder for your music files).
With this, `--coverPaths` should have only one path !
Default value: `false`.

* `--outputDir "where/videos/will/go"`

Need exactly 1 path. Specify the folder where all videos will be stocked. The folder can exist or not, whatever. 
But if he exists, he should to be empty, whereas the operation will fail (nothing will be delete).
Default value: `yaumExport`.

* `--credentials "path/to/credentials.json"`

Need exactly 1 path. Specify the JSON file where the youtube authenticate are written. 
You can also, instead of a path, specify directly the content of the file following the JSON format `{...}`.
Default value: `./credentials.json`.

* `--cleanOnEnd`

Use similar as `--albumRecursive`.
If specified and true, all files will be delete at the end of the process, after all the uploads end.
Default value: `true`.

* `--noUpload`

Use similar as `--albumRecursive`.
If specified and true, the created videos will not be upload to youtube.
Default value: `false`.

* `--port 5994`

Need exactly 1 port number, higher than 0. The port specified will be used by the local server used to connect the app to youtube.
This arg can be useful if the default port is already used by an other application.
Default value: `5994`.

* `--title "title of youtube video with {filename}"`

Need exactly 1 string. Title of all youtube videos. You can insert the name of the current file with `{filename}`.
Default value: `{filename}`.

* `--desc "description of youtube video with {filename}"`

Need exactly 1 string. Description of all youtube videos. 
You can insert the name of the current file with `{filename}` and some credits to YAUM `{credits}`.
Use `\n` for line breaks.
Default value: `{filename}\n\n{credits}`.

* `--privacy "private"`

Need exactly 1 string. Privacy of all youtube videos. Keep it `private` if you don't want to spam your subscribers.
Default value: `private`.

* `--tags rock soundtrack whatever`

Need a minimum of 0 tags (so can be empty). Specify the youtube tags for all videos.
Default value: `YAUM`.

* `--categoryId 10`

Need exactly 1 number. Specify the youtube category for all videos. For example, 10 is for Music.
Default value: `10`.

* `--parallelProcess 1`

Need exactly 1 number, higher than 0. Specify the number of video convert process running in the same time. 
**Be careful, a number too high for your CPU may cause some troubles to your computer !**
Default value: `1`.

* `--output "multiple"`

Need exactly 1 string: `multiple` or `allinone`. Define the comportment of the app. `multiple` will create one video per music file, then upload them. 
`allinone` will create a single video compiling all music files, like `youtube-album-uploader` does.
**For now, `allinone` mode don't work and is disabled.**
Default value: `multiple`.

---

When it finishes creating all videos your browser should open and prompt you to sign in with your Google account and give YAUM permission to upload on your behalf.

## Questions

If you have any questions, just [open an issue](https://github.com/Chnapy/youtube-album-uploader-multiple/issues/new).

## Disclaimer

It is your responsibility to respect the copyright of any material uploaded with this app.  
