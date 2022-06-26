////////////////////////////// Variables 

const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];

cargarEventListeners();

function cargarEventListeners() {
    //Cuando agregas un curso presionando "Agregar al carrito"
    listaCursos.addEventListener("click", agregarCurso);

    // Elimina cursos del carrito
    carrito.addEventListener("click", eliminarCurso);

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener("click", () => {
        articulosCarrito = []; //Reiniciamos el arreglo

        carritoHTML();  //Imprimimos el HTML 
    })

    //Muestra los cursos de local storage

    document.addEventListener("DOMContentLoaded", () => {
        articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carritoHTML();
    });
}

///////////////////////////////////Funciones

function agregarCurso(e) {
    e.preventDefault();

    if (e.target.classList.contains("agregar-carrito")) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);  //Valor del parametro de la función leerDatosCurso
    }
}

//Elimina un curso del carrito

function eliminarCurso(e) {
    if (e.target.classList.contains("borrar-curso")) {
      const cursoId = e.target.getAttribute("data-id");  //Accede al curso que se quiere eliminar

       // Eliminar del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId)

        carritoHTML(); // Iterar sobre el carrito y mostrar su HTML
    }
}


// Lee el contenido HTML al que le dimos click y extrae la información del curso

function leerDatosCurso(curso) {
    // console.log(curso);

    //Crear un objeto con el contenido del curso actual

    const infoCurso = {
        imagen: curso.querySelector("img").src,
        titulo: curso.querySelector("h4").textContent,
        precio: curso.querySelector(".precio span").textContent,
        id: curso.querySelector("a").getAttribute("data-id"),
        cantidad: 1,
    }
    
    //Revisa si un elemento ya existe en el carrito

    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id);
    if (existe) {
        //Actualizamos la cantidad
        const cursos = articulosCarrito.map ( curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso;    // Retorna el objeto actualizado
            } else {
                return curso;    //Retorna los objetos que no son duplicados
            }
        } );
        articulosCarrito = [...cursos];
    } else {
        //Agregamos el curso al arreglo del carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }


    console.log(articulosCarrito);

    carritoHTML();
}

////////////////////////Muestra el carrito de compras en el HTML

function carritoHTML() {

    //Limpiar el HTML

    limpiarHTML();

    //Recorre el carrito y general el HTML

    articulosCarrito.forEach( (curso) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                 <img src="${curso.imagen}" width="100" >
            </td>
            <td>
                ${curso.titulo}
            </td>
            <td>
                ${curso.precio}
            </td>
            <td>
                ${curso.cantidad}
            </td>
            <td>
               <a href="#" class="borrar-curso" data-id="${curso.id}" > X </a>
             </td>
        `;

        //Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row)
    });

    //Agregar el carrito de compras al Local Storage, se agrega acá ya que es donde agregamos el HTML

    sincronizarStorage();

}

// Elimina los cursos del table body

function limpiarHTML() {
    contenedorCarrito.innerHTML = "";
}

function sincronizarStorage() {
    localStorage.setItem("carrito", JSON.stringify(articulosCarrito))
}