// Usuarios con sus nombres asociados a un ID
const usuarios = {
    '0987654321': 'Ash Ketchum',
    '002': 'Misty Waterflower',
    '003': 'Brock Harrison'
};

// Validar login
function validarLogin(event) {
    event.preventDefault(); // Evitar recargar la página

    var userID = document.getElementById('userID').value;
    var pin = document.getElementById('pin').value;
    var errorMessage = document.getElementById('error-message');

    // Simular que el PIN correcto es "1234"
    if (pin === '1234' && usuarios[userID]) {
        // Almacenar el ID del usuario y su nombre en localStorage
        localStorage.setItem('userID', userID);
        localStorage.setItem('userName', usuarios[userID]);
        
        // Redirigir a la página de acciones
        window.location.href = 'acciones.html';
    } else {
        errorMessage.textContent = 'ID o PIN incorrecto. Inténtalo de nuevo.';
    }
}

// Mostrar el nombre del usuario en la pantalla de acciones
function mostrarUsuario() {
    var userName = localStorage.getItem('userName');
    var userID = localStorage.getItem('userID');

    if (userName && userID) {
        // Mostrar el nombre del usuario en la bienvenida
        document.getElementById('bienvenida').textContent = 'Bienvenido, ' + userName;
        // Mostrar el ID del usuario
        document.getElementById('userID').textContent = userID;
    } else {
        // Si no hay ID de usuario, redirigir al login
        window.location.href = 'login.html';
    }
}

// Hacer depósito
function hacerDeposito(event) {
    event.preventDefault();
    var monto = parseFloat(document.getElementById('montoDeposito').value);
    var transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];

    // Agregamos el depósito a las transacciones
    transacciones.push({ tipo: 'Depósito', monto: monto, fecha: new Date().toLocaleDateString() });
    localStorage.setItem('transacciones', JSON.stringify(transacciones));

    // Mostramos un mensaje de éxito
    document.getElementById('mensaje').textContent = 'Depósito de $' + monto.toFixed(2) + ' realizado con éxito.';
    // comprobante pdf
    generarComprobantePDF(transacciones);
    // Redirigir a la página de acciones después de 2 segundos
    setTimeout(function() {
        window.location.href = 'acciones.html';
    }, 2000);
}
//generar pdf

function generarComprobantePDF(transacciones) {
    // Importa jsPDF desde la biblioteca
    const { jsPDF } = window.jspdf;

    // Crea una nueva instancia de jsPDF
    const doc = new jsPDF();

    // Añade el título al PDF
    doc.setFontSize(16);
    doc.text("Comprobante de Transacción", 10, 10);

    // Añade un espacio
    doc.setFontSize(12);
    doc.text("Detalles de la Transacción:", 10, 20);

    // Última transacción (la más reciente)
    const ultimaTransaccion = transacciones[transacciones.length - 1];
    const { tipo, monto, fecha } = ultimaTransaccion;

    // Añade detalles de la transacción
    doc.text(`Tipo de Transacción: ${tipo}`, 10, 30);
    doc.text(`Monto: $${monto.toFixed(2)}`, 10, 40);
    doc.text(`Fecha: ${fecha}`, 10, 50);

    // Genera el PDF
    doc.save(`Comprobante_${tipo}_${fecha}.pdf`);
}


// Hacer retiro
function hacerRetiro(event) {
    event.preventDefault();
    
    var monto = parseFloat(document.getElementById('montoRetiro').value);
    var transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    var saldo = 0;

    // Calcular el saldo actual sumando los depósitos y restando los retiros
    transacciones.forEach(function(transaccion) {
        if (transaccion.tipo === 'Depósito') {
            saldo += transaccion.monto;
        } else if (transaccion.tipo === 'Retiro') {
            saldo -= transaccion.monto;
        }else if (transaccion.tipo === 'Pago de Servicio') {
            saldo -= transaccion.monto;
        }
    });

    // Validar que el monto a retirar no sea mayor que el saldo disponible
    if (monto > saldo) {
        document.getElementById('mensaje').textContent = 'Error: No puede retirar más que el saldo disponible. Saldo actual: $' + saldo.toFixed(2);
    } else {
        // Si el monto es válido, realizar el retiro
        transacciones.push({ tipo: 'Retiro', monto: monto, fecha: new Date().toLocaleDateString() });
        localStorage.setItem('transacciones', JSON.stringify(transacciones));

        // Mostramos un mensaje de éxito
        document.getElementById('mensaje').textContent = 'Retiro de $' + monto.toFixed(2) + ' realizado con éxito.';
        document.getElementById('mensaje').classList.remove('text-danger');
        document.getElementById('mensaje').classList.add('text-success');

        // comprobante pdf
        generarComprobantePDF(transacciones);

        // Redirigir a la página de acciones después de 2 segundos
        setTimeout(function() {
            window.location.href = 'acciones.html';
        }, 2000);
    }
}

