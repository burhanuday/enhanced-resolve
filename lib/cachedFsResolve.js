var resolveFactory = require("./resolve");

// use node.js fs
var fs = require("fs");

// caching factory
var createThrottledFunction = require("./createThrottledFunction");

// the cache objects
var statCache = {}, readFileCache = {}, readdirCache = {};

// create the functions with the factory
// the sync version have higher priority as it finishes earlier
// caching time is 4 seconds
var statAsync = createThrottledFunction(fs.stat, 4000, Object.create(statCache));
var statSync = createThrottledFunction.sync(fs.statSync, 4000, statCache);
var readFileAsync = createThrottledFunction(fs.readFile, 4000, Object.create(readFileCache));
var readFileSync = createThrottledFunction.sync(fs.readFileSync, 4000, readFileCache);
var readdirAsync = createThrottledFunction(fs.readdir, 4000, Object.create(readdirCache));
var readdirSync = createThrottledFunction.sync(fs.readdirSync, 4000, readdirCache);

// create the resolve function
module.exports = resolveFactory({
	// use the created functions
	stat:			statAsync,
	statSync:		statSync,
	readFile:		readFileAsync,
	readFileSync:	readFileSync,
	readdir:		readdirAsync,
	readdirSync:	readdirSync,

	// use standard JSON parser
	parsePackage:	JSON.parse
});