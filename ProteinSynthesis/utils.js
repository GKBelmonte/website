/**

JsUtils v0.1

Copyright (c) 2013, Gabriel Khalil Belmonte
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. All advertising materials mentioning features or use of this software
   must display the following acknowledgement:
   This product includes software developed by Gabriel Khalil Belmonte.
4. Neither the name of Gabriel Khalil Belmonte nor the
   names of its contributors may be used to endorse or promote products
   derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY GABRIEL KHALIL BELMONTE ''AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL GABRIEL KHALIL BELMONTE BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/** Log utilities */
var g_log = new Array();
var g_minPriorityForLog = 50;
function Log(message, priority)
{
	if(priority == undefined)
		priority = 5;
	if(priority <= g_minPriorityForLog)
  {
		console.log(message);
    g_log .push( message );
  }
}


/** Ui Utilities*/
/**
Assumes the following css
.section-collaps
{color: #CC0000;}

.section-expand
{color: #007C00;}


*/

function _toggleVisibility( target )
{
    var now = target.next().css('display');
    if(now != 'none')
    {
        target.removeClass('section-collapse')
        target.addClass('section-expand');
        target.next().css('display','none');
        target.html(target.html().replaceAll('-','+'));
    }
    else
    {
        target.addClass('section-collapse')
        target.removeClass('section-expand');
        target.next().css('display','block');
        target.html(target.html().replaceAll('\\+','-')); // plus is a regex expression reserved character. we must escape it
    }
}


/*
  For events bound with OnClick or onclick attributes
*/
function ToggleVisibilityOnClick(e)
{
    var target = $(e);
    _toggleVisibility(target);
}

/*
  For events bound with jQuery $().click()
*/
function ToggleVisibilityClick(e)
{
    var target = $(e.target);
    _toggleVisibility(target);
}

/** Array extensions */
Array.prototype.RemoveAt = function (index) {
    this.splice(index, 1);
}

Array.prototype.RemoveAtMany = function (arrayOfIndexes) {
    arrayOfIndexes.sort(function (a, b) { return a > b;});
    for (var ii = 0; ii < arrayOfIndexes.length; ++ii)
    {
        this.RemoveAt(arrayOfIndexes[ii]-ii);
    }
}

/*
    <summary>
        Finds if elementLeft is the same as elementRight.
        e.g. elementLeft == elementRight within pareto context.
    </summary>
    <param name='elementLeft'>The element at the left of the operator</param>
    <param name='elementRight'>The element at the right of the operator</param>
    <param name='propertyArray'>The array of properties that will be pareto tested</param>
    <param name='tolerance'>value of tolerance</param>
    <return>True if equal, false otherwise</return>
*/
function _paretoEqual(elementLeft, elementRight, propertyArray, tolerance) {
    for (var ii = 0 ; ii < propertyArray.length; ++ii) {
        if (Math.abs(elementLeft[propertyArray[ii]] - elementRight[propertyArray[ii]]) > tolerance)
            return false;
    }
    return true;
}


/*
    <summary>
        Finds if elementLeft dominates elementRight.
        e.g. elementLeft > elementRight within pareto context.
    </summary>
    <param name='elementLeft'>The element at the left of the operator</param>
    <param name='elementRight'>The element at the right of the operator</param>
    <param name='propertyArray'>The array of properties that will be pareto tested</param>
    <param name='maximizeArray'>An array of the same size as propertyArray, identifying whether to maximize or minimize the property of matching index</param>
    <return>True if left dominates right, false otherwise</return>
*/
function _paretoGreaterThan(elementLeft, elementRight, propertyArray, maximizeArray)
{
    for (var ii = 0 ; ii < propertyArray.length; ++ii)
    {
        if (maximizeArray[ii])
        {
            if (elementLeft[propertyArray[ii]] < elementRight[propertyArray[ii]])
            {
                return false;
            }
        }
        else
        {
            if (elementLeft[propertyArray[ii]] > elementRight[propertyArray[ii]])
            {
                return false;
            }
        }
    }
    return true;
    
}


function ParetoFrontRank(array, propertyArray, maxMinArray, rank)
{
    //Shallow copy array
    var queueArray = array.slice();
    do {
        var frontIndexes = new Array();
        for (var ii = 0; ii < queueArray.length ; ++ii) {
            var testElement = queueArray[ii];
            var testElementDominated = false;
            for (var jj = 0; jj < queueArray.length; ++jj) {
                if (ii == jj) {
                    continue;//do not test an element against itself
                }
                else {
                    //an element is rank 0 if no one dominates him. Check if any element dominates him
                    var dominated = _paretoGreaterThan(queueArray[jj], testElement, propertyArray, maxMinArray);
                    if (dominated) {
                        var equal = _paretoEqual(queueArray[jj], testElement, propertyArray, 0.01);
                        //an object dominates itself since it is no better at anything than itself. Identical objects must be caught
                        if (!equal) {
                            testElementDominated = true;
                            break;
                        }
                    }
                }
            }

            //Not dominated, so it belongs to pareto front
            if (!testElementDominated) {
                testElement.rank = rank;
                frontIndexes.push(ii);
            }
        }
        //console.log("++++++++++++++++ RANK "+rank+"     ++++++++++++++++");
        //for (var xx = 0 ; xx < queueArray.length; ++xx) {
        //    console.log("Point (" + queueArray[xx].effective + ',' + queueArray[xx].efficient + ') has rank ' + queueArray[xx].rank);
        //}
        queueArray.RemoveAtMany(frontIndexes);

        // All front will have been computed. Repeat for next rank if the rank is not empty
        if (queueArray.length == 0) {
            return;
        }
        else {
            rank += 1;
        }
    } while (queueArray.length > 0);
}


