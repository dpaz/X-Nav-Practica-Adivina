$(document).ready(function(){

    //Creo el mapa lo centro en el 0,0 y le doy una capa de teselas.
    map = L.map("map").setView([0,0], 2);
    L.tileLayer(' http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png').addTo(map);
    

    fotosflikr("madrid")

    function fotosflikr(tag){
       
        $.getJSON("https://api.flickr.com/services/feeds/photos_public.gne?&tags="+tag+"&tagmode=any&format=json&jsoncallback=?",
            function(data){
                data = data.items.splice(0,5)
                console.log(data);
                for(i=0; i<5 ; i++){
                    $("#car"+i).attr("src",data[i].media.m)
                }
                    
               
        });
    }


});