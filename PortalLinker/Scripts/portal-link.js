$(document).ready(
  function () {
    let owData = [
      { 'x': -320, 'y': 107, 'z': -3885 },
      { 'x': -248, 'y': 200, 'z': -3770 }
    ];
    let neData = [
      { 'x': -41, 'y': 126, 'z': -484 },
      { 'x': -29, 'y': 129, 'z': -473 }
    ];

    let portals = { 'overworld': owData, 'nether': neData };

    ImportPortals(portals);

    window.addEventListener('resize', function (event) {
      Refresh();
    });

    SetupDropJson();

    SetupMouseWheel();

    //https://web.dev/drag-and-drop/ https://www.w3schools.com/html/html5_draganddrop.asp
  });

function AddPortal(ele, dim) {
  let children = $(ele).parent().children("input");
  let x = parseFloat(children[0].value);
  let z = parseFloat(children[1].value);
  let y = parseFloat(children[2].value);
  if (Number.isNaN(x) || Number.isNaN(z) || Number.isNaN(y)) {
    console.log("Bad input");
    return;
  }
  let vec = { 'x': x, 'y': y, 'z': z };

  AddPortalDirect(dim, vec);

  Refresh();
}

var g_Arrow = '<div style="position: absolute; top: {top}px; left: {left}px;" class="{dim}-div">'
  + '<span>{portaldist}</span>'
  + '<svg class="portal-arrow portal-arrow-{dim} tooltipcontainer" width="1" height="1" >'
  + '     <defs>'
  + '         <marker id="{dim}-arrow" markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto">'
  + '             <path d="M2,2 L2,11 L10,6 L2,2"></path>'
  + '         </marker>'
  + '     </defs>'
  + '     <path d="M0,0 L{length},{height}">'
  + '     </path>'
  + ' </svg>'
  + ' <span class="tooltiptext">{portaldist}</span></div>'


function GetPortalInner(dim, vec) {

  let otherDim = GetOtherDim(vec, dim);

  return `<div class="portal-drag-control">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            </svg>
          </div>
          <span class='portal-coord main-coord'>${vec.x},</span>
          <span class='portal-coord main-coord'>${vec.z},</span>
          <span class='portal-coord main-coord'>${vec.y}</span>
          <span class='portal-coord portal-equiv'><sub>${otherDim.x}, ${otherDim.z}, ${otherDim.y}</sub></span>
          <button onclick='DeletePortal(this, "${dim}")'>x</button>`;
}

function AddPortalDirect(dim, vec) {
  let root = dim === "Overworld"
    ? $('.portal-holder-overworld')
    : $('.portal-holder-nether');

  root.children().last().before(`<div class="portal-entry" class="center-horizontal" draggable="true" data-dim="${dim}">`
    + GetPortalInner(dim, vec)
    +`</div>`);

  root.children().last().prev().data('vec', vec);
}

function DeletePortal(ele, dim) {
  $(ele).parent().remove();
  Refresh();
}

class Portal {
  constructor(uiEle, dim) {
    let vec = uiEle.data('vec');
    this.x = vec.x;
    this.y = vec.y;
    this.z = vec.z;
    this.vec = vec;
    this.hook = uiEle.offset();
    if (dim === "Overworld") {
      this.hook.left += uiEle.width();
      this.hook.left -= 50;
      this.hook.top -= 5;
    }
    else {
      this.hook.left += 50;
      this.hook.top += 5;
    }
    this.hook.top += uiEle.height() / 2;
    this.dim = dim;
    this.ui = uiEle;
  }

  Link(otherPortal, distance) {
    let length = otherPortal.hook.left - this.hook.left - 10 ;
    let height = otherPortal.hook.top - this.hook.top;
    let left = this.hook.left;
    if (this.dim === "Nether") {
      
      height += 10;
    }
    else {
      height -= 10;
    }

    let newArrow = g_Arrow
      .replace("{top}", this.hook.top)
      .replace("{left}", this.hook.left)
      // more like, x,y but wtv
      .replace("{length}", length)
      .replace("{height}", height)
      .replace("{dim}", this.dim)
      .replace("{dim}", this.dim)
      .replace("{dim}", this.dim)
      .replace("{portaldist}", distance.toFixed(1))
      .replace("{portaldist}", distance.toFixed(1));

    $(".portal-arrows").append(newArrow);
  }

  Refresh() {
    this.ui.html(GetPortalInner(this.dim, this.vec));
  }

  toString() {
    let l = this;
    return `${l.dim}@(${l.x},${l.z},${l.y})`;
  }
}

function Refresh() {
  $(".portal-arrows").html("");
  let { overworldPortals, netPortals } = GetPortals();

  FindLinks(overworldPortals, netPortals, "Overworld");
  FindLinks(netPortals, overworldPortals, "Nether");
}