String.prototype.Reverse = function(  )
{
	return this.split("").reverse().join("");
}

function CompressObjectArrayIntoTable(arrayOfObjects, PropertiesToCompress)
{
    var compressed = new Array();
    //First row is table key (column names)
    var compressedObj = new Array();
    for (var jj = 0; jj < PropertiesToCompress.length; ++jj)
    {
        compressedObj.push(PropertiesToCompress[jj]);
    }
    //Push Key
    compressed.push(compressedObj);


    for (var ii = 0; ii < arrayOfObjects.length; ++ii) {
        var candidate = arrayOfObjects[ii];
        compressedObj = new Array();
        for (var jj = 0; jj < PropertiesToCompress.length; ++jj) {
            compressedObj.push(candidate[PropertiesToCompress[jj]]);
        }
        compressed.push(compressedObj);
    }
    arrayOfObjects.length = 0;
    for (var ii = 0 ; ii < compressed.length; ++ii) {
        arrayOfObjects.push(compressed[ii]);
    }
}


function DecompressObjectTableIntoObjectArray(table)
{
    var properties = table[0];
    var result = new Array();
    for (var ii = 1 ; ii < table.length; ++ii)
    {
        var obj = new Object();
        for (var jj = 0; jj < properties.length; ++jj)
        {
            obj[properties[jj]] = table[ii][jj];
        }
        result.push(obj);
    }
    return result;
}

//Add functionality to native string, cause it is limited
String.prototype.indexOfMultiple=function(Arr) 
{
	var indexs = new Array();
	//Make an array of the multiple first instances of Arr[ii]
	for(var ii = 0; ii < Arr.length ; ++ii)
	{
		indexs.push(this.indexOf(Arr[ii]));
	}
	
	var min = this.length;//The first instance of an element in *this cannot be at an index greater than length (e.g. this is a big number)
	for(var ii = 0; ii < indexs.length; ++ii)
	{
		if(indexs[ii] != -1 && indexs[ii] < min)
			min = indexs[ii];
	}
	if(min == this.length)
		min = -1;
	return min;
}

String.prototype.replaceAt=function(index,string, len) 
{
  if(len == undefined)
    len = 1;

  return this.substr(0, index) + string + this.substr(index+len);

}

String.prototype.replaceAll = function(find,replace)
{
	return this.replace(new RegExp(find, 'g'), replace);
}


String.prototype.PadLeft = function(padString, length) {
	var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}
 
String.prototype.PadRight = function(padString, length) {
	var str = this;
    while (str.length < length)
        str = str + padString;
    return str;
}


Worker.prototype.PostMessageToEngine = function(message)
{
	Log("Post message: "  + message,2);
	this.postMessage(message);
}



/**
<summary>Returns a background engine based on a background worker</summary>
*/
function CreateBackgroundEngine(filepath, customOnMessage, overrideWrapper) {
    if(overrideWrapper == undefined)
      overrideWrapper = false;
    var engine = null;
    try {
        engine = new Worker(filepath);
        if(overrideWrapper)
        {
          engine.onmessage = customOnMessage;
        }
        else
        {
          engine.customOnMessage =customOnMessage;
          engine.onmessage = 
          function wrapMessage(e) 
          {
            Log('@lambda:onmessage ' + e.data );
            var obj = e.data;
            if(obj !== null)
            {
              this.customOnMessage(obj);
            }
            else 
            {
              Log("Invalid message received from background worker");
            }
          } ;
        }

        engine.error = function (e) {
            alert("Error from background worker:" + e.message);
        }

    } catch (error) {
        alert("Your browser has problems with background workers. This is what we know: " + error);
        engine = null;
    }
    
    Log('@InitializeBackgroundEngine END');
    return engine;
}

function CreateProperMessage ( command , value )
{
    var stringed = JSON.stringify(value);
    var obs = { "command" : command, "vals" : stringed };
    var total = JSON.stringify(obs);
    return total;
}

function ReadProperMessage(message)
{
    var obj = null;
    try{ obj = JSON.parse(message);}
    catch (ex) { obj = null/*postMessage("Unrecognized command") ;*/ }
    
    if(obj != null )
    {
        var v = JSON.parse(obj.vals);
        var c =  obj.command;
        obj = { "command" : c, "vals" : v };
    }
    return obj;
}

/**
Shove something similar in the background process
*/
self.onmessage = function (e) {
   
    var obj = ReadProperMessage(e.data);
    
    if(obj != null )
    {
        if ( obj.command == "blah" )
        {
            var info = obj.vals;
            //Do stuff
        }
        else
        {
          Log("unrecognized command received");
        }
    }
    else
    {
    
    }
    
};


