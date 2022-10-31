# 2048AI: Web 2048 with Expectimax for Auto Playing

Entrance
-----
https://shikanchen.github.io/2048AI/

Auto Agent
-----
The agent is a depth-3 game tree, designed in a structure that the AI player as a max player and game as a chance player (generating a 2-tile at a random spot). The game tree is evaluated in weights by the expectimax algorithm to compute decisions for the agent.

Design Evaluation Functions
------
```
prob = _matrix.length + prob / (i + j + 1);
```
The current developing heuristic value is account for the size of the matrix and the manhattan distance between tiles.
