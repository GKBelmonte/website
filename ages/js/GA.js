//TODO: 
//Generalize over n-rows maybe
//Explain color scheme
//Explain parameters
//create loader / saver of existing pop
//The use of game terminatino criteria is allowed since the game has advanced a lot
//and we just need to evaluate who would win. We expect the final value sto be relatively close to
//those values, it's just a matter of getting a more precise figure, so it is an acceptable end game mechanism.
/**********************************  Helping functions  **********************************/
function HelperFunctions (){}
//Random integer between param1 inclusive and param2 exclusive
HelperFunctions.RandomInt = function(p1,p2)
{
	return Math.floor((p2-p1)*Math.random() + p1);
}


//Given a probability p, generates a random number, and
//checks if the probability passes as true or false 
//for one instance. 0<=p<1
//true if pass, false if fail
HelperFunctions.ProbabilityPass =function(p)
{
	var dice = Math.random();
	if( dice < p )
		return true;
	else
		return false;
}

//Given a standard deviation s, return a random value around 0 with that standard deviation
HelperFunctions.GaussianNoise =function(s)
{
	//3 random numbers from -1 to 1.
	var d0 = Math.random()*2 - 1;
	var d1 = Math.random()*2 - 1;
	var d2 = Math.random()*2 - 1;
	var d3 = Math.random()*2 - 1;
	var d4 = Math.random()*2 - 1;
	return (d0 + d1 + d2 + d3 + d4)*s;
	
}

/**********************************  Individual Defenition  **********************************/
function Individual(pieceValues,name)
{
	if(pieceValues != undefined)
		this.PieceValues = pieceValues.slice(0);//this makes a clone of the array object, thus changing the array outside of this object, makes this one retain its values
	else
		this.Regenerate();
		
	if(name == undefined)
		this.Name = Individual.CreateName();
	else
		this.Name = name;
}

Individual.prototype.toString = function()
{
	return this.Name + " : " + this.PieceValues;
}
Individual.prototype.Mutate = 
function(probability,sigma) 
{
	var newInd = new Individual(this.PieceValues);
	//Create default values
	if(probability == undefined)
		probability = 0.4;
	if(sigma == undefined)
		sigma = 400;
	
	for(var ii = 0; ii < newInd.PieceValues.length; ii++)
	{
		if(HelperFunctions.ProbabilityPass(probability))
			newInd.PieceValues[ii] += Math.round(HelperFunctions.GaussianNoise(sigma));
	}
	return newInd;
}

//Recycles the individual by reseting its values to those of a new one alltogether
Individual.prototype.Regenerate = 
function()
{
	var newValues = new Array();
	for(var ii = 0; ii < 5; ++ii)
		newValues.push( HelperFunctions.RandomInt(800,17000));
	this.PieceValues = newValues;
	this.Name = Individual.CreateName();
}

//Returns an array proper for the evaluation function
Individual.prototype.GetPieceValues = 
function() 
{
	var result = new Array();
	result.push(0);//Null piece value
	for(var ii = 0; ii < this.PieceValues.length ; ++ii)
	{
		result.push(this.PieceValues[ii]);
	}
	result.push(600000); //In the thousands. Pawn default = 1000. King worth 600 pawns
	return result;
}


//Given an Array of N-parents, take an allele of each parent with equal probability
Individual.Crossover = function (ParentArray)
{
	var pVals = new Array();
	for(var ii = 0; ii < 5 ; ++ii)
	{
		var dice = HelperFunctions.RandomInt(0,3);
		if(dice == 0)
		{
			//Take average of parents respective alleles
			var tot = 0;
			for(var jj = 0; jj < ParentArray.length;++jj)
			{
				tot += ParentArray[jj].PieceValues[ii];
			}
			tot = tot/ParentArray.length;
			pVals.push(Math.floor(tot));
		}
		else
		{
			pVals.push(ParentArray[HelperFunctions.RandomInt(0,ParentArray.length)].PieceValues[ii]);
		}
	}
	
	return (new Individual(pVals));
}

