var imgNumber = 0;
var layoutNumber;
var imagesArray = new Array("beehive.png",
"PinC1.png",
    "PinCU.png",
    "PinO1.png",
    "FlagOS.png",
    "FlagOB.png",
    "capC.png",
    "capCW.png",
    "capO.png",
    "capOW.png",
    "sweater.png",
    "sweaterY.png",
    "sweaterG.png",
    "sweaterP.png",
    "trash.jpg");
var imagesArrayToolTip = new Array(	"Beehive",
	"Pin",
    "Pin",
    "Pin",
    "Flag",
    "Flag",
    "Cap",
    "Cap",
    "Cap",
    "Cap",
    "Sweater",
    "Sweater",
    "Sweater",
    "Sweater",
    "Refuse"
)

var navigationTabs = new Array(4);
navigationTabs[0] = "Prior to Election Day";
navigationTabs[1] = "Opening the Polls";
navigationTabs[2] = "During the Day";
navigationTabs[3] = "Closing the Polls";

var navigationTabsContent = new Array(4);
navigationTabsContent[0] = new Array("Check the supplies in your kit against your supply list",
    "Arrange to Visit Polling Place on Monday (or earlier.)",
    "Ask the Assistant Chief to visit/check the polling location with you",
    "Election Officers need all-day access to telephone, restrooms, etc.",
    "Obtain the Name and Phone Number for a 5:00 a.m. Emergency Contact",
    "Note emergency evacuation route(s) -  a floor plan should be posted in each building",
    "Locate reserved voter parking spaces (see Notice 8422 for schools.)",
    "Is the lightning enough?",
    "Do you have enough tables and chairs?",
    "Is a flag available?",
    "Locate telephone and restrooms; make sure they won't be locked between 5:00 a.m. and 10 p.m.",
    "Check reserved accessible parking spaces. Are additional spaces needed?",
    "If the main entrance has steps, identify the alternate entrance. Will it be unlocked by 6 a.m.?",
    "Check entrances, ramps and pathways for barriers. Can obstacles be removed or marked?",
    "Is additional signage needed to reserve parking or direct voters to alternate entrance(s)?",
    "Locate Cart with Voting Machines",
    "Plug in the cart to charge the machine batteries.",
    "Mark Absentees in Paper Precinct Pollbooks with Blue Ink.");
navigationTabsContent[1] = new Array("Promptly at 5:00 a.m., swear in Election Officers; assign numbers",
    "Welcome authorized representatives (Poll Watchers)",
    "Open voting machine cart",
    "Prepare the Paper Ballots",
    "Check machine ballot against precinct sample ballot",
    "Post VOTE HERE sign(s) at most visible site from road/parking lot",
    "Post additional POLLING PLACE signs on street corners or parking lot entrances as needed, especially if your polling place is difficult for new voters to locate",
    "Post other signs, such as arrows, as needed to direct voters to voting entrance. This is especially important if you are not in your normal room",
    "Required: post PROHIBITED AREA notices at main entrance to building",
    "Required: post CURBSIDE VOTING signs at main entrance to building and at the designated, handicapped parking spaces. Post the 'call for assistance' sign with an appropriate phone number for your location",
    "As needed: post HANDICAPPED PARKING / ALTERNATE ENTRANCE signs",
    "As needed: establish additional HANDICAPPED PARKING spaces close to your entrance",
    "Required: Post IDENTIFICATION / GIVE FULL LEGAL NAME signs on check-in tables",
    "For Paper Pollbooks - use ALPHABETICAL DIVISION signs on tables and in room to direct voters as quickly as possible into their correct line",
    "Required: Voting Instruction Posters",
    "Required: Post SAMPLE BALLOTS, minimum of 2 sets",
    "Required: Post VOTER RIGHTS AND RESPONSIBILITIES [HAVA] POSTER",
    "Required: When Ballot Box is set up, attach the BALLOT BOX sign to the door of the Auxiliary Ballot bin on the left side of the Ballot Box",
    "Post additional signs as needed: Use ARROWS, ENTRANCE and EXIT to direct voters.");
