/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*

Splits a identifier into a object of this stucture:

"raw!./loader?qqq!module/lib/file?query" ->
{
	loaders: [
		{
			path: "raw",
			query: null,
			module: true
		},
		{
			path: "./loader",
			query: "?qqq",
			module: false
		}
	],
	resource: {
		path: "module/lib/file",
		query: "?query",
		module: true
	},
}

resource can be null, in i. e. "loader!"

double !! or leading will be removed.

loaders can be null, in i. e. "./file"

loaders can be [], in i. e. "!./file"

*/
module.exports = function parse(identifier) {
	var splitted = identifier.split(/!/g);

	var resource = splitted.pop();

	return {
		loaders: splitted.length > 0 ? splitted.filter(isNotEmptyString).map(toPart.bind(null, false)) : null,
		resource: toPart(true, resource)
	}
}

function isNotEmptyString(str) {
	return str !== "";
}

function toPart(allowQueryOnly, identifier) {
	if(identifier === "") return null;
	var part = {
		path: null,
		query: null,
		module: false
	};
	var idxQuery = identifier.indexOf("?");
	if(idxQuery == 0) {
		if(!allowQueryOnly)
			throw new Error("Only a query specified, but a path was (also) expected. " + JSON.stringify(identifier));
		part.query = identifier;
	} else if(idxQuery > 0) {
		part.path = identifier.slice(0, idxQuery);
		part.query = identifier.slice(idxQuery);
	} else {
		part.path = identifier;
	}
	part.module = part.path && isModule(part.path);
	return part;
}

var notModuleRegExp = /^\.$|^\.[\\\/]|^\.\.$|^\.\.[\/\\]|^\/|^[A-Z]:\\/i;

function isModule(path) {
	return !notModuleRegExp.test(path);
}

module.exports.isModule = isModule;