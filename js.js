var ProcessEngine = null;
var DataToGraphPointRatio = 4;
var g_Data = null;
var selected = 'default';
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
var ev2;
function Initialize(arg1)
{
  ProcessEngine = CreateBackgroundEngine("background.js", 
  OnMessage,
  false);

	
  
  $('.parameter-section p').click( ToggleVisibilityClick  );
  $('.graph-label').click( ToggleVisibilityClick  );
  $('.parameters-label').click( ToggleVisibilityClick  );
  $('.select span').click(
    function (e)
    {
    console.log('click');
      var paras = $('.display div');
      paras.hide(400);
          selected = $(e.target).attr('id');
          console.log('hi');

          $('#' + selected + '-description').show(1000);
        
    }
    
  );
}




$(document).load(Initialize(0));

