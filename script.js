var len=10;
var wall ="rgb(255, 255, 255)";
var original="rgb(52, 52, 52)";
var path='#fce303';

function setup(){
    var maze_container=document.getElementById('maze_container');

    for(var i=0; i<10; i++){
        var row=document.createElement('div');
        row.className='row row' + (i+1);
        row.id='row'+(i+1);

        for(var j=0; j<10; j++){
            var node=document.createElement('div');
             node.className='node node'+((i*10)+(j+1));
            node.id='node' + ((i*10)+(j+1));
          node.style.border='1px solid gray';

            if(((i*10)+(j+1))!=1  && ((i*10)+(j+1))!=100 ){
                node.style.backgroundColor = original;
                node.onclick=function(){
                    clicked (this.id);
                }
            }

            row.appendChild(node);
        }

        maze_container.appendChild(row);
    }
}

function clicked(elementID){
    var node=document.getElementById(elementID);
    if(node.style.backgroundColor==wall){
        node.style.backgroundColor=original;
    }
    else{
        node.style.backgroundColor=wall;
    }
}

function reset(){
    for(var i=2; i<100; i++){
        var node=document.getElementById('node' + i);

        node.style.backgroundColor=original;
    }
    document.getElementById('node1').style.backgroundColor=brown;
    document.getElementById('node100').style.backgroundColor=rgb(31, 31, 172);
}


function solvemaze() {
    if (haswall()) {
        alert('resetting the maze');
        reset();
        return;
    }

    var maze = [];
    for (let i = 0; i < len; i++) {
        maze[i] = new Array(len).fill(0);
    }

    var rowcount = 0;
    var colcount = 0;
    var nodeVal = 1;

    for (var i = 1; i < (len * len + 1); i++) {
        if (document.getElementById('node' + i).style.backgroundColor == wall) {
            maze[rowcount][colcount] = -1;
        } else {
            maze[rowcount][colcount] = nodeVal;
        }
        colcount++;

        if (colcount == len) {
            rowcount++;
            colcount = 0;
        }
        nodeVal++;
    }

    var adjlist = {};
    var possiblemoves = [
        [-1, 0],
        [1, 0],
        [0, 1],
        [0, -1]
    ];

    for (var row = 0; row < maze.length; row++) {
        for (var col = 0; col < maze[row].length; col++) {
            if (maze[row][col] == -1) {
                continue;
            }
            var currnode = maze[row][col];
            var neighbors = [];

            for (var k = 0; k < possiblemoves.length; k++) {
                var nrow = possiblemoves[k][0] + row;
                var ncol = possiblemoves[k][1] + col;
                if ((nrow >= 0 && nrow < maze.length) && (ncol >= 0 && ncol < maze[0].length)) {
                    if (maze[nrow][ncol] != -1) {
                        neighbors.push([nrow, ncol]);
                    }
                }
            }
            adjlist[currnode] = neighbors;
        }
    }

    var visited = [];
    var prev = new Array(len * len).fill(0);
    for (var i = 0; i < len; i++) {
        visited[i] = new Array(len).fill(false);
    }
    var queue = [];
    var solved = false;
    queue.push([0, 0]);
    while (queue.length > 0) {
        var nodecoor = queue.shift();
        var node = maze[nodecoor[0]][nodecoor[1]];
        visited[nodecoor[0]][nodecoor[1]] = true;

        if (node == 100) {
            solved = true;
            break;
        }

        var adj = adjlist[node];
        for (var k = 0; k < adj.length; k++) {
            var n = adj[k];
            if (!visited[n[0]][n[1]]) {
                visited[n[0]][n[1]] = true;
                queue.push(n);
                prev[maze[n[0]][n[1]] - 1] = node - 1;
            }
        }
    }

    if (!solved) {
        alert("This maze cannot be solved");
        reset();
        return "";
    }

    // retrace
    var endnode = maze[9][9];
    document.getElementById('node' + endnode).style.backgroundColor = path;

    var previous = endnode - 1;
    while (true) {
        var node = prev[previous];
        try {
            document.getElementById('node' + (node + 1)).style.backgroundColor = path;
        } catch (err) {
            break;
        }

        if (node == 0) {
            break;
        } else {
            previous = node;
        }
    }
    document.getElementById('node1').style.backgroundColor = path;
}

 function haswall(){
     for(var i=1; i<101; i++){
         if(document.getElementById('node'+i).style.backgroundColor==wall){
             return true;
         }
     }
    return false;
 }
