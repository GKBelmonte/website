
var PlayerColor = new Object();
PlayerColor.Black = -1;
PlayerColor.White = 1;

var Direction = new Object();
Direction.Left = 6;
Direction.UpLeft = 7;
Direction.Up = 0;
Direction.UpRight = 1;
Direction.Right = 2;
Direction.DownRight = 3;
Direction.Down = 4;
Direction.DownLeft = 5;


Direction.GetDirectionFromCoordinatePair = function ( /*int*/ kk,/* int*/ ll)
{
    if (0 > kk)//General up
    {
        if (ll > 0)//Right
            return Direction.UpRight;
        else if (ll == 0)//Neither
            return Direction.Up;
        else //Left
            return Direction.UpLeft;
    }
    else if (0 == kk) //Left or right
    {
        if (ll > 0)//Right
            return Direction.Right;
        else if (ll == 0)//Neither
            throw new ArgumentException("The coordinates must be non-zero for a direction to exist");
        else //Left
            return Direction.Left;
    }
    else //General down 
    {
        if (ll > 0)//Right
            return Direction.DownRight;
        else if (ll == 0)//Neither
            return Direction.Down;
        else //Left
            return Direction.DownLeft;
    }
}


function GotchaEngine ( mind )
{
  this.Turn = PlayerColor.Black;
  this.Board = new Board();
  this.CtrlZStack = new Array();
  this.GameOver = false;
  this._lastMove = {"col":0, "dir":0, "row":0};
  this.Mind = mind;
}

GotchaEngine.prototype.CheckForGameOver = function  ()
{
    var _board = this.Board;
    var _turn = this.Turn;
    for(var ii = 0; ii < 4;++ ii)
    {
        for(var jj = 0; jj< 4;++ jj)
        {
            var fromVal = _board.GetCell(ii, jj);
            if (fromVal > 0 && _turn == PlayerColor.White || fromVal < 0 && _turn == PlayerColor.Black)
            {
                for(var kk = -1 ; kk < 2; ++kk) 
                {
                    for(var ll =-1;  ll <2 ; ++ll)
                    {
                        var row = ii + kk;
                        var col = jj + ll;
                        if (kk == 0 && ll == 0 || row < 0 || row > 3 || col < 0 || col > 3)
                            continue;
                        var toVal = _board.GetCell(row, col);
                        if (toVal >= 0 && _turn == PlayerColor.White || toVal <= 0 && _turn == PlayerColor.Black)
                        { _gameOver = false ; return ; }
                    }
                }

            }
        }
    }
    _gameOver = true;
}

GotchaEngine.prototype.Undo =function()
{
    var _board = this.Board;
    var  CtrlZStack = this.CtrlZStack;
    _board = mCtrlZStack[mCtrlZStack.length - 1];
    CtrlZStack.RemoveAt(mCtrlZStack.length - 1);
    _board = mCtrlZStack[mCtrlZStack.length - 1];
    CtrlZStack.RemoveAt(mCtrlZStack.length - 1);
}



GotchaEngine.prototype.MoveMedLevel = function ( number,  letter,  dir)
{
    var error = "";
    var row = 0;
    switch (number)
    {
        case '1':
            row = 0;
            break;
        case '2':
            row = 1;
            break;
        case '3':
            row = 2;
            break;
        case '4':
            row = 3;
            break;
        default:
            error = "The number provided is not correct. Please try again";
            break;
    }
    if (error.length > 0)
        return error;

    var col = 0;
    switch (letter)
    {
        case 'A':
        case 'a':
            col = 0;
            break;
        case 'B':
        case 'b':
            col = 1;
            break;
        case 'C':
        case 'c':
            col = 2;
            break;
        case 'D':
        case 'd':
            col = 3;
            break;
        default:
            error = "The letter provided is not correct. Please try again";
            break;
    }
    if (error.length > 0)
        return error;

    var dirEnum = Direction.Up;

       
    if (dir == "UpLeft")
        dirEnum = Direction.UpLeft;
    else if (dir == "UpRight")
        dirEnum = Direction.UpRight;
    else if (dir == "DownLeft")
        dirEnum = Direction.DownLeft;
    else if (dir == "DownRight")
        dirEnum = Direction.DownRight;
    else if (dir == "Up")
        dirEnum = Direction.Up;
    else if (dir == "Down")
        dirEnum = Direction.Down;
    else if (dir == "Left")
        dirEnum = Direction.Left;
    else if (dir == "Right")
         dirEnum = Direction.Right;
    else
        error = "Unrecognized direction. We're on a 2-d board.";

    if (error.length > 0)
        return error;

    return this.MoveLowLevel(row, col, dirEnum);
}

