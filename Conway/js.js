var truthTableB = [ 
						[0,0,0,0] ,
						[0,0,1,0] ,
						[0,1,0,0] ,
						[0,1,1,0] ,
						[1,0,0,1] ,
						[1,0,1,0] ,
						[1,1,0,1] ,
						[1,1,1,1]
					   ];
var SPEED = 300;		   
function NextState(state,truthTable)
{
	var nextState = state.slice();
	var match = -1;
	for (var ii = 1; ii < (state.length - 1); ++ii)
	{
		match = -1;
		for (var jj = 0; jj < truthTable.length; ++jj)
		{
			if (truthTable[jj][0] == state[ii - 1] && truthTable[jj][1] == state[ii] && truthTable[jj][2] == state[ii + 1])
			{
				match = jj;
				break;
			}
		}
		nextState[ii] = truthTable[match][3]; 
	}

	match = -1;
	for (var jj = 0; jj < truthTable.length; ++jj)
	{
		if (truthTable[jj][0] == state[state.length -1 ] && truthTable[jj][1] == state[0] && truthTable[jj][2] == state[1])
		{
			match = jj;
			break;
		}
	}
	nextState[0] = truthTable[match][3];

	match = -1;
	for (var jj = 0; jj < truthTable.length; ++jj)
	{
		if (truthTable[jj][0] == state[state.length - 2] && truthTable[jj][1] == state[state.length - 1] && truthTable[jj][2] == state[0])
		{
			match = jj;
			break;
		}
	}
	nextState[state.length-1] = truthTable[match][3]; 
	return nextState;
}

	var PossibleTruthTables = new Array();
	for (var ii = 0; ii < 256; ++ii)
	{
		var t0 = [ 
					[0,0,0, ((ii & 0x01) > 0)? 1: 0] ,
					[0,0,1, ((ii & 0x02) > 0)? 1: 0] ,
					[0,1,0, ((ii & 0x04) > 0)? 1: 0] ,
					[0,1,1, ((ii & 0x08) > 0)? 1: 0] ,
					[1,0,0, ((ii & 0x10) > 0)? 1: 0] ,
					[1,0,1, ((ii & 0x20) > 0)? 1: 0] ,
					[1,1,0, ((ii & 0x40) > 0)? 1: 0] ,
					[1,1,1, ((ii & 0x80) > 0)? 1: 0]
				   ];
		PossibleTruthTables.push(t0);
	
	}
	
	
	var truth_table_x = [ 
					[0,0,0, 0] ,
					[0,0,1, 0] ,
					[0,1,0, 0] ,
					[0,1,1, 1] ,
					[1,0,0, 1] ,
					[1,0,1, 1] ,
					[1,1,0, 1] ,
					[1,1,1, 0]
				   ];
var states = new Array() ;
function Main(states,first,last)
{
	setInterval(function () {UpdateAllStates(states,first,last)},SPEED);
}

var executing = false;
var intervalID;
function Execute()
{
	if(executing)
	{
		console.log("stoping");
		executing = false;
		//clearInterval(intervalID);
		clearTimeout(intervalID);
		$('#Execute').text("Execute");
    $('#Execute').css('background-color','#2550FA');
    $('#Execute').css('color','#FFFFFF');
	}
	else
	{
		console.log("starting");
		executing = true;
		$('#Execute').text("Stop");
    $('#Execute').css('background-color','#EF1020');
		$('#Execute').css('color','#000000')
    UpdateAllStates(states,first,last);
	}
}

function UpdateAllStates(states,first,last)
{
	for (var ii = 0; ii < (last-first-1); ++ii)
		states[ii] = NextState(states[ii],PossibleTruthTables[ii+first]);
	states[last-first-1] = NextState(states[last-first-1],truth_table_x);
	for (var ii = 0; ii < (last-first); ++ii)
	{
		OutputState(states[ii],ii)
	}
	if(executing)
		intervalID = setTimeout(function () {UpdateAllStates(states,first,last)},SPEED);
}

function OutputState(state, id)
{
	//console.log(state.join(""));
	var sets = $('.state');
	for(var ii = 0; ii < sets.length ; ++ii)
	{
		var cells = $(sets[ii]).find('.cell');
		for(var jj = 0; jj < cells.length; ++jj)
		{
			var cell = $(cells[jj]);
			cell.css('background-color','rgb(' + (1 - states[ii][jj])*255 +','+ (1 - states[ii][jj])*255 +',255)');
			cell.attr('index',jj);
		}
	}
}

