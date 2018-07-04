var database = firebase.database();

var name;
var dest;
var freq;
var first;
var rowNum = 0;
var keys = [];
var upKey = 0;
var upRow;
var fa;

$("#upForm").hide();
$("#updateTitle").hide();

$("#submit").click(function(event) {
    event.preventDefault();
    
    name = $("#name").val().trim();
    dest = $("#dest").val().trim();
    freq = $("#freq").val().trim();
    first = $("#first").val().trim();

    database.ref().push({
        trainName: name,
        destination: dest,
        trainTime: first,
        frequency: freq
    });
    console.log(name + dest + freq + first);
});

var intervalId = setInterval(qwe, 1000);

function qwe(){
    $(".container").empty();
    $(".container").append("<h1 class=display-4 style=text-align:center>Anytime is Train Time</h1>");
    $(".container").append("<p class=lead style=text-align:center>Choo Choo. Chee Chee</p>");
    $(".container").append("<p class=lead style=text-align:center>" + moment().format('LT'));

    $("tbody").empty()
    database.ref().on("child_added", function(snap) {

        rowCreating(snap.val().trainName, snap.val().destination, snap.val().trainTime, snap.val().frequency);
      
        rowNum++;
        keys.push(snap.key);
    });
}

$(document).on("click","button.delete",function(){
    var row = $(this).attr("data-row");
    $("#" + row).text("");
    database.ref(keys[row]).remove();
});

$(document).on("click","button.update",function(){
    $("#upForm").show();
    var row = $(this).attr("data-row");
    upKey = keys[row];
    upRow = $(this).attr("data-row");
});

$("#upSubmit").click(function(event){
    event.preventDefault();

    var upName = $("#upName").val().trim();
    var upDest = $("#upDest").val().trim();
    var upFreq = $("#upFreq").val().trim();
    var upFirst = $("#upFirst").val().trim();

    database.ref(upKey).update({
        trainName: upName,
        destination: upDest,
        trainTime: upFirst,
        frequency: upFreq
    });

    $("#" + upRow).text("");

    rowCreating(upName, upDest, upFirst, upFreq);

    $("#upForm").hide();
});

function rowCreating(name, place, tim, inter){

    var row = $("<tr>");
    var con = $("<div>");
    var delBtn = $("<button>");
    var upBtn = $("<button>");

    delBtn.addClass("btn btn-secondary delete");
    delBtn.text("DELETE");
    delBtn.attr("type", "button");
    delBtn.attr("data-row", rowNum);
    con.append(delBtn);

    upBtn.addClass("btn btn-dark update");
    upBtn.text("UPDATE");
    upBtn.attr("type", "button");
    upBtn.attr("data-row", rowNum);
    con.append(upBtn);

    row.attr("id", rowNum);   
    row.append("<td>" + name);
    row.append("<td>" + place);
    row.append("<td>" + inter);

    var timeLeft = Math.ceil(left(tim, inter));
    row.append("<td>" + arrival(tim, inter)); 
    row.append("<td>" + timeLeft); 
    row.append(con);

    $("tbody").append(row);    
}

function arrival(d, e){
    var l = left(d, e);
    var c = moment().add(l, "m").format("LT");
    return c;
}

function left(a, b){
    var inter = parseInt(b) * 60;

    var d =  parseInt(a.substr(0, 2)) * 3600;
    var e =  parseInt(a.substr(3, 2)) * 60;

    var start = d + e;
    var end = moment().unix();
    var min = (inter - ( end - start ) % inter) / 60;

    return min;
}