GotchaEngine.prototype.MoveLowLevel = function ( /*int*/ row, /*var*/col, /*Direction*/ dir)
{
    var _board = this.Board;
    var _turn = this.Turn;
    
    var _oldBoard = new Board(_board);
    var cellValue = _board.GetCell(row, col);
    if (cellValue == 0)
        return "No pieces in the location. Try again.";
    else if (cellValue < 0 && _turn == PlayerColor.Black || cellValue > 0 && _turn == PlayerColor.White)
    {
        var s = this._move(row, col, dir, cellValue, false);

        if (s.length > 0) //s non-empty indicates error
            return s;
    }
    else
    {
        var s  = "It's "+ (_turn == PlayerColor.White ? "white" : "black")+" turn to play. Try again.";
        return s;
    }
    this.Turn = (_turn == PlayerColor.White ? PlayerColor.Black : PlayerColor.White);
    this.CheckForGameOver();
    if( _gameOver )
    {
        var s = "GAME OVER: "+(_turn == PlayerColor.White ? "black" : "white")+" wins";
        return s;
    }
    else
    {
        this.CtrlZStack.push(_oldBoard);
        return "OK";
    }
}

GotchaEngine.prototype._move = function (/*int*/ row, /*int*/ col, /*Direction*/ dir, /*int*/ cellValue, /*bool*/ turn)
{
    var intDir = /*(int)*/dir;
    var avCases = 0;

    // Find how many cells are avalaible.
    avCases = this._getCellsInDirection(row, col, intDir);

    var s = "";
    if (avCases == 0)
    {
        s = "The move in direction "+dir.toString()+" is illegal. Try again.";
        return s;
    }

    cellValue = this._makeMoveInDirection(row, col, dir, cellValue, avCases);

    if(turn)
        _turn = (_turn == PlayerColor.White ? PlayerColor.Black : PlayerColor.White); 

    return s;
}

var DIRECTION_MODIFIER_LOOKUP = 
        [ 
            [ -1, 0 ], //Up
            [ -1, 1 ], //UpRight
            [ 0, 1 ],  //Right
            [ 1, 1 ],
            [ 1, 0 ],
            [ 1, -1 ],
            [ 0, -1 ],
            [ -1, -1 ]
        ];
GotchaEngine.prototype._getCellsInDirection = function ( row,  col,  dir)
{
    var _board= this.Board;
    var _turn  = this.Turn;
    var ii_mod = DIRECTION_MODIFIER_LOOKUP[dir][ 0]; //(dir) % 4 > 0 ? (dir > 3 ? -1 : +1) : (0); 
    var jj_mod = DIRECTION_MODIFIER_LOOKUP[dir][ 1]; //((dir + 6) % 8) % 4 > 0 ? (((dir + 6) % 8) > 3 ? -1 : +1) : (0);

    var raw = _board._board;//get the raw data rep to speed stuff
    var res = 0;

    if (_turn == PlayerColor.Black)
    {
        var ii = row + ii_mod * (1);
        var jj = col + jj_mod * (1);
        if (ii >= 0 && ii < 4 && jj >= 0 && jj < 4  && raw[ii][jj] <= 0)
        {
            ++res;
            ii += ii_mod * (1);
            jj += jj_mod * (1);
            if (ii >= 0 && ii < 4 && jj >= 0 && jj < 4 && raw[ii][jj] <= 0)
            {
                ++res;
                ii += ii_mod * (1);
                jj += jj_mod * (1);
                if (ii >= 0 && ii < 4 && jj >= 0 && jj < 4 && raw[ii][jj] <= 0)
                    ++res;
            }

        }
    }
    else
    {
        var ii = row + ii_mod * (1);
        var jj = col + jj_mod * (1);
        if (ii >= 0 && ii < 4 && jj >= 0 && jj < 4 && raw[ii][jj] >= 0)
        {
            ++res;
            ii += ii_mod * (1);
            jj += jj_mod * (1);
            if (ii >= 0 && ii < 4 && jj >= 0 && jj < 4 && raw[ii][jj] >= 0)
            {
                ++res;
                ii += ii_mod * (1);
                jj += jj_mod * (1);
                if (ii >= 0 && ii < 4 && jj >= 0 && jj < 4 && raw[ii][jj] >= 0)
                    ++res;
            }
                
        }
    }
    return res;
}

