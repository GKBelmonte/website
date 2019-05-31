$(document).ready(
    function () {
        let owData = [
            {'x': -320, 'y': 107, 'z': -3885},
            {'x':-248, 'y': 200, 'z': -3770}
            ];
        let neData = [
            {'x':-41, 'y': 126, 'z': -484},
            {'x':-29, 'y': 129, 'z': -473}
            ];

        for(let i = 0; i < owData.length; ++i)
            AddPortalDirect("Overworld", owData[i]);
        for(let i = 0; i < owData.length; ++i)
            AddPortalDirect("Nether", neData[i]);
        Refresh();
    });
    
function AddPortal(ele, dim)
{
    let children = $(ele).parent().children("input");
    let x = parseFloat(children[0].value);
    let z = parseFloat(children[1].value);
    let y = parseFloat(children[2].value);
    if (Number.isNaN(x) || Number.isNaN(z) || Number.isNaN(y))
    {
        console.log("Bad input");
        return;
    }
    let vec = { 'x': x, 'y': y, 'z': z };

    AddPortalDirect(dim, vec);
    
    Refresh();
}

var g_Arrow = '<div><svg class="portal-arrow portal-arrow-{dim} tooltipcontainer" width="306" height="100" style="top: {top}px; left: {left}px;">'
              
              + '     <defs>'
              + '         <marker id="{dim}-arrow" markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto">'
              + '             <path d="M2,2 L2,11 L10,6 L2,2"></path>'
              + '         </marker>'
              + '     </defs>'
              + '     <path d="M0,0 L{length},{height}">'
              + '     </path>'
              + ' </svg>'
              + ' <span class="tooltiptext">{portaldist}</span></div>'

function AddPortalDirect(dim, vec)
{
    let root = dim === "Overworld" 
        ? $('.portal-holder-overworld')
        : $('.portal-holder-nether');
    
    let otherDim = GetOtherDim(vec, dim);
    
    root.children().last().before('<div class="portal-entry" class="center-horizontal">'
    + `<span class='portal-coord'>${vec.x},</span>`
    + `<span class='portal-coord'>${vec.z},</span>`
    + `<span class='portal-coord'>${vec.y}</span>`
    + `<span class='portal-coord portal-equiv'><sub>${otherDim.x}, ${otherDim.z}, ${otherDim.y}</sub></span>`
    + `<button onclick='DeletePortal(this, "${dim}")'>x</button>`
    + `</div>`);
    
    root.children().last().prev().data('vec', vec);
}

function DeletePortal(ele, dim)
{
    $(ele).parent().remove();
    Refresh();
}

class Portal {
    constructor(uiEle, dim)
    {
        let vec = uiEle.data('vec');
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
        this.hook = uiEle.offset();
        if(dim === "Overworld")
        {
            this.hook.left += uiEle.width();
            this.hook.left -= 50;
            this.hook.top -=5;
        }
        else
        {
            this.hook.left += 50;
            this.hook.top +=5;
        }
        this.hook.top += uiEle.height()/2;
        this.dim = dim;
        this.ui = uiEle;
    }
    
    Link(otherPortal)
    {
        let length = otherPortal.hook.left - this.hook.left;
        let height = otherPortal.hook.top - this.hook.top;
        let left = this.hook.left;
        if (this.dim === "Nether")
        {
            left += 5;
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
            .replace("{dim}", this.dim);
        
        $(".portal-arrows").append(newArrow);
    }
}

function Refresh()
{
    $(".portal-arrows").html("");
    let overworldPortalsUi = $('.portal-holder-overworld .portal-entry');
    let overworldPortals = [];
    for(let i = 0; i < overworldPortalsUi.length - 1; ++i)
    {
        overworldPortals.push(new Portal($(overworldPortalsUi[i]), "Overworld"));
    }
    
    let netPortalsUi = $('.portal-holder-nether .portal-entry');
    let netPortals = [];
    for(let i = 0; i < netPortalsUi.length - 1; ++i)
    {
        netPortals.push(new Portal($(netPortalsUi[i]), "Nether"));
    }
    
    FindLinks(overworldPortals, netPortals, "Overworld");
    FindLinks(netPortals , overworldPortals, "Nether");
}

function FindLinks(portalsLeft, portalsRight, dim)
{
    for(let i = 0; i < portalsLeft.length; ++i)
    {
        let links = [];
        for(let j = 0; j < portalsRight.length; ++j)
        {
            let link = CanConnect(portalsLeft[i], portalsRight[j], dim);
            links.push(link);
        }
        let validLinks = links.filter((l) => l.links);
        validLinks.sort((l,r) => l.dist - r.dist);
        if(validLinks.length > 0)
        {
            let chosenTarget = validLinks[0];
            portalsLeft[i].Link(chosenTarget.target);
        }
    }
}

function GetOtherDim(vec, currentDim)
{
    if (currentDim === 'Overworld')
    {
        let res = { 
            'x': Math.floor(vec.x/8), 
            'y': Math.floor(vec.y), 
            'z': Math.floor(vec.z/8) 
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


function CanConnect(l, r, dim)
{
    let res = { 'links': false, 'dist' : -1, 'target' : r };
    let otherVec = GetOtherDim(l, dim);
    let xdiff = Math.abs(otherVec.x - r.x);
    let ydiff = Math.abs(otherVec.y - r.y);
    let zdiff = Math.abs(otherVec.z - r.z);
    res.dist = Math.sqrt( xdiff*xdiff + ydiff*ydiff + zdiff*zdiff);
    if (xdiff > 128 || zdiff > 128)
    {
        return res;
    }
    
    //if the source dim is overworld, we can't connect past 127
    if(dim === "Overworld" && r.y > 127)
    {
        return res;
    }
    res.links = true;
    return res;
}
