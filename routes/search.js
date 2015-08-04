var logger = require('../utils/logger');

module.exports = function (routes, es) {
	
	// Поиск по ключевым словам
	routes.post('/search', function(req, res) {
		
		var result = [];
		var keywords = req.body;
		
		var dateFrom = new Date('2015-01-01');
		
		es.search({
			index: '_all',
			body: {
				'query': {
					'filtered': {
						'query': {
							'match': {
								'text': {
									'query': keywords,
									'fuzziness': 'AUTO',
									'operator': 'and'
								}
							}
						},
						'filter': {
							'range': {
								'pubDate': {
									'gte': '2015-08-03'
								}
							}
						}
					},
					'highlight': {
						'fields': {
							'text': {}
						}
					}
				}
			}
		}, function (error, response) {
			res.json(response);
		});
		
	});
	
};

/*
	['Мажилис парламента', 'Председатель мажилиса']
*/

function searchNews(keyword, result) {
	var query = [];
}