var Post = require('../models/post');
var News = require('../models/news');

var logger = require('../utils/logger');

module.exports = function (routes, es) {
	
	// Добавление поста
	routes.post('/news', function(req, res) {
		var post = new Post(req.body, es);
		post.save(function (err) {
			var result = null;
			if(err) {
				result = {'status': 'error', 'errors': err, 'post': {src: post.fields.src, url: post.fields.url, id: post.getId()}};
			} else {
				result = {'status': 'success', 'post': {src: post.fields.src, url: post.fields.url, id: post.getId()}};
			}
			logger.info(result);
			if(err) logger.info(err);
			res.json(result);
		});
	});
	
	routes.post('/news.bulk', function(req, res) {
		var news = new News(req.body, es);
		news.save(function (err) {
			var result = {
				'added': news.added,
				errors: news.errors
			};
			logger.info(result);
			if(err) logger.info(err);
			res.json(result);
		});
	});
	
};