Individual.CreateName = function ()
{
	var syllabels = 
	[
    'sel',
    'er',
    'a',
    'fed',
    'ed',
    'hi',
    'es',
    're',
    'hel',
    'in',
    're',
    'con',
    'sy',
    'ter',
    'kha',
    'al',
    'de',
    'com',
    'o',
    'din',
    'en',
    'an',
    'tir',
    'pin',
    'tru',
	'fre',
	'de',
	'ma',
	'kog'
	]	;
	
	var result  = '';
	for(var ii = 0; ii < HelperFunctions.RandomInt(2,5); ++ii)
	{
		result += syllabels[HelperFunctions.RandomInt(0,syllabels.length)];
	}
	
	result = result[0].toUpperCase() + result.substr(1,result.length-1);  
	return result;
}

/**********************************  Evaluator Defenition  **********************************/

//This is function is really complex since the evaluation happens asynchrounously 
//and can be stopped at any time by the UI.
//What happens is that the Evaluator has two call-backs
// evaluator: call this to tell the Fighter what to evaluate
// master: call this to tell the overall algorithm that a full evaluation of the
// 			population was completed.
//	
//	Population evaluation resolves in a quick-sort tournament.
// Pick a random individual and test it against every other.
// The better get thrown in one group and the worse in another.
// Repeat which each sub-group ( O(nlog(n) )

//arr: Array to be sorted
//evaluator: A function capable of evaluating A > B for the objects in arr
//	It should take objects A, B and this object, and call-back the result
//	with callback.Execute ( A - B ) or callback.Execute ( A > B )
//master: A function to call to let the object owner that the total evaluation was completed 
function Evaluator(arr,evaluator, master)
{
	//std vals
	this.Arr = arr;
	this.begin = 0;
	this.end = this.Arr.length -1;
	
	//piv vals
	var pivot = HelperFunctions.RandomInt(0,this.Arr.length);
	this.pivotVal = this.Arr[pivot];
	Evaluator._swap(this.Arr,this.end,pivot);
	
	//changing vals
	this.pointing = 0;
	this.ArrBetter = new Array();
	this.ArrWorse = new Array();
	this.queue = new Array();
	this.queuepointer = 0;
	this.queue.push({"begin":0,"end":this.end});
	
	//callbacks
	this.Continue = evaluator; //Roughly speakin is A > B 
	this.Master = master;
	
	//check var
	this.done = false;
	
	this.Executing = false;
	this.CompCount = 0;
	this.DrawCount = 0;
	
	/*0-9,10-19,20-29,30-39,40-49,50-59, 60+*/
	this.Histogram = [0, 0, 0, 0, 0, 0, 0];
	console.log("Current Pivot =" +this.pivotVal);
}

//Start evaluation: Given the array of individuals and the properly
//define individual evaluator
Evaluator.prototype.Execute = function(score)
{
	if(!this.done)
	{
		this.CompCount++;
		if(score > 0 )
		{
			this.ArrBetter.push(this.Arr[this.pointing]);
		}
		else 
		{
			this.ArrWorse.push(this.Arr[this.pointing]);

			if(score == 0)
				this.DrawCount++;
		}
		//scope to add stuff to histogram
		{
			var posScore = (score > 0) ? score: - score;
			var histInd = Math.floor(posScore / 10);
			histInd = (histInd > 6 ? 6 : histInd);
			this.Histogram[histInd] += 1;
		}
		this.pointing++;
		if(this.pointing >= this.end)
		{
			//Untouched first chunk
			var Temp = new Array();
			for(var ii = 0; ii < this.begin;++ii)
			{
				Temp.push(this.Arr[ii]);
			}
			//Worse than pivot
			Temp = Temp.concat(this.ArrWorse);
			var pivPos = Temp.length;
			//Better than pivot and the other untouched better chunk
			this.Arr = Temp.concat([this.pivotVal]).concat(this.ArrBetter).concat(this.Arr.splice(this.end+1,this.Arr.length-this.end-1));
			
			//Add execution queue if relevant (more than 1 thingy fighting
			if(this.begin < pivPos-1)
				this.queue.push({"begin":this.begin,"end":pivPos-1});
			if(pivPos + 1 < this.end)
				this.queue.push({"begin":pivPos+1,"end":this.end});
			
			
			this.queuepointer++;
			if(this.queuepointer < this.queue.length)
			{
				//Reset all values taking into consideration the queue
				this.begin = this.queue[this.queuepointer].begin;
				this.end = this.queue[this.queuepointer].end;
				var pivot = HelperFunctions.RandomInt(this.begin,this.end+1);
				this.pivotVal = this.Arr[pivot];
				Evaluator._swap(this.Arr,this.end,pivot);
				this.pointing = this.begin;
				this.ArrBetter = new Array();
				this.ArrWorse = new Array();
			}
			else
			{
				this.done = true;
			}
				
		}
		//Call-back evaluator to continue
		if(!this.done)
		{
			this.Continue(this.Arr[this.pointing],this.pivotVal, this); //Give the evaluator 2 new values to evaluate
		}
		else
		{
			this.Executing = false;
			this.Master(this.Arr) ;//Tell the master algorithm this the evaluation is complete. Send it the "sorted" array.
		}
	}
	else
		console.log("Useless call");
}

