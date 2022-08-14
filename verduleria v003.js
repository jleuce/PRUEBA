//Defino las clases que voy a usar
// Clase de ITEMS que se ofrecen
class Item {
  constructor(id, nombre, precio, cantidad, imagen) {
    this.id = Items.length;
    this.nombre = nombre.toUpperCase();
    this.precio = precio;
    this.cantidad = cantidad;
    this.imagen = imagen;
}
imagen(){
  return fetch(`https://imsea.herokuapp.com/api/1?q=${this.nombre}`)
  .then((respuesta) => respuesta.json())
  .then((resultado) => {
       console.log (resultado.results[0]);
       return (resultado.results[0]);
      //const imgElem = document.createElement('img');
      //imgElem.src = linkImagen;
      //document.body.appendChild(imgElem);
  });
}
}
//creo la clase de objeto que se van a trabajar en el carrito
class eCarrito {
  constructor(nombre, cantidad, precio) {
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.precio = precio;
  }
   pxq(){
    return (parseFloat(this.precio * this.cantidad));
  }
}
//Creo los arrays contenedores
//De los items
const Items = [];
//De lo que vaya a cargar en el carrito
const Carrito = [];
//Inicio el programa
// 1- Cargo la pagina principal y el HTML desde JSON
function traerArchivoBackEnd() {
    //function traerProductos()
    const API_URL = "http://45.81.5.216";
    const fetchErrorHandle = (response) => response.status === 200
    ? Promise.resolve(response)
    : response.json().then(data => Promise.reject({response, data}));

        return fetch(`${API_URL}/productos`)
            .then(fetchErrorHandle)
            .then(response => response.json())
            .then(responseObject => responseObject.productos)
            .then(productos => productos.forEach (element => 
                Items.push(new Item(0,element.nombre,element.precio,element.stock,element.imagenUrl))))

            }



function traerArchivoJSON () {
    return fetch('./ItemsInFolder.json')
      .then(response => response.json())
      .then(data => {
        data.forEach(objetoJSON => {
            Items.push(new Item(0,objetoJSON.nombre, objetoJSON.precio, objetoJSON.cantidad, objetoJSON.imagen));
      })
    })
    .then(response => traerArchivoBackEnd())
    .then(() => {
        
        muestroHTML();
        vindear();
    })
    }

// 2- Si hay algo en el local store pregunto si quiere recuperar los datos
if (localStorage.getItem("ItemsOrigen") != null) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  
  swalWithBootstrapButtons.fire({
    title: 'Se encontraron datos guardados!!',
    text: "¿Desea recuperar la informacion?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Recuperar',
    cancelButtonText: 'Descartar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      Items.splice(0,Items.length);
      let itemGuardadoEnJSON = localStorage.getItem("ItemsOrigen");
      const itemGuardadoEnObjeto = JSON.parse(itemGuardadoEnJSON);
      itemGuardadoEnObjeto.forEach((element) => {
        Items.push(element);
      });
      let guardadoEnJSON = localStorage.getItem("carrito");
      const guardadoEnObjeto = JSON.parse(guardadoEnJSON);
      guardadoEnObjeto.forEach((element) => {
        Carrito.push(element);
      });
      if (Carrito.length > 0) {
      agregarHTMLCarritoV2();
      cargarHTMLBotonCancelar();
      TotalDelCarrito();
      vindearBotonesModal();
    }
    muestroHTML();
    vindear();
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Descartado',
        'Datos eliminados del localStorage',
        'error'
      )
      localStorage.removeItem("carrito");
      localStorage.removeItem("ItemsOrigen");
      
      traerArchivoJSON ();
      
    }
  })
}else{
  traerArchivoJSON ();
}
//CARGAR ITEMS DESDE ARCHIVO JSON AL ARRAY ITEMS

// ME FIJO SI HAY ALGO EN CARRITO O ITEMSORIGEN EN EL LOCALSTORAGE
// FUNCION VINDEO LA MAS IMPORTANTE

function vindear() {
  const botonSumar = document.querySelectorAll(".botonSumar");
  const botonRestar = document.querySelectorAll(".botonRestar");
  const botonAgregar = document.querySelectorAll(".agregar");
  const cuadradoItem = document.querySelectorAll(".cuadradoItem");
  
  //const cuadradoGrande = document.querySelectorAll(".cuadradoItem");

// Eventos
// Pintar de rojo al pararse
cuadradoItem.forEach(cuadrado=> {
  cuadrado.addEventListener("mouseover", () =>{
    
    cuadrado.style.backgroundColor = "rgba(255,0,0,0.5)";
  } )
  cuadrado.addEventListener("mouseout", () =>{
    
    cuadrado.style.backgroundColor = "rgba(255,255,255,0.5)";
  })
})

// Configuro que pasa cuando todo el boton +
botonSumar.forEach((card) => {
  card.addEventListener("click", () => {
    let objetoDevuelve = traerPantallaContador(card);
    let valorContador = objetoDevuelve.innerHTML;
    let cantidadDisponible = buscarCantidad(buscarNombre(card));
    if (valorContador == cantidadDisponible) {
      cartelCantidadNoDisponible();
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
      AvisoTemporal(nombreTitulo.innerHTML,cantidad.innerHTML,"green","Agregaste");
      destruirHTMLCarrito();
      agregarObjetoAlCarrito(nombreTitulo.innerHTML, cantidad.innerHTML);
      agregarHTMLCarritoV2();
      modificarCantidadOrigen(nombreTitulo.innerHTML, cantidad.innerHTML);
      refrescarCard(element);
      cargarHTMLBotonCancelar();
      actualizarLocalStorage();
      TotalDelCarrito();
      vindearBotonesModal();
    }
  });
});
}

