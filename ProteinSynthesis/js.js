var ProcessEngine = null;
var DataToGraphPointRatio = 4;
var g_Data = null;
function PlotData ( )
{
    var gpGroupNumber = parseInt($('#gas-protein-group').val());
    var rGroupNumber = parseInt($('#gas-group').val());
    var gGroupNumber = parseInt($('#repressor-group').val());
    var ahlrGroupNumber =parseInt($('#ahlr-group').val());
    var ahlGroupNumber = parseInt($('#ahl-group').val());
    var groupNumbers = [gpGroupNumber,gGroupNumber,rGroupNumber,ahlrGroupNumber,ahlGroupNumber];
    
    var Group1Data = new Array();
    var Group2Data = new Array();
    var Group3Data = new Array();
    var Group4Data = new Array();
    var Group5Data = new Array();
    var AllGroupData = [Group1Data,Group2Data,Group3Data,Group4Data,Group5Data];
    if (g_Data != null)
    {
        
        for(var ii = 0; ii < g_Data.length; ++ii)
        {
          if (ii % DataToGraphPointRatio == 0)
          {
            var groupRows =[
            [g_Data[ii][0] ],
            [g_Data[ii][0] ],
            [g_Data[ii][0] ],
            [g_Data[ii][0] ],
            [g_Data[ii][0] ]
            ];
            for(var jj=1; jj < 6/*g_Data[ii].length*/; ++jj)
            {
              groupRows[groupNumbers[jj-1]-1].push( g_Data[ii][jj] );
            }
            
            for(var jj = 0; jj < AllGroupData.length; ++jj)
            {
              AllGroupData[jj].push (groupRows[jj] );
            }
          }
        }
        
        for(var ii = 0; ii < 5; ++ii)
        {
          var data = google.visualization.arrayToDataTable(AllGroupData[ii]);

          var options = {
            title: 'Group '+(ii+1).toString()+' Graphs'
          };
          
          var chart = new google.visualization.LineChart($('#graph-group'+(ii+1).toString())[0]);
          chart.draw(data, options);
        }
    }
}
function GetParamObj()
{
  var GasProteinHalfLife = parseFloat($('#GasProteinHalfLifeInput').val());
  var GasProteinStrength = parseFloat($('#GasProteinStrengthInput').val());
  var GasProteinSize = parseFloat($('#GasProteinSizeInput').val());
  var GasProteinThreshold = parseFloat($('#GasProteinThresholdInput').val());
  var GasProteinSensitivity = parseFloat($('#GasProteinSensitivityInput').val());
  var GasProduction = parseFloat($('#GasProductionInput').val());
  var GasDiffusion = parseFloat($('#GasDiffusionInput').val());
  
  var RepressorHalfLife = parseFloat($('#RepressorHalfLifeInput').val());
  var RepressorStrength = parseFloat($('#RepressorStrengthInput').val());
  var RepressorSize = parseFloat($('#RepressorSizeInput').val());
  var RepressorThreshold = parseFloat($('#RepressorThresholdInput').val());
  var RepressorSensitivity = parseFloat($('#RepressorSensitivityInput').val());
  
  var AhlrHalfLife = parseFloat($('#AhlrHalfLifeInput').val());
  var AhlrStrength = parseFloat($('#AhlrStrengthInput').val());
  var AhlrSize = parseFloat($('#AhlrSizeInput').val());
  var AhlrThreshold = parseFloat($('#AhlrThresholdInput').val());
  var AhlrSensitivity = parseFloat($('#AhlrSensitivityInput').val());
  
  var AhlHalfLife = parseFloat($('#AhlHalfLifeInput').val());
  var AhlStrength = parseFloat($('#AhlStrengthInput').val());
  var AhlSize = parseFloat($('#AhlSizeInput').val());
  var AhlThreshold = parseFloat($('#AhlThresholdInput').val());
  var AhlSensitivity = parseFloat($('#AhlSensitivityInput').val());
  
  
  var DeltaTime = parseFloat($('#DeltaTimeInput').val());
  
  var DataSize = parseFloat($('#DataSizeInput').val());
  
  var params = 
  {
    'GasProteinHalfLife' : GasProteinHalfLife ,
    'GasProteinStrength' : GasProteinStrength,
    'GasProteinSize' : GasProteinSize,
    'GasProteinThreshold' : GasProteinThreshold,
    'GasProteinSensitivity' : GasProteinSensitivity,
    
    'GasProduction' : GasProduction,
    'GasDiffusion' : GasDiffusion,
    
    'RepressorHalfLife' : RepressorHalfLife,
    'RepressorStrength' : RepressorStrength,
    'RepressorSize' : RepressorSize,
    'RepressorThreshold' : RepressorThreshold,
    'RepressorSensitivity' : RepressorSensitivity,
    
    'AhlrHalfLife' : AhlrHalfLife,
    'AhlrStrength' : AhlrStrength,
    'AhlrSize' : AhlrSize,
    'AhlrThreshold' : AhlrThreshold,
    'AhlrSensitivity': AhlrSensitivity,
    
    'AhlHalfLife' : AhlHalfLife,
    'AhlStrength' : AhlStrength,
    'AhlSize' : AhlSize,
    'AhlThreshold' : AhlThreshold,
    'AhlSensitivity': AhlSensitivity,
    
    'DeltaTime' : DeltaTime,
    'DataSize' : DataSize
  }
  
  var _DataToGraphPointRatio = parseFloat($('#DataToGraphPointRatioInput').val());

  if(isNaN (_DataToGraphPointRatio) )
  {
    
  }
  else
  {
    DataToGraphPointRatio = _DataToGraphPointRatio;
  }
  
    
    var NameArray = 
  [
    'GasProteinHalfLife',
    'GasProteinStrength' ,
    'GasProteinSize' ,
    'GasProteinThreshold' ,
    'GasProteinSensitivity' ,
    
    'GasProduction' ,
    'GasDiffusion' ,
    
    'RepressorHalfLife' ,
    'RepressorStrength' ,
    'RepressorSize' ,
    'RepressorThreshold' ,
    'RepressorSensitivity' ,
    
    'DeltaTime' ,
    'DataSize' 
  ];
  if( DataToGraphPointRatio > 100)
  {
    alert("Your data-to-graph ratio is too large, 1 point will be graphed for each " + DataToGraphPointRatio + " data points. This may cause graphing aliasing");
  }

  return params;
}