function Reinitialize()
{
	first = arg1;
	last = first + NUMBER_OF_SIMULTANEOUS_SIMS;
}
var NUMBER_OF_SIMULTANEOUS_SIMS = 1;
var first = 0;
var last = first + NUMBER_OF_SIMULTANEOUS_SIMS;
function Initialize(arg1)
{
	NUMBER_OF_SIMULTANEOUS_SIMS = 1;
	first = arg1;
	last = first + NUMBER_OF_SIMULTANEOUS_SIMS;
	//Console.Clear();
	//var state = [0,1,0,0,1,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0 ];
	//start states
	for(var ii = 0; ii < NUMBER_OF_SIMULTANEOUS_SIMS; ++ii)
	{
		states[ii] = ( [0,1,0,0,1,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,1,0 ] );
	}
	//start colors for state
	var sets = $('.state');
	console.log(sets);
	for(var ii = 0; ii < sets.length ; ++ii)
	{
		var cells = $(sets[ii]).attr('index',ii).find('.cell');
		
		for(var jj = 0; jj < cells.length; ++jj)
		{
			$(cells[jj]).css('background-color','rgb(' + (1 - states[ii][jj])*255 +','+ (1 - states[ii][jj])*255 +',255)');
			$(cells[jj]).attr('index',jj);
			
			$(cells[jj]).click(
			function(event)
			{ 
				var elem = $(this);
				
				var parentIndex= parseInt(elem.parent().attr('index'));
				var index= parseInt(elem.attr('index'));
				var state = states[parentIndex][index];
				console.log(state);
				if(state=='1')
				{
					states[parentIndex][index] = 0;
					console.log('setting none');
					$(this).css('background-color','rgb(255, 255, 255)');
					
				}
				else if(state == '0')
				{
					states[parentIndex][index] = 1;
					console.log('setting blue');
					$(this).css('background-color','rgb(0, 0, 255)');
				}
				//console.log(elem.css('background-color'));					
			}  
			); 
		}
	}

//	LoadRange();
	$('.truth-table-mob').hide(50);
	var labels = $('.state-label');
	for(var ii = 0; ii < NUMBER_OF_SIMULTANEOUS_SIMS -1; ++ii)
	{
		$(labels[ii]).hover
		(
		//On enter
		function (e) {
			console.log('Enter');
			var index = parseInt($(this).next().attr("index"));
			ShowTI(index);
			$('.truth-table-mob').css("top", (e.pageY+5));
			$('.truth-table-mob').css("left",(e.pageX+5));
			$('.truth-table-mob').clearQueue();
			$('.truth-table-mob').css("display","block");
		},
		//On leave
		function () {
			console.log('Leave');
			$('.truth-table-mob').clearQueue();
			$('.truth-table-mob').css("display","none");
		});
	}
	LoadTX();
	
  //Circularize
  var cells = $('.cell');
  var count = cells.length;
  var radius = 100;
  var width = 400;
  var height = 350;
  var radial_frq = 2*Math.PI/count;
  cells.css('position', 'absolute');
  for( var ii = 0; ii < count; ++ ii)
  {
    var left = width/2 + Math.cos( radial_frq * ii ) * radius ;
    var top = height/2 +  Math.sin( radial_frq * ii ) * radius ;
    $(cells[ii]).css('top', top.toString() + 'px');
    $(cells[ii]).css('left', left.toString() + 'px');
  }
  
}
function ShowTI(index)
{
	var valtochange = $('.truth-table-mob .ttrv');
	for(var ii = 0; ii < 8 ;++ii)
	{
		$(valtochange[ii]).text( PossibleTruthTables[(first+index)][ii][3] );
	}
}


function LoadTX()
{
	var vals = $('.ttrit');
	for(var ii = 0; ii < 8 ;++ii)
	{
		truth_table_x[ii][3] = parseInt(vals[ii].value);
	}
}

function LoadRange()
{
	var newBeg = parseInt($('.load-range-tb').val());
	first = newBeg;
	last = first + NUMBER_OF_SIMULTANEOUS_SIMS;
	var labels = $('.state-label');
	for(var ii = 0; ii < NUMBER_OF_SIMULTANEOUS_SIMS -1; ++ii)
	{
		$(labels[ii]).text("truth table id=" + (ii + first));
	}

}






function FiniteStateArithmeticTable( numberBase, inputs)
{
	//rows = numberBase ^ inputs
	//columns = inputs + outputs
	var result = new Array();
	var rows = Math.pow(numberBase, inputs);
	for(var ii = 0; ii < rows;++ii)
	{
		var row = NumberToBaseArr(ii,numberBase,inputs);
		row.push('X');
		result.push(row);
	}
	return result;
	
}
var state_color



function NumberToBaseArr(number,base, digits)
{
	var res = new Array();
	for(var ii = 1; ii < digits +1;++ii)
	{
		var next = number % base;
		number = Math.floor(number/base);
		res.push(next);
		
	}
	return res.reverse();
}

$(document).load(Initialize(0));