GotchaEngine.prototype._makeMoveInDirection = function (/*int */row, /*int */col, /*Direction*/ dir, /*int */cellValue, /*int*/ avCases)
{
    var _board = this.Board;
    var _turn = this.Turn;
    _board.SetCell(row, col, 0);
    var row_mod = DIRECTION_MODIFIER_LOOKUP[dir][ 0];
    var col_mod = DIRECTION_MODIFIER_LOOKUP[dir][ 1];
    for (var ii = 1; ii <= avCases && cellValue != 0; ++ii)
    {
        var value = _turn * ii;
        value = Math.abs(value) > Math.abs(cellValue) ? cellValue : value;
        var toAdd = (ii == avCases) ? cellValue : value;
        _board.AddToCell(row + ii * row_mod, col+ii*col_mod, toAdd);
        cellValue -= value;
        
    }
    this._lastMove.col = col; this._lastMove.row = row; this._lastMove.dir = dir;
    return cellValue;
}

GotchaEngine.prototype.LogBoard = function()
{
  console.log(this.Board.toString()) ;
}











        function Board ( other )
        {
          if(typeof other !== 'undefined')
          {
            this._board = 
            [
                [other._board[0][0],other._board[0][1],other._board[0][2],other._board[0][3]],
                [other._board[1][0],other._board[1][1],other._board[1][2],other._board[1][3]],
                [other._board[2][0],other._board[2][1],other._board[2][2],other._board[2][3]],
                [other._board[3][0],other._board[3][1],other._board[3][2],other._board[3][3]]
            ]
          }
          else
          {
           this._board = 
            [
            
                [-10,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,10]
            ];
          }
        }


        Board.prototype.Print = function()
        {
            //Console.WriteLine(this);

            console.log("     A   B   C   D");
            for (var ii = 0; ii < 4; ++ii)
            {
                console.log( (ii+1).toString() + "|");
                var build = "";
                for (var jj = 0; jj < 4; ++jj)
                {
                    //if (_board[ii][jj] < 0) Console.ForegroundColor = ConsoleColor.Red;
                    //else if (_board[ii][jj] > 0) Console.ForegroundColor = ConsoleColor.Cyan;
                    //else Console.ForegroundColor = ConsoleColor.DarkBlue;
                    
                    build += (this._board[ii][jj].toString()).PadLeft(' ',4);
                    //Console.ForegroundColor = ConsoleColor.Gray;
                }
                console.log(build);
            }
        }

        Board.prototype.GetCell = function( row,  col)
        {
            return this._board[row][col];
        }

        Board.prototype.SetCell = function( row,  col,  val)
        {
            this._board[row][col] = val;
        }

        Board.prototype.AddToCell = function( row ,  col,  val)
        {
            this._board[row][col] += val;
        }


        Board.prototype.toString = function()
        {
            build = new Array();
           build.push("     A    B    C    D\n");
            for (var ii = 0; ii < 4; ++ii)
            {
                build.push( (ii+1).toString() + "|");
                for (var jj = 0; jj < 4; ++jj)
                {
                    build.push((this._board[ii][jj].toString()).PadLeft(' ',5));
                }
                build.push('\n');
            }
            return build.join('');
        }
    
    
    
    function b_test()
    {
      var eng = new GotchaEngine(null);
      eng.MoveMedLevel('1','A','Right');
      eng.LogBoard();
      eng.MoveMedLevel('4','D','Left');
      eng.LogBoard();
      eng.MoveMedLevel('1','D','DownLeft');
      eng.LogBoard();
      eng.MoveMedLevel('4','B','Left');
      eng.LogBoard();
      eng.MoveMedLevel('1','C','DownLeft');
      eng.LogBoard();
      eng.MoveMedLevel('4','C','Left');
      eng.LogBoard();
      eng.MoveMedLevel('2','C','Down');
      eng.LogBoard();
      eng.MoveMedLevel('4','B','Left');
      return eng;
    }