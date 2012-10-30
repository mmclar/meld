var http = require('http');
var url = require('url');
var fs = require('fs');

var state = {
    nextId: 0,
    games: {}
}

var actions = {
    create: function(request, response, name1, name2) {
        var game = {
            id: state.nextId++,
            rounds: [],
            name1: name1,
            name2: name2
        };
        state.games[game.id] = game;
        response.write(JSON.stringify(game));
        response.end();
    },
    gameData: function(request, response, id) {
        game = state.games[id];
        response.write(JSON.stringify(game));
        response.end();
    }
};

http.createServer(function(request, response) {
    // Map urls straight to functions with those names.
    var parts = url.parse(request.url).pathname.split('/');
    var action = parts[1];
    var f = actions[action];
    if (f) {
        args = parts.slice(2);
        args = args.map(decodeURIComponent);
        args.unshift(request, response);
        actions[action].apply(actions[action], args);
    } else {
        var filename = action || 'index.html';
        extension = filename.split('.')[1];
        var sendFile = function(data) {
            response.writeHead(200, {"Content-Type": { "html": "text/html", "js": "text/javascript", "css": "text/css" }[extension]});
            response.write(''+data);
            response.end();
        };
        filename = 'static/' + filename;
        fs.readFile(filename, function(err, data){
            if (err) {
                filename += '.html';
                fs.readFile(filename, function(err, data) {
                    if (err) {
                        response.writeHead(404, {"Content-Type": "text/html"});
                        response.write("404 Not Found");
                        response.end();
                    }
                    sendFile(data);
                });
            } else {
                sendFile(data);
            }
        });
    }
}).listen(8080, '0.0.0.0');
