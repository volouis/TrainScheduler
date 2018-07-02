var database = firebase.database();

var name;
var dest;
var freq;
var first;
var rowNum = 0;
var keys = [];

$(".container").append("<p class=lead style=text-align:center>" + moment().format('LT'));

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

database.ref().on("child_added", function(snap) {
    var row = $("<tr>");
    var delBtn = $("<button>");

    delBtn.addClass("btn btn-primary delete");
    delBtn.text("DELETE");
    delBtn.attr("type", "button");
    delBtn.attr("data-row", rowNum);

    row.attr("id", rowNum);   
    row.append("<td>" + snap.val().trainName);
    row.append("<td>" + snap.val().destination);
    row.append("<td>" + snap.val().frequency);
    row.append("<td>" + arrival(snap.val().trainTime, snap.val().frequency)); 
    row.append("<td>" + left(snap.val().trainTime, snap.val().frequency)); 
    row.append(delBtn);

    $("tbody").append(row);  
    rowNum++;
    keys.push(snap.key);
});

$(document).on("click","button.delete",function(){
    var row = $(this).attr("data-row");
    $("#" + row).text("");
    database.ref(keys[row]).remove();
});

function arrival(d, e){
    var l = left(d, e);
    var c = moment().add(l, "m").format("LT");
    return c;
}

function left(a, b){
    var c = moment().format('LT');
    var inter = parseInt(b) * 60;

    var d =  parseInt(a.substr(0, 2)) * 3600;
    var e =  parseInt(a.substr(3, 2)) * 60;

    var start = d + e;
    var end = moment().unix();;

    return Math.ceil((inter - ( end - start ) % inter) / 60);
}