#!/usr/bin/env node

'use strict';

const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {

    getAndroidResPath: (context) => {

        var platforms = context.opts.cordova.platforms;

        if (platforms.indexOf("android") === -1) {
            return null;
        }

        var androidPath = context.opts.projectRoot + '/platforms/android/app/src/main';

        if (!fs.existsSync(androidPath)) {
            androidPath = context.opts.projectRoot + '/platforms/android';

            if (!fs.existsSync(androidPath)) {
                console.log("Unable to detect type of cordova-android application structure");
                throw new Error("Unable to detect type of cordova-android application structure");
            } else {
                console.log("Detected pre cordova-android 7 application structure");
            }
        } else {
            console.log("Detected cordova-android 7 application structure");
        }

        return androidPath;
    },

    getAndroidManifestPath: (context) => {
        return this.getAndroidResPath(context);
    },

    getXcodeVersion: async () => {
        const { stdout, stderr } = await exec('xcodebuild -version | grep \'Xcode\'');
        if (!stderr && stdout) {
            return Promise.resolve(stdout);
        }
        return Promise.reject(stderr);
    }
};
