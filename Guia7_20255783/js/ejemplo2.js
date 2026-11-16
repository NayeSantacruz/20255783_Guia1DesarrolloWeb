// Obteniendo la referencia de los elementos
// por medio de arreglos asociativos
// aqui se esta utilizando el atributo name de cada elemento
const formulario = document.forms["frmRegistro"];
const button = document.forms["frmRegistro"].elements["btnRegistro"];

// CREANDO MODAL CON BOOTSTRAP
const modal = new bootstrap.Modal(document.getElementById("idModal"), {});

// OBTENIENDO LA REFERENCIA DEL CUERPO DEL MODAL
// PARA IMPRIMIR EL RESULTADO
const bodyModal = document.getElementById("idBodyModal");

// Recorrer el formulario
const recorrerFormulario = function () {
  let totText = 0;
  let totRadio = 0;
  let totCheck = 0;
  let totDate = 0;
  let totSelect = 0;
  let totFile = 0;
  let totPass = 0;
  let totEmail = 0;

  // Recorriendo elementos del formulario
  let elementos = formulario.elements;
  let totalElementos = elementos.length;

  for (let index = 0; index < totalElementos; index++) {
    // Accediendo a cada hijo del formulario
    let elemento = elementos[index];

    // verificando el tipo de control en el formulario
    let tipoElemento = elemento.type;
    // verificando el tipo de nodo
    let tipoNode = elemento.nodeName;

    // Contabilizando el total de INPUT TYPE = TEXT
    if (tipoElemento == "text" && tipoNode == "INPUT") {
      console.log(elemento);
      totText++;
    }
    // Contabilizando el total de INPUT TYPE = PASSWORD
    else if (tipoElemento == "password" && tipoNode == "INPUT") {
      console.log(elemento);
      totPass++;
    }
    // Contabilizando el total de INPUT TYPE = EMAIL
    else if (tipoElemento == "email" && tipoNode == "INPUT") {
      console.log(elemento);
      totEmail++;
    }
    // Contabilizando el total de INPUT TYPE = RADIO
    else if (tipoElemento == "radio" && tipoNode == "INPUT") {
      console.log(elemento);
      totRadio++;
    }
    // Contabilizando el total de INPUT TYPE = CHECKBOX
    else if (tipoElemento == "checkbox" && tipoNode == "INPUT") {
      console.log(elemento);
      totCheck++;
    }
    // Contabilizando el total de INPUT TYPE = FILE
    else if (tipoElemento == "file" && tipoNode == "INPUT") {
      console.log(elemento);
      totFile++;
    }
    // Contabilizando el total de INPUT TYPE = DATE
    else if (tipoElemento == "date" && tipoNode == "INPUT") {
      console.log(elemento);
      totDate++;
    }
    // Contabilizando el total de SELECT
    else if (tipoNode == "SELECT") {
      console.log(elemento);
      totSelect++;
    }
  }

  let resultado = `
    Total de input[type="text"] = ${totText}<br>
    Total de input[type="password"] = ${totPass}<br>
    Total de input[type="radio"] = ${totRadio}<br>
    Total de input[type="checkbox"] = ${totCheck}<br>
    Total de input[type="date"] = ${totDate}<br>
    Total de input[type="email"] = ${totEmail}<br>
    Total de select = ${totSelect}<br>
  `;

  bodyModal.innerHTML = resultado;
  //Funcion que permite mostrar el modal de Bootstrap
  //Esta funcion es definida por Bootstrap
  modal.show();
};




// EJERCICIO COMPLEMENTARIO 1

// OBTENIENDO LA REFERENCIA DE LOS CONTROLES DEL FORMULARIO
const txtNombre = document.getElementById("idNombre");
const txtApellidos = document.getElementById("idApellidos");
const txtFechaNac = document.getElementById("idFechaNac");
const txtCorreo = document.getElementById("idCorreo");
const txtPassword = document.getElementById("idPassword");
const txtPasswordRepetir = document.getElementById("idPasswordRepetir");
const cmbPais = document.getElementById("idCmPais");
const fileArchivo = document.getElementById("idArchivo");

