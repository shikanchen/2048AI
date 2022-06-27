const MOVES = [0, 1, 2, 3];
const MAX_PLAYER = 0;
const CHANCE_PLAYER = 1;

class Node {
    constructor(state, player_type) {
        this.state = [deepcopy(state[0]), state[1]];
        this.children = [];

        this.player_type = player_type;
    }

    is_terminal(){
        return this.children.length === 0;
    }
}

class AI {
    constructor(root_state, search_depth = 3) {
        this.root = new Node(root_state, MAX_PLAYER);
        this.search_depth = search_depth;
        this.simulator = new Game(...root_state);
    }

    build_tree(node = null, depth = 0) {
        if (node === null) {
            node = this.root;
        }
        if (depth === this.search_depth) {
            return;
        }

        this.simulator.reset(...node.state)
        if (node.player_type === MAX_PLAYER) {
            for (let direction of MOVES) {
                if (this.simulator.move(direction)) {
                    node.children.push([direction, new Node(this.simulator.get_state(), CHANCE_PLAYER)]);
                }
                this.simulator.reset(...node.state);
            }
        } else if (node.player_type === CHANCE_PLAYER) {
            let placements = this.simulator.get_open_tiles();
            for (let placement of placements) {
                this.simulator.tile_matrix[placement[0]][placement[1]] = 2;
                node.children.push([null, new Node(this.simulator.get_state(), MAX_PLAYER)]);
                this.simulator.reset(...node.state);
            }
        }

        for (let [_, child] of node.children) {
            this.build_tree(child, depth+1)
        }
    }

    expectimax(node = null) {
        if (node === null) {
            node = this.root;
        }

        if (node.is_terminal()) {
            return [null, node.state[1]];
        } else if (node.player_type === MAX_PLAYER) {
            let [best_direction, value] = [-1, -1];
            for (let [direction, child] of node.children) {
                let new_value = this.expectimax(child)[1];
                if (new_value > value) {
                    [best_direction, value] = [direction, new_value];
                }
            }
            return [best_direction, value];
        } else if (node.player_type === CHANCE_PLAYER) {
            let value = 0;
            for (let [_, child] of node.children) {
                value += this.expectimax(child)[1];
            }
            value /= node.children.length;
            return [null, value];
        }
    }

    probability(node) {
        let _matrix = node.state[0];
        let prob = 0.0;
        let tiles = [];
        for (let i = 0; i < _matrix.length; i++) {
            for (let j = 0; j < _matrix[i].length; j++) {
                tiles.push([_matrix[i][j], i, j]);
            }
        }
        tiles.sort((a, b) => b[0] - a[0]);
        tiles.reverse();
        for (let idx = 0; idx < _matrix.length * 2; idx++) {
            let [tile, i, j] = tiles[idx];
            if (j < 1) {
                prob += 1;
            }
        }
        let [tile, i, j] = tiles[0];
        prob = _matrix.length + prob / (i + j + 1);
        return prob;
    }

    superexpectimax(node = null) {
        if (node === null) {
            node = this.root;
        }

        if (node.is_terminal()) {
            return [null, node.state[1]];
        } else if (node.player_type === MAX_PLAYER) {
            let [best_direction, value] = [-1, -1];
            for (let [direction, child] of node.children) {
                let new_value = this.probability(child) * this.expectimax(child)[1];
                if ( new_value > value ) {
                    [best_direction, value] = [direction, new_value];
                }
            }
            return [best_direction, value];
        } else if (node.player_type === CHANCE_PLAYER) {
            let value = 0;
            for (let [_, child] of node.children) {
                value += this.probability(child) * this.expectimax(child)[1];
            }
            value /= node.children.length;
            return [null, value];
        }
    }

    compute_decision() {
        this.build_tree();
        let [direction, _] = this.expectimax(this.root);
//      let [direction, _] = this.superexpectimax(this.root);
        return direction;
    }
}
