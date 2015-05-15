




//Dificultad global del juego no se puede cambiar en mitad del juego por defecto en normal
var dificultad = 4000;

//Variable de puntuacion del juego
var puntuacion = 0;
var nslide = 1;

$(document).ready(function(){

    //Creo el mapa lo centro en el 0,0 y le doy una capa de teselas.
    map = L.map("map").setView([0,0], 2);
    L.tileLayer(' http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png').addTo(map);

    

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
    var lastgame;
    var game ="";

    //Inicializacion puntuacion
    var vpunt = $("#puntuacion");
    vpunt.html("La puntuacion es de: "+puntuacion)


    var carousel = $(".carousel");

    var nestados = 0;
    

/*

    juegos();
    function juegos(){

         <li><a class="game" href="#">Capitales</a></li>
                      <li class="divider"></li>
                      <li><a class="game" href="#">Monumentos</a></li>
                      <li class="divider"></li>
                      <li><a class="game" href="#">Ciudades</a></li>

        
        $("dropdownJuegos").append(html);
    }

*/


    //actualiza el indice y pide la siguiente imagen de flikr para el carrousel
    function next(){
        if(index<juego.nombres.length){
            coordsAcierto = L.latLng(juego.coord[index][0],juego.coord[index][1]);
            fotosflikr(juego.nombres[index]);
            index++;
            nslide=1;
        }else{
            alert("Juego terminado");
            $(".carousel-inner").empty();
            html='<div class="item active">'
                html+='<img id="car0" src="img/galaxia1.jpg" alt="La imagen no ha podido ser mostrada"  width="100%" height="300px">'
            html+='</div>'
            $(".carousel-inner").append(html);
            
            addhistoria();
            
        }
    }

    //Añade al historial la partida y guarda un estado
    function addhistoria(){

        

        data={fecha: new Date(),
              nombre: lastgame,
              punt:puntuacion,
              juego: juego,
              index: index,
              coordsAcierto: coordsAcierto
        }

        history.replaceState(data,null,location.href+lastgame)
        history.pushState(null,null,location.href+game);
        html= '<a id=his'+nestados+' href="#" class="list-group-item his">'+data.nombre+' '+data.punt+' '+data.fecha+'</a>'
        $("#historial").append(html);
        nestados++;
    }


    //Llama a el feed de flickr para una tag dada devolviendo un JSON
    function fotosflikr(tag){
        console.log(tag);



        $.getJSON("https://api.flickr.com/services/feeds/photos_public.gne?&tags="+tag+"&tagmode=any&format=json&jsoncallback=?",
            function(data){
                data = data.items.splice(0,5);
                $(".carousel-inner").empty();

                for(i=0; i<5 ; i++){
                    var html="";
                    if(i==0){
                        html='<div class="item active">'
                            html+='<img id="car0" src="'+data[i].media.m+'" alt="La imagen no ha podido ser mostrada"  width="100%" height="300px">'
                        html+='</div>'
                    }else{
                        html='<div class="item">'
                            html+='<img id="car'+i+'" src="'+data[i].media.m+'" alt="La imagen no ha podido ser mostrada"  width="100%" height="300px">'
                        html+='</div>'
                    }
                    $(".carousel-inner").append(html);

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

    //Aumenta nslide segun el numero de fotos que se hayan pasado y actualiza la dificultad
    //La dificultad no se actualiza al momento pasan varias diapositivas hasta que el cambio se aplica
    $("#carousel").on("slid.bs.carousel",function(){
        nslide++;
        
        $("#carousel").data("bs.carousel").options.interval = dificultad;

    })

    //Puntuacion calculada con la distancia y el numero de diapositivas
    function calculapuntuacion(){

        puntuacion += Math.floor(10000/(dist*nslide));
        vpunt.html("La puntuacion es de: "+puntuacion)
    }


    
    


    //Cambiar dificultad del juego
    

    //Comienza el juego seleccionado
    $("#comenzar").click(function(){
        if(nestados==0){
            history.pushState(null,null,location.href+game);
            nestados++;
        }else{
           addhistoria()
        }
        index =0;
        coordsAcierto = L.latLng(juego.coord[index][0],juego.coord[index][1]);
        fotosflikr(juego.nombres[index]);
        index++;
        puntuacion = 0;
    });


    //Seleccionar juego
    $(".game").click(function(){
        lastgame = game
        game = $(this).html();
        juego.nombres = [];
        juego.coord = [];

        $.getJSON("json/"+game+".json",function(data){
            data.features.forEach(function(el,i){

                juego.nombres[i] = el.properties.Name;
                juego.coord[i] = el.geometry.coordinates;
            });
            
        })
        
        $("#juegoActual").html(game)
       
    })
    


    //sale del juego actual y vuelve a la pantalla incial
    $("#salir").click(function(){
        
        history.go(-1);
        index = 0;
        coordsAcierto = L.latLng(0,0);
        puntuacion = 0;
        $(".carousel-inner").empty();
        html='<div class="item active">'
            html+='<img id="car0" src="img/galaxia1.jpg" alt="La imagen no ha podido ser mostrada"  width="100%" height="300px">'
        html+='</div>'
        $(".carousel-inner").append(html);
    })
    

    window.addEventListener('popstate', function(event) {
        //replaceHistorial()
        console.log(event.state);
    });

});