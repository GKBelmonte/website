import { Vector } from './vector.js';

var ProcessEngine = null;

var selected = 'default';
function OnMessage (data)
{
  if(data.command == "process") {

  }
  else if (data.command == 'graph-gas')  {
    
  }
  else {
    Log("Unrecognized command response received from background worker", 0 );
  }
}

function cursify() {
  if(!$.typer.options.stopCursor)
  {
    setTimeout(() => {
      let cursor = $('.cursor');
      cursor.fadeIn(600,
        () => cursor.fadeOut(600,
          () => cursify()));
    }, 100);
  }
}

var site = site || {};


var ev2;
function Initialize(arg1)
{
  ProcessEngine = CreateBackgroundEngine(
      "js/background.js", 
      OnMessage,
      false);
  
  $('.section-expand').click( ToggleVisibilityClick  );
  $('.graph-label').click( ToggleVisibilityClick  );
  $('.parameters-label').click(ToggleVisibilityClick);
  $('#gkb-about-me-expand').click(aboutExpandCollapse);

  //OLD
  //$('.select span').click(
  //  function (e) {
  //        selected = $(e.target).attr('id');
  //        $('#dock-description').typeTo( $('#' + selected + '-description').html() );
  //  }
  //);

  initNavLabels();

  $('.select span').click((e) => {
    let id = e.target.id
    let target = $(`#${id}-description`);
    site.impress.goto(target[0]);
    if (!site.impressSwitch.checked)
      $('#impress-fallback').html(target.html());
  });
  
  RegisterKonamiCode(function() {} );

  setTimeout(function () {
    $('#dock-description').typeTo($('#DescriptionDefault').html())
  }, 200);

  $.getJSON("spherePackedPoints.json", (d) => {
    site.spherePackedPoints = d;
    initImpress();
  });

  //handle switch between impress and not impress
  site.impressSwitch = $('#impress-switch input')[0];
  $('#impress-switch').click(() => {
    if (site.impressSwitch.checked) {
      $('#impress').show();
      $('#impress-fallback').hide();
    }
    else {
      $('#impress').hide();
      $('#impress-fallback').show();
    }
  });

  //keep fallback in sync
  $(document).on('impress:stepenter', stepEnterHandler);
  $(document).on('impress:stepleave', stepLeaveHandler);
}

site.idleRoate = true;

function stepLeaveHandler(e) {
  switch (e.target.id) {
    case 'start':
      $('#impress > div').removeClass('idle-rotating');
      //await new Promise(r => setTimeout(r, 1000));
      break;
    default:
      $('#impress-fallback').html($(e.target).html());
      break;
  }
}

function stepEnterHandler(e) {
  
  if (site.impressSwitch.checked) {
    switch (e.target.id) {
      case 'start':
        $('#impress > div').addClass('idle-rotating');
        break;
      default:
        $('#impress-fallback').html($(e.target).html());
        break;
    }
  }

}

function initNavLabels() {
  //only true before impress init
  let steps = $("#impress > div:not('.exclude-from-auto-pos')");
  let titles = [];
  for (let s of steps) {
    let step = $(s);
    let title = step.attr('title');
    let targetId = step.attr('id');
    let cutAt = targetId.indexOf('-description');
    if (cutAt === -1)
      continue;
    let id = targetId.substr(0, cutAt);
    titles.push({
      'id': id,
      'title': title
    });
  }

  let navPane = $('#gkb-nav-pane');
  for (let i = titles.length - 1; i >= 0; --i) {
    navPane.prepend(`<div class="select">
          <span class="select-label" id='${titles[i].id}'>${titles[i].title}</span>
        </div>`);
  }
}

function initImpress() {
    //data-rotate-x
    //data-rotate-y
  let baseRadius = 125;
  let steps = $("#impress > div:not('.exclude-from-auto-pos')"); //only true before impress init
  let stepCount = steps.length;
  site.currentSsp = site.spherePackedPoints[stepCount];
  site.steps = steps;

  for (let i = 0; i < site.currentSsp.length; ++i) {
    let vector = site.currentSsp[i];
    let step = $(steps[i]);
    // Default vector generated is 1,0,0. I rather have it be 0,0,1, as it should incur no rotation.
    // (as a sanity check)
    let v = new Vector(vector.Y, vector.Z, vector.X);
    
    let o = v.getOrientationFromVector();
    step.attr('data-rotate-x', o.X * 180 / Math.PI );
    step.attr('data-rotate-y', o.Y * 180 / Math.PI);
    step.attr('data-x', v.X * baseRadius * stepCount);
    step.attr('data-y', v.Y * baseRadius * stepCount);
    step.attr('data-z', v.Z * baseRadius * stepCount);
    step.addClass("step slide");
  }

  site.impress = impress();
  site.impress.init();

  $('body').css('overflow', '');
}

function aboutExpandCollapse(e) {
  let target = $('#gkb-about-me');

  let collapsing = $(e.currentTarget).hasClass('section-collapsing');//$(e.currentTarget).hasClass('about-section-expanded');
  if (collapsing) {
    target.typeTo("", () => clearComplete(), () => typeComplete());
  }
  else {
    setTimeout(() => {
      target.typeTo($('#gkb-about-me-content').html(), () => clearComplete(), () => typeComplete());
      cursify();
    }, 100);
  }
}

function clearComplete() {
  console.log('clear complete');
}

function typeComplete() {
  console.log('type complete');
}

$(document).ready(() => Initialize(0));
