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
  ProcessEngine = CreateBackgroundEngine("js/background.js", 
  OnMessage,
  false);
  
	
  
  $('.parameter-section p').click( ToggleVisibilityClick  );
  $('.graph-label').click( ToggleVisibilityClick  );
  $('.parameters-label').click( ToggleVisibilityClick  );
  /*$('.select span').click(
    function (e)
    {
          console.log('click');
          var paras = $('.display div'); //we hide all ofthem.. oh hacky uuu
          paras.hide(400);
          selected = $(e.target).attr('id');
          console.log('hi');

          $('#' + selected + '-description').show(1000);
        
    }
    
  );*/
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
        
  
  /*
    numpad is 97 to 105
  */
}




$(document).load(Initialize(0));

