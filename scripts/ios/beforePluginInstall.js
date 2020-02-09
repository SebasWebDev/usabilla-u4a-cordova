#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const utilities = require("../lib/utilities");

module.exports = function (context) {
    const platforms = context.opts.cordova.platforms;

    if (platforms.indexOf("ios") === -1) {
        return null;
    }

    const pluginPath = path.resolve(context.opts.plugin.dir, './plugin.xml');
    const pluginContent = fs.readFileSync(pluginPath).toString();

    utilities.getXcodeVersion().then((xcodeVersion) => {
        const version = xcodeVersion.replace(' ', '-');
        console.log('Found Xcode version: ' + version);
        const newContent = pluginContent.replace(
            '<pod name="Usabilla" git="https://github.com/usabilla/usabilla-u4a-ios-swift-sdk" />',
            `<pod name="Usabilla" git="https://github.com/usabilla/usabilla-u4a-ios-swift-sdk" branch="${version}" />`
        );
        fs.writeFileSync(pluginPath, newContent);
    }).catch((error) => {
        console.error(error);
    });
};
