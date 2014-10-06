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


function  Node ( state)
    {
      this.trueValue = NaN;
      this.inheritedValue = NaN;      
      this.mState = state;
      this.children = [];
    }
     
    
    
    
    function AdversarialAi ( moveGenerator ,evaluator, prioritizer ) 
    {
      this.evaluator = evaluator;
      this.prioritizer = prioritizer;
      this.moveGenerator = moveGenerator;
    }
    
    AdversarialAi.prototype.AlphaBeta = function( state, depth, max) 
    {
      
    }
    
    
    AdversarialAi.prototype._alphaBeta = function ( node,  depth,  alpha,  beta,  maximizing)
    {
        var this = this.this;
        //Greatest depth, then terminate
        if (depth == maxDepth) //|| mTerminate)
        {
            n.trueValue = eval(n.State, mEvalParams);
            return n.trueValue;
        }
        var children = this.moveGenerator (n.State);
        if (this.prioritizer  != null)
            this.prioritizer  (children, maximizing);

        var evaluatedChildren = 0;

        if (children.Count == 0)
        {
            n.trueValue = this.evalutaor(n.State, mEvalParams);
            return n.trueValue;
        }

        for (var ii = 0; ii < children.length; ++ii)
        {
            state = children[ii];
            ++evaluatedChildren;
            var child = new Node(state);
            child.inheritedValue = _alphaBeta(child, depth + 1, alpha, beta, !maximizing);
            if (maximizing) { alpha = Math.Max(alpha, child.inheritedValue); }
            else { beta = Math.Min(beta, child.inheritedValue); }
            n.children.push(child); //not used yet. Once I figure out how to pick up where I left off, it should be g2g
            if (beta <= alpha) //cut/dat/off
            {
                break;
            }
        }
        //chunk here was for benchmarking. Aint no one care about that
        //_evaluatedTotal += evaluatedChildren;
        //_savedChildrenTotal += children.Count - evaluatedChildren;
        var res = maximizing ? alpha : beta;
        return res;
    }
    
    
    this.onmessage = function (e) {
   
    var obj = e.data;//ReadProperMessage(e.data);
    
    if(obj != null )
    {
        if ( obj.command == "GetLog" )
        {
          postMessage({"command":"GetLog" ,"vals":g_log});
        }
        else if ( obj.command == "AlphaBeta" )
        {
            var info = obj.vals;
            //Do stuff
        }
        else
        {
          Log("Unrecognized command received");
        }
    }
    else
    {
      Log("Unrecognized command received");
    }
    
};