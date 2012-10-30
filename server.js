var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function(request, response) {
    // Map urls straight to functions with those names.
    var parts = url.parse(request.url).pathname.split('/');
    var action = parts[1];
    var f = actions[action];
    if (f) {
        console.log(action + ' found');
        actions[action].apply(actions[action], parts.slice(2));
    } else {
        var filename = action || 'index.html';
        extension = filename.split('.')[1];
        fs.readFile('static/' + filename, function(err, data){
            if (err) {
                response.writeHead(404, {"Content-Type": "text/html"});
                response.write("404 Not Found");
            } else {
                response.writeHead(200, {"Content-Type": { "html": "text/html", "js": "text/javascript" }[extension]});
                response.write(+data);
            }
            response.end();
        });
    }
}).listen(8080, '0.0.0.0');

var actions = {
    test:  function(a1, a2) {
        console.log(a1);
        console.log(a2);
    }
};
