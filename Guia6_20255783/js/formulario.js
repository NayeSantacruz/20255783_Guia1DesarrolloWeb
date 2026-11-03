//Accediendo a los elementos html
const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const notificacion = document.getElementById("idNotificacion");
// Componente de Bootstrap
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

//Componente modal
const idModal = document.getElementById("idModal");

//Arreglo global de pacientes
let arrayPaciente = [];

//Posicion del paciente que se esta editando (-1 cuando se registra uno nuevo)
let posicionEditar = -1;

/*
Funciones para la persistencia de datos con LocalStorage
Primero se valida que el navegador soporte el objeto Storage
*/
const storageDisponible = typeof Storage !== "undefined";

const guardarPacientes = () => {
    if (storageDisponible) {
        //El arreglo se convierte a JSON porque Storage solo guarda texto
        localStorage.setItem("pacientes", JSON.stringify(arrayPaciente));
    }
};

const cargarPacientes = () => {
    if (storageDisponible) {
        let datos = localStorage.getItem("pacientes");
        if (datos != null) {
            //El texto JSON se convierte nuevamente en un arreglo
            arrayPaciente = JSON.parse(datos);
        }
    }
};

/*
Creando una funcion para que limpie el formulario 
siempre que se cargue la pagina o cuando se presione 
el boton limpiar del formulario
*/
const limpiarForm = () => {
    inputNombre.value= "";
    inputApellido.value = "";
    inputFechaNacimiento.value = "";
    inputRdMasculino.checked = false;
    inputRdFemenino.checked = false;
    cmbPais.value = 0;
    inputDireccion.value = "";
    inputNombrePais.value = "";

    //Se vuelve al modo registrar nuevo paciente
    posicionEditar = -1;
    buttonAgregarPaciente.innerHTML = `<i class="bi bi-person-plus-fill"></i> Guardar Datos`;

    inputNombre.focus();
};


/*
Funcion para validar el ingreso del paciente
*/

const addPaciente = function () {
    let nombre = inputNombre.value;
    let apellido = inputApellido.value;
    let fechaNacimiento = inputFechaNacimiento.value;
    let sexo =
        inputRdMasculino.checked == true
        ? "Hombre"
        : inputRdFemenino.checked == true
        ? "Mujer"
        : "";
    let pais = cmbPais.value;
    let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
    let direccion = inputDireccion.value;

    if (
        nombre != "" && 
        apellido != "" && 
        fechaNacimiento != "" &&
        sexo != "" && 
        pais != 0 && 
        direccion != ""
    ) {
        let paciente = new Array(
            nombre,
            apellido,
            fechaNacimiento,
            sexo,
            labelPais,
            direccion
        );

        if (posicionEditar == -1) {
            //Agregando informacion al arreglo paciente
            arrayPaciente.push(paciente);
            //Asignando un mensaje a nuestra notificacion
            mensaje.innerHTML = "Se ha registrado un nuevo paciente";
        } else {
            //Reemplazando los datos del paciente que se estaba editando
            arrayPaciente[posicionEditar] = paciente;
            mensaje.innerHTML = "Se han actualizado los datos del paciente";
            //Actualizando la tabla que se muestra en pantalla
            imprimirPacientes();
        }

        //Guardando los cambios en LocalStorage
        guardarPacientes();
        //Llamando al componente de Bootstrap
        toast.show();

        //Limpiando formulario
        limpiarForm();
    } else {
        //Asignando un mensaje a nuestra notificacion
        mensaje.innerHTML = "Faltan campos por completar";
        //Llamando al componente de Bootstrap
        toast.show();
    }
};

//Funcion que imprime la ficha de los pacientes registrados
function imprimirFilas() {
    let $fila = "";
    let contador = 1;

    arrayPaciente.forEach((element) => {
        $fila += `<tr>
                <td scope="row" class="text-center fw-bold">${contador}</td>
                <td>${element[0]}</td>
                <td>${element[1]}</td>
                <td>${element[2]}</td>
                <td>${element[3]}</td>
                <td>${element[4]}</td>
                <td>${element[5]}</td>
                <td>
                    <button id="idBtnEditar${contador}" type="button" class="btn btn-primary btnEditar" data-posicion="${contador - 1}" alt="Editar">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button id="idBtnEliminar${contador}" type="button" class="btn btn-danger btnEliminar" data-posicion="${contador - 1}" alt="Eliminar">
                        <i class="bi bi-trash3-fill"></i>
                    </button>
                </td>
            </tr>`;
        contador++;
    });
    return $fila;
}

