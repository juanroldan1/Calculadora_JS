//DOM
document.addEventListener('DOMContentLoaded', function() {
    const botones = document.querySelectorAll('#teclado button');
    const historial = document.getElementById('historial');
    const operacionesDiv = document.getElementById('operaciones'); // Nueva línea
    const botonBorrarHistorial = document.getElementById('borrar_historial'); // Nueva línea
    const pantalla = document.getElementById('num_pantalla');
    const botonModoOscuro = document.getElementById('modo_oscuro');
    const calculadora = document.querySelector('.calculadora');

    // Variables de estado
    let operacionesHistorial = []; 
    let primerNumero = '';
    let operacionActual = '';
    let debeLimpiarPantalla = false;

    // Función para actualizar la pantalla con un nuevo valor
    function actualizarPantalla(valor) {
        if (pantalla.value === '0' || debeLimpiarPantalla) {
            pantalla.value = valor;
            debeLimpiarPantalla = false;
        } else {
            // Validar punto decimal múltiple
            if (valor === '.' && pantalla.value.includes('.')) {
                return;
            }
            pantalla.value += valor;
        }
    }

    // Función para actualizar historial
    function actualizarHistorial(){
        operacionesDiv.innerHTML = operacionesHistorial.slice(-10).join('<br>');
    }

    // Función para limpiar solo el historial
    function limpiarHistorial() {
        operacionesHistorial = [];
        operacionesDiv.innerHTML = '';
    }

    // Función para realizar cálculos
    function calcularResultado() {
        const num1 = parseFloat(primerNumero);
        const num2 = parseFloat(pantalla.value);
        let resultado = 0;
        let expresionCompleta = `${primerNumero} ${operacionActual} ${pantalla.value}`;
        
        switch (operacionActual) {
            case '+':
                resultado = num1 + num2;
                break;
            case '-':
                resultado = num1 - num2;
                break;
            case '*':
                resultado = num1 * num2;
                break;
            case '/':
                if (num2 !== 0) {
                    resultado = num1 / num2;
                } else {
                    resultado = 'Error';
                }
                break;
            case '%':
                resultado = (num1 * num2) / 100;
                expresionCompleta = `${primerNumero} × ${pantalla.value}%`;
                break;
            case'^':
                resultado = num1 ** num2;
                break;
            default:
                return;
        }
        
        if (resultado !== 'Error' && !isNaN(resultado) && isFinite(resultado)) {
            // Redondea para evitar problemas de precisión de flotantes
            resultado = parseFloat(resultado.toFixed(8));
            pantalla.value = resultado;
        } else {
            pantalla.value = 'Error';
        }
        
        // Actualiza el historial
        operacionesHistorial.push(`${expresionCompleta} = ${pantalla.value}`);
        actualizarHistorial();

        // Reinicia las variables de estado
        primerNumero = pantalla.value;
        operacionActual = '';
        debeLimpiarPantalla = true;
    }

    // Función para limpiar la calculadora
    function limpiarCalculadora() {
        pantalla.value = '0';
        primerNumero = '';
        operacionActual = '';
        debeLimpiarPantalla = false;
        
    }

    // Eventos para cada botón
    botones.forEach(boton => {
        boton.addEventListener('click', function() {
            const valorBoton = boton.textContent;
            
            if (!isNaN(valorBoton) || valorBoton === '.') {
                actualizarPantalla(valorBoton);
            }
            
            else if (['+', '-', '*', '/','^'].includes(valorBoton)) {
                if (operacionActual !== '') {
                    calcularResultado();
                }
                primerNumero = pantalla.value;
                operacionActual = valorBoton;
                debeLimpiarPantalla = true;
            }
            
            else if (valorBoton === '=') {
                if (operacionActual !== '' && primerNumero !== '') {
                    calcularResultado();
                }
            }
            
            else if (valorBoton === 'AC') {
                limpiarCalculadora();
            }
            
            else if (valorBoton === '+/-') {
                const valorActual = parseFloat(pantalla.value);
                if (!isNaN(valorActual)) {
                    pantalla.value = valorActual * -1;
                }
            }
            
            else if (valorBoton === '%') {
                if (operacionActual !== '' && primerNumero !== '') {
                    calcularResultado();
                } else {
                    const numeroActual = parseFloat(pantalla.value);
                    if (!isNaN(numeroActual)) {
                        const resultado = numeroActual / 100;
                        pantalla.value = resultado;
                        operacionesHistorial.push(`${numeroActual}% = ${resultado}`);
                        actualizarHistorial();
                    }
                }
            }
        });
    });

    // Evento para limpiar historial
    if (botonBorrarHistorial) {
        botonBorrarHistorial.addEventListener('click', limpiarHistorial);
    }

    // Lógica para el botón de modo oscuro
    if (botonModoOscuro && calculadora && historial) {
        botonModoOscuro.addEventListener('click', function() {
            calculadora.classList.toggle('modo-oscuro');
            historial.classList.toggle('modo-oscuro');
        });
    }
});
