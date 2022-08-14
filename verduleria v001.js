//Defino las clases que voy a usar
// Clase de ITEMS que se ofrecen
class Item {
  constructor(id, nombre, precio, cantidad) {
    this.id = Items.length;
    this.nombre = nombre.toUpperCase();
    this.precio = precio;
    this.cantidad = cantidad;
    this.posiciones = [
      "titulo" + Items.length,
      "precio" + Items.length,
      "cantidad" + Items.length,
      "bs" + Items.length,
      "br" + Items.length,
      "contador" + Items.length,
      "agregar" + Items.length,
    ];
  }
}
//creo la clase de objeto que se van a trabajar en el carrito
class eCarrito {
  constructor(nombre, cantidad, precio) {
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.precio = precio;
    this.pxq = precio * cantidad;
  }
}
//Creo los arrays contenedores
//De los items
const Items = [];
//De lo que vaya a cargar en el carrito
const Carrito = [];
let totalCarrito = 0;
//Inicio el programa


// ME FIJO SI HAY ALGO EN CARRITO O ITEMSORIGEN EN EL LOCALSTORAGE 
if (localStorage.getItem("carrito") == null) {
} else {
  let guardadoEnJSON = localStorage.getItem("carrito");
  const guardadoEnObjeto = JSON.parse(guardadoEnJSON);
  guardadoEnObjeto.forEach((element) => {
    Carrito.push(element);
  });
  if (Carrito.length > 0) {
  agregarHTMLCarritoV2();
  cargarHTMLBotonCancelar()}
}
if (localStorage.getItem("ItemsOrigen") == null) {;
  cargarItems();
  muestroHTML();
} else {
  let guardadoEnJSON = localStorage.getItem("ItemsOrigen");
  const guardadoEnObjeto = JSON.parse(guardadoEnJSON);
  guardadoEnObjeto.forEach((element) => {
    Items.push(element);
    
  });
  muestroHTML();
}

// FUNCION VINDEO LA MAS IMPORTANTE

vindear();

function vindear() {
  const botonSumar = document.querySelectorAll(".botonSumar");
  const botonRestar = document.querySelectorAll(".botonRestar");
  const botonAgregar = document.querySelectorAll(".agregar");
  //const cuadradoGrande = document.querySelectorAll(".cuadradoItem");

/* HAGO COSAS CUANDO ME PARO SOBRE EL CUADRADO
cuadradoGrande.forEach((element) => {
addEventListener("mouseout", () => console.log(element))})*/

// BOTONES
// Configuro que pasa cuando todo el boton +
botonSumar.forEach((card) => {
  card.addEventListener("click", () => {
    let objetoDevuelve = traerPantallaContador(card);
    let valorContador = objetoDevuelve.innerHTML;
    let cantidadDisponible = buscarCantidad(buscarNombre(card));
    if (valorContador == cantidadDisponible) {
      //alert("no hay mas");
      cartel();
    } else {
      objetoDevuelve.innerHTML++;
    }
  });
});
// Configuro que pasa cuando todo el boton -
botonRestar.forEach((card) => {
  card.addEventListener("click", () => {
    let objetoDevuelve = traerPantallaContador(card);
    let valorContador = objetoDevuelve.innerHTML;
    if (valorContador != 0) {
      objetoDevuelve.innerHTML--;
    }
  });
});
//  AGREGAR - Arma un nuevo htlm y guarda el item y valor en un array y descuenta del objeto inicial
botonAgregar.forEach((element) => {
  element.addEventListener("click", () => {
    if (traerPantallaContador(element).innerHTML != 0) {
      const nombreTitulo = element.parentElement.querySelector(".titulos");
      const cantidad = element.parentElement.querySelector(".contador");
      destruirHTMLCarrito();
      agregarObjetoAlCarrito(nombreTitulo.innerHTML, cantidad.innerHTML);
      agregarHTMLCarritoV2();
      modificarCantidadOrigen(nombreTitulo.innerHTML, cantidad.innerHTML);
      refrescarCard(element);
      cargarHTMLBotonCancelar();
      actualizarLocalStorage();
    }
  });
});
}

// FUNCIONES
function cargarItems() {
  Items.push(new Item(0, "papa", 50, 5));
  Items.push(new Item(1, "cebolla", 30, 30));
  Items.push(new Item(2, "manzana", 60, 6));
  Items.push(new Item(3, "pepino", 60, 6));
}
function muestroHTML() {
  // muestro los objetos de Items en el HTML
  Items.forEach((element) => {
    let lista = document.getElementById("s1");
    lista.insertAdjacentHTML(
      "beforeend",
      `
        <div class="card-group cuadradoGrande">
            <div class="card">
            <img src="./ml1.webp" class="card-img-top" alt="...">
              <div class="card-body cuadradoItem">
                <h5 class="card-title titulos" id ="${element.posiciones[0]}">${element.nombre}</h5>
                <p class="card-text precio" id = "${element.posiciones[1]}">Precio:$${element.precio}</p>
                <p class="card-text cantidad" id = "${element.posiciones[2]}"> Cantidad disponible:${element.cantidad}</p>
                <div class="btn-group mr-2" role="group" aria-label="First group">
                <button type="button" class="btn btn-secondary botonSumar" id="${element.posiciones[3]}">+</button>
                <button type="button" class="btn btn-secondary botonRestar"id ="${element.posiciones[4]}">-</button> <p type="text" class = "card-text contador" id = "${element.posiciones[5]}">0</p>
              </div>
            <button type="button" class="btn btn-info agregar" id="${element.posiciones[6]}">Agregar</button>
            </div>
        </div>
            `
    );
  });
}

