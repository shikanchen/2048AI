let game = new Game();

let DEBUG = true
let gameovered = false;

if (DEBUG){
    var script=document.createElement('script');
    script.src='https://rawgit.com/paulirish/memory-stats.js/master/bookmarklet.js';
    document.head.appendChild(script);
}


$(document).ready(function(){
    prepareForMobile();
    $("body").bind("touchmove", function(e){
        e.preventDefault();
    });
    newgame();
});

function prepareForMobile(){
    if( documentWidth > 500 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    $('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.04*cellSideLength);

    $('.number-cell').css('width',cellSideLength);
    $('.number-cell').css('height',cellSideLength);
    $('.number-cell').css('border-radius',0.02*cellSideLength);
}

function newgame() {
    game.reset();
    gameovered = false;
    [board, score] = game.get_state();
    updateBoardView(true);
}

function auto_move() {
    ai = new AI(game.get_state());
    direction = ai.compute_decision();
    if (direction != -1) {
        game.move_and_place(direction);
        [board, score] = game.get_state();
        updateBoardView();
        updateScore();
    }
}

function auto() {
    if (game.game_over() && !gameovered) {
        gameovered = true;
        alert('Game over！Score：'+ score);
        return;
    }
    auto_move();
    setTimeout(function() {
        auto();
    }, 50);
}

function updateBoardView(init=false){

    if ( init ) {
        $("#grid-container").empty()
        for( let i = 0 ; i < 4 ; i ++ ) {
            for( let j = 0 ; j < 4 ; j ++ ){
                $("#grid-container").append( '<div class="grid-cell" id="grid-cell-'+i+'-'+j+'"></div>' );
                let gridCell = $('#grid-cell-'+i+"-"+j);
                gridCell.css('top', getPosTop( i , j ) );
                gridCell.css('left', getPosLeft( i , j ) );
            }
        }
    }

    for( let i = 0 ; i < 4 ; i ++ )
        for( let j = 0 ; j < 4 ; j ++ ){
            if ( init ){
                $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            }
            let theNumberCell = $('#number-cell-'+i+'-'+j);

            if ( board[i][j] == 0 ){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2 );
                theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2 );
                theNumberCell.text('');
            }
            else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
                theNumberCell.css('color',getNumberColor( board[i][j] ) );
                theNumberCell.text( board[i][j] );
            }

        }

    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');
}

function createColorForNumber(num){
    let color = { r:256,g:256,b:256}
    let dec = 64;
    while(num > 1){
        num /= 2;
        if(color.b > 0) color.b -= dec;
        else if(color.g > 0) {
            color.g -= dec;
        }
        else if(color.r > 0) {
            color.r -= dec;
            color.g = 256;
        }
    }
    return "rgb("+color.r+","+color.g+","+color.b+")";

}

function updateScore() {
    $('#score').text(score);
}

$(document).keydown( function( event ){
//  event.preventDefault();
    switch( event.keyCode ){
        case 37: //left
            game.move_and_place(0)
            break;
        case 38: //up
            game.move_and_place(1);
            break;
        case 39: //right
            game.move_and_place(2);
            break;
        case 40: //down
            game.move_and_place(3);
            break;
        default: //default
            break;
    }
    [board, score] = game.get_state()
    updateBoardView()
    updateScore()
    if (game.game_over() && !gameovered) {
        gameovered = true;
        alert('Game over！Score：'+ score);
    }
});
