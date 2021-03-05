require('dotenv').config();

const { 
    leerInput,
    inquiererMenu,
    pausa,
    listarLugares
} = require('./helpers/inquirer');

const Busquedas = require('./models/busquedas');



// variables de entorno
// Descripcion: son variables de entorno globales a lo largo de mi aplicacion 
// console.log(process.argv);
// AHORA SI QUIERO ACCEDER A MI MAPBOX_KEY
// console.log(process.env.MAPBOX_KEY);



const main = async() => {

    // variable para poder evaluar
    let opt;

    // hago la instancia de mi clase
    const busquedas = new Busquedas();

    // hago un do while porque se ejecuta 
    // 1 vez y evalua su condicion 
    // mientras opt sea diferente de 0 ejecute el menu
    do {
        
        // muestro mi menu y uso await porque es una promesa
        opt = await inquiererMenu();
        
        switch (opt) {
            
            case 1:
                // Mostrar Mensaje
                const termino = await leerInput('Ciudad: ');

                // Buscar los lugares
                // como trabajo con una promesa utilizo await
                const lugares = await busquedas.ciudad(termino);
                
                // Seleccionar el lugar
                const id = await listarLugares(lugares);
                // si digita 0 es cancelar
                if( id === '0' ) continue;
                
                
                const lugarSel = lugares.find( l => l.id === id );
                
                // guardo en db
                busquedas.agregarHistorial( lugarSel.nombre );

                // Clima
                const clima = await busquedas.climaLugar( lugarSel.lat, lugarSel.lng );
                // console.log(clima);

                // Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green );
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Cómo está el clima:', clima.desc.green);
                
            break;
            
            case 2:
                // Historial
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log( `${ idx } ${ lugar }` );
                })

            break;
            
        }
        
        // para que me arroje el mensaje de presione enter para continuar
       if( opt !== 0 ) await pausa();

    }while( opt !== 0)
}


main();