function RunSimulation()
{
 
  var params = GetParamObj();
  
  $('#bttnRun').attr('disabled',"disabled");
  $('#bttnRun').text('Running...');
    if(ProcessEngine != null)
  {
    ProcessEngine.postMessage({"command":"process", "vals":params });
  }
  else
  {
    alert("The background engine was not created successfully. See earlier error for details...");
  }
}

function GraphGas()
{
  var params = GetParamObj();
  if(ProcessEngine != null)
  {
    ProcessEngine.postMessage({"command":"graph-gas", "vals":params });
  }
  else
  {
    alert("The background engine was not created successfully. See earlier error for details...");
  }
}

function GraphRep()
{
  var params = GetParamObj();
  if(ProcessEngine != null)
  {
    ProcessEngine.postMessage({"command":"graph-rep", "vals":params });
  }
  else
  {
    alert("The background engine was not created successfully. See earlier error for details...");
  }
}

function OnMessage (data)
{
  if(data.command == "process")
  {
      g_Data = data.vals;
      $('#bttnRun').text('Run'); 
      $('#bttnRun').removeAttr('disabled',"disabled"); 
      
      PlotData();
  }
  else if (data.command == 'graph-gas')
  {
    var plot_data = google.visualization.arrayToDataTable(data.vals[0]);

    var options = {
      title: 'Gas Rate Of Change'
    };

    var chart = new google.visualization.LineChart($('#gas-rate-graph')[0]);
    chart.draw(plot_data, options);
    
    plot_data = google.visualization.arrayToDataTable(data.vals[1]);

    options = {
      title: 'Gas Protein Rate Of Change'
    };

    var chart2 = new google.visualization.LineChart($('#gas-protein-rate-graph')[0]);
    chart2.draw(plot_data, options);
  }
  else if(data.command == 'graph-rep')
  {
    var plot_data = google.visualization.arrayToDataTable(data.vals);

    var options = {
      title: 'Repressor Rate Of Change'
    };

    var chart = new google.visualization.LineChart($('#rep-rate-graph')[0]);
    chart.draw(plot_data, options);
  }
  else
  {
    Log("Unrecognized command response received from background worker", 0 );
  }
}

function Initialize(arg1)
{
  ProcessEngine = CreateBackgroundEngine("background.js", 
  OnMessage,
  false);
  
  if(ProcessEngine != null)
  {
    ProcessEngine.postMessage({"command":"process", "vals":null });
  }
	
  
  $('.parameter-section p').click( ToggleVisibilityClick  );
  $('.graph-label').click( ToggleVisibilityClick  );
  $('.parameters-label').click( ToggleVisibilityClick  );
  $('#bttnRun').click(RunSimulation);
  $('#bttnGraphGasRate').click(GraphGas);
  $('#bttnGraphRepRate').click(GraphRep);
  $('#gas-protein-group').change(function () {PlotData();} );
  $('#gas-group').change(function () {PlotData();} );
  $('#repressor-group').change(function () {PlotData();} );
  $('#ahl-group').change(function () {PlotData();} );
  $('#ahlr-group').change(function () {PlotData();} );
}




$(document).load(Initialize(0));

