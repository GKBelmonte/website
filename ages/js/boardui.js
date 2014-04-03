var g_startOffset = null;
var g_selectedPiece = null;
var moveNumber = 1;

var g_allMoves = [];
var g_playerWhite = true;
var g_changingFen = false;
var g_analyzing = false;

var g_uiBoard;
var g_cellSize = 45;

//G.K.: Added these to evalute game state and
//how to handle mates and logs
var g_inProgress = false;

var g_minPriorityForLog = -1;

var g_someMate= false;

function Log(message, priority)
{
	if(priority == undefined)
		priority = 5;
	if(priority <= g_minPriorityForLog)
		console.log(message);
}

function PostMessageToEngine(message)
{
	Log("Post message: "  + message,2);
	g_backgroundEngine.postMessage(message);
}


function UINewGame() {
    Log('@UINewGame');
    moveNumber = 1;

    var pgnTextBox = document.getElementById("PgnTextBox");
    pgnTextBox.value = "";

    EnsureAnalysisStopped();
    ResetGame();
    if (InitializeBackgroundEngine()) {
        PostMessageToEngine("go");
    }
    g_allMoves = [];
    RedrawBoard();

    if (!g_playerWhite) {
        SearchAndRedraw(); //G.K.: Just call this to start stuff.
    }
    Log('@UINewGame END');
}

//Cleanly terminates the background engine
function EnsureAnalysisStopped() {
    Log('@EnsureAnalysisStopped');
    if (g_analyzing && g_backgroundEngine != null) {
        Log("\tTerminating...")
        g_backgroundEngine.terminate();
        g_backgroundEngine = null;
    }
    Log('@EnsureAnalysisStopped END');
}

//Unknown: Probably none relevant
function UIAnalyzeToggle() {
    Log('@UIAnalyzeToggle');
    if (InitializeBackgroundEngine()) {
        if (!g_analyzing) {
            PostMessageToEngine("analyze");
        } else {
            EnsureAnalysisStopped();
        }
        g_analyzing = !g_analyzing;
        document.getElementById("AnalysisToggleLink").innerText = g_analyzing ? "Analysis: On" : "Analysis: Off";
    } else {
        alert("Your browser must support web workers for analysis - (chrome4, ff4, safari)");
    }
    Log('@UIAnalyzeToggle END');
}

//Unknown : probably irrelevant
function UIChangeFEN() {
    Log('@UIChangefen');
    if (!g_changingFen) {
        var fenTextBox = document.getElementById("FenTextBox");
        var result = InitializeFromFen(fenTextBox.value);
        if (result.length != 0) {
            UpdatePVDisplay(result);
            return;
        } else {
            UpdatePVDisplay('');
        }
        g_allMoves = [];

        EnsureAnalysisStopped();
        InitializeBackgroundEngine();

        g_playerWhite = !!g_toMove;
        PostMessageToEngine("position " + GetFen());

        RedrawBoard();
    }
    Log('@UIChangefen END');
}

function UIChangeStartPlayer() {
    Log("@UIChangeStartPlayer");
    g_playerWhite = !g_playerWhite;
    RedrawBoard();
    Log("@UIChangeStartPlayer END");
    
}

function UpdatePgnTextBox(move) {
    var pgnTextBox = document.getElementById("PgnTextBox");
    if (g_toMove != 0) {
        pgnTextBox.value += moveNumber + ". ";
        moveNumber++;
    }
    pgnTextBox.value += GetMoveSAN(move) + " ";
}

function UIChangeTimePerMove() {
    var timePerMove = document.getElementById("TimePerMove");
    g_timeout = parseInt(timePerMove.value, 10);
}

function FinishMove(bestMove, value, timeTaken, ply) {
    Log('@FinishMove');
    Log('\t' + bestMove);
    Log('\t' + value);
    Log('\t' + timeTaken);
    Log('\t' + ply);
    if (bestMove != null) {
        UIPlayMove(bestMove, BuildPVMessage(bestMove, value, timeTaken, ply));
    } else {
        alert("Checkmate!");
    }
    Log('@FinishMove END');
}

function UIPlayMove(move, pv) {
    Log('@UIPlayMove');
    Log('\t' + move);
    Log('\t' + pv);
    
    UpdatePgnTextBox(move);
    g_allMoves[g_allMoves.length] = move;
    MakeMove(move);

    UpdatePVDisplay(pv);

    UpdateFromMove(move);
    Log('@UIPlayMove END');
}

