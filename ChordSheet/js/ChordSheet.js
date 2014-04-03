	var file;
	var files;
	var LoadedFileName;
	var ChordsSharp = [ 'A' , 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#',  'G', 'G#'];
	String.prototype.removeAt=function(index) {
      return this.substr(0, index) + this.substr(index+1);
	}
   
   String.prototype.replaceAt=function(index,string, len) {
	if(len == undefined)
		len = 1;
	
      return this.substr(0, index) + string + this.substr(index+len);

	}

	function handleFileSelect(evt) 
	{
		evt.stopPropagation();
		evt.preventDefault();

		files = evt.dataTransfer.files; // FileList object.

		// files is a FileList of File objects. List some properties.
		var output = [];
		for (var i = 0, f; f = files[i]; i++) {
		  output.push('<li><strong>', f.name, '</strong></li>');
		  console.log(f.name);
		}
		file = files[0];
		$('#list').prepend('<ul>' + output.join('') + '</ul>');
		ReadFile(file);
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  var reader;
  function ReadFile(fileToRead)
  {
	reader = new FileReader();
	reader.readAsText(fileToRead);
	$('.head').text(file.name.substr(0,file.name.length - 4));
	reader.onload = LoadFile;
  }
  
  function ParseChords(chords_)
  {
	var chords = chords_;
		for(var ii = 0; ii < chords.length; ++ii)
		{
			if(chords[ii] == '@')
			{
				chords = chords.removeAt(ii);
				var chordBase = ChordsSharp.indexOf(chords[ii]);
				if(chords[ii+1] == '#')
					chordBase+=1;
				var initLoc = ii;
				while( ii < chords.length && (chords[ii] != ' ' && chords[ii] != '\n'))
					++ii;
				var len = ii - initLoc;
				
				var ToWrap = '<span type="' + ChordsSharp[chordBase] + '">' + chords.substr(initLoc,len) + ' ' + '</span>';
				
				chords = chords.replaceAt(initLoc,ToWrap, len);
			}
		}
		return chords;
  }
  
  function LoadFile()
  {
	var chords = ParseChords(reader.result);
	var midFile = chords.length/2;
	midFile = chords.indexOf('\n',midFile);
	
	$('.left').html('');
	
	$('.left').append(chords.substr(0,midFile));
	
	$('.right').html('');
	
	$('.right').append(chords.substr(midFile+1));
	
  }
  
  
  function ShiftChords(amount)
  {
	var nodes = $('span');
	for(var ii = 0; ii < nodes.length; ++ii)
	{
		var node = $(nodes[ii]);
		var chord = node.attr('type');
		if (chord == undefined)
			continue;
		var ind = (ChordsSharp.indexOf(chord) + amount) ;
		if(ind < 0)
			ind += 12;
		else
			ind = ind % 12;
		node.attr('type',ChordsSharp[ind]);
		var txt = node.text();
		if(txt[1] == '#')
			txt = txt.replaceAt(0,ChordsSharp[ind],2);
		else
			txt = txt.replaceAt(0,ChordsSharp[ind]);
		node.text(txt);
	}
  }
  
  // Setup the dnd listeners.
  var dropZone = document.getElementById('drop_zone');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);
  
  $('#imgminustone').click(function(){ShiftChords(-1);});
  $('#imgplustone').click(function(){ShiftChords(1);});
  
  
  $('#imgminuslineh').click
  (
	function()
	{
		var parse = $('.left').css('line-height');
		parse = parse.substr(0,parse.length-2);
		var i = parseInt(parse); 
		var res  =  (i - 1 ) + 'px';
 		$('.left').css('line-height', res);

		$('.right').css('line-height', res);
	}
  );
  $('#imgpluslineh').click
  (
	function()
	{
		var parse = $('.left').css('line-height');
		parse = parse.substr(0,parse.length-2);
		var i = parseInt(parse); 
		var res  =  (i +1 ) + 'px';
		$('.left').css('line-height', res);

		$('.right').css('line-height', res);
	}
  );
  
  $('#imgminustop').click
  (
	function()
	{
		var parse = $('.sheet span').css('top');
		console.log(parse);
		parse = parse.substr(0,parse.length-2);
		var i = parseInt(parse); 
		var res  =  (i - 1 ) + 'px';
 		$('.sheet span').css('top', res);

		$('.sheet span').css('top', res);
	}
  );
  
  $('#imgplustop').click
  (
	function()
	{
		var parse = $('.sheet span').css('top');
		console.log(parse);
		parse = parse.substr(0,parse.length-2);
		var i = parseInt(parse); 
		var res  =  (i +1 ) + 'px';
		$('.sheet span').css('top', res);

		$('.sheet span').css('top', res);
	}
  );
  
  
  function toHex (str) {
	var r = "";
	var i;
	var letter = "0123456789abcdef";
	
	for (i=0; i<str.length; i++) {
		r += letter[str.charCodeAt(i)  >> 4] + letter[str.charCodeAt(i) & 15];
	}
	
	return r;
}


function newBrute()
{
  
      var possKey = "xy";
      var pass ="qb";
      var iv = possKey;
      var r = "";
      var block;
      
      for (i=0; i<pass.length; i+=2) {
        block = pass.substr(i, 2);
        r += XOR(iv, block);
       // iv = SomeHashFunction.hash(block);
      }
      
      return toHex(r);
      
  
}


function fromHex(str) {
	var r = "";
	var i;
	
	for (i=0; i<str.length; i += 2) {
		r += String.fromCharCode(parseInt(str.substr(i, 2), 16));
	}
	
	return r;
}

function XOR(str1, str2) {
	var i;
	var r = "";
	
	for (i=0; i<str2.length; i++) {
		r += String.fromCharCode(str1.charCodeAt(i) ^ str2.charCodeAt(i));
	}
	
	return r;
}

function customEncryptionFunction (pass) {
	var key = KeyLoader.loadKeyFromFile("static.key");
	var iv = SomeHashFunction.hash(key);
	var r = "";
	var block;
	
	for (i=0; i<pass.length; i+=2) {
		block = pass.substr(i, 2);
		r += XOR(iv, block);
		iv = SomeHashFunction.hash(block);
	}
	
	return toHex(r);
}

//afilortw13579
function bruteForce_4()
{
  var passProb = ["aa","ff","ii","ll","oo","rr","tt","ww","11","33","55","77","99"];
  for(var kk = 0; kk < passProb.length;++kk)
  for(var ii=0 ;ii < 255; ++ii)
  {
    for(var jj = 0; jj < 255;++jj)
    {
      var possKey = String.fromCharCode(ii)+String.fromCharCode(jj);
      posCrypt = XOR(possKey,passProb[kk]);
      if(toHex(posCrypt) == "5555")
      {
        console.log(passProb[kk] + " " + ii+","+jj);
        
      }
    }
  }
}

// Match 5e0e
// Crypto #2

//afilortw13579

function bruteForce()
{
  var posChars =["a","f","i","l","o","r","t","w","1",'3','5','7','9']; 
  for(var ii=0 ;ii < 255; ++ii)
  {
    for(var jj = 0; jj < 255;++jj)
    {
      var possKey = String.fromCharCode(ii)+String.fromCharCode(jj);
      for(var kk =0 ;kk< posChars.length;++kk)
      {
        for(var ll=0; ll < posChars.length;++ll)
        {
          var possPlain = posChars[kk]+posChars[ll];
          var res =  XOR(possKey,possPlain);
          if("5e0e" == toHex(res))
          {
            console.log(possPlain + " with " +possKey);
          }
        }
      }
    }
  }

}

/*
52,52
51,51
60,60
57,57
58,58
39,39
33,33
34,34
00,100
102,102
96,96
98,98
108,108
*/
/*
PLAIN  01100110
KEY    11001010
CRYPT  10101100 


PLAIN  10101010
KEY    11001010
CRYPT  01100000
*/
