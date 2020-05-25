var ProcessEngine = null;

var selected = 'default';
function OnMessage (data)
{
  if(data.command == "process")
  {
    /**/
  }
  else if (data.command == 'graph-gas')
  {
    /* *****  stuff */
  }
  else
  {
    Log("Unrecognized command response received from background worker", 0 );
  }
}

function cursify() {
 if(!$.typer.options.stopCursor)
 {
  $('.cursor').fadeIn(395);
  $('.cursor').fadeOut(395);
 }
} 

var ev2;
function Initialize(arg1)
{
    ProcessEngine = CreateBackgroundEngine(
        "js/background.js", 
        OnMessage,
        false);
  
    $('.section-expand').click( ToggleVisibilityClick  );
      $('.graph-label').click( ToggleVisibilityClick  );
      $('.parameters-label').click( ToggleVisibilityClick  );

      $('.select span').click(
        function (e)
        {
              selected = $(e.target).attr('id');
  
              $('#dock-description').typeTo( $('#' + selected + '-description').html() );
        
        }
    
      );
  
      setInterval ( cursify, 800 );
      RegisterKonamiCode(function() {} );
      setTimeout(function () {
      $('#dock-description').typeTo( $('#DescriptionDefault').html() ) } , 200);
}


$(document).ready(() => Initialize(0));

