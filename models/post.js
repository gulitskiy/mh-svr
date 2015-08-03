var News = require('../models/news');
var crypto = require('crypto');
var dateFormat = require('dateformat');

function md5(str) {
	return crypto.createHash('md5').update(str).digest("hex");
}

module.exports = Post = function (body, es) {
	
	if(!es)
		throw new Exceptopn("es is not defined!");
	
	var fields = {}, errors = [];
	
	this.fields = fields;
	this.errors = errors;
	this.es = es;
	
	function Post(body) {
		for(var pn in props) {
			var prop = props[pn];
			fields[pn] = prop.initializer(body[prop.from], errors);
		}
	}
	Post(body);
	
};

Post.prototype.isValid = function () {
	return this.errors.length == 0;
};

Post.prototype.getId = function () {
	return md5(this.fields.url);
};

Post.prototype.save = function (cb) {
	if(this.isValid()) {	
		var es = this.es;
		var post = this.fields;
		var _this = this;
		es.index({
			index: 'news',
			type: post.lng,
			id: md5(post.url),
			body: post
		}, function (err, res) {
			if(cb) cb.apply(_this, err, res);
		});
	} else {
		cb.apply(this, this.errors);
	}
};

var requiredMessage = 'Filed "%s" is required!';

var props = {
	'src': {
		'from': 'source',
		'type': typeof '',
		'initializer': function (val, errors) {
			var newVal = val ? val.toLowerCase() : null;
			this.validator(newVal, errors);
			return newVal;
		},
		'validator': function (val, errors) {
			if(!val || typeof val != this.type)
				errors.push(requiredMessage.replace('%s', this.from));
		}
	},
	'lng': {
		'from': 'lang',
		'type': typeof '',
		'initializer': function (val, errors) {
			var newVal = val ? val : null;
			this.validator(newVal, errors);
			return newVal;
		},
		'validator': function (val, errors) {
			if(!val || typeof val != this.type)
				errors.push(requiredMessage.replace('%s', this.from));
		}
	},
	'url': {
		'from': 'url',
		'type': typeof '',
		'initializer': function (val, errors) {
			var newVal = val ? val : null;
			this.validator(newVal, errors);
			return newVal;
		},
		'validator': function (val, errors) {
			if(!val || typeof val != this.type)
				errors.push(requiredMessage.replace('%s', this.from));
		}
	},
	'pubDate': {
		'from': 'pubDate',
		'type': typeof '',
		'initializer': function (val, errors) {
			var newVal = dateFormat(new Date(val), 'yyyy-mm-dd HH:MM:ss');
			this.validator(newVal, errors);
			return newVal;
		},
		'validator': function (val, errors) {
			if(!val || val.length == 0)
				errors.push(requiredMessage.replace('%s', this.from));
		}
	},
	'title': {
		'from': 'title',
		'type': typeof '',
		'initializer': function (val, errors) {
			var newVal = val ? val : null;
			this.validator(newVal, errors);
			return newVal;
		},
		'validator': function (val, errors) {
			if(!val || typeof val != this.type)
				errors.push(requiredMessage.replace('%s', this.from));
		}
	},
	'fullText': {
		'from': 'fullText',
		'type': typeof '',
		'initializer': function (val, errors) {
			var newVal = val ? val : null;
			this.validator(newVal, errors);
			return newVal;
		},
		'validator': function (val, errors) {
			if(!val || typeof val != this.type)
				errors.push(requiredMessage.replace('%s', this.from));
		}
	},
	'desc': {
		'from': 'desc',
		'type': typeof '',
		'default': null,
		'initializer': function (val, errors) {
			var newVal = val ? val : null;
			this.validator(newVal, errors);
			return newVal;
		},
		'validator': function (val, errors) {
		}
	},
	'tags': {
		'from': 'tags',
		'type': typeof [],
		'default': null,
		'initializer': function (val, errors) {
			var newVal = val ? val : null;
			this.validator(newVal, errors);
			return newVal;
		},
		'validator': function (val, errors) {
		}
	},
	'img': {
		'from': 'img',
		'type': typeof '',
		'default': null,
		'initializer': function (val, errors) {
			var newVal = val ? val : null;
			this.validator(newVal, errors);
			return newVal;
		},
		'validator': function (val, errors) {
		}
	},
	'cat': {
		'from': 'category',
		'type': typeof '',
		'default': null,
		'initializer': function (val, errors) {
			var newVal = val ? val : null;
			this.validator(newVal, errors);
			return newVal;
		},
		'validator': function (val, errors) {
		}
	}
};