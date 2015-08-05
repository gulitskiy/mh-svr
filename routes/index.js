module.exports = function (routes, es) {
	require('./news')(routes, es);
	require('./search')(routes, es);
};