var intervalVar = null;
var playingWhite = true;
var Running  = false;
var Victor = "none";
var WhiteVals = [0, 800, 3350, 3450, 5000, 19750, 600000];
var WhiteSee = [0, 1, 3, 3, 5, 9, 900, 0,
						0, 1, 3, 3, 5, 9, 900, 0];
var BlackVals = [0, 800, 3350, 3450, 5000, 19750, 600000];
var BlackSee = [0, 1, 3, 3, 5, 9, 900, 0,
						0, 1, 3, 3, 5, 9, 900, 0];

var CallBackObj = null;
var p_white = null;
var p_black = null;
function ResetEval()
{
	intervalVar = null;
	playingWhite = true;
	Running  = false;
	Victor = "none";
	WhiteVals = [0, 800, 3350, 3450, 5000, 19750, 600000];
	WhiteSee = [0, 1, 3, 3, 5, 9, 900, 0,
							0, 1, 3, 3, 5, 9, 900, 0];
	BlackVals = [0, 800, 3350, 3450, 5000, 19750, 600000];
	BlackSee = [0, 1, 3, 3, 5, 9, 900, 0,
							0, 1, 3, 3, 5, 9, 900, 0];

	CallBackObj = null;
	g_someMate = false;
	p_white = null;
	p_black = null;
}

function CheckCheckState()
{
    if (GenerateValidMoves().length == 0) 
	{
        return g_inCheck ? 'Checkmate' : 'Stalemate';
    }
	else
		return "no";
}


function ToggleMove()
{
	Log("called",2);
	if(!(CheckCheckState() == 'Checkmate' || CheckCheckState() == 'Stalemate' ) )
	{
		if( moveNumber > ParameterContainer.MaxMoves ) //Too many moves. Best standard material wins.
		{
			Log("Too many moves, end game", -1);
			var exitScore = NaiveScore();
			if(exitScore != 0)
			{	
				Victor = (exitScore < 0) ? "Black" : "White" ;
				Log(Victor + " Wins",-1);	
			}
			else
			{
				Victor = "Draw";
				Log(Victor,-1);
			}

			stopGame();
		}
		
		if(Running && !g_inProgress)
		{
			Log("executed",1);
			if(playingWhite)
			{
				Log("White turn",2);
				SetPieceValues ( WhiteSee, WhiteVals);
			}
			else
			{
				Log("Black turn",2);
				SetPieceValues ( BlackSee, BlackVals);
			}
			playingWhite  = ! playingWhite;
			SearchAndRedraw();
		}
		
	}
	else
	{
		console.log("Some mate:");
		var state = CheckCheckState()
		if(state == 'Checkmate')
		{	
			Victor = playingWhite ? "Black" : "White" ;
			Log(Victor + " Wins in " +  moveNumber ,-1);	
		}
		else if(state == 'Stalemate')
		{
			Victor = "Draw";
			Log(Victor + " after " +  moveNumber + " moves",-1);
		}
		else
			Log("Broken win", -10);
		
		stopGame();
	}
}


function startGame()
{
	if(!Running)
	{
		intervalVar = setInterval(ToggleMove,300);
		Running = true;
	}
}

function stopGame()
{
	Log("Game stopped",1);
    clearInterval(intervalVar);
	Running= false;
	if(CallBackObj!=null)
	{
		if(Victor != "none")
		{
			$(p_white).removeClass("challenger");
			$(p_black).removeClass("pivot");
			if(Victor == "White")
				CallBackObj.Execute(moveNumber);
			else if (Victor == "Black")
				CallBackObj.Execute(-moveNumber);
			else if (Victor == "Draw")
				CallBackObj.Execute(0);
		}
	}
}



