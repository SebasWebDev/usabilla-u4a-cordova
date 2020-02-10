#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const utilities = require("../lib/utilities");
const xcode = require('xcode');

module.exports = function (context) {
    let resolve, reject;
    const response = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    const platforms = context.opts.cordova.platforms;

    if (platforms.indexOf("ios") === -1) {
        reject('Platform ios not found.');
    }

    const pluginPath = path.resolve(context.opts.plugin.dir, './plugin.xml');
    console.log("Usabilla plugin path:" + pluginPath);
    const pluginContent = fs.readFileSync(pluginPath).toString();

    utilities.getXcodeVersion().then((xcodeVersion) => {
        const version = xcodeVersion.replace(' ', '-').replace(/(?:\r|\n|\t)/, '');
        console.log('Found Xcode version: ' + version + ' --');
        const newContent = pluginContent.replace(
            '<pod name="Usabilla" git="https://github.com/usabilla/usabilla-u4a-ios-swift-sdk" />',
            `<pod name="Usabilla" git="https://github.com/usabilla/usabilla-u4a-ios-swift-sdk" branch="${version}" />`
        );
        fs.writeFileSync(pluginPath, newContent);
        if (xcode) {
            // Adds the pods to the library search
            xcode.addToLibrarySearchPaths(`${context.opts.projectRoot}/Pods/**`);
        }
        resolve('Hook executed successfully');
    }).catch((error) => {
        console.error(error);
        reject(error);
    });

    return response;
};