function agregarHTMLCarritoV2() {
  //if(Carrito.length <= 1){
  //totalCarrito += cantidad*precio;
  let lugar = document.getElementById("s1");
  lugar.insertAdjacentHTML(
    "afterend",
    `
      <div class="card-group" id="este" >
          <div class="card">
            <div class="card-body" id="listado">
              <h5 class="card-title elegidos">Mis elegidos</h5>
              
            </div>
            <h5 class="card-title totalLista">Total $${totalCarrito}</h5>
            <button type="button" class="btn btn-info comprarCarrito">Comprar</button>
          </div>
      </div>
        `
  );
  Carrito.forEach((element) => {
    let lugar = document.querySelector(".elegidos");
    lugar.insertAdjacentHTML(
      "afterend",
      `
          <div class="esto1">
              <p class="card-text nombreCarrito">${element.nombre}</p>
              <p class="card-text"> Cantidad seleccionada:${element.cantidad}</p>
              <button type="button" class="btn btn-info cancelarCarrito">Cancelar</button>
          </div>
          `
    );
  });
  //}
  document.querySelector(".totalLista").innerHTML = `Total $${totalCarrito}`;
}
function agregarHTMLCarritoItems(params) {}
function agregarObjetoAlCarrito(nombre1, cantidad) {
  if (Carrito.length == 0)  {
    Carrito.push(new eCarrito(nombre1, cantidad, buscarPrecio(nombre1)));
                            } else {
    const objeto = Carrito.find((objetoItem) => objetoItem.nombre == nombre1);
    if (objeto == null || objeto.nombre != nombre1){
      Carrito.push(new eCarrito(nombre1, cantidad, buscarPrecio(nombre1)));
    }else{
      objeto.cantidad =
        parseInt(objeto.cantidad) + parseInt(cantidad);                  
    }                  
  }
}
function refrescarSeccion() {
  let lugarEnPantalla = document.querySelectorAll(".cuadradoGrande");
  lugarEnPantalla.forEach( lugar => lugar.remove());
  muestroHTML();
  vindear();
}

function destruirHTMLCarrito() {
  let lugar1;
  if (Carrito.length > 0) {
    lugar1 = document.querySelector("#este");
    lugar1.remove();
  }
}
function buscarNombre(lugar) {
  const nombreTitulo =
    lugar.parentElement.parentElement.querySelector(".titulos");
  return nombreTitulo.innerHTML;
}
function buscarPrecio(nombreBuscado) {
  const objeto = traerObjetoItemsPorNombre(nombreBuscado);
  return objeto.precio;
}
function traerObjetoCarritoPorNombre(nombre) {
  const objeto = Carrito.find(
    (objetoCarrito) => objetoCarrito.nombre == nombre
  );
  return objeto;
}
function traerObjetoItemsPorNombre(nombre) {
  const objeto = Items.find(
    (objetoItem) => objetoItem.nombre == nombre
  );
  return objeto;
}
function buscarCantidad(nombreBuscado) {
  const objeto = traerObjetoItemsPorNombre(nombreBuscado);
  return objeto.cantidad;
}
function traerPantallaContador(lugar) {
  let campoCantidad = lugar.parentElement.querySelector(".contador");
  return campoCantidad;
}
function modificarCantidadOrigen(nombreBuscado, cantidadRestar) {
  const objeto = traerObjetoItemsPorNombre(nombreBuscado);
    objeto.cantidad = objeto.cantidad - cantidadRestar;
}
function refrescarCard(lugar) {
  const objeto = traerObjetoItemsPorNombre(buscarNombre(lugar));
  let nuevaCantidad = objeto.cantidad;
  let donde = lugar.parentElement.parentElement.querySelector(".cantidad");
  donde.innerHTML = `Cantidad disponible: ${nuevaCantidad}`;
  let donde2 = lugar.parentElement.parentElement.querySelector(".contador");
  donde2.innerHTML = `0`;
}
//Al cancelar el item en el carrito tengo que borralo del array del carrito y reestablecer la cantidad original en el otro array
function cancelarItemCarrito() {

}

function cartel() {
Swal.fire({
  position: 'top-end',
  icon: 'success',
  title: 'Your work has been saved',
  showConfirmButton: false,
  timer: 1500
})
}
function actualizarLocalStorage() {
  if (localStorage.length > 0) {
    localStorage.removeItem("carrito");
    localStorage.removeItem("ItemsOrigen");
    localStorage.setItem("carrito", JSON.stringify(Carrito));
    localStorage.setItem("ItemsOrigen", JSON.stringify(Items));
  } else {
    localStorage.setItem("carrito", JSON.stringify(Carrito));
    localStorage.setItem("ItemsOrigen", JSON.stringify(Items));
  }
}

// BOTON CANCELAR
//const botonCancelar = cargarHTMLBotonCancelar();

//hacer que el DOM sepa que existe el boton CANCELAR
function cargarHTMLBotonCancelar() {
  const botonCancelar = document.querySelectorAll(".cancelarCarrito");
  botonCancelar.forEach((card) => {
    card.addEventListener("click", () => {
      let lugarContenido = card.closest(".esto1");
      let papaLugarContenido = card.closest("#este");
      let nombreContenido = lugarContenido.firstElementChild.innerHTML;
      let objetoEnCarrito = traerObjetoCarritoPorNombre(nombreContenido);
      modificarCantidadOrigen(objetoEnCarrito.nombre, -objetoEnCarrito.cantidad);
      let posicionEnCarrito = Carrito.indexOf(objetoEnCarrito);
      Carrito.splice(posicionEnCarrito, 1);
      actualizarLocalStorage();
      lugarContenido.remove();
      refrescarSeccion();
      if (Carrito.length == 0) {
        papaLugarContenido.remove();
      }
    });
  });
}