function UIUndoMove() {
    Log("@UIUndoMove");
  if (g_allMoves.length == 0) {
    return;
  }

  if (g_backgroundEngine != null) {
    g_backgroundEngine.terminate();
    g_backgroundEngine = null;
  }

  UnmakeMove(g_allMoves[g_allMoves.length - 1]);
  g_allMoves.pop();

  if (g_playerWhite != !!g_toMove && g_allMoves.length != 0) {
    UnmakeMove(g_allMoves[g_allMoves.length - 1]);
    g_allMoves.pop();
  }

  RedrawBoard();
   Log("@UIUndoMove end");
}

function UpdatePVDisplay(pv) {
    Log('@UIPVDDisplay');
    Log('\t' + pv);
    if (pv != null) {
        var outputDiv = document.getElementById("output");
        if (outputDiv.firstChild != null) {
            outputDiv.removeChild(outputDiv.firstChild);
        }
        outputDiv.appendChild(document.createTextNode(pv));
    }
    Log('@UIPVDDisplay END');
}

//G.K.: Magic happens here
function SearchAndRedraw() {
    Log('@SearchAndRedraw');
    if (g_analyzing) {
        Log("\tAnalysing...")
        EnsureAnalysisStopped();
        InitializeBackgroundEngine();
        PostMessageToEngine("position " + GetFen());
        PostMessageToEngine("analyze");
        return;
    }

    if (InitializeBackgroundEngine()) {
        PostMessageToEngine("search " + g_timeout);
    } else {
	Search(FinishMove, 99, null);
    }
	g_inProgress = true;
    Log('@SearchAndRedraw END');
}

var g_backgroundEngineValid = true;
var g_backgroundEngine;

// G.K.: Tries to create a Worker, unless the worker is already created
// in which case it returns true.
// true if success.
// false if failure.
function InitializeBackgroundEngine() {
    Log('@InitializeBackgroundEngine');
    if (!g_backgroundEngineValid) {
        return false;
    }

    if (g_backgroundEngine == null) {
        g_backgroundEngineValid = true;
        try {
            g_backgroundEngine = new Worker("js/garbochess.js");
            g_backgroundEngine.onmessage = 
            
            function (e) 
            {
                Log('@lambda:onmessage ' + e.data );
                var obj = ReadProperMessage(e.data);
                if(obj !== null)
                {
                    if(obj.command == "getPieceValues")
                    {
                        Log(obj.vals,2);
                    }
					else if(obj.command = "getMatValues")
						Log(obj.vals,2);
                }
                else {
                    if (e.data.match("^pv") == "pv") {
                        UpdatePVDisplay(e.data.substr(3, e.data.length - 3));
                    } else if (e.data.match("^message") == "message") {
                        EnsureAnalysisStopped();
                        UpdatePVDisplay(e.data.substr(8, e.data.length - 8));
                    } else if (e.data === "Unrecognized command"){

                        Log("\tUnrecognized command")
                    }
                    else {
                        Log('\tMove From str: ' + GetMoveFromString(e.data),2);
                        UIPlayMove(GetMoveFromString(e.data), null);
						g_inProgress = false;
                    }
					//Check information about mate
					var tempMate = false;
					try
					{
						tempMate = e.data.contains("checkmate") || e.data.contains("stalemate");
					}
					catch(execption)
					{
						tempMate = false;
					}
					g_someMate = tempMate;
                }
                Log('@lambda:onmessage END');
            }
            
            
            g_backgroundEngine.error = function (e) {
                alert("Error from background worker:" + e.message);
            }
            PostMessageToEngine("position " + GetFen());
            
            
        } catch (error) {
			alert("Your browser has problems with background workers. See note for details and workarounds.");
            g_backgroundEngineValid = false;
        }
    }
    Log('@InitializeBackgroundEngine END');
    return g_backgroundEngineValid;
}


function SetPieceValues(seeVals,matVals)
{
    Log("@SetPieceValues",2);
    var total = CreateProperMessage ( "setPieceValues" , seeVals )
    Log("\t" + total,2);
    PostMessageToEngine(total);
	
	total = CreateProperMessage ( "setMatValues" , matVals )
    Log("\t" + total,2);
    PostMessageToEngine(total);
    Log("@SetPieceValues END",2);
}




