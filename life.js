    (function() {
        var _ = self.Life = function(seed){
            this.seed = seed;
            this.height = seed.length;
            this.width = seed[0].length;

            this.prevBoard = [];
            this.board = cloneArray(seed);
        };

        _.prototype = { 
            next: function(){
                this.prevBoard = cloneArray(this.board);

                for(var row=0;row<this.height;row++){
                    for(var col=0;col<this.width;col++){
                        var neighbors = this.aliveNeighbors(this.prevBoard,col,row);
                        var alive = !!this.board[row][col];

                        if(alive){
                            if(neighbors < 2 || neighbors > 3){
                                this.board[row][col] = 0;
                            }
                        }
                        else{
                            if(neighbors == 3){
                                this.board[row][col] = 1;
                            }
                        }
                    }
                }

            },

            aliveNeighbors : function(array,col,row){

                var prevRow = array[row-1] || [];
                var nextRow = array[row + 1] || [];

                return [
                    prevRow[col-1],prevRow[col],prevRow[col+1],
                    array[row][col-1],array[row][col+1],
                    nextRow[col-1],nextRow[col],nextRow[col+1]
                ].reduce(function(prev,cur){
                   return prev + !!cur; 
                },0);

            },

            toString: function(){
                return this.board.map(function (row) { return row.join(' '); }).join('\n');
            }
        }

    })();

    //helpers
    // warning : only clones 2D arrays
    function cloneArray(array){
        return array.slice().map(function(row) { return row.slice(); });
    }

    var game = new Life([
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,1,1,1,0],
        [0,1,1,1,0,0],
        [0,0,0,0,0,0]
    ]);

    console.log(game + '')

    game.next();

    console.log(game + '');

    game.next();

    console.log(game + '');

    game.next();

    console.log(game + '');
