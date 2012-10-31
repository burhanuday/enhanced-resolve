/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*

converts a object created by "parse" back to a string.

this is not the exact opposite of parse

i. e. in this case "!module" -parse-> {...} -stringify-> "module"

*/
module.exports = function stringify(request) {
	var stuff = [], i;
	if(request.loaders) {
		for(i = 0; i < request.loaders.length; i++)
			stuff.push(request.loaders[i]);
	}
	stuff.push(request.resource);
	return stuff.map(toPartString).join("!");
}

function toPartString(part) {
	if(part === null) return "";
	if(part.query && part.path) return part.path + part.query;
	if(part.path) return part.path;
	if(part.query) return part.query;
	return "";
}