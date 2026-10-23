"use strict";


let pedidos = [];


// Elementos del DOM
const formulario = document.querySelector("#formPedido");
const inputProducto = document.querySelector("#producto");
const inputPrecio = document.querySelector("#precio");
const inputCantidad = document.querySelector("#cantidad");
const inputPrecioMaximo = document.querySelector("#precioMaximo");
const btnFiltrar = document.querySelector("#btnFiltrar");
const btnMostrarTodos = document.querySelector("#btnMostrarTodos");
const btnLimpiar = document.querySelector("#btnLimpiar");
const cuerpoTabla = document.querySelector("#cuerpoTabla");
const totalUnidades = document.querySelector("#totalUnidades");
const montoTotal = document.querySelector("#montoTotal");
const mensaje = document.querySelector("#mensaje");

// Procesamiento de datos
const crearPedido = (producto, precio, cantidad) => ({ producto, precio, cantidad });

const calcularSubtotal = (pedido) => pedido.precio * pedido.cantidad;

const calcularUnidades = (lista) =>
  lista.reduce((suma, pedido) => suma + pedido.cantidad, 0);

const calcularMonto = (lista) =>
  lista.map(calcularSubtotal).reduce((suma, subtotal) => suma + subtotal, 0);

const filtrarPorPrecio = (lista, maximo) =>
  lista.filter((pedido) => pedido.precio <= maximo);

// Validaciones
function marcarCampo(campo, esValido) {
  campo.classList.toggle("is-invalid", !esValido);
  campo.classList.toggle("is-valid", esValido);
  return esValido;
}

function validarProducto() {
  return marcarCampo(inputProducto, inputProducto.value.trim() !== "");
}

function validarPrecio() {
  const valor = parseFloat(inputPrecio.value);
  return marcarCampo(inputPrecio, !isNaN(valor) && valor > 0);
}

function validarCantidad() {
  const valor = Number(inputCantidad.value);
  return marcarCampo(inputCantidad, Number.isInteger(valor) && valor > 0);
}


function crearFila(pedido) {
  const fila = document.createElement("tr");
  const datos = [
    pedido.producto,
    `$${pedido.precio.toFixed(2)}`,
    pedido.cantidad,
    `$${calcularSubtotal(pedido).toFixed(2)}`,
  ];

  datos.forEach((dato) => {
    const celda = document.createElement("td");
    celda.textContent = dato;
    fila.appendChild(celda);
  });

  return fila;
}

function mostrarTabla(lista) {
  cuerpoTabla.innerHTML = "";

  if (lista.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.colSpan = 4;
    celda.className = "text-center text-secondary";
    celda.textContent = "No hay pedidos para mostrar";
    fila.appendChild(celda);
    cuerpoTabla.appendChild(fila);
    return;
  }


  lista.map(crearFila).forEach((fila) => cuerpoTabla.appendChild(fila));
}

function mostrarTotales(lista) {
  totalUnidades.textContent = calcularUnidades(lista);
  montoTotal.textContent = `$${calcularMonto(lista).toFixed(2)}`;
}

function mostrarMensaje(texto, tipo) {
  mensaje.innerHTML = "";
  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo} mb-0`;
  alerta.setAttribute("role", "alert");
  alerta.textContent = texto;
  mensaje.appendChild(alerta);
}

function actualizarVista(lista) {
  mostrarTabla(lista);
  mostrarTotales(lista);
}

// Evento blur
inputProducto.addEventListener("blur", validarProducto);
inputPrecio.addEventListener("blur", validarPrecio);
inputCantidad.addEventListener("blur", validarCantidad);

// Evento submit
formulario.addEventListener("submit", function (evento) {

  evento.preventDefault();

  const productoValido = validarProducto();
  const precioValido = validarPrecio();
  const cantidadValida = validarCantidad();

  if (!productoValido || !precioValido || !cantidadValida) {
    mostrarMensaje("Revisa los campos marcados antes de continuar.", "danger");
    return;
  }

  const nuevoPedido = crearPedido(
    inputProducto.value.trim(),
    parseFloat(inputPrecio.value),
    Number(inputCantidad.value)
  );

  pedidos = [...pedidos, nuevoPedido];

  inputPrecioMaximo.value = "";
  actualizarVista(pedidos);
  mostrarMensaje(`Se agregó el pedido: ${nuevoPedido.producto}.`, "success");

  formulario.reset();
  [inputProducto, inputPrecio, inputCantidad].forEach((campo) =>
    campo.classList.remove("is-valid")
  );
  inputProducto.focus();
});

// Evento click
btnFiltrar.addEventListener("click", () => {
  const maximo = parseFloat(inputPrecioMaximo.value);

  if (isNaN(maximo) || maximo <= 0) {
    mostrarMensaje("Ingresa un precio máximo válido para filtrar.", "warning");
    return;
  }

  mensaje.innerHTML = "";
  actualizarVista(filtrarPorPrecio(pedidos, maximo));
});

btnMostrarTodos.addEventListener("click", () => {
  inputPrecioMaximo.value = "";
  mensaje.innerHTML = "";
  actualizarVista(pedidos);
});

btnLimpiar.addEventListener("click", () => {
  pedidos = [];
  inputPrecioMaximo.value = "";
  actualizarVista(pedidos);
  mostrarMensaje("Se eliminaron todos los pedidos.", "warning");
});

// Inicialización
actualizarVista(pedidos);
