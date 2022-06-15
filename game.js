function deepcopy(current_array) {
    let new_array = [];
    for (let i = 0; i < current_array.length; i++) {
        new_array[i] = current_array[i].slice();
    }
    return new_array
}

function add(accumulator, a) {
    return accumulator + a;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


class Game {
    constructor(init_tile_matrix = null, init_score = 0) {
        this.board_size = 4;
        this.reset(init_tile_matrix, init_score);
    }
    
    // resets the game using the given initialization state and total points
    reset(init_tile_matrix = null, init_score = 0) {
        this.undoMat = [];
        this.score = init_score;
        if (init_tile_matrix === null) {
            this.tile_matrix = this.new_tile_matrix();
            this.place_random_tile();
            this.place_random_tile();
        } else {
            this.tile_matrix = deepcopy(init_tile_matrix);
        }
        this.board_size = this.tile_matrix.length;
    }
    
    new_tile_matrix() {
        let _tile_matrix = [];
        for (let i = 0; i < this.board_size; i++) {
            let _ = [];
            for (var j = 0; j < this.board_size; j++) {
                _.push(0);
            }
            _tile_matrix.push(_);
        }
        return _tile_matrix
    }
    
    // performs a move in the specified direction and places a random tile
    move_and_place(direction) {
        if (this.move(direction)) {
            this.place_random_tile();
        }
    }

    // moves in the specified direction
    move(direction) {
        let moved = false;
        this.addToUndo();
        for (let i = 0; i < direction; i++) {
            this.rotate_matrix_clockwise();
        }
        if (this.can_move()) {
            this.move_tiles();
            this.merge_tiles();
            moved = true;
        }
        for (let i = 0; i < (4 - direction) % 4; i++) {
            this.rotate_matrix_clockwise();
        }
        return moved
    }
    
    move_tiles() {
        var tm = this.tile_matrix
        for (let i = 0; i < this.board_size; i++) {
            for (let j = 0; j < this.board_size - 1; j++) {
                while (tm[i][j] == 0 && tm[i].slice(j).reduce(add, 0) > 0) {
                    for (let k = j; k < this.board_size - 1; k++) {
                        tm[i][k] = tm[i][k + 1]
                    }
                    tm[i][this.board_size - 1] = 0
                }
            }
        }
    }
    
    merge_tiles() {
        let tm = this.tile_matrix
        for (let i = 0; i < this.board_size; i++) {
            for (let k = 0; k < this.board_size - 1; k++) {
                if (tm[i][k] == tm[i][k + 1] && tm[i][k] != 0) {
                    tm[i][k] = tm[i][k] * 2
                    tm[i][k + 1] = 0
                    this.score += tm[i][k]
                    this.move_tiles()
                }
            }
        }
    }
    
    place_random_tile() {
        let choices = []
        for( let i = 0 ; i < this.board_size; i ++ ) {
            for( let j = 0 ; j < this.board_size; j ++ ) {
                if (this.tile_matrix[i][j] == 0){
                    choices.push([i, j])
                }
            }
        }
        let choice = getRandomInt(0, choices.length);
        let i = choices[choice][0];
        let j = choices[choice][1];
        this.tile_matrix[i][j] = 2
        
    }
    
    undo() {
        if (this.undoMat.length > 0) {
            let m = this.undoMat.pop()
            this.tile_matrix = m[0]
            this.score = m[1]
        }
    }
    
    addToUndo() {
        this.undoMat.push([deepcopy(this.tile_matrix), this.score])
    }
    
    rotate_matrix_clockwise() {
        let tm = this.tile_matrix
        for (let i = 0; i < parseInt(this.board_size/2); i++) {
            for (let k = i; k < this.board_size - i - 1; k++) {
                let temp1 = tm[i][k]
                let temp2 = tm[this.board_size - 1 - k][i]
                let temp3 = tm[this.board_size - 1 - i][this.board_size - 1 - k]
                let temp4 = tm[k][this.board_size - 1 - i]
                tm[this.board_size - 1 - k][i] = temp1
                tm[this.board_size - 1 - i][this.board_size - 1 - k] = temp2
                tm[k][this.board_size - 1 - i] = temp3
                tm[i][k] = temp4
            }
        }
    }
    
    can_move() {
        let tm = this.tile_matrix
        for (let i = 0; i < this.board_size; i++) {
            for (let j = 1; j < this.board_size; j++) {
                if (tm[i][j-1] == 0 && tm[i][j] > 0) {
                    return true;
                } else if ((tm[i][j-1] == tm[i][j]) && tm[i][j-1] != 0) {
                    return true;
                }
            }
        }
        return false;
    }
    
   game_over() {
        let found_dir = false;
        for (let i = 0; i < 4; i++) {
            this.rotate_matrix_clockwise();
            if (this.can_move()) {
                found_dir = true;
            }
        }
        return !found_dir
    }
    
    save_state(filename="savedata") {
        return
    }
    
    load_state(filename="savedata") {
        return
    }
    
    load_state_line(line) {
        return
    }
    
    
    get_open_tiles() {
        let tiles = []
        for (let i = 0; i < this.board_size; i++) {
            for (let j = 0; j < this.board_size; j++) {
                if (this.tile_matrix[i][j] == 0) {
                    tiles.push([i,j])
                }
            }
        }
        return tiles
    }
    
    
    get_state() {
        return [this.tile_matrix, this.score]
    }
}