// Usuarios con sus nombres asociados a un ID
const usuarios = {
    '001': 'Ash Ketchum',
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

    // Redirigir a la página de acciones después de 2 segundos
    setTimeout(function() {
        window.location.href = 'acciones.html';
    }, 2000);
}

// Hacer retiro
function hacerRetiro(event) {
    event.preventDefault();
    var monto = parseFloat(document.getElementById('montoRetiro').value);
    var transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];

    // Agregamos el retiro a las transacciones
    transacciones.push({ tipo: 'Retiro', monto: monto, fecha: new Date().toLocaleDateString() });
    localStorage.setItem('transacciones', JSON.stringify(transacciones));

    // Mostramos un mensaje de éxito
    document.getElementById('mensaje').textContent = 'Retiro de $' + monto.toFixed(2) + ' realizado con éxito.';

    // Redirigir a la página de acciones después de 2 segundos
    setTimeout(function() {
        window.location.href = 'acciones.html';
    }, 2000);
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
        }
    });

    // Mostramos el saldo en el elemento con id "saldo"
    document.getElementById('saldo').textContent = '$' + saldo.toFixed(2);
}
