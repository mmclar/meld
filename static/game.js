var gameId,
    me;

$(document).ready(function() {
    gameOver = false;

    var parts = window.location.href.split('/');
    gameId = parts[parts.length-1];

    $.getJSON('/gameData/' + gameId, function(game) {
        $(['p1', 'p2']).each(function(k, v) {
            $('.player-choice a.' + v).text(game[v]);
        });
        $('.player-choice a').click(function(e) {
            me = $(e.target).hasClass('p1') ? 'p1' : 'p2';
            $('.player-choice').hide();
            update();
        });
    });
});

function update() {
    $.getJSON('/gameData/' + gameId, function(game) {
        var markup;
        $(['p1', 'p2']).each(function(k, player) {
            $('h2.game-title .' + player).text(game[player]);
        });

        me = 'p1';
        // Make sure all of the rounds are shown here.
        $(game.rounds).each(function(i, round) {
            markup = $('.templates .round').clone();
            $(['p1', 'p2']).each(function(k, player) {
                markup.find('.' + player + ' .guess').text(round[player]);
            });
            $('ul.round-list').append(markup);
        });
    });
}
