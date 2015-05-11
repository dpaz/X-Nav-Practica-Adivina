$(document).ready(function(){

    //Creo el mapa lo centro en el 0,0 y le doy una capa de teselas.
    map = L.map("map").setView([0,0], 2);
    L.tileLayer(' http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png').addTo(map);

    //Inicializo el marker que usare con opacidad 0
    var marker = L.marker([0,0],{opacity:0})
    marker.addTo(map);

    //Coordenadas del lugar donde se situan las fotos y distancia entre los dos lugares
    var coordsAcierto = L.latLng(40.418889,-3.691944);
    var dist = 0;

    //Numero de lugar en el juego
    var index;

    //Variable de puntuacion del juego
    var puntuacion = 0;
    var vpunt = $("#puntuacion");
    vpunt.html("La puntuacion es de: "+puntuacion)


    fotosflikr("madrid");







    //actualiza el indice y pide la siguiente imagen de flikr para el carrousel
    function next(){
        fotosflikr("");
    }

    //Llama a el feed de flickr para una tag dada devolviendo un JSON
    function fotosflikr(tag){
       
        $.getJSON("https://api.flickr.com/services/feeds/photos_public.gne?&tags="+tag+"&tagmode=any&format=json&jsoncallback=?",
            function(data){
                data = data.items.splice(0,5)
               
                for(i=0; i<5 ; i++){
                    $("#car"+i).attr("src",data[i].media.m)
                }
                    
               
        });
    }

    //Coloca un marker en la posicion donde pulsemos
    map.on('click', function(pos) {
        marker.setLatLng(pos.latlng); 
        marker.setOpacity(1);
    });

    //Calcula la distancia en km desde el marker a la poicion correcta
    $("#aceptar").click(function(){
        dist = coordsAcierto.distanceTo(marker.getLatLng())/1000
        console.log(dist);

        calculapuntuacion()
    })

    function calculapuntuacion(){
        puntuacion += Math.floor(10000/dist);
        vpunt.html("La puntuacion es de: "+puntuacion)
    }
});