// BOTON CANCELAR
const botonCancelar = cargarHTMLBotonCancelar();

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
      AvisoTemporal(objetoEnCarrito.nombre,objetoEnCarrito.cantidad,"red","Eliminaste");
      TotalDelCarrito();
      refrescarSeccion();
      if (Carrito.length == 0) {
        papaLugarContenido.remove();
      }
    });
  });
}

// FUNCIONES

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

// FUNCIONAMIENTO DEL TOTAL DEL CARRITO
function TotalDelCarrito(){
  let total = (0);
  Carrito.forEach (element => {
total = total + element.precio * element.cantidad;
  })
  objeto = document.getElementById("totalCarrito");
  objeto.innerHTML = `Total: ${total}`;
}
function TotalDelCarritoModal(){
  let total = (0);
  Carrito.forEach (element => {
total = total + element.precio * element.cantidad;
  })
  
  return (`Total a pagar:$ ${total}`);
}

function prueba() {
  Items.forEach(objeto =>{
    console.log(objeto.imagen());})
}

function vindearBotonesModal() {
  const btnFinalizar = document.querySelector("#btnFinalizar");
  const btnVolver = document.querySelector("#btnVolver");
  const textEmail = document.querySelector("#textEmail");
  const textComentario = document.querySelector("#textComentario");
  const tituloEmail= document.querySelector(".tituloEmail");
  textEmail.addEventListener("input", () => {

      if (/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(textEmail.value)){
        tituloEmail.style.backgroundColor = "rgba(0,255,0,0.5)";
      } else {
        tituloEmail.style.backgroundColor = "rgba(255,0,0,0.5)";
    }
    
    console.log(textEmail.value);
    console.log(tituloEmail.style.backgroundColor);
  })
  btnFinalizar.addEventListener("click", () => {
  console.log(btnFinalizar);
  })
  btnVolver.addEventListener("click", () => {
  console.log(btnVolver);
  })
}

// FUNCIONES OK
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
// EL TOASTIFY
function AvisoTemporal(nombre,cantidad,color,mensaje) {
  Toastify({
    text: `${mensaje} ${cantidad} de ${nombre} al carrito`,
    duration: 3000,
    backgroundColor: `${color}`,
    }).showToast();
  }
function cartelCantidadNoDisponible() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'No se puede sumar más cantidad',
      showConfirmButton: false,
      timer: 1500
    })
    }
// Cargo el HTML segun los Items
function muestroHTML() {
  Items.forEach((element) => {
    let lista = document.getElementById("s1");
    lista.insertAdjacentHTML(
      "beforeend",
      `
        <div class="card-group cuadradoGrande">
            <div class="card">
            <img src="${element.imagen}" class="card-img-top" alt="...">
              <div class="card-body cuadradoItem">
                <h5 class="card-title titulos">${element.nombre}</h5>
                <p class="card-text precio">Precio:$${element.precio}</p>
                <p class="card-text cantidad"> Cantidad disponible:${element.cantidad}</p>
                <div class="btn-group mr-2" role="group" aria-label="First group">
                <button type="button" class="btn btn-secondary botonSumar">+</button>
                <button type="button" class="btn btn-secondary botonRestar">-</button> <p type="text" class = "card-text contador">0</p>
              </div>
            <button type="button" class="btn btn-info agregar">Agregar</button>
            </div>
        </div>
            `
    );
  });
}
// Agrego el papel carrito abajo de todo
function agregarHTMLCarritoV2() {
  let lugar = document.getElementById("s1");
  lugar.insertAdjacentHTML(
    "afterend",
    `
      <div class="card-group" id="este" >
          <div class="card">
            <div class="card-body" id="listado">
              <h5 class="card-title elegidos">Mis elegidos</h5>
              
            </div>
            <h5 class="card-title totalLista" id="totalCarrito">Total $0</h5>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Ir al finalizar
      </button>
      
      <!-- Modal -->
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Pago</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              ...${TotalDelCarritoModal()}

              <div class="mb-3">
  <label for="textEmail" class="form-label tituloEmail">Ingrese su email</label>
  <input type="email" class="form-control" id="textEmail" placeholder="name@example.com">
</div>
<div class="mb-3">
  <label for="textComentario" class="form-label tituloComentario">Comentarios</label>
  <textarea class="form-control" id="textComentario" rows="3"></textarea>
</div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btnVolver" data-dismiss="modal">Volver</button>
              <button type="button" class="btn btn-primary" id="btnFinalizar">Finalizar</button>
            </div>
          </div>
        </div>
      </div> 
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
              <p class="card-text"> Subtotal:$${element.cantidad * element.precio}</p>
              <button type="button" class="btn btn-info cancelarCarrito">Cancelar</button>
          </div>
          
          `
    );
  });
  //}
  document.querySelector(".totalLista").innerHTML = `Total $${TotalDelCarritoModal()}`;
}
// Agrego objeto al array Carrito y si ya hay una con el mismo nombre solo le suma
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

