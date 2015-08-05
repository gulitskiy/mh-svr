
var es = require('elasticsearch');
var crypto = require('crypto');

function md5(str) {
	return crypto.createHash('md5').update(str).digest("hex");
}

var esClient = new es.Client({
	host: "http://localhost:9200",
	//log: 'trace',
	apiVersion: '1.6'
});

esClient.search({
	index: 'news',
	from: 0,
	size: 2000,
	//fields: ['src', 'lng', 'url', 'pubDate', 'title', 'fullText', 'desc', 'tags', 'img', 'cat'],
	body: {
		'query': {
			'match_all' : { }
		}
	}
}, function (err, res) {
	for(var i = 0; i < res.hits.hits.length; i++) {
		var item = res.hits.hits[i]._source;
		(function(post, j) {
			
			
			esClient.index({
				index: 'stock',
				type: post.lng,
				id: md5(post.url),
				body: post
			}, function (err, res) {
					console.log(j);
			});
		})(item, i);
	}
	console.log(res.hits.hits.length);
});