var database = firebase.database();

var name;
var dest;
var freq;
var first;

$("#submit").click(function(event) {
    event.preventDefault();
    
    name = $("#name").val();
    dest = $("#dest").val();
    freq = $("#freq").val();
    first = $("#first").val();

    console.log(name + dest + freq + first);

    
});