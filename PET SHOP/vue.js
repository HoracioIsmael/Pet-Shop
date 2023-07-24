const {
  createApp
} = Vue
createApp({
  data() {
    return {
      productos: [],
      juguetes: [],
      farmacia: [],
      cartaDetails: {},
      articuloCarrito: [],
      article: [],
      carrito: [],
      elementosCarrito: [],
      productosFiltrados: [],
      total: 0,
      mje: "",
      value: "",
    }
  },
  created() {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => {
        this.productos = data;
        this.juguetes = this.productos.filter(carta => (carta.tipo == "Juguete"))
        this.farmacia = this.productos.filter(carta => (carta.tipo == "Medicamento"))
        if (document.title == "Juguetes Franco Pet-Shop") {
          this.productos = this.juguetes
          console.log(this.productos)
        }
        if (document.title == "Farmacia Franco Pet-Shop") {
          this.productos = this.farmacia
        }
        if (document.title == "details") {
          this.cartaDetails = this.mainDetalle(this.productos)

        }
        if (document.title == "carrito") {
          this.tablaCarrito()
        }
      })
  },
  methods: {
    // Método para formatear la descripcion con saltos de línea
    formatDescripcion(descripcion) {
      return descripcion.replace(/\n/g, "<br>");
    },
    mainDetalle(productos) {
      var idCard = location.search.split("?id=").join("");
      var carta = productos.filter((carta) => carta._id == idCard)[0];
      return carta
    },
    borrarCarrito(event) {
      let identificacion = (event.target.value)
      console.log(event.target.value)
      index = this.articuloCarrito.findIndex(articulo => articulo._id == identificacion)
      console.log(index)
      this.articuloCarrito.splice(index, 1)
      this.total -= this.elementosCarrito[index].total
      this.elementosCarrito.splice(index, 1)
      localStorage.setItem('articulos', JSON.stringify(this.articuloCarrito))
      $('#toast-delete').toast('show')
    },
    tablaCarrito() {
      this.articuloCarrito = JSON.parse(localStorage.getItem('articulos'))
      if (this.articuloCarrito == null) {
        alert("no hay elementos en el carrito")
      } else {
        console.log(this.articuloCarrito);
        for (let i = 0; i < this.articuloCarrito.length; i++) {
          let elementos = new Object()
          elementos.id = this.articuloCarrito[i]._id
          elementos.name = this.articuloCarrito[i].nombre
          elementos.precio = this.articuloCarrito[i].precio
          elementos.cantidad = this.articuloCarrito[i].cantidad
          elementos.indice = i + 1
          elementos.total = this.articuloCarrito[i].cantidad * this.articuloCarrito[i].precio
          this.elementosCarrito.push(elementos)
          this.total += elementos.total
        }
      }
    },
    sumarArticulo(idArticulo) {
      this.articuloCarrito = JSON.parse(localStorage.getItem('articulos'))
      index = this.articuloCarrito.findIndex(articulo => articulo._id == idArticulo)
      if ((this.articuloCarrito[index]['cantidad'] + 1) <= this.articuloCarrito[index]['stock']) {

        this.articuloCarrito[index]['cantidad'] += 1
        this.elementosCarrito[index]['cantidad'] += 1
        this.elementosCarrito[index]['total'] += this.elementosCarrito[index]['precio']
        this.total += this.elementosCarrito[index]['precio']
      } else {
        //SUMAR AL PROYECTO--------------------
        $('#toast-error').toast('show')
        console.log("nop")
      }
      console.log(this.total)
      localStorage.setItem('articulos', JSON.stringify(this.articuloCarrito))
    },
    restarArticulo(idArticulo) {
      //SUMAR AL PROYECTO--------------------
      this.articuloCarrito = JSON.parse(localStorage.getItem('articulos'))
      index = this.articuloCarrito.findIndex(articulo => articulo._id == idArticulo)
      if ((this.articuloCarrito[index]['cantidad']) > 1) {
        this.articuloCarrito[index]['cantidad'] -= 1
        this.elementosCarrito[index]['cantidad'] -= 1
        this.elementosCarrito[index]['total'] -= this.elementosCarrito[index]['precio']
        this.total -= this.elementosCarrito[index]['precio']
      } else {
        console.log("nop")
      }
      console.log(this.total)
      localStorage.setItem('articulos', JSON.stringify(this.articuloCarrito))
    },
    borrarMje() {
      this.mje = ""
    },
    mjeFormulario() {
      $('#toast-success').toast('show')
    },
    FiltrarDatos() {
      //eventos en este caso serian todos los "productos"---- hacerle el filter a productos
      if (this.value != "") {
        this.productosFiltrados = this.productos.filter(producto => producto.nombre.toLowerCase().includes(this.value.toLowerCase()))
      }
    },
    escuchadorCarrito(producto) {
      this.articuloCarrito = JSON.parse(localStorage.getItem('articulos'))
      if (this.articuloCarrito != null) {
        let filter_repeated = this.articuloCarrito.filter(articulo => articulo._id.includes(producto._id))
        if (filter_repeated.length) {
          index = this.articuloCarrito.findIndex(articulo => articulo._id == producto._id)
          if (this.articuloCarrito[index]['cantidad'] < this.articuloCarrito[index]['stock']) {
            this.articuloCarrito[index]['cantidad'] += 1
            $('#toast-success').toast('show')
          } else {
            $('#toast-delete').toast('show')
          }
        } else {
          producto.cantidad = 1
          this.articuloCarrito.push(producto)
          $('#toast-success').toast('show')
        }
        localStorage.setItem('articulos', JSON.stringify(this.articuloCarrito))
      } else {
        producto.cantidad = 1
        this.articuloCarrito = []
        this.articuloCarrito.push(producto)
        localStorage.setItem('articulos', JSON.stringify(this.articuloCarrito))
        $('#toast-success').toast('show')
      }
    },
  },
  computed: {
    search() {
      if (this.value != "") {
        console.log("bhjs")
        this.FiltrarDatos()
      } else {
        this.productosFiltrados = this.productos
      }
    }
  },
}).mount('#app')