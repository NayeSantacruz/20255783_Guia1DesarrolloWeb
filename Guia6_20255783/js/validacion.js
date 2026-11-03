//Accediendo a los elementos html
const inputCarnet = document.getElementById("idTxtCarnet");
const inputNombre = document.getElementById("idTxtNombre");
const inputDui = document.getElementById("idTxtDui");
const inputNit = document.getElementById("idTxtNit");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputCorreo = document.getElementById("idTxtCorreo");
const inputEdad = document.getElementById("idTxtEdad");

const buttonValidar = document.getElementById("idBtnValidar");
const buttonLimpiar = document.getElementById("idBtnLimpiar");

const notificacion = document.getElementById("idNotificacion");
// Componente de Bootstrap
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

/*
Expresiones regulares
Una expresion regular se escribe entre diagonales / / y describe un patron de texto.
^ indica el inicio del texto y $ indica el final, asi el texto completo debe cumplir el patron.
[A-Za-z]  un caracter que sea una letra
\d        un digito del 0 al 9
{n}       el elemento anterior se repite exactamente n veces
+         el elemento anterior se repite una o mas veces
*/

//Carnet: dos letras y tres numeros
const expCarnet = /^[A-Za-z]{2}\d{3}$/;

//Nombre completo: solo letras (con tildes y ñ) separadas por espacios, minimo nombre y apellido
const expNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)+$/;

//DUI: ########-#
const expDui = /^\d{8}-\d$/;

//NIT: ####-######-###-#
const expNit = /^\d{4}-\d{6}-\d{3}-\d$/;

//Fecha: dia 01-31, mes 01-12 y año de cuatro digitos (dd/mm/aaaa)
const expFecha = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

//Correo electronico: usuario@dominio.com
const expCorreo = /^[\w.-]+@[\w-]+(\.[\w-]+)+$/;

//Edad: solo numeros
const expEdad = /^\d+$/;

/*
Funcion que valida un campo con su expresion regular.
*/
const validarCampo = (input, expresion) => {
    if (input.value == "") {
        //Un campo vacio no se marca, se queda como esta en el formulario
        input.classList.remove("is-valid");
        input.classList.remove("is-invalid");
        return false;
    } else if (expresion.test(input.value)) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
};

//Funcion que valida todos los campos de la ficha
const validarFicha = () => {
    let carnetOk = validarCampo(inputCarnet, expCarnet);
    let nombreOk = validarCampo(inputNombre, expNombre);
    let duiOk = validarCampo(inputDui, expDui);
    let nitOk = validarCampo(inputNit, expNit);
    let fechaOk = validarCampo(inputFechaNacimiento, expFecha);
    let correoOk = validarCampo(inputCorreo, expCorreo);
    let edadOk = validarCampo(inputEdad, expEdad);

    if (
        inputCarnet.value == "" ||
        inputNombre.value == "" ||
        inputDui.value == "" ||
        inputNit.value == "" ||
        inputFechaNacimiento.value == "" ||
        inputCorreo.value == "" ||
        inputEdad.value == ""
    ) {
        //Asignando un mensaje a nuestra notificacion
        mensaje.innerHTML = "Faltan campos por completar";
    } else if (carnetOk && nombreOk && duiOk && nitOk && fechaOk && correoOk && edadOk) {
        mensaje.innerHTML = "Todos los datos son correctos";
    } else {
        mensaje.innerHTML = "Hay campos con formato incorrecto";
    }
    //Llamando al componente de Bootstrap
    toast.show();
};

//Funcion que limpia el formulario y quita los estilos de validacion
const limpiarForm = () => {
    let campos = document.querySelectorAll("#idForm input");

    campos.forEach((campo) => {
        campo.value = "";
        campo.classList.remove("is-valid");
        campo.classList.remove("is-invalid");
    });

    inputCarnet.focus();
};

/*
Funcion que agrega los separadores (guion o diagonal) automaticamente
mientras se escriben los numeros.
*/
const aplicarFormato = (input, grupos, separador) => {
    //Se dejan solo los numeros escritos, \D significa "cualquier caracter que no sea digito"
    let numeros = input.value.replace(/\D/g, "");
    let resultado = "";
    let posicion = 0;

    for (let i = 0; i < grupos.length; i++) {
        let parte = numeros.slice(posicion, posicion + grupos[i]);
        if (parte != "") {
            //El separador se agrega solo cuando ya hay digitos del siguiente grupo
            if (i > 0) {
                resultado += separador;
            }
            resultado += parte;
        }
        posicion += grupos[i];
    }

    input.value = resultado;
};

//El formato se aplica cada vez que el usuario escribe en el campo
inputDui.addEventListener("input", () => {
    aplicarFormato(inputDui, [8, 1], "-");
});

inputNit.addEventListener("input", () => {
    aplicarFormato(inputNit, [4, 6, 3, 1], "-");
});

inputFechaNacimiento.addEventListener("input", () => {
    aplicarFormato(inputFechaNacimiento, [2, 2, 4], "/");
});

// Agregando eventos a los botones y utilizando funciones tipo flecha
buttonValidar.onclick = () => {
    validarFicha();
};

buttonLimpiar.onclick = () => {
    limpiarForm();
};