function EvaluateTwo (a,b,callbackObj)
{
	ResetEval();
	UINewGame();
	WhiteVals = a.GetPieceValues();
	WhileSee = [0,Math.round(WhiteVals[1]/1000),Math.round(WhiteVals[2]/1000),Math.round(WhiteVals[3]/1000),Math.round(WhiteVals[4]/1000),Math.round(WhiteVals[5]/1000),900,0,
				0,Math.round(WhiteVals[1]/1000),Math.round(WhiteVals[2]/1000),Math.round(WhiteVals[3]/1000),Math.round(WhiteVals[4]/1000),Math.round(WhiteVals[5]/1000),900,0];
	BlackVals = b.GetPieceValues();
	BlackSee = [0,Math.round(BlackVals[1]/1000),Math.round(BlackVals[2]/1000),Math.round(BlackVals[3]/1000),Math.round(BlackVals[4]/1000),Math.round(BlackVals[5]/1000),900,0,
				0,Math.round(BlackVals[1]/1000),Math.round(BlackVals[2]/1000),Math.round(BlackVals[3]/1000),Math.round(BlackVals[4]/1000),Math.round(BlackVals[5]/1000),900,0];
	CallBackObj = callbackObj;
	
	
	var mods = $(".white-player")
	var tds = $(mods[0]).find("td");
	$(tds[0]).text(a.Name);
	for(var jj = 1; jj < tds.length; ++jj)
	{
		$(tds[jj]).text(a.PieceValues[jj-1]);
	}
	
	 mods = $(".black-player")
	 tds = $(mods[0]).find("td");
	$(tds[0]).text(b.Name);
	for(var jj = 1; jj < tds.length; ++jj)
	{
		$(tds[jj]).text(b.PieceValues[jj-1]);
	}
	p_white = "#player_"+ a.origIndex +"_" + a.Name;
	p_black = "#player_"+ b.origIndex +"_" + b.Name;
	$(p_white).addClass("challenger");
	$(p_black).addClass("pivot");
	
	Log(a.Name + " playing white vs. " + b.Name + " playing black" ,-2);
	
	startGame();
}

function NaiveScore()
{
	var score = 0;
	for (var ii = 2; ii < 10; ++ii)
    {   
        for (var jj = 4; jj < 12; jj++)
        {
            score += PieceToScore(parseInt(g_board[ii*16+jj]));
        }
    }
	return score;
}

function PrintBoard(b)
{
    console.log("   A   B   C   D   E   F   G   H");
    for (var ii = 2; ii < 10; ++ii)
    {   
        var str = ((ii + 1).toString() + "| ");
        for (var jj = 4; jj < 12; jj++)
        {
            str += PieceToChar(parseInt(b[ii*16+jj])) + " | ";
        }
        console.log(str);
        str = "  ";
        for (var jj = 0; jj < 8; jj++)
        {
            str += ("--- ");
        }
        console.log(str);
    }

    console.log("   A   B   C   D   E   F   G   H");

}

function PieceToChar(val)
{

    var colorBlack = 0x10;
    var colorWhite = 0x08;

    var pieceEmpty = 0x00;
    var piecePawn = 0x01;
    var pieceKnight = 0x02;
    var pieceBishop = 0x03;
    var pieceRook = 0x04;
    var pieceQueen = 0x05;
    var pieceKing = 0x06;
    var FinalRes = "";
    var pieceType = val & 0x07;

    switch (pieceType)
    {
        case pieceRook:
            FinalRes = "R";
            break;
        case pieceKnight:
            FinalRes = "K";
            break;
        case pieceBishop:
            FinalRes = "B";
            break;
        case pieceKing:
            FinalRes = "X";
            break;
        case pieceQueen:
            FinalRes = "Q";
            break;
        case piecePawn:
            FinalRes = "P";
            break;
        default:
            FinalRes = " ";
            break;
    }

    if( (val & colorBlack) >= 1)
    {
        FinalRes = FinalRes.toLowerCase();
    }
    return FinalRes;
}

function PieceToScore(val)
{

    var colorBlack = 0x10;
    var colorWhite = 0x08;

    var pieceEmpty = 0x00;
    var piecePawn = 0x01;
    var pieceKnight = 0x02;
    var pieceBishop = 0x03;
    var pieceRook = 0x04;
    var pieceQueen = 0x05;
    var pieceKing = 0x06;
    var FinalRes = 0;
    var pieceType = val & 0x07;

    switch (pieceType)
    {
        case pieceRook:
            FinalRes = 5;
            break;
        case pieceKnight:
            FinalRes = 3;
            break;
        case pieceBishop:
            FinalRes = 3;
            break;
        case pieceKing:
            FinalRes = 100;
            break;
        case pieceQueen:
            FinalRes = 9;
            break;
        case piecePawn:
            FinalRes = 1;
            break;
        default:
            FinalRes = 0;
            break;
    }

    if( (val & colorBlack) >= 1)
    {
        FinalRes = -FinalRes;
    }
    return FinalRes;
}