//Carga en el formulario los datos del paciente seleccionado
const editarPaciente = (posicion) => {
    let paciente = arrayPaciente[posicion];

    inputNombre.value = paciente[0];
    inputApellido.value = paciente[1];
    inputFechaNacimiento.value = paciente[2];
    inputRdMasculino.checked = paciente[3] == "Hombre";
    inputRdFemenino.checked = paciente[3] == "Mujer";

    //Buscando en el select el pais que se guardo en el paciente
    for (let i = 0; i < cmbPais.options.length; i++) {
        if (cmbPais.options[i].text == paciente[4]) {
            cmbPais.selectedIndex = i;
        }
    }

    inputDireccion.value = paciente[5];

    //Se guarda la posicion para que addPaciente actualice en lugar de agregar
    posicionEditar = posicion;
    buttonAgregarPaciente.innerHTML = `<i class="bi bi-pencil-square"></i> Actualizar Datos`;
    inputNombre.focus();
};

//Elimina el paciente seleccionado del arreglo
const eliminarPaciente = (posicion) => {
    let paciente = arrayPaciente[posicion];

    if (confirm(`¿Desea eliminar al paciente ${paciente[0]} ${paciente[1]}?`)) {
        arrayPaciente.splice(posicion, 1);
        guardarPacientes();

        //Si se estaba editando un paciente se limpia el formulario
        if (posicionEditar != -1) {
            limpiarForm();
        }

        imprimirPacientes();
        mensaje.innerHTML = "Paciente eliminado correctamente";
        toast.show();
    }
};

const imprimirPacientes = () => {
let $table = `<div class="table-responsive">
                <table class="table table-striped table-hover table-bordered">
                    <tr>
                        <th scope="col" class="text-center" style="width:5%">#</th>
                        <th scope="col" class="text-center" style="width:15%"> Nombre</th>
                        <th scope="col" class="text-center" style="width:15%">Apellido</th>
                        <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
                        <th scope="col" class="text-center" style="width:10%">Sexo</th>
                        <th scope="col" class="text-center" style="width:10%">Pais</th>
                        <th scope="col" class="text-center" style="width:25%">Dirección</th>
                        <th scope="col" class="text-center" style="width: 10%">Opciones</th>
                    </tr>
                    ${imprimirFilas()}
                </table>
            </div>
        `;
    document.getElementById("idTablaPacientes").innerHTML = $table;

    //Los botones se crean dinamicamente, por eso los eventos se asignan
    //despues de insertar la tabla. La posicion se obtiene del atributo data-posicion
    document.querySelectorAll(".btnEditar").forEach((boton) => {
        boton.onclick = () => {
            editarPaciente(parseInt(boton.dataset.posicion));
        };
    });

    document.querySelectorAll(".btnEliminar").forEach((boton) => {
        boton.onclick = () => {
            eliminarPaciente(parseInt(boton.dataset.posicion));
        };
    });
};

// Contador global de los option correspondiente
// al select (cmb) pais
let contadorGlobalOption = cmbPais.children.length;
const addPais = () => {
    let paisNew = inputNombrePais.value;

    if (paisNew != "") {
        // Creando nuevo option con la API DOM
        let option = document.createElement("option");
        option.textContent = paisNew;
        option.value = contadorGlobalOption + 1;

        //Agregando el nuevo option en el select
        cmbPais.appendChild(option);

        //Asignando un mensaje a nuestra notificacion
        mensaje.innerHTML = "Pais agregado correctamente";
        //Llamando al componente de Bootstrap
        toast.show();
    } else {
        //Asignando un mensaje a nuestra notificacion
        mensaje.innerHTML = "Faltan campos por completar";
        //Llamando al componente de Bootstrap
        toast.show();
    }
};

// Agregando eventos a los botones y utilizando funciones tipo flecha
buttonLimpiarPaciente.onclick = () => {
    limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
    addPaciente();
};

buttonMostrarPaciente.onclick = () => {
    imprimirPacientes();
};

buttonAgregarPais.onclick = () => {
    addPais();
};

// Se agrega el focus en el campo nombre pais del modal
idModal.addEventListener("shown.bs.modal", () => {
    inputNombrePais.value = "";
    inputNombrePais.focus();
});

//Ejecutar funcion al momento de cargar la pagina HTML
cargarPacientes();
limpiarForm();