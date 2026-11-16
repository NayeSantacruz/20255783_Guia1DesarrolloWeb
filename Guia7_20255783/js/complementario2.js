
// CONFIGURACION DE LA API
const API_KEY = "908e19cc47msh03555a52a290f5ep191308jsnc9bfb2c3c1da";
const API_HOST = "mmo-games.p.rapidapi.com";
const API_URL = `https://${API_HOST}`;

// Opciones que se envian en cada peticion (encabezados que solicita RapidAPI)
const opciones = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": API_HOST,
  },
};

// OBTENIENDO LA REFERENCIA DE LOS ELEMENTOS
const listado = document.getElementById("idListado");
const mensaje = document.getElementById("idMensaje");
const contador = document.getElementById("idContador");
const txtBuscar = document.getElementById("idTxtBuscar");
const cmbPlataforma = document.getElementById("idCmbPlataforma");
const buttonMas = document.getElementById("idBtnMas");
const formFiltros = document.getElementById("idFormFiltros");

// CREANDO MODAL CON BOOTSTRAP
const modal = new bootstrap.Modal(document.getElementById("idModal"), {});
const tituloModal = document.getElementById("modalLabel");
const bodyModal = document.getElementById("idBodyModal");

// Cantidad de juegos que se agregan cada vez al listado
const JUEGOS_POR_PAGINA = 12;

// Arreglo con todos los juegos devueltos por la API
let juegos = [];
// Arreglo con los juegos que cumplen los filtros
let juegosFiltrados = [];
// Total de juegos que se estan mostrando
let totalMostrados = 0;


// Funcion que elimina todos los nodos hijos de un elemento
const limpiarElemento = function (elemento) {
  while (elemento.hasChildNodes()) {
    elemento.removeChild(elemento.firstChild);
  }
};

// Funcion que muestra un mensaje de carga dentro de un contenedor
const mostrarCargando = function (contenedor, texto) {
  limpiarElemento(contenedor);

  const div = document.createElement("div");
  div.setAttribute("class", "text-center py-4");

  // Spinner de bootstrap
  const spinner = document.createElement("div");
  spinner.setAttribute("class", "spinner-border text-primary");
  spinner.setAttribute("role", "status");

  const parrafo = document.createElement("p");
  parrafo.setAttribute("class", "mt-3 mb-0");
  parrafo.textContent = texto;

  div.appendChild(spinner);
  div.appendChild(parrafo);
  contenedor.appendChild(div);
};

// Funcion que muestra un mensaje de error dentro de un contenedor
// recibe la funcion que se ejecutara al pulsar el boton "Reintentar"
const mostrarError = function (contenedor, texto, reintentar) {
  limpiarElemento(contenedor);

  const div = document.createElement("div");
  div.setAttribute("class", "alert alert-danger");
  div.setAttribute("role", "alert");

  const icono = document.createElement("i");
  icono.setAttribute("class", "bi bi-exclamation-triangle me-2");

  div.appendChild(icono);
  div.appendChild(document.createTextNode(texto));

  if (reintentar) {
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-outline-danger btn-sm ms-3");
    button.textContent = "Reintentar";
    button.onclick = reintentar;
    div.appendChild(button);
  }

  contenedor.appendChild(div);
};

