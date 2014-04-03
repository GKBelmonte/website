var someValue = -1;

function FacePalm()
{
	return someValue;
}

self.onmessage = function (e) {
	
    var obj = JSON.parse(e.data);
	if (obj.command =  "set") 
	{
        someValue = parseInt(obj.val);
    }
    else if (obj.command =  "add") 
	{
        someValue = parseInt(obj.val);
    }
	
	postMessage("Set value to " + someValue);
}