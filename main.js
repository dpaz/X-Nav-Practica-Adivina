$(document).ready(function(){

    map = L.map("map").setView([0,0], 2);
    L.tileLayer(' http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png').addTo(map);
    console.log("acabo");
    console.log(map);
});