// Los intereses son todos los checkbox del formulario
const chkIntereses = formulario.querySelectorAll("input[type='checkbox']");
// Las carreras son los radio que comparten el mismo atributo name
const rdCarreras = document.getElementsByName("idRdCarrera");

// OBTENIENDO LA REFERENCIA DEL TITULO DEL MODAL
const tituloModal = document.getElementById("modalLabel");

// Expresion regular para validar el correo electronico
const expresionCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Funcion que elimina todos los nodos hijos del cuerpo del modal
const limpiarModal = function () {
  while (bodyModal.hasChildNodes()) {
    bodyModal.removeChild(bodyModal.firstChild);
  }
};

// Funcion que devuelve el texto del label asociado a un control
const obtenerTextoLabel = function (elemento) {
  let label = document.querySelector(`label[for="${elemento.id}"]`);
  return label.textContent;
};

// Funcion que devuelve un arreglo con los intereses seleccionados
const obtenerIntereses = function () {
  let intereses = [];
  for (let index = 0; index < chkIntereses.length; index++) {
    if (chkIntereses[index].checked) {
      intereses.push(obtenerTextoLabel(chkIntereses[index]));
    }
  }
  return intereses;
};

// Funcion que devuelve la carrera seleccionada
// si no hay ninguna seleccionada devuelve una cadena vacia
const obtenerCarrera = function () {
  let carrera = "";
  for (let index = 0; index < rdCarreras.length; index++) {
    if (rdCarreras[index].checked) {
      carrera = obtenerTextoLabel(rdCarreras[index]);
    }
  }
  return carrera;
};

// Funcion que valida la informacion del formulario
// devuelve un arreglo con los errores encontrados
const validarFormulario = function () {
  let errores = [];

  // a. Validando que los campos no esten vacios
  if (txtNombre.value.trim() == "") {
    errores.push("El campo Nombres no puede estar vacío");
  }

  if (txtApellidos.value.trim() == "") {
    errores.push("El campo Apellidos no puede estar vacío");
  }

  // b. Validando que la fecha de nacimiento no supere la fecha actual
  if (txtFechaNac.value == "") {
    errores.push("El campo Fecha nacimiento no puede estar vacío");
  } else {
    let fechaNacimiento = new Date(`${txtFechaNac.value}T00:00:00`);
    let fechaActual = new Date();

    if (fechaNacimiento > fechaActual) {
      errores.push("La fecha de nacimiento no puede superar la fecha actual");
    }
  }

  // c. Validando el correo electronico por medio de una expresion regular
  if (txtCorreo.value.trim() == "") {
    errores.push("El campo Correo electrónico no puede estar vacío");
  } else if (!expresionCorreo.test(txtCorreo.value.trim())) {
    errores.push("El correo electrónico no tiene un formato válido");
  }

  // d. Validando que las contraseñas sean iguales
  if (txtPassword.value == "") {
    errores.push("El campo Contraseña no puede estar vacío");
  }

  if (txtPasswordRepetir.value == "") {
    errores.push("El campo Repetir Contraseña no puede estar vacío");
  }

  if (
    txtPassword.value != "" &&
    txtPasswordRepetir.value != "" &&
    txtPassword.value != txtPasswordRepetir.value
  ) {
    errores.push("Las contraseñas no son iguales");
  }

  // e. Verificando que este seleccionado al menos un interes
  if (obtenerIntereses().length == 0) {
    errores.push("Debe seleccionar al menos un interés");
  }

  // f. Verificando que se seleccione una carrera
  if (obtenerCarrera() == "") {
    errores.push("Debe seleccionar una carrera");
  }

  // g. Verificando que se seleccione un pais de origen
  // la primera opcion del select es "Seleccione una opcion"
  if (cmbPais.selectedIndex == 0) {
    errores.push("Debe seleccionar un país de origen");
  }

  // Validando que se haya seleccionado la imagen del avatar
  if (fileArchivo.files.length == 0) {
    errores.push("Debe seleccionar la imagen de su avatar");
  }

  return errores;
};

