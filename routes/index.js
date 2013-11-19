    exports.index = function (req, res) {
    	res.render('index.html', { 
    		url: 'www.google.com'
    	});
    	
    };

    exports.display = function (req, res) {
    	res.render('display.html', { 
    		url: 'www.google.com'
    	});
    	
    };