function UpdateFromMove(move) {
    Log('@UpdateFromMove');
    Log('\t' + move);
    
    var fromX = (move & 0xF) - 4;
    var fromY = ((move >> 4) & 0xF) - 2;
    var toX = ((move >> 8) & 0xF) - 4;
    var toY = ((move >> 12) & 0xF) - 2;

    if (!g_playerWhite) {
        fromY = 7 - fromY;
        toY = 7 - toY;
        fromX = 7 - fromX;
        toX = 7 - toX;
    }

    if ((move & moveflagCastleKing) ||
        (move & moveflagCastleQueen) ||
        (move & moveflagEPC) ||
        (move & moveflagPromotion)) {
        RedrawPieces();
    } else {
        var fromSquare = g_uiBoard[fromY * 8 + fromX];
        $(g_uiBoard[toY * 8 + toX])
            .empty()
            .append($(fromSquare).children());
    }
    Log('@UpdateFromMove END');
}

function RedrawPieces() {
    Log('@RedrawPieces');
    for (y = 0; y < 8; ++y) {
        for (x = 0; x < 8; ++x) {
            var td = g_uiBoard[y * 8 + x];
            var pieceY = g_playerWhite ? y : 7 - y;
            var piece = g_board[((pieceY + 2) * 0x10) + (g_playerWhite ? x : 7 - x) + 4];
            var pieceName = null;
            switch (piece & 0x7) {
                case piecePawn: pieceName = "pawn"; break;
                case pieceKnight: pieceName = "knight"; break;
                case pieceBishop: pieceName = "bishop"; break;
                case pieceRook: pieceName = "rook"; break;
                case pieceQueen: pieceName = "queen"; break;
                case pieceKing: pieceName = "king"; break;
            }
            if (pieceName != null) {
                pieceName += "_";
                pieceName += (piece & 0x8) ? "white" : "black";
            }

            if (pieceName != null) {
                var img = document.createElement("div");
                $(img).addClass('sprite-' + pieceName);
                img.style.backgroundImage = "url('img/sprites.png')";
                img.width = g_cellSize;
                img.height = g_cellSize;
                var divimg = document.createElement("div");
                divimg.appendChild(img);
/*
                $(divimg).draggable({ start: function (e, ui) {
                    if (g_selectedPiece === null) {
                        g_selectedPiece = this;
                        var offset = $(this).closest('table').offset();
                        g_startOffset = {
                            left: e.pageX - offset.left,
                            top: e.pageY - offset.top
                        };
                    } else {
                        return g_selectedPiece == this;
                    }
                }});

                $(divimg).mousedown(function(e) {
                    if (g_selectedPiece === null) {
                        var offset = $(this).closest('table').offset();
                        g_startOffset = {
                            left: e.pageX - offset.left,
                            top: e.pageY - offset.top
                        };
                        e.stopPropagation();
                        g_selectedPiece = this;
                        g_selectedPiece.style.backgroundImage = "url('img/transpBlue50.png')";
                    } else if (g_selectedPiece === this) {
                        g_selectedPiece.style.backgroundImage = null;
                        g_selectedPiece = null;
                    }
                });
					*/
                $(td).empty().append(divimg);
            } else {
                $(td).empty();
            }
        }
    }
    Log('@RedrawPieces END');
}