//Start the evaluator by calling the call-back with the required parameters
//Two objects two compare and the object to call-back the score from
Evaluator.prototype.Start = function()
{
	this.Executing = true;
	this.Continue(this.Arr[this.pointing],this.pivotVal, this);
}

//helper swap function.
Evaluator._swap = function(arr,a,b)
{
	var t = arr[a];
	arr[a] = arr[b];
	arr[b] = t;
}

//Integer test of Evaluator
var TestEval = false;
var ex;
if(TestEval)
{
	var Arr = new Array(); for(var ii = 0; ii < 64; ++ ii) { Arr.push(HelperFunctions.RandomInt(0,100)) }
	evalu = function(a, b, call)
	{ //Firefox bug in setTimeout = Error: useless setTimeout call (missing quotes around argument?)
		if( a > b) {setTimeout(call.Execute(1),00); }
		else { setTimeout(call.Execute(0),00); }
	}
	console.log(Arr);
	ex = new Evaluator(Arr,evalu,function(event){console.log("Done") ; console.log(event);} );
}


function MasterGA ()
{
	this.Population = new Array() ;
	for(var ii = 0; ii < ParameterContainer.PopulationSize; ++ii)
	{
		this.Population.push(new Individual());
		this.Population[ii].origIndex = ii;
	}
	this.Evaluator = null;
	this.genCount = 0;
}

MasterGA.prototype.UIPlaceIndividuals = function()
{
	var format = '<div class="player-container"><table class="rounded-corner waiting-player"><thead><tr><th class="top-left" scope="col">Pawn</th><th scope="col">	Knight	</th><th scope="col">Bishop	</th><th scope="col">Rook</th><th class="top-right" scope="col">Queen</th>	</tr>	</thead>	<tfoot>	<tr><td class="name" colspan="5"><em>?</em>	</td></tr></tfoot><tbody><tr><td>0</td>	<td>0</td><td>0</td><td>0</td><td>0</td></tr></tbody></table></div>';
	var Container = $('.players');
	 Container.html('');
	for(var ii = 0; ii < this.Population.length;++ii)
	{
		Container.append('<div class="player-container"><table id='+'"player_'+ii+'_'+ this.Population[ii].Name+'" class="rounded-corner waiting-player"><thead><tr><th class="top-left" scope="col">Pawn</th><th scope="col">	Knight	</th><th scope="col">Bishop	</th><th scope="col">Rook</th><th class="top-right" scope="col">Queen</th>	</tr>	</thead>	<tfoot>	<tr><td class="name" colspan="5"><em>'+ this.Population[ii].Name + '</em>	</td></tr></tfoot><tbody><tr><td>'+ this.Population[ii].PieceValues[0] + '</td>	<td>'+ this.Population[ii].PieceValues[1] + '</td><td>'+ this.Population[ii].PieceValues[2] + '</td><td>'+ this.Population[ii].PieceValues[3] + '</td><td>'+ this.Population[ii].PieceValues[4] + '</td></tr></tbody></table></div>');
	}
}

MasterGA.prototype.UIUpdateHistory = function()
{
	var old = $('#GenHistory').val();
	var newGen = "Generation " + this.genCount + ": [\n";
	for(var ii = 0; ii < this.Population.length; ++ii)
	{
		newGen += this.Population[ii].toString() + ";\n";
	}
	newGen += '] D/C: '+ this.Evaluator.DrawCount+'/'+this.Evaluator.CompCount +'\n'; //Append the draw/fight ratio
	newGen += 'LH:' + this.Evaluator.Histogram + '\n |'; //Append match length histogram followed by | to help parsing
	$('#GenHistory').val(old+newGen);
}

