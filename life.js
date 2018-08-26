function $(selector,container){
    return (container || document).querySelector(selector);
}

(function () {
    var _ = self.Life = function (seed) {
        this.seed = seed;
        this.height = seed.length;
        this.width = seed[0].length;

        this.prevBoard = [];
        this.board = cloneArray(seed);
    };

    _.prototype = {
        next: function () {
            this.prevBoard = cloneArray(this.board);

            for (var row = 0; row < this.height; row++) {
                for (var col = 0; col < this.width; col++) {
                    var neighbors = this.aliveNeighbors(this.prevBoard, col, row);
                    var alive = !!this.board[row][col];

                    if (alive) {
                        if (neighbors < 2 || neighbors > 3) {
                            this.board[row][col] = 0;
                        }
                    }
                    else {
                        if (neighbors == 3) {
                            this.board[row][col] = 1;
                        }
                    }
                }
            }

        },

        aliveNeighbors: function (array, col, row) {

            var prevRow = array[row - 1] || [];
            var nextRow = array[row + 1] || [];

            return [
                prevRow[col - 1], prevRow[col], prevRow[col + 1],
                array[row][col - 1], array[row][col + 1],
                nextRow[col - 1], nextRow[col], nextRow[col + 1]
            ].reduce(function (prev, cur) {
                return prev + !!cur;
            }, 0);

        },

        toString: function () {
            return this.board.map(function (row) { return row.join(' '); }).join('\n');
        }
    }



    //helpers
    // warning : only clones 2D arrays
    function cloneArray(array) {
        return array.slice().map(function (row) { return row.slice(); });
    }


})();


(function () {

    var _ = self.LifeView = function (table, size) {
        this.grid = table;
        this.size = size;
        this.started = false;
        this.autoplay = false;
        this.createGrid();
    };

    _.prototype = {
        createGrid: function () {
            var me = this;
            var fragment = document.createDocumentFragment();
            this.grid.innerHtml = '';
            this.checkBoxes = [];

            for (var y = 0; y < this.size; y++) {
                var row = document.createElement('tr');
                this.checkBoxes[y] = [];
                for (var x = 0; x < this.size; x++) {
                    var cell = document.createElement('td');
                    var checkBox = document.createElement('input');
                    checkBox.type = 'checkbox';
                    this.checkBoxes[y][x] = checkBox;
                    cell.appendChild(checkBox);
                    row.appendChild(cell);
                }

                fragment.appendChild(row);
            }

            this.grid.addEventListener('change',function(event){
                if(event.target.nodeName.toLowerCase() == 'input'){
                    me.started = false;
                };
            });

            this.grid.appendChild(fragment);
        },

        get boardArray(){
            return this.checkBoxes.map(function (row){
                return row.map(function (checkBox){
                    return checkBox.checked;
                })
            });
        },

        play: function(){
            this.game = new Life(this.boardArray);
            this.started = true;
        },

        next: function(){

            if(!this.started || this.game){
                this.play();
            }

            this.game.next();
            var board = this.game.board;
            for(var y=0;y<this.size;y++){
                for(var x=0;x<this.size;x++){
                    this.checkBoxes[y][x].checked = !!board[y][x];
                }
            }

            if(this.autoplay){
                
            }

        }
    };

})();

var lifeView = new LifeView(document.getElementById('grid'), 12);

(function(){
    
    var buttons = { 
        next : $('button.next'),
        autoplay : $('button.autoplay')
    }

    buttons.next.addEventListener('click',function(event){
        lifeView.next();
    });

    $('#autoplay').addEventListener('change',function(event){
        buttons.next.textContent = this.checked ? 'Start' : 'Next';
        lifeView.autoplay = this.checked;
    });

})();