function RedrawBoard() {
    Log('@RedrawBoard');
    var div = $("#board")[0];

    var table = document.createElement("table");
    table.cellPadding = "0px";
    table.cellSpacing = "0px";
    $(table).addClass('no-highlight');

    var tbody = document.createElement("tbody");

    g_uiBoard = [];

    var dropPiece = function (e, ui) {
        Log('@lambda:dropPiece');
        Log('\t' + e);
        Log('\t' + ui);
        var endX = e.pageX - $(table).offset().left;
        var endY = e.pageY - $(table).offset().top;
        
        endX = Math.floor(endX / g_cellSize);
        endY = Math.floor(endY / g_cellSize);

        var startX = Math.floor(g_startOffset.left / g_cellSize);
        var startY = Math.floor(g_startOffset.top / g_cellSize);
        
        Log('\t(' + startX + ', ' + startY + ')->(' + endX + ', ' + endY +')');
        
        if (!g_playerWhite) {
            Log("\t !white")
            startY = 7 - startY;
            endY = 7 - endY;
            startX = 7 - startX;
            endX = 7 - endX;
        }

        var moves = GenerateValidMoves();
        var move = null;
        for (var i = 0; i < moves.length; i++) {
            if ((moves[i] & 0xFF) == MakeSquare(startY, startX) &&
                ((moves[i] >> 8) & 0xFF) == MakeSquare(endY, endX)) {
                move = moves[i];
            }
        }

        if (!g_playerWhite) {
            startY = 7 - startY;
            endY = 7 - endY;
            startX = 7 - startX;
            endX = 7 - endX;
        }

        g_selectedPiece.style.left = 0;
        g_selectedPiece.style.top = 0;
        Log('\t' + move);
        if (!(startX == endX && startY == endY) && move != null) {
            UpdatePgnTextBox(move);

            if (InitializeBackgroundEngine()) {
                Log(FormatMove('\t'+move));
                PostMessageToEngine(FormatMove(move));
            }

            g_allMoves[g_allMoves.length] = move;
            MakeMove(move);

            UpdateFromMove(move);

            g_selectedPiece.style.backgroundImage = null;
            g_selectedPiece = null;

            var fen = GetFen();
            document.getElementById("FenTextBox").value = fen;
            Log("\tsetTimeout effected")
            setTimeout("SearchAndRedraw()", 0);
        } else {
            g_selectedPiece.style.backgroundImage = null;
            g_selectedPiece = null;
        }
        Log('@lambda:dropPiece END');
    };

    for (y = 0; y < 8; ++y) {
        
        var tr = document.createElement("tr");

        for (x = 0; x < 8; ++x) {
            var td = document.createElement("td");
            td.style.width = g_cellSize + "px";
            td.style.height = g_cellSize + "px";
            td.style.backgroundColor = ((y ^ x) & 1) ? "#B9C9FE" : "#E8EDFF";
            tr.appendChild(td);
            g_uiBoard[y * 8 + x] = td;
        }

        tbody.appendChild(tr);
    }

    table.appendChild(tbody);

    $('body').droppable({ drop: dropPiece });
    $(table).mousedown(function(e) {
        if (g_selectedPiece !== null) {
            dropPiece(e);
        }
    });

    RedrawPieces();

    $(div).empty();
    div.appendChild(table);

    g_changingFen = true;
    document.getElementById("FenTextBox").value = GetFen();
    g_changingFen = false;
    
    Log('@RedrawBoard END');
}
/*********************** Parameter functions ************************/

var ParameterContainer = //g_timeout is not contained so as to not make changes to legacy code of Garbo
{
	"PopulationSize" : 12,
	"MaxGens" : 12,
	"MaxMoves" : 60
}

var g_paramsVisible = false;
function showParams ()
{
	if(g_paramsVisible)
	{
		$('.toggleHide').hide(500);
		$('.plusMinus').html('&#43;');
	}
	else
	{
		$('.toggleHide').show(500);
		$('.plusMinus').html('&#45;');
	}
	g_paramsVisible = !g_paramsVisible;
}

var g_historyVisible = false;
function showHistory ()
{
	if(g_historyVisible)
	{
		$('.history').hide(500);
		$('.showHistory').html('Show History');
	}
	else
	{
		$('.history').show(500);
		$('.showHistory').html('Hide History');
	}
	g_historyVisible = !g_historyVisible;
}

var g_notesVisible = false;
function ToggleNotes()
{
	if(g_notesVisible)
	{
		$('.note-container').hide(500);
		$('.footer2 h2').html('&#43; Notes:');
	}
	else
	{
		$('.note-container').show(500);
		var f = function() { document.body.scrollTop += 50;};
		f();
		setTimeout(f,50);
		setTimeout(f,100);
		setTimeout(f,150);
		setTimeout(f,200);
		setTimeout(f,250);
		setTimeout(f,300);
		$('.footer2 h2').html('&#45; Notes:');
	}
	g_notesVisible = !g_notesVisible;
}

function UpdateParamsGA()
{
	Log('Parameters Updated', -1);
	var Pop = ParameterContainer.PopulationSize;
	var gens = ParameterContainer.MaxGens;
	var maxMoves;
	try{Pop = parseInt( $('#in_popSize').val())}
	catch(ex) { Log("Population input invalid",0); Pop = ParameterContainer.PopulationSize;}
	try{gens = parseInt( $('#in_maxGen').val())}
	catch(ex) { Log("Generation input invalid",0); gens = ParameterContainer.MaxGens;}
	try{maxMoves = parseInt( $('#in_maxMoves').val())}
	catch(ex) { Log("Moves input invalid",0); maxMoves = ParameterContainer.MaxMoves;}
	Log("pop " + Pop + ", gens " + gens +", max Moves " + maxMoves ,2);
	ParameterContainer.PopulationSize = Pop;
	ParameterContainer.MaxGens = gens;
	ParameterContainer.MaxMoves = maxMoves;
	UIChangeTimePerMove();
}