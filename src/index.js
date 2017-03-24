var path = require('path');
var fs = require('fs');
var JSON5 = require('json5');

var nodeResolve = require('eslint-import-resolver-node').resolve;

/* eslint-disable no-console */
var babelRootImport = require('babel-root-import/build/helper.js');

// newer version of babel root import exports the 2 functions
// but older versions exported a class
/* eslint-disable new-cap */
var babelRootImportObj = babelRootImport.default ?
    new babelRootImport.default() : babelRootImport;

var hasRootPathPrefixInString = babelRootImportObj.hasRootPathPrefixInString;
var transformRelativeToRootPath = babelRootImportObj.transformRelativeToRootPath;

if (babelRootImport.default) {
    /* eslint-disable no-console */
    hasRootPathPrefixInString = hasRootPathPrefixInString.bind(babelRootImportObj);
    transformRelativeToRootPath = transformRelativeToRootPath.bind(babelRootImportObj);
}

exports.interfaceVersion = 2;

/**
 * Find the full path to 'source', given 'file' as a full reference path.
 *
 * resolveImport('./foo', '/Users/ben/bar.js') => '/Users/ben/foo.js'
 * @param  {string} source - the module to resolve; i.e './some-module'
 * @param  {string} file - the importing file's full path; i.e. '/usr/local/bin/file.js'
 * @param  {object} config - the resolver options
 * @return {object}
 */
exports.resolve = (source, file, opts) => {
    var rootPathSuffix = '';
    var rootPathPrefix = '';

    if (opts.rootPathSuffix && typeof opts.rootPathSuffix === 'string') {
        rootPathSuffix = `/${opts.rootPathSuffix.replace(/^(\/)|(\/)$/g, '')}`;
    }

    if (opts.rootPathPrefix && typeof opts.rootPathPrefix === 'string') {
        rootPathPrefix = opts.rootPathPrefix;
    } else {
        rootPathPrefix = '~';
    }

    var transformedSource = source;
    if (hasRootPathPrefixInString(source, rootPathPrefix)) {
        transformedSource = transformRelativeToRootPath(source, rootPathSuffix, rootPathPrefix);
    }

    return nodeResolve(transformedSource, file, opts);
};
