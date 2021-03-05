// requerimos filesystem
const fs = require('fs');

// requerimos axios
const axios = require('axios')

class Busquedas {

    // creo mi arreglo para almacenar mi historial
    historial = [];
    // me creo el path de donde quiero mi base de datos
    dbPath = './db/database.json';



    constructor() {
        //TODO: leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado() {

        // voy a hacer las primeras letras de mi JSON a mayuscula
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ');
        });
    }

    get paramsMapbox() {

        return {
                'access_token': process.env.MAPBOX_KEY,
                'limit': 5,
                'language': 'es'
        }
    }

    get paramsWeather() {

        return  {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudad( lugar = '' ) {

        // peticion http

        try {
            // Peticion HTTP
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            // hacemos la peticion 
            const resp = await instance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));


        } catch (error) {
            
            return []; // retornar los lugares que coincidan
        }
    }


    async climaLugar( lat, lon ) {

        // peticion http

        try {
            // Peticion HTTP
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                // ... es llamado para la desestructuracion
                params: { ...this.paramsWeather, lat, lon }
            });

            // hacemos la peticion 
            const resp = await instance.get();
            // console.log(resp);
            // aqui hago la desestructuracion para 
            // poder tomar de la peticion dos objetos, 
            // y que objetos son los que me gustaria extraer
            const { weather, main } =  resp.data;
            // console.log(weather);//para saber que viene en weather

            return {
                // como el weather es un arreglo tengo que usar la posicion que quiero obtener
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            console.log(error);
        }

    }


    agregarHistorial( lugar = '' ){
        
        // validamos si existen el arreglo el lugar que queremos 
        if ( this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return; // no haga nada
        }

        // pero si existe voy a guardar ese lugar, recorto para tener de posicion 0 a la 5 en mi archivo JSON 
        this.historial = this.historial.slice(0,5);

        // TODO: prevenir duplicados
        this.historial.unshift( lugar.toLocaleLowerCase() );

        // grabar en DB
        this.guardarDB();
    }

    guardarDB(){
        
        // creo esto por si hay muchas propiedades
        const payload = {
            // uso mi arreglo
            historial: this.historial
        };

        // escribo en mi archivo, uso el path y la lista payload
        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );

    }
    
    leerDB(){

        // verifico si el archivo existe
        if( !fs.existsSync(this.dbPath) ) return;
        

        const info = fs.readFileSync( this.dbPath, { encoding: 'utf8' } );
        
        // parseo la data, que es un objeto de tipo string, a parsearlo a JSON
        const data = JSON.parse( info );
        // console.log(data);

        // tengo un arreglo de tareas para retornar
        this.historial = data.historial;

    }
    





}





module.exports = Busquedas;