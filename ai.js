// {0: 'up', 1: 'left', 2: 'down', 3: 'right'}
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
        return !this.children;
    }
}

class AI {
    constructor(root_state, search_depth = 3) {
        this.root = new Node(root_state, MAX_PLAYER);
        this.search_depth = search_depth;
        this.simulator = new Game(...root_state);
    }
    
    build_tree(node = null, depth = 0, ec = false) {
        if (node === null) {
            node = this.root;
        }
        if (depth === this.search_depth) {
            return;
        }
        
        this.simulator.reset(...node.state)
        if (node.player_type === MAX_PLAYER) {
            for (direction in MOVES) {
                if (this.simulator.move(direction)) {
                    node.children.push([direction, new Node(this.simulator.get_state(), CHANCE_PLAYER)]);
                }
                this.simulator.reset(...node.state);
            }
        } else if (node.player_type === CHANCE_PLAYER) {
            placements = this.simulator.get_open_tiles();
            for (placement in placements) {
                this.simulator.tile_matrix[placement[0]][placement[1]] = 2;
                node.children.push([null, new Node(this.simulator.get_state(), MAX_PLAYER)]);
                this.simulator.reset(...node.state);
            }
        }
        
        for (child in node.children) {
            this.build_tree(child[1], depth+1)
        }
    }
    
    expectimax(node = null) {
        if (node === null) {
            node = this.root;
        }
        
        if (node.is_terminal()) {
            return [null, node.state[1]];
        } else if (node.player_type === MAX_PLAYER) {
            let best_direction = -1;
            let value = -1;
            for (child in node.children) {
                if (this.expectimax(child[1])[1] > child[1]) {
                    best_direction = child[0];
                    value = child[1];
                }
            }
            return [best_direction, value];
        } else if (node.player_type === CHANCE_PLAYER) {
            let value = 0;
            for (child in node.children) {
                value += this.expectimax(child[1])[1];
            }
            value /= node.children.length;
            return [null, value];
        }
    }
    
    probability(node) {
        return 0.0;
    }
    
    
}