//Epic name for a function.
//Kills, replaces and chooses who mutates or crossovers
MasterGA.prototype.Reap = function()
{
	var pop = this.Population ;//for quick access
	var newPop = new Array();
	var fail = Math.floor(pop.length *0.2);
	var change = Math.floor(pop.length *0.8);
	
	//Fresh individuals
	for(var ii = 0; ii < fail; ++ii)
	{
		pop[ii].Regenerate();
		newPop.push(pop[ii]);
		$($('.waiting-player')[ii]).addClass('dead');
	}
	
	//Changed individuals
	for(var ii = fail; ii < change; ++ii)
	{
		var dice = HelperFunctions.RandomInt(0,6);//6 not included
		if(dice == 0)
		{
			$($('.waiting-player')[ii]).addClass('survivor');
			newPop.push(pop[ii]); //Individual survived by chance
		}
		else if(dice == 1 ||  dice == 2)
		{
			$($('.waiting-player')[ii]).addClass('mutated');
			//Pick a surviving random individual and mutate it (not from the bottom 20%)
			newPop.push(pop[HelperFunctions.RandomInt(fail,pop.length)].Mutate());
		}
		else
		{
			$($('.waiting-player')[ii]).addClass('crossover');
			var parents = new Array();
			var numOfP = HelperFunctions.RandomInt(2,5); //pick 2,3 or 4 parents
			while(parents.length < numOfP)
			{
				var index = HelperFunctions.RandomInt(fail,pop.length);
				//Index implies rank
				var prob = 100*index/pop.length;
				if(HelperFunctions.RandomInt(0,101) <= prob )
				{
					parents.push(pop[index]);
				}
			}
			newPop.push(Individual.Crossover(parents));
		}
	}

	//Elite:
	for(var ii = change; ii < pop.length; ++ii)
	{
		$($('.waiting-player')[ii]).addClass('survivor');
		newPop.push(pop[ii]);
	}
	this.Population = newPop;
	this._addOriginalIndex();
}

//Call when the generation completes.
var g_freezeUI = false;
function OnCompletion(event)
{
	Log("Generation Complete",-1); 
	SingletonMaster.genCount+=1;
	SingletonMaster.Population = event; 
	SingletonMaster.UIPlaceIndividuals();
	Log("Number of matches: " +  SingletonMaster.Evaluator.CompCount);
	Log("Number of Draws: " +  SingletonMaster.Evaluator.DrawCount);
	Log("Match length histogram: " +  SingletonMaster.Evaluator.Histogram);
	
	SingletonMaster.UIUpdateHistory();
	//Reset
	UINewGame();
	SingletonMaster.Evaluator = null;//kill the old evaluator
	ResetEval();
	
	//Reap
	SingletonMaster.Reap();
	g_freezeUI = true;
	
	setTimeout(OnCompletion2,2000);
}


function OnCompletion2()
{	
	SingletonMaster.UIPlaceIndividuals();
	g_freezeUI = false;
	//Terminate
	if(SingletonMaster.genCount <= ParameterContainer.MaxGens)
		SingletonMaster.OneGeneration();
	else
		alert(SingletonMaster.genCount + " generations completed");
}

//Resets the original index of the population members. Used
//by UI to highlight thigs.
MasterGA.prototype._addOriginalIndex = function()
{
	for(var ii = 0 ; ii < this.Population.length; ++ii)
		this.Population[ii].origIndex = ii;
}

//Executes one generation
MasterGA.prototype.OneGeneration = function()
{
	this.UIPlaceIndividuals();
	this.Evaluator = new Evaluator(this.Population,EvaluateTwo,OnCompletion);
	this.Evaluator.Start();
}


var SingletonMaster = new MasterGA();

function startGA()
{
	if(!g_freezeUI)
	{
		if(SingletonMaster.Evaluator != null)
		{
			
			if(SingletonMaster.Evaluator.Executing)
			{
				startGame();
			}
			else
			{ //this ought never be reached since for an evaluator to exist, Evaluator start must have been called.
				Evaluator.Start();
			}
		}
		else
		{
			SingletonMaster.OneGeneration();
		}
	}
}

function ResetGA()
{
	if(!g_freezeUI)
	{
		UINewGame();
		SingletonMaster.Evaluator = null;//kill the old evaluator
		ResetEval();
		SingletonMaster = new MasterGA();
		SingletonMaster.UIPlaceIndividuals();
		//$('#GenHistory').text("");
		//$('#GenHistory').val("");
	}
}