// Funcion que muestra en el modal los errores encontrados
const mostrarErrores = function (errores) {
  limpiarModal();
  tituloModal.textContent = "Errores en el formulario";

  // Creando alerta de bootstrap
  const divAlerta = document.createElement("div");
  divAlerta.setAttribute("class", "alert alert-danger mb-0");

  const parrafo = document.createElement("p");
  parrafo.setAttribute("class", "fw-bold");
  parrafo.appendChild(
    document.createTextNode("Por favor corrija lo siguiente:")
  );
  divAlerta.appendChild(parrafo);

  // Creando lista con cada uno de los errores
  const lista = document.createElement("ul");
  lista.setAttribute("class", "mb-0");

  for (const error of errores) {
    const item = document.createElement("li");
    item.appendChild(document.createTextNode(error));
    lista.appendChild(item);
  }

  divAlerta.appendChild(lista);
  bodyModal.appendChild(divAlerta);

  modal.show();
};

// Funcion que crea una fila <tr> con el nombre del campo y su valor
const crearFila = function (campo, valor) {
  const fila = document.createElement("tr");

  // Celda de encabezado con el nombre del campo
  const celdaCampo = document.createElement("th");
  celdaCampo.setAttribute("scope", "row");
  celdaCampo.appendChild(document.createTextNode(campo));

  // Celda con el valor capturado
  const celdaValor = document.createElement("td");
  celdaValor.appendChild(document.createTextNode(valor));

  fila.appendChild(celdaCampo);
  fila.appendChild(celdaValor);

  return fila;
};

// Funcion que muestra en el modal la informacion capturada
// creando una tabla con funciones de DOM
const mostrarInformacion = function () {
  limpiarModal();
  tituloModal.textContent = "Información del registro";

  // Creando la tabla
  const tabla = document.createElement("table");
  tabla.setAttribute("class", "table table-striped table-bordered mb-0");

  // Creando el encabezado de la tabla
  const encabezado = document.createElement("thead");
  encabezado.setAttribute("class", "table-dark");
  const filaEncabezado = document.createElement("tr");

  const thCampo = document.createElement("th");
  thCampo.setAttribute("scope", "col");
  thCampo.appendChild(document.createTextNode("Campo"));

  const thValor = document.createElement("th");
  thValor.setAttribute("scope", "col");
  thValor.appendChild(document.createTextNode("Valor"));

  filaEncabezado.appendChild(thCampo);
  filaEncabezado.appendChild(thValor);
  encabezado.appendChild(filaEncabezado);
  tabla.appendChild(encabezado);

  // Creando el cuerpo de la tabla
  const cuerpo = document.createElement("tbody");

  // La fecha viene en formato aaaa-mm-dd, se muestra como dd/mm/aaaa
  let fecha = txtFechaNac.value.split("-");
  let fechaNacimiento = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;

  // Texto de la opcion seleccionada en el select
  let pais = cmbPais.options[cmbPais.selectedIndex].text;

  cuerpo.appendChild(crearFila("Nombres", txtNombre.value.trim()));
  cuerpo.appendChild(crearFila("Apellidos", txtApellidos.value.trim()));
  cuerpo.appendChild(crearFila("Fecha nacimiento", fechaNacimiento));
  cuerpo.appendChild(crearFila("Correo electrónico", txtCorreo.value.trim()));
  // Por seguridad la contraseña no se muestra, solo asteriscos
  cuerpo.appendChild(
    crearFila("Contraseña", "*".repeat(txtPassword.value.length))
  );
  cuerpo.appendChild(crearFila("Intereses", obtenerIntereses().join(", ")));
  cuerpo.appendChild(crearFila("Carrera", obtenerCarrera()));
  cuerpo.appendChild(crearFila("País de origen", pais));
  cuerpo.appendChild(crearFila("Avatar", fileArchivo.files[0].name));

  tabla.appendChild(cuerpo);
  bodyModal.appendChild(tabla);

  modal.show();
};

// agregando eventos al boton
button.onclick = () => {
  let errores = validarFormulario();

  if (errores.length == 0) {
    mostrarInformacion();
  } else {
    mostrarErrores(errores);
  }
};