navigationTabsContent[2] = new Array(
    "Keep the lines at the Check-in Tables, not in the voting area. Ask the Greeter to slow  down the pace at check-in if needed.",
    "NO VOTER MAY LEAVE THE VOTING LOCATION WITH A PAPER BALLOT IN HAND!!",
    "Ask the person if he/she would like assistance. Don't assume or insist",
    "At your discretion, you may move very frail or disabled voters to the front of the line - most 'able-bodied' voters won't object",
    "Provide chairs for these voters if there are long waits in the lines",
    "Keep the magnifying glass out on the Check-In table, so voters know that it is available",
    "Post a curbside sign with an office or cell phone number to call for assistance",
    "For blind or severely visually-impaired voters notify the voter that an audio ballot is available",
    "For language-minority or illiterate voters any voter may bring an assistant to translate or read the ballot for them"
    );
navigationTabsContent[3] =new Array( "At 6:45 p.m. - Announce outside 'The polls will close in 15 minutes'",
    "Check official TIME at U.S. Naval Observatory: 202-762-1401 or 202-762-1069",
    "At 7:00 p.m. - Announce outside 'The polls are officially closed'",
    "After the last voter has voted and departed the polling place welcome authorized Representatives (Poll Watchers)",
    "Get organized: assign tasks for Election Officer teams",
    "Team 1 to certify the Pollbook(s) and unused paper ballots",
    "Team 2 to close touch screen machines",
    "Team 3 to close the optical scan machine and certify voted paper ballots",
    "Clean up the area",
    "Place privacy booths, cardboards, machines and cords into the cart",
    "Check and lock the Cart",
    "Seal and Sign Envelope #7A",
    "Do NOT return ballots in the cart!",
    "Do NOT put the Blue Bag back into the cart",
    "The Blue Bag and Ballots must be returned to the Government Center!");
function createEditableLayout(index) {
    var loc = qualifyURL("./images/Rec" + index + ".jpg");
    document.getElementById('diagram').style.backgroundImage="url(" + loc + ")";
    //document.getElementById('diagram').style.-webkit-background-size: content;
    //document.getElementById('diagram').style.-moz-background-size: content;
    //document.getElementById('diagram').style.-o-background-size: content;
    document.getElementById('diagram').style.backgroundSize="cover";
   /* var content = document.getElementById('document').innerHTML;
    content +=
    '<div class="toolboxImage ui-draggable ui-draggable-dragging drop" style="left: 473.24px; top: 209.11px; position: absolute;">
    <img title="Registration Station" class="itemImage" id="img_3" src="./images/toolbox/registrationH.png">
    <div class="ui-rotatable-handle ui-draggable"></div>
    <div class="delete"></div>
    <div class="clone"></div>
    </div>';
    document.getElementById('document').innerHTML = content;  */
}


function createToolbox(location) {
    var imgNum = 0;
    var num_rows = 4;
    var num_cols = 3;
    var imgBase = qualifyURL(location);
    var title = "<h3>Toolbox</h3>"
    var selfie_instr = "<h4> Drag yourself into the selfie@</h4>";
    var selfie = '<div class="toolboxImage"><img class="itemImage" title="You!" style="width: 150px" src="' + imgBase + '1_sticker.png" id="img_' + (imgNum) + '"/></div>';
    // var selfie = '<img title="Selfie" id="selfie" src="' + imgBase + 'selfie.png">';
    var instructions = "<h4>Drag any of these stickers into your selfie@</h4> <div class='toolboxTable'>";
    var tbody = '';
    var theader = '<table border="0">\n';
    for (var i = 0; i < num_rows; i++) {
        tbody += '<tr>';
        for (var j = 0; j < num_cols; j++) {
            tbody += '<td class="toolboxCell">';
            tbody += '<div class="toolboxImage"><img class="itemImage" style="width: 80px" title="'+imagesArrayToolTip[imgNum]+'" src="images/toolbox/' + imagesArray[imgNum] + '" id="img_' + (imgNum) +
            '"/></div>';
            tbody += '</td>'
            imgNum++;
        }
        tbody += '</tr>\n';
    }
    var tfooter = '</table></div></div>';
    document.getElementById('toolbox').innerHTML = title + selfie_instr + selfie + instructions + theader + tbody + tfooter;
}
function createToDoDivs(imgId) {
    var allToDos = document.getElementById("allToDos");
    var match = imgId.match(/\d+/);
    var index = parseInt(match[0]);
    var checkboxList = "<h3>Checklist:</h3>";
    var clonedDiv = document.getElementById('checkboxToDoList').cloneNode(true);
    var list = checklist[index];
    for (var j = 0; j < list.length; j++) {
        checkboxList += '<input type="checkbox">' + list[j] + '</input><br/><br/>';
    }
    clonedDiv.id = "clon_div_" + imgId;
    clonedDiv.innerHTML = checkboxList;
    clonedDiv.style.display = "none";
    allToDos.appendChild(clonedDiv);

}


