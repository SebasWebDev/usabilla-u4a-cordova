#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const utilities = require("../lib/utilities");

module.exports = function () {
    const pluginPath = path.resolve('../..', './plugin.xml');
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
