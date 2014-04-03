

var test;
function Execute()
{
	var text = $('#text-in').val();
	
	var gens = text.split('Generation');
	gens = gens.splice(1,gens.length - 1);
	for(var ii = 0; ii < gens.length ; ++ii)
	{
		var st = gens[ii].indexOf('[') + 1;
		gens[ii] = gens[ii].substr(st);
	}
	test = gens;
	
	for(var ii = 0; ii < gens.length;++ii)
	{
		var individuals = gens[ii].split(';');
		
		for(var jj = 0; jj < individuals.length - 1; ++jj)// -1 bcs the last individual is empty
		{
			var name_split_vals = individuals[jj].split(':');
			individuals[jj] =  {"Name" : name_split_vals[0].trim() , "Vals" : name_split_vals[1].split(',')};
		}
		var dvsc = individuals[individuals.length - 1].split(':')[1].split('/');
		individuals.drawCount = { 'draw' : parseInt(dvsc[0].trim()) ,'count' : parseInt(dvsc[1].trim())};
		var dvsc = individuals[individuals.length - 1].split('LH:')[1].split(',');
		individuals.lengthHistogram = dvsc;
		individuals.pop();//Kill that empty individual
		gens[ii] = individuals;
	}
	
	for(var ii = 0; ii < gens.length; ++ii)
	{ //Here we iterate over generations	
		var genRef = gens[ii]; //ref to the generation obj
		genRef.ValsAve = [0,0,0,0,0];//Add a property to the object dynamically to contain average values on a generation basis (love dynamic typing)
		genRef.ValsStdDev = [0,0,0,0,0];
		//Exclue bottom 20% (Fresh none-sense)
		genRef.ValsAveX = [0,0,0,0,0];
		genRef.ValsStdDevX = [0,0,0,0,0];
		for(var jj = 0; jj < genRef.length ;++jj)
		{ //Here over individuals
			var valRef = genRef[jj].Vals;
			for(var kk = 0; kk < valRef.length; ++kk)
			{ //Here over values
				valRef[kk] = parseInt(valRef[kk].trim());
				genRef.ValsAve[kk] += valRef[kk]; //Sum of values
				genRef.ValsStdDev[kk] += valRef[kk]*valRef[kk]; //Sum of squared values
				//Exclude bottom 20%
				if (jj >= Math.floor(genRef.length *0.2))
				{
					genRef.ValsAveX[kk] += valRef[kk]; //Sum of values
					genRef.ValsStdDevX[kk] += valRef[kk]*valRef[kk]; //Sum of squared values
				}
			}
		}
		//Individuals done.
		//Lets compute the average
		for(var jj = 0; jj < genRef.ValsAve.length; ++jj)
		{
			genRef.ValsAve[jj] = genRef.ValsAve[jj] / genRef.length;
			genRef.ValsAveX[jj] = genRef.ValsAveX[jj] / (genRef.length-Math.floor(genRef.length *0.2)); 
		}
		
		//Now, Lets compute the stddev. Remember we have sum of squares.
		for(var jj = 0; jj < genRef.ValsStdDev.length; ++jj)
		{
			genRef.ValsStdDev[jj] = Math.sqrt(genRef.ValsStdDev[jj] / genRef.length - genRef.ValsAve[jj] *genRef.ValsAve[jj]); 
			genRef.ValsStdDevX[jj] = Math.sqrt(genRef.ValsStdDevX[jj] / (genRef.length-Math.floor(genRef.length *0.2)) - genRef.ValsAveX[jj] *genRef.ValsAveX[jj]); 
		}
	}
	
	//Ok, we have everything parsed, and piece average on each gen basis. Let's write it pretty:
	var res = "";
	for(var ii = 0; ii < gens.length; ++ii)
	{
		res += "Generation " + ii + " average: \t";
		for(var jj = 0; jj < gens[ii].ValsAve.length; ++jj)
		{
			res+= gens[ii].ValsAve[jj].toString() + '\t';
		}
		res += "Generation " + ii + " stddev: \t";
		for(var jj = 0; jj < gens[ii].ValsStdDev.length; ++jj)
		{
			res+= gens[ii].ValsStdDev[jj].toString() + '\t';
		}
		
		res += "Generation " + ii + " averageX: \t";
		for(var jj = 0; jj < gens[ii].ValsAveX.length; ++jj)
		{
			res+= gens[ii].ValsAveX[jj].toString() + '\t';
		}
		res += "Generation " + ii + " stddevX: \t";
		for(var jj = 0; jj < gens[ii].ValsStdDevX.length; ++jj)
		{
			res+= gens[ii].ValsStdDevX[jj].toString() + '\t';
		}
		
		res+='length histogram\t';
		for(var jj = 0; jj < gens[ii].lengthHistogram.length; ++jj)
		{
			res+= parseInt(gens[ii].lengthHistogram[jj]).toString() + '\t';
		}
		
		res+= gens[ii].drawCount.draw +'\t' + gens[ii].drawCount.count +'\t';
		res+= '\n';
	}
	$('#text-out').val(res);
	
}