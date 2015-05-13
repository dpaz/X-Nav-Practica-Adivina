

//Primera imagen que se muestra en el hueco del carousel
var imginicio = '<img id="car0" src="img/galaxia1.jpg" alt="La imagen no ha podido ser mostrada"  width="100%" height="300px">'


//Dificultad global del juego no se puede cambiar en mitad del juego por defecto en normal
var dificultad = 4000;

//Variable de puntuacion del juego
var puntuacion = 0;
var nslide = 1;

$(document).ready(function(){

    //Creo el mapa lo centro en el 0,0 y le doy una capa de teselas.
    map = L.map("map").setView([0,0], 2);
    L.tileLayer(' http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png').addTo(map);

    $("#containerCarrousel").append(imginicio)

    //Inicializo el marker que usare con opacidad 0
    var marker = L.marker([0,0],{opacity:0})
    marker.addTo(map);

    //Coordenadas del lugar donde se situan las fotos y distancia entre los dos lugares
    var coordsAcierto = L.latLng(0,0);
    var dist = 0;

    //Numero de lugar en el juego
    var index = 0;;

    //Juego actual
    var juego = {nombres : [], coord : []}

    //Inicializacion puntuacion
    var vpunt = $("#puntuacion");
    vpunt.html("La puntuacion es de: "+puntuacion)


    var carousel = $(".carousel");

    

   






    //actualiza el indice y pide la siguiente imagen de flikr para el carrousel
    function next(){
        if(index<juego.nombres.length){
        coordsAcierto = L.latLng(juego.coord[index][0],juego.coord[index][1]);
        fotosflikr(juego.nombres[index]);
        index++;
        }else{
            alert("Juego terminado")
        }
    }

    //Llama a el feed de flickr para una tag dada devolviendo un JSON
    function fotosflikr(tag){
        console.log(tag);
        crearcarrousel();
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

        calculapuntuacion();
        next();
    })

    //Aumenta nslide segun el numero de fotos que se hayan pasado
    $("#carousel").on("slid.bs.carousel",function(){
        nslide++;
        console.log(nslide);
    })

    //Puntuacion calculada con la distancia y el numero de diapositivas
    function calculapuntuacion(){
        puntuacion += Math.floor(10000/(dist*nslide));
        vpunt.html("La puntuacion es de: "+puntuacion)
    }


    //Crea un carrousel vacio de 5 elementos
    function crearcarrousel(){
        $("#containerCarrousel").empty();
        html= '<div id="carousel" class="carousel slide" data-ride="carousel" data-interval="4000">'
            html+='<div class="carousel-inner" role="listbox">'
                html+='<div class="item active">'
                    html+='<img id="car0" src="" alt="La imagen no ha podido ser mostrada"  width="100%" height="300px">'
                html+='</div>'
                html+='<div class="item">'
                    html+='<img id="car1" src="" alt="La imagen no ha podido ser mostrada"  width="100%" height="300px">'
                html+='</div>'
                html+='<div class="item">'
                    html+='<img id="car2" src="" alt="La imagen no ha podido ser mostrada"  width="100%" height="300px">'
                html+='</div>' 
                html+='<div class="item">'
                    html+='<img id="car3" src="" alt="La imagen no ha podido ser mostrada"  width="100%" height="300px">'
                html+='</div>'  
                html+='<div class="item">'
                    html+='<img id="car4" src="" alt="La imagen no ha podido ser mostrada"  width="100%" height="300px">'
                html+='</div>'
            html+='</div>'
        html+='</div>';

        $("#containerCarrousel").append(html);      
    }


    //Cambiar dificultad del juego
    $(".dific").click(function(){
       
        dif = $(this).html()
        switch(dif){
            case "Facil":
                dificultad = 6000;
                break;
            case "Normal":
                dificultad = 4000;
                break;
            case "Dificil":
                dificultad = 2000;
                break;
        }  
    })


    $("#comenzar").click(function(){
        index =0;
        coordsAcierto = L.latLng(juego.coord[index][0],juego.coord[index][1]);
        fotosflikr(juego.nombres[index]);
        index++;
        
    });


    //Seleccionar juego
    $(".game").click(function(){
       
        game = $(this).html();

        $.getJSON("json/"+game+".json",function(data){
            data.features.forEach(function(el,i){

                juego.nombres[i] = el.properties.Name;
                juego.coord[i] = el.geometry.coordinates;
            });
            
        })
        
        $("#juegoActual").html(game)

    })
    
    

});