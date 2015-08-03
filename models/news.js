module.exports = News = function (body, es) {
	
	if(!es)
		throw new Exceptopn("es is not defined!");
	
	var newsList = [], errors = [];
	
	this.newsList = newsList;
	this.errors = errors;
	this.es = es;
	this.added = 0;
	
	function News(body) {
		for(var i = 0; i < body.length; i++) {
			newsList.push(new Post(body[i], es));
		}
	}
	News(body);
	
};

News.prototype.isValid = function () {
	for(var i = 0; i < this.newsList.length; i++) {
		if(this.newsList[i].errors.length > 0)
			return false;
	}
	return true;
};

News.prototype.getBulkBody = function () {
	var body = [];
	var errors = this.errors;
	for(var i = 0; i < this.newsList.length; i++) {
		var post = this.newsList[i];
		if(post.isValid()) {
			this.added++;
			var operation = { index: {_index: 'news', _type: post.fields.lng, _id: post.getId()} };
			body.push(operation);
			body.push(post.fields);
		} else {
			errors.push({'post': { src: post.fields.src, url: post.fields.url }, 'errors': post.errors});
		}
	}
	return body;
};

News.prototype.save = function (cb) {
	var _this = this;
	var es = this.es;
	es.bulk({
	  body: _this.getBulkBody()
	}, function (err, res) {
		console.log('Added:' + _this.added);
		if(_this.errors.length > 0) {
			console.log('Errors: ' + _this.errors.length);
			for(var i =0; i < _this.errors.length; i++) {
				console.log();
				console.log(_this.errors[i]);
			}
			console.log();
		}
		if(cb)
			cb.apply(_this, err, res);
	});
};