function createTabContent() {
    var tabs = "";
    tabs += '<ul>';
    for (var i = 0; i < navigationTabs.length; i++) {
        tabs += '<li><a href="#tabs-'+i+'">' + navigationTabs[i] + '</a></li>';
    }
    tabs += '</ul>';
    var topNav = document.getElementById("tabNav");

    for (var i = 0; i < navigationTabsContent.length; i++) {
        tabs += "<div id='tabs-"+i+"'>";
        var checklist = navigationTabsContent[i];
        for (j = 0; j < checklist.length; j++) {
            tabs += '<input type="checkbox">' + checklist[j] + '</input><br/>';
        }
        tabs += "</div>";


    }
    topNav.innerHTML = tabs;


}

function showTabContent(index) {
    //get all other divs
    var tabContentDiv = document.getElementById("tabContent");
    var children = tabContentDiv.childNodes;
    for (var i = 0; i < children.length; i++) {
        var child = children [i];
        if (child.tagName == "DIV" && child.id.indexOf("clon_todo_div_") != -1) {
            child.className = "hidden";
        }
    }
    var allToDoTab = document.getElementById("clon_todo_div_" + index);
    allToDoTab.className = "shown";

   //to toggle style between active and inactive tabs
   for(var j=0; j < navigationTabs.length; j++){
      var tabLink = document.getElementById("tab_" + j);
      if(j==index){
         tabLink.style.color="#FFFFFF";
         tabLink.style.backgroundColor="#96897A";
     }else{
         tabLink.style.removeProperty('color');
         tabLink.style.removeProperty('background-color');
     }
 }
}

function showChecklist(ev) {
    console.log($("#clon_div_"+ev.target.id).length);
    if($("#clon_div_"+ev.target.id).length == 0){
        createToDoDivs(ev.target.id);
    }

}

function reset() {
    $('#edit .drop').remove();
    createEditableLayout(layoutNumber);
	window.location = "/"
}



function escapeHTML(s) {
    return s.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
}

function qualifyURL(url) {
    var el = document.createElement('div');
    el.innerHTML = '<a href="' + escapeHTML(url) + '">x</a>';
    return el.firstChild.href;
}

function saveCopy() {
    var styleSheetLink = qualifyURL("./styles/diagram_layout.css");
    var savedPage = "<html><head>";
    savedPage += '<title>Layout</title>';
    savedPage += '<link rel="stylesheet" href="' + styleSheetLink + '"  type="text/css">';
    savedPage += '</head><body>';
    var diagramName='edit';
    savedPage += document.getElementById(diagramName).outerHTML;
    savedPage += '</body></html>';

    var blob = new Blob([savedPage], {type: "text/html"});
    saveAs(blob, 'diagram.html');
}

