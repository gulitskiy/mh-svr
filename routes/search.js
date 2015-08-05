var logger = require('../utils/logger');
var dateFormat = require('dateformat');

var formatDate = 'yyyy-mm-dd HH:MM:ss';

module.exports = function (routes, es) {
	
	// Поиск по ключевым словам
	routes.get('/search', function(req, res) {
	
		var query = null, dateFrom = null;
		
		if(!req.query.q) {
			res.json({'status': 'error', 'message': 'q param is required'});
			return;
		}
		
		var query = req.query.q;
		var dateFrom = new Date(req.query.dateFrom);
		var keywords = query.split(' ');
		
		var clauses = [];
		
		for(var i = 0; i < keywords.length; i++) {
			if(keywords[i] && keywords[i].length > 0) {
				var clause = {
					'span_multi': {
						'match': {
							'fuzzy': {
								'fullText': {
									"fuzziness": "AUTO",
									"value": keywords[i]
								}
							}
						}
					}
				};
				clauses.push(clause);
			}
		}
		
		var esQuery = {
			'query': {
				'filtered': {
					'query': {
						'span_near': {
							'clauses': clauses,
							'slop' : 2,
							'in_order' : true,
							//'boost' : 2
						}
					},
					'filter': {
						'range': {
							'pubDate': {
								'gte': dateFormat(dateFrom, formatDate)
							}
						}
					}
				}
			},
			'highlight' : {
				'pre_tags' : ['<b>'],
				'post_tags' : ['</b>'],
				'order' : 'score',
				'fields' : {
					'fullText' : {
						'fragment_size' : 150,
						'number_of_fragments' : 3
					}
				}
			}			
		};
		
		//res.json(esQuery);
		
		es.search({
			index: '_all',
			body: esQuery
		}, function (error, response) {
			res.json(response);
		});
		
	});
	
};

/*
	['Мажилис парламента', 'Председатель мажилиса']
*/