// Funcion que convierte la fecha aaaa-mm-dd al formato dd/mm/aaaa
const formatearFecha = function (fecha) {
  if (!fecha) {
    return "No disponible";
  }

  let partes = fecha.split("-");
  if (partes.length != 3) {
    return fecha;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

// Funcion que crea una etiqueta (badge) de bootstrap
const crearEtiqueta = function (texto, color) {
  const span = document.createElement("span");
  span.setAttribute("class", `badge text-bg-${color} me-1`);
  span.textContent = texto;
  return span;
};


// Funcion asincrona que realiza una peticion a la API
// recibe la ruta del endpoint y devuelve los datos en formato de objeto
const consultarAPI = async function (ruta) {
  const respuesta = await fetch(`${API_URL}${ruta}`, opciones);

  // fetch solo rechaza la promesa cuando hay un fallo de red, por eso
  // se verifica el codigo de estado HTTP de la respuesta
  if (!respuesta.ok) {
    if (respuesta.status == 401 || respuesta.status == 403) {
      throw new Error(
        "La clave de RapidAPI no es válida o no está suscrita a la API MMO Games."
      );
    } else if (respuesta.status == 404) {
      throw new Error("No se encontró la información solicitada.");
    } else if (respuesta.status == 429) {
      throw new Error(
        "Se alcanzó el límite de peticiones de la API, intente más tarde."
      );
    } else {
      throw new Error(`La API respondió con el error ${respuesta.status}.`);
    }
  }

  // Convirtiendo la respuesta JSON en un objeto de JavaScript
  const datos = await respuesta.json();
  return datos;
};


// Funcion que crea la tarjeta de un juego con funciones de DOM
const crearTarjeta = function (juego) {
  const columna = document.createElement("div");
  columna.setAttribute("class", "col");

  const tarjeta = document.createElement("div");
  tarjeta.setAttribute("class", "card h-100 shadow-sm tarjeta-juego");
  // Guardando el id del juego en un atributo data-*
  tarjeta.setAttribute("data-id", juego.id);

  const imagen = document.createElement("img");
  imagen.setAttribute("src", juego.thumbnail);
  imagen.setAttribute("class", "card-img-top");
  imagen.setAttribute("alt", juego.title);
  imagen.setAttribute("loading", "lazy");

  const cuerpo = document.createElement("div");
  cuerpo.setAttribute("class", "card-body d-flex flex-column");

  const titulo = document.createElement("h5");
  titulo.setAttribute("class", "card-title fw-bold");
  titulo.textContent = juego.title;

  const etiquetas = document.createElement("div");
  etiquetas.setAttribute("class", "mb-2");
  etiquetas.appendChild(crearEtiqueta(juego.genre.trim(), "primary"));
  etiquetas.appendChild(crearEtiqueta(juego.platform, "secondary"));

  const descripcion = document.createElement("p");
  descripcion.setAttribute("class", "card-text");
  descripcion.textContent = juego.short_description;

  const button = document.createElement("button");
  button.setAttribute("type", "button");
  button.setAttribute("class", "btn btn-outline-primary mt-auto");

  const icono = document.createElement("i");
  icono.setAttribute("class", "bi bi-info-circle me-1");
  button.appendChild(icono);
  button.appendChild(document.createTextNode("Ver detalles"));

  // Al seleccionar el juego se consulta el endpoint de detalle
  button.onclick = () => {
    cargarDetalle(tarjeta.dataset.id);
  };

  cuerpo.appendChild(titulo);
  cuerpo.appendChild(etiquetas);
  cuerpo.appendChild(descripcion);
  cuerpo.appendChild(button);

  tarjeta.appendChild(imagen);
  tarjeta.appendChild(cuerpo);
  columna.appendChild(tarjeta);

  return columna;
};

// Funcion que agrega al listado el siguiente grupo de juegos
const mostrarJuegos = function () {
  let limite = Math.min(
    totalMostrados + JUEGOS_POR_PAGINA,
    juegosFiltrados.length
  );

  for (let index = totalMostrados; index < limite; index++) {
    listado.appendChild(crearTarjeta(juegosFiltrados[index]));
  }

  totalMostrados = limite;

  contador.textContent = `Mostrando ${totalMostrados} de ${juegosFiltrados.length} juegos`;

  // El boton "Mostrar mas" solo se muestra si quedan juegos pendientes
  if (totalMostrados < juegosFiltrados.length) {
    buttonMas.classList.remove("d-none");
  } else {
    buttonMas.classList.add("d-none");
  }
};

// Funcion que aplica los filtros de titulo y plataforma
// sobre los juegos que ya se obtuvieron de la API
const filtrarJuegos = function () {
  let texto = txtBuscar.value.trim().toLowerCase();
  let plataforma = cmbPlataforma.value;

  juegosFiltrados = juegos.filter((juego) => {
    let coincideTitulo = juego.title.toLowerCase().includes(texto);
    let coincidePlataforma =
      plataforma == "" || juego.platform.includes(plataforma);

    return coincideTitulo && coincidePlataforma;
  });

  // Reiniciando el listado
  limpiarElemento(listado);
  limpiarElemento(mensaje);
  totalMostrados = 0;

  if (juegosFiltrados.length == 0) {
    const div = document.createElement("div");
    div.setAttribute("class", "alert alert-warning");
    div.textContent = "No se encontraron juegos con los filtros indicados.";
    mensaje.appendChild(div);
  }

  mostrarJuegos();
};

// Funcion asincrona que consulta el endpoint de listado
const cargarListado = async function () {
  // Mensaje durante la carga de datos
  mostrarCargando(mensaje, "Cargando el listado de juegos...");
  limpiarElemento(listado);
  contador.textContent = "";
  buttonMas.classList.add("d-none");

  try {
    juegos = await consultarAPI("/games");
    filtrarJuegos();
  } catch (error) {
    console.error(error);
    mostrarError(
      mensaje,
      `No se pudo cargar el listado de juegos. ${error.message}`,
      cargarListado
    );
  }
};


// Funcion que crea una fila <tr> con el nombre del dato y su valor
const crearFila = function (campo, valor) {
  const fila = document.createElement("tr");

  const celdaCampo = document.createElement("th");
  celdaCampo.setAttribute("scope", "row");
  celdaCampo.setAttribute("class", "w-25");
  celdaCampo.textContent = campo;

  const celdaValor = document.createElement("td");
  celdaValor.textContent = valor ? valor : "No disponible";

  fila.appendChild(celdaCampo);
  fila.appendChild(celdaValor);

  return fila;
};

// Funcion que crea una tabla a partir de un arreglo de pares [campo, valor]
const crearTabla = function (filas) {
  const tabla = document.createElement("table");
  tabla.setAttribute("class", "table table-striped table-bordered");

  const cuerpo = document.createElement("tbody");
  for (const fila of filas) {
    cuerpo.appendChild(crearFila(fila[0], fila[1]));
  }

  tabla.appendChild(cuerpo);
  return tabla;
};

// Funcion que crea un subtitulo para las secciones del detalle
const crearSubtitulo = function (texto) {
  const subtitulo = document.createElement("h2");
  subtitulo.setAttribute("class", "fs-5 fw-bold mt-4");
  subtitulo.textContent = texto;
  return subtitulo;
};

// Funcion que crea un enlace con apariencia de boton
// el enlace se abre en una nueva pestaña
const crearEnlace = function (url, texto, clases, claseIcono) {
  const enlace = document.createElement("a");
  enlace.setAttribute("href", url);
  enlace.setAttribute("target", "_blank");
  enlace.setAttribute("rel", "noopener");
  enlace.setAttribute("class", clases);

  const icono = document.createElement("i");
  icono.setAttribute("class", claseIcono);
  enlace.appendChild(icono);
  enlace.appendChild(document.createTextNode(texto));

  return enlace;
};

// Funcion que muestra en el modal la informacion del juego seleccionado
const mostrarDetalle = function (juego) {
  limpiarElemento(bodyModal);
  tituloModal.textContent = juego.title;

  // Imagen principal
  const imagen = document.createElement("img");
  imagen.setAttribute("src", juego.thumbnail);
  imagen.setAttribute("class", "img-fluid rounded w-100 mb-3");
  imagen.setAttribute("alt", juego.title);
  bodyModal.appendChild(imagen);

  // Etiquetas de genero, plataforma y estado
  const etiquetas = document.createElement("div");
  etiquetas.setAttribute("class", "mb-3");
  etiquetas.appendChild(crearEtiqueta(juego.genre.trim(), "primary"));
  etiquetas.appendChild(crearEtiqueta(juego.platform, "secondary"));
  if (juego.status) {
    etiquetas.appendChild(crearEtiqueta(juego.status, "success"));
  }
  bodyModal.appendChild(etiquetas);

  // La descripcion viene en formato HTML, se convierte en un documento
  // para extraer unicamente el texto de cada parrafo
  const documento = new DOMParser().parseFromString(
    juego.description ? juego.description : "",
    "text/html"
  );
  const parrafos = documento.querySelectorAll("p");

  if (parrafos.length > 0) {
    for (const parrafo of parrafos) {
      const p = document.createElement("p");
      p.textContent = parrafo.textContent;
      bodyModal.appendChild(p);
    }
  } else {
    const p = document.createElement("p");
    p.textContent = documento.body.textContent.trim()
      ? documento.body.textContent.trim()
      : juego.short_description;
    bodyModal.appendChild(p);
  }

  // Informacion general
  bodyModal.appendChild(crearSubtitulo("Información general"));
  bodyModal.appendChild(
    crearTabla([
      ["Desarrollador", juego.developer],
      ["Publicador", juego.publisher],
      ["Lanzamiento", formatearFecha(juego.release_date)],
    ])
  );

  // Requisitos minimos (no todos los juegos los tienen)
  const requisitos = juego.minimum_system_requirements;
  if (requisitos) {
    bodyModal.appendChild(crearSubtitulo("Requisitos mínimos"));
    bodyModal.appendChild(
      crearTabla([
        ["Sistema operativo", requisitos.os],
        ["Procesador", requisitos.processor],
        ["Memoria", requisitos.memory],
        ["Gráficos", requisitos.graphics],
        ["Almacenamiento", requisitos.storage],
      ])
    );
  }

  // Capturas de pantalla
  if (juego.screenshots && juego.screenshots.length > 0) {
    bodyModal.appendChild(crearSubtitulo("Capturas de pantalla"));

    const fila = document.createElement("div");
    fila.setAttribute("class", "row row-cols-2 g-2");

    for (const captura of juego.screenshots) {
      const columna = document.createElement("div");
      columna.setAttribute("class", "col");

      const img = document.createElement("img");
      img.setAttribute("src", captura.image);
      img.setAttribute("class", "img-fluid rounded");
      img.setAttribute("alt", `Captura de ${juego.title}`);
      img.setAttribute("loading", "lazy");

      columna.appendChild(img);
      fila.appendChild(columna);
    }

    bodyModal.appendChild(fila);
  }

  // Enlaces del juego
  const divEnlaces = document.createElement("div");
  divEnlaces.setAttribute("class", "d-flex flex-wrap gap-2 mt-4");

  // profile_url es la ficha del juego en MMOBomb, es una pagina normal
  // por lo que siempre se puede abrir
  divEnlaces.appendChild(
    crearEnlace(
      juego.profile_url,
      "Ver ficha del juego",
      "btn btn-success",
      "bi bi-box-arrow-up-right me-1"
    )
  );

  // game_url redirige al sitio oficial pasando por servicios de publicidad,
  // los bloqueadores de anuncios pueden impedir que se abra en algunos juegos
  divEnlaces.appendChild(
    crearEnlace(
      juego.game_url,
      "Sitio oficial",
      "btn btn-outline-secondary",
      "bi bi-controller me-1"
    )
  );

  bodyModal.appendChild(divEnlaces);

  const nota = document.createElement("p");
  nota.setAttribute("class", "form-text");
  nota.textContent =
    "Si el sitio oficial no abre, desactive el bloqueador de anuncios o utilice la ficha del juego.";
  bodyModal.appendChild(nota);
};

// Funcion asincrona que consulta el endpoint de detalle
// recibe el id del juego seleccionado en el listado
const cargarDetalle = async function (id) {
  // Mensaje durante la carga de datos
  tituloModal.textContent = "Detalle del juego";
  mostrarCargando(bodyModal, "Cargando los detalles del juego...");
  modal.show();

  try {
    const juego = await consultarAPI(`/game?id=${id}`);
    mostrarDetalle(juego);
  } catch (error) {
    console.error(error);
    mostrarError(
      bodyModal,
      `No se pudieron cargar los detalles del juego. ${error.message}`,
      () => {
        cargarDetalle(id);
      }
    );
  }
};


// Filtrando en tiempo real mientras se escribe el titulo
txtBuscar.addEventListener("input", filtrarJuegos, false);
cmbPlataforma.addEventListener("change", filtrarJuegos, false);

// Evitando que el formulario recargue la pagina al pulsar Enter
formFiltros.onsubmit = (event) => {
  event.preventDefault();
};

buttonMas.onclick = () => {
  mostrarJuegos();
};

// Funcion principal, se ejecuta cuando el documento ha cargado
const iniciar = function () {
  // Verificando que se haya configurado la clave de RapidAPI
  if (API_KEY == "TU_CLAVE" || API_KEY == "") {
    mostrarError(
      mensaje,
      "Falta configurar la clave de RapidAPI en el archivo js/complementario2.js (constante API_KEY)."
    );
  } else {
    cargarListado();
  }
};

window.onload = iniciar;