// Calcular y mostrar el saldo
function mostrarSaldo() {
    var transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    var saldo = 0;

    // Calculamos el saldo basado en las transacciones
    transacciones.forEach(function(transaccion) {
        if (transaccion.tipo === 'Depósito') {
            saldo += transaccion.monto;
        } else if (transaccion.tipo === 'Retiro') {
            saldo -= transaccion.monto;
        }else if (transaccion.tipo === 'Pago de Servicio') {
            saldo -= transaccion.monto;
        }
    });

    // Mostramos el saldo en el elemento con id "saldo"
    document.getElementById('saldo').textContent = '$' + saldo.toFixed(2);
}
// Función para mostrar el historial de transacciones en una tabla dinámica
function mostrarHistorialTransacciones() {
    var transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    var historial = document.getElementById('historial-transacciones');
    historial.innerHTML = ''; // Limpiar el contenido antes de mostrar las transacciones

    // Si hay transacciones, agregarlas a la tabla
    if (transacciones.length > 0) {
        transacciones.forEach(function(transaccion) {
            var fila = `<tr>
                <td>${transaccion.fecha}</td>
                <td>${transaccion.tipo}</td>
                <td>$${transaccion.monto.toFixed(2)}</td>
            </tr>`;
            historial.innerHTML += fila;
        });
    } else {
        // Si no hay transacciones, mostrar un mensaje
        historial.innerHTML = `<tr><td colspan="3" class="text-center">No hay transacciones registradas.</td></tr>`;
    }
}

// Función para mostrar el gráfico de transacciones
function mostrarGraficoTransacciones() {
    var transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    var depositos = 0;
    var retiros = 0;
    var pagosServicios = 0;

    // Contamos y sumamos las cantidades de cada tipo de transacción
    transacciones.forEach(function(transaccion) {
        if (transaccion.tipo === 'Depósito') {
            depositos += transaccion.monto;
        } else if (transaccion.tipo === 'Retiro') {
            retiros += transaccion.monto;
        } else if (transaccion.tipo === 'Pago de Servicio') {
            pagosServicios += transaccion.monto;
        }
    });

    // Configurar el gráfico
    var ctx = document.getElementById('transaccionesChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line', // Tipo de gráfico de líneas
        data: {
            labels: ['Depósitos', 'Retiros', 'Pagoºs de Servicios'], // Etiquetas en el eje X
            datasets: [
                {
                    label: 'Monto de Transacciones',
                    data: [depositos, retiros, pagosServicios], // Datos: cantidad total de cada tipo
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    fill: false, // No rellenar el área bajo la línea
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true // Comenzar el eje Y desde 0
                    }
                }]
            }
        }
    });
}

// Función para pagar servicios
function pagarServicio(event) {
    event.preventDefault();

    var servicio = document.getElementById('servicio').value;
    var monto = parseFloat(document.getElementById('montoServicio').value);
    var transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    var saldo = 0;


    // Calcular el saldo actual sumando depósitos y restando retiros
    transacciones.forEach(function(transaccion) {
        if (transaccion.tipo === 'Depósito') {
            saldo += transaccion.monto;
        } else if (transaccion.tipo === 'Retiro') {
            saldo -= transaccion.monto;
        }else if (transaccion.tipo === 'Pago de Servicio') {
            saldo -= transaccion.monto;
        }
    });

    // Verificar si el usuario tiene suficiente saldo
    if (monto > saldo) {
        document.getElementById('mensaje').textContent = 'Error: No tienes suficiente saldo para pagar este servicio. Saldo actual: $' + saldo.toFixed(2);
        document.getElementById('mensaje').classList.remove('text-success');
        document.getElementById('mensaje').classList.add('text-danger');
    } else {
        // Añadir la transacción de pago de servicio
        transacciones.push({ tipo: 'Pago de Servicio', monto: monto, fecha: new Date().toLocaleDateString() });
        localStorage.setItem('transacciones', JSON.stringify(transacciones));

        // Mostrar mensaje de éxito
        document.getElementById('mensaje').textContent = 'Pago de ' + servicio + ' de $' + monto.toFixed(2) + ' realizado con éxito.';
        document.getElementById('mensaje').classList.remove('text-danger');
        document.getElementById('mensaje').classList.add('text-success');

        // comprobante pdf
        generarComprobantePDF(transacciones);

        // Redirigir a la página de acciones después de 2 segundos
        setTimeout(function() {
            window.location.href = 'acciones.html';
        }, 2000);
    }
   
    
}//localStorage.clear();