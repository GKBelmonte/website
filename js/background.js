

/**
Shove something similar in the background process
*/
self.onmessage = function (e) {
   
    var obj = e.data;
    if(obj != null )
    {
        if ( obj.command == "process" )
        {
            LoadParams(obj.vals);
            var res = new Array();
            res.push(["Time","Gas Protein","Repressor","Gas","AhlR","Ahl"])
            for (var ii = 0; ii < SAMPLE_POINTS; ++ii)
            { 
                //TODO: Somehow make these calls simultaneous. They use values from the future currently.
                var pg = GetNextProteinGazQuantity();
                var rep = GetNextRepressorQuantity();
                var gas = GetNextGasQuantity();
                var ahlr = GetNextAhlrQuantity();
                var ahl = GetNextAhlQuantity();
                res.push([ii*DELTA_TIME , pg, rep, gas, ahlr,ahl]);
            }
            postMessage({"command":"process" ,"vals":res});
        }
        else if(obj.command == "graph-rep")
        {
          var REP_SAMPLES = 100;
        
          LoadParams(obj.vals);
          var res = new Array();
          res.push(["Gas","Delta Repressor"])
          for( var ii = 0; ii < REP_SAMPLES ; ++ ii)
          {
            var delta = GetRepressorRate();
            res.push([nowGasQuantity, delta]);
            nowGasQuantity += 0.5;
          }
          postMessage({"command":"graph-rep" ,"vals":res});
        }
        else if(obj.command == "graph-gas")
        {
          var GAS_SAMPLES = 100;
          var GAS_P_SAMPLES = 100;
        
          LoadParams(obj.vals);
          var total_res = [ null, null];
          var res = new Array();
          res.push(["Gas Protein","Delta Gas"])
          for( var ii = 0; ii < GAS_SAMPLES ; ++ ii)
          {
            var delta_gas = GetGasRate();
            res.push([nowProteinGazQuantity, delta_gas]);
            nowProteinGazQuantity += 0.5;
          }
          total_res[0] = res;
          LoadParams(obj.vals);
          res = new Array();
          res.push(["Repressor","Delta Gas Protein"])
          for( var ii = 0; ii < GAS_P_SAMPLES ; ++ ii)
          {
            var delta_gas = GetProteinGazRate();
            res.push([nowRepressorQuantity, delta_gas]);
            nowRepressorQuantity += 0.5;
          }
          total_res[1] = res;
          
           postMessage({"command":"graph-gas" ,"vals":total_res});
        }
        else
        {
          postMessage({'command':'error', 'vals':'Unrecognized command'});
          Log("unrecognized command received");
        }
    }

    else
    {
      postMessage({'command':'error', 'vals':'Unformatted message'});
      Log("Unformatted message received");
    }
    
};