function GetPortals() {
  let overworldPortalsUi = $('.portal-holder-overworld .portal-entry');
  let overworldPortals = [];
  for (let i = 0; i < overworldPortalsUi.length - 1; ++i) {
    let portal = new Portal($(overworldPortalsUi[i]), "Overworld");
    overworldPortals.push(portal);
    portal.Refresh();
  }

  let netPortalsUi = $('.portal-holder-nether .portal-entry');
  let netPortals = [];
  for (let i = 0; i < netPortalsUi.length - 1; ++i) {
    let portal = new Portal($(netPortalsUi[i]), "Nether");
    netPortals.push(portal);
    portal.Refresh();
  }
  return { overworldPortals, netPortals };
}

function FindLinks(portalsLeft, portalsRight, dim) {
  for (let i = 0; i < portalsLeft.length; ++i) {
    let links = [];
    for (let j = 0; j < portalsRight.length; ++j) {
      let link = CanConnect(portalsLeft[i], portalsRight[j], dim);
      links.push(link);
    }
    let validLinks = links.filter((l) => l.links);
    validLinks.sort((l, r) => l.dist - r.dist);
    if (validLinks.length > 0) {
      let chosenTarget = validLinks[0];
      portalsLeft[i].Link(chosenTarget.target, chosenTarget.dist);
    }
  }
}

function GetOtherDim(vec, currentDim) {
  if (currentDim === 'Overworld') {
    let res = {
      'x': Math.floor(vec.x / 8),
      'y': Math.floor(vec.y),
      'z': Math.floor(vec.z / 8)
    };
    return res;
  }
  let res = {
    'x': Math.floor(vec.x * 8),
    'y': Math.floor(vec.y),
    'z': Math.floor(vec.z * 8)
  };
  return res;
}

function CanConnect(l, r, dim) {
  let res = { 'links': false, 'dist': -1, 'target': r };
  let otherVec = GetOtherDim(l, dim);
  let xdiff = Math.abs(otherVec.x - r.x);
  let ydiff = Math.abs(otherVec.y - r.y);
  let zdiff = Math.abs(otherVec.z - r.z);
  res.dist = Math.sqrt(xdiff * xdiff + ydiff * ydiff + zdiff * zdiff);
  if (xdiff > 128 || zdiff > 128) {
    return res;
  }

  // if the source dim is overworld, we can't connect past 127
  // not a thing since 1.16
  // if (dim === "Overworld" && r.y > 127) {
  //   return res;
  // }

  console.log(`${l} connects to ${r} at distance ${res.dist} `)
  res.links = true;
  return res;
}

function ExportPortals(overworldPortals, netPortals) {

  let portals = { "overworld": overworldPortals, "nether": netPortals }
  let contents = JSON.stringify(
    portals,
    (k, v) => (k == "ui" || k == "hook" || k == "dim") ? undefined : v,
    2);
  let fileName = "portals.json";

  SaveFile(fileName, contents);
}

function ExportPortalsUI() {
  let { overworldPortals, netPortals } = GetPortals()
  ExportPortals(overworldPortals, netPortals);
}

function SaveFile(fileName, fileContents) {
  let pp = document.createElement('a');
  pp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContents));
  pp.setAttribute('download', fileName);
  pp.click();
}

function ImportPortals(portals) {
  let owData = portals.overworld;
  let neData = portals.nether;
  for (let i = 0; i < owData.length; ++i)
    AddPortalDirect("Overworld", owData[i]);
  for (let i = 0; i < neData.length; ++i)
    AddPortalDirect("Nether", neData[i]);
  Refresh();
}

function SetupDropJson() {
  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    files = evt.dataTransfer.files; // FileList object.

    file = files[0];

    ReadFile(file);
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  let reader;
  function ReadFile(fileToRead) {
    reader = new FileReader();
    reader.readAsText(fileToRead);
    $('.head').text(file.name.substr(0, file.name.length - 4));
    reader.onload = LoadFile;
  }

  function LoadFile() {
    let portals = JSON.parse(reader.result);
    ImportPortals(portals);
  }

  let dropZone = document.querySelector('body');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);
}

function SetupMouseWheel() {
  $(document).on('mousewheel', 'span.portal-coord.main-coord', function (e) {

    function GetParentAndIndex(target) {
      let parent = $(e.currentTarget).parent();
      let ix = parent.children().index(e.currentTarget) - 1;
      let coord = 'x';
      switch (ix) {
        case 1: coord = 'z'; break;
        case 2: coord = 'y'; break;
      }
      return [parent, coord];
    }

    let [parent, ix] = GetParentAndIndex(e.currentTarget);
    let vec = parent.data('vec');

    if (e.originalEvent.wheelDelta / 120 > 0) {
      vec[ix] = vec[ix] + 1;
    }
    else if (e.originalEvent.wheelDelta / 120 < 0) {
      vec[ix] = vec[ix] - 1;
    }

    e.currentTarget.textContent = `${vec[ix]},`;
    parent.data('vec', vec);

    Refresh();
  });
}