function doneDeal() {
    // document.getElementById("homepage").style.display = "none";
    // document.getElementById("topbar").style.display = "none";
    document.getElementById("layout_edit").style.display = "none";
    document.getElementById("done_email").style.display = "block";
    // createEditableLayout(layout_number);
    // createToolbox("./images/toolbox/");
    document.getElementById("selfie@").innerHTML = document.getElementById('edit').outerHTML;
    a = document.getElementById("selfie@").innerHTML;
    // addSelfie();

    /* all these divs need to be changed to canvases
    var canvas = document.getElementById("selfie@");
    var ctx = canvas.getContext('2d');
    ctx.drawImage(document.getElementById('edit').outerHTML);
    var formData = new FormData();
    formData.append("data", a);
    var xhr2 = new XMLHttpRequest();
    xhr2.open('POST','/email');
    xhr2.send(formData);*/
}

function addSelfie(){
    /* var text = '
    <div class="toolboxImage ui-draggable ui-draggable-dragging drop" style="left: 200px; top: 209.11px; position: absolute;">
              <div class="selfie"><img title="Selfie" id="selfie" src="./images/toolbox/selfie.png"></div>
            <div class="ui-rotatable-handle ui-draggable"></div>'; */

    // document.getElementById('edit').innerHTML = '<div class="toolboxImage ui-draggable ui-draggable-dragging drop" style="left: 200px; top: 209.11px; position: absolute;"><div class="selfie"><img title="Selfie" id="selfie" src="./images/toolbox/selfie.png"></div><div class="ui-rotatable-handle ui-draggable"></div>';
    /* <div class="toolboxImage"><img class="itemImage" title="'+imagesArrayToolTip[imgNum]+'" src="' + imgBase + imagesArray[imgNum] + '" id="img_' + (imgNum) +
            '"/></div> */
    $('<div class="toolboxImage" style="left: 200px; top: 0px; position: relative;"><img class="itemImage" title="Selfie" id="selfie" src="./images/toolbox/selfie.png">').appendTo($('#edit'));
}


function makeLayoutPage(layout_number){
    layoutNumber = layout_number;
    document.getElementById("homepage").style.display = "none";
    document.getElementById("topbar").style.display = "none";
    document.getElementById("layout_edit").style.display = "block";
    createEditableLayout(layout_number);
    var useruid = getCookie('pyuserid');
    console.log("useruid", useruid);
    createToolbox("/users/"+useruid+"/");
    // addSelfie();
    //createTabNav();
    createTabContent();
    $( init );
    $( "#tabNav" ).tabs();

}

//New code - jquery and JS to implement the new functionality
// TO-DO: Refactor
var ele;

function init() {
    var visible = true;
  ele = $('.toolboxImage');
  $('.toolboxImage').draggable({
    helper: "clone"
  });


  $('#selfie').droppable({
    drop: function (event, ui) {
      if ($(ui.helper).hasClass('drop')){
        clickDroppedItem();
        return true;
      }
      $(this).after($(ui.helper).clone().draggable({containment: 'parent', drag: removeStyle, stop: addStyle}).rotatable().addClass('drop'));
      $(this).after($(ui.helper).clone().draggable({containment: 'parent', drag: removeStyle, stop: addStyle}).resizeable().addClass('drop'));
      clickDroppedItem();
      // Create handle dynamically
      $('<div class="delete"></div>').appendTo($('.drop'));
      $('<div class="clone"></div>').appendTo($('.drop'));
      clickDelete();
      clickClone();


    }
  });

  $('#diagram').droppable({
    drop: function (event, ui) {
      if ($(ui.helper).hasClass('drop')){
        clickDroppedItem();
        return true;
      }
      $(this).after($(ui.helper).clone().draggable({containment: 'parent', drag: removeStyle, stop: addStyle}).rotatable().resizeable().addClass('drop'));
      clickDroppedItem();
      // Create handle dynamically
      $('<div class="delete"></div>').appendTo($('.drop'));
      $('<div class="clone"></div>').appendTo($('.drop'));
      clickDelete();
      clickClone();


    }
  });

  ele.css('position', 'relative');
//checklists
/*
  $('#checklistMenu').click(function(event){

    $('#checklistMenu').hide();
    $('#workspaceMenu').show();
    if ( visible ) {
        $('#edit_body').slideUp('fast',function(){
            $('#edit_body').addClass('hide')
            .slideDown(0);
        });
        $('#checklist_view').slideUp(0,function(){
            $('#checklist_view').removeClass('hide')
            .slideDown('fast');
        });
    } else {
        $('#edit_body').slideUp(0,function(){
            $('#edit_body').removeClass('hide')
            .slideDown('fast');
        });
        $('#checklist_view').slideUp('fast',function(){
            $('#checklist_view').addClass('hide')
            .slideDown(0);
        });
    }
    visible = ! visible;
  });

  $('#workspaceMenu').click(function(event){

    $('#workspaceMenu').hide();
    $('#checklistMenu').show();

    if ( visible ) {
        $('#edit_body').slideUp('fast',function(){
            $('#edit_body').addClass('hide')
            .slideDown(0);
        });
        $('#checklist_view').slideUp(0,function(){
            $('#checklist_view').removeClass('hide')
            .slideDown('fast');
        });
    } else {
        $('#edit_body').slideUp(0,function(){
            $('#edit_body').removeClass('hide')
            .slideDown('fast');
        });
        $('#checklist_view').slideUp('fast',function(){
            $('#checklist_view').addClass('hide')
            .slideDown(0);
        });
    }
    visible = ! visible;
  });

  */

}

