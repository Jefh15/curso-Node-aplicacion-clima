const inquirer = require("inquirer");
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que desea hacer?',
        choices: [ 
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }  
        ]
    }
];


const inquiererMenu = async() => {
    console.clear();

    // mis mensajes
    console.log('=============================='.green);
    console.log('   Seleccione una opción   '.white);
    console.log('==============================\n'.green);

    // hago una desestructuracion, para mostrar mi menu
    const { opcion } = await inquirer.prompt(preguntas);

    return opcion;

}


// Hago la pausa de mi aplicacion
const pausa = async() => {
    
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${ 'enter'.green } para continuar...`,
        }
    ];

    console.log('\n');
    await inquirer.prompt(question);
}


const leerInput = async( message ) => {

    // me creo una pregunta
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            // valida el value que se acaba de escribir
            validate( value ){
                if( value.length === 0 ){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    // hago la desestructuracion de mid desc
    const { desc } =  await inquirer.prompt(question);

    // retorno mi desc
    return desc;
    }


    const listarLugares = async( lugares = [] ) => {

        // el map me transforma mi arreglo a algo que quiero mostrar a mi manera
        const choices = lugares.map( (lugar, i) => {

            const idx = `${i + 1}.`.green;

            return {
                value : lugar.id,
                name: `${ idx } ${ lugar.nombre }`
            }

        });

        // añado al inicio del arreglo
        choices.unshift({
            value: '0',
            name: '0. '.green + 'Cancelar'
        });

        const preguntas = [
            {
                type: 'list',
                name: 'id',
                message: 'Seleccione lugar:',
                choices
            }
        ]
        
        // hago una desestructuracion, para mostrar mi menu
        const { id } = await inquirer.prompt(preguntas);
        
        return id;
    }


    const confirmar = async( message ) => {

        // me creo las preguntas para poder confirmar si esta seguro o no
        const question = [
            {
                type: 'confirm',
                name: 'ok',
                message
            }
    ]

        // hago una desestructuracion, para mostrar mi menu
        const { ok } = await inquirer.prompt(question);
        return ok;

    }

    const mostrarListadoChecklist = async( tareas = [] ) => {

        // el map me transforma mi arreglo a algo que quiero mostrar a mi manera
        const choices = tareas.map( (tarea, i) => {

            const idx = `${i + 1}.`.green;

            return {
                
                value : tarea.id,
                name: `${ idx } ${ tarea.desc }`,
                // hago un if ternario ? true : false
                checked: ( tarea.completadoEn ) ? true : false
            }

        });

        // viene la pregunta
        const pregunta = [
            {
                type: 'checkbox',
                name: 'ids',
                message: 'Selecciones',
                choices
            }
        ]
        
        // hago una desestructuracion, para mostrar mi menu
        const { ids } = await inquirer.prompt(pregunta);
        
        return ids;
    }





module.exports = {
    inquiererMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
}