function clickClone(){
  $('.clone').click(function(event){
    console.log(event.target.className);
    if (event.target.className == "clone"){
      var clonedElement = $(event.target).parent().clone().draggable({containment: 'parent', drag: removeStyle, stop: addStyle});
      clonedElement.children('.ui-rotatable-handle').remove();
      clonedElement.children('.custom-resizeable-handle').remove();
      clonedElement.rotatable();
      clonedElement.resizeable();
      console.log(event.clientX);
      clonedElement.css({
        'left': event.clientX + 30,
        'top': event.clientY
      });

      clonedElement.appendTo($('#edit'));
      clickDroppedItem();
      clickDelete();
      clickClone();
    }

  });
}
function clickDelete(){
  $('.delete').click(function(event){
    console.log(event.target.className);
    if (event.target.className == "delete")
      $(event.target).parent().remove();
  });
}
function clickDroppedItem (){
  $('.drop').click(function(event){
    // console.log(event.target);
    if (event.target.className != "delete" && event.target.className != "clone"){
      // showChecklist(event);
      event.preventDefault();
    // $("#clon_div_"+event.target.id).modal();
  }
  });

}

function removeStyle(event, ui){
  $(event.target).removeClass("toolboxImage");
}

function addStyle(event, ui){
  $(event.target).addClass("toolboxImage");
}

function applyRotation() {
  $('.handler').draggable({
    opacity: 0.01,
    helper: 'clone',
    drag: function (event, ui) {
      var rotateCSS = 'rotate(' + ui.position.left + 'deg)';
      $(this).parent().css({
        '-moz-transform': rotateCSS,
        '-webkit-transform': rotateCSS
      });
    }
  });
}


$(window).on('beforeunload', function(){

  var leftArr = []; //don't forget to clear array so that things aren't added more than once when beforeunload is called multiple times
  var topArr = [];
  var srcArr = [];
  var rotArr = [];

  $.each($('#edit .toolboxImage'), function(index, value){
    leftArr.push($(value).css('left'));
  })

  $.each($('#edit .toolboxImage'), function(index, value){
    topArr.push($(value).css('top'));
  })

  $.each($('#edit .toolboxImage'), function(index, value){
    rotArr.push($(value).css('-webkit-transform'));
  })

  $.each($('#edit .toolboxImage .itemImage'), function(index, value){
    srcArr.push($(value).attr('src'));
  })

  //eventually background will be refactored to simply be included with the rest of the images
  var background = $('#edit #diagram').css('background-image')

  var formData = new FormData();
  //var filename = $scope.pyuserid;
  //formData.append("name", name);

  formData.append("leftArr", leftArr);
  formData.append("topArr", topArr);
  formData.append("srcArr", srcArr);
  formData.append("rotArr", rotArr);
  formData.append("background", background);

  var xhr2 = new XMLHttpRequest();
  xhr2.open('POST', '/session');
  xhr2.send(formData);
});

