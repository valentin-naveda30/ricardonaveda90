var state ={
  allProducts:[],
  productsToRender:[],//pagination
    man:[],
    woman:[],
    children:[],
    index:0,
    cart:[]
}

if(localStorage.getItem("cart")!== null){
  state.cart =JSON.parse(localStorage.getItem("cart"))
}

     //DOM
     var contenedor = document.querySelector(".products")
     var filterMayorMenor=document.getElementById("filter-mayor-menor")
     var filterMenorMayor=document.getElementById("filter-menor-mayor")
     var inputSearch =document.getElementById("input-search")
     var btnSearch =document.getElementById("btn-search")
     var title=document.getElementById("title-page")
     var filter_A_Z=document.getElementById("A-Z")
     var filter_Z_A=document.getElementById("Z-A")
     var categoryMan=document.getElementById("category-man")
     var categoryWoman=document.getElementById("category-woman")
     var categoryChild=document.getElementById("category-child")
     var todo=document.getElementById("all-products")
     var cartCount=document.getElementById("cant-prod-carr")

     //si existen productos
     cartCount.textContent=state.cart.length

fetch("https://fakestoreapi.com/products/")
.then(function(data){
    data.json().then(function(productos){
      //agregamos la propiedad queatity a todos los productos
      productos.forEach(function(producto){
          producto.quantity=1
      })


       //todo nuestro codigo aqui
       state.allProducts=productos
       state.man=productos.filter(function(product){
           return product.category==="Hombre"
       })
       state.woman=productos.filter(function(product){
          return product.category==="Mujer"
       })
       state.children =productos.filter(function(product){
            return product.category ==="Niño"
       })
       //copiando los productos
       //estado de nuestra tienda
       //Primer Render

       //paginacion
       state.productsToRender=createPagination(state.allProducts)

       //renders

       renderProducts()
       renderPagination()

    actualizarPagIndice()


       //FUNCIONES


      //FUNCIONES

       function renderPagination(products){
        var products= state.productsToRender

        //DOM

        var pagination =document.querySelector(".pagination")
        //Func

         pagination.innerHTML=""

            pagination.innerHTML+= ` <li class="page-item"><button class="page-link" id="btn-prev">Anterior</button></li>`
        for(var i=0;i<products.length;i++){
          pagination.innerHTML+=`<li class="page-item"><a class="page-link" href="#">${i +1}</a></li>`
        } 
  
        pagination.innerHTML+= `<li class="page-item"><button class="page-link" id="btn-next">Siguiente</button></li>`

        var btnNext=document.getElementById("btn-next")
        var btnPrev=document.getElementById("btn-prev")

       //EVENTOS
        btnNext.addEventListener("click",function(){
          nextPage(products)
        })
        btnPrev.addEventListener("click",function(){
           prevPage(products)
        })

      }
       function createPagination(products){
        var productsCopy=[...products]
        var allProducts =[]
        for(var i=0;i<productsCopy.length;i++){
            var pagina= productsCopy.splice(0,5)
            allProducts.push(pagina)
        }
         return allProducts
       }
       function actualizarPagIndice(){
         var indices=document.querySelectorAll(".page-Link")
          indices.forEach(function(li){
          if(li.textContent ==state.index +1){
            li.classList.add("active")
          }else{
            li.classList.remove("active")
          }
         })
       }

       //imprime los productos en pantalla
       function renderProducts(){

        //limpiando el contenedor
        contenedor.innerHTML=""
       //creando los porductos
        state.productsToRender[state.index].forEach(function(producto,index){
          var inCart = state.cart.find(function(pr){
            return pr.id ===producto.id
          })
          console.log("inCart",inCart)


        contenedor.innerHTML+=`
        <div class="card" style="width: 18rem;"id="card-producto-${index}">
        <img src="${producto.image}" class="card-img-top" alt="producto">
        <div class="card-body">
          <h5 class="card-title">${producto.title}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">$${producto.price}</h6>
          <p class="card-text">${producto.description}
        </p>
          <button class=" btn-cart ${inCart !==null ? "product-in-cart":""}">
          ${inCart!==undefined ? "Sacar del Carrito":"Añadir al carrito"}</button>
        </div>
      </div>
      `
      })
      state.productsToRender[state.index].forEach(function(producto,index){
        var card=document.getElementById("card-producto-"+index)
        var img=card.querySelector("img")
        var button= card.querySelector("button")
        
        img.addEventListener("click",function(){
          localStorage.setItem("selected-product",JSON.stringify(producto))
          window.location.href ="producto-detalle.html"
        })
      
        button.addEventListener("click",function(){
           if(button.textContent==="Añadir al carrito"){
            state.cart.push(producto)
            cartCount.textContent=state.cart.length;
            button.textContent="Sacar del carrito"
            button.style.backgroundColor="red"
           }else{
            state.cart=state.cart.filter(function(pr){
               return pr.name !== producto.name
            })

             cartCount.textContent=state.cart.length;
             button.textContent="Sacar del Carrito"
             button.style.backgroundColor="#007bff"
           }
           localStorage.setItem("cart",JSON.stringify(state.cart))
        })
      
})

}

   function nextPage(products){

        if(state.index < products.length-1){
            state.index++
            actualizarPagIndice()
            renderProducts(products)
       }

}

       function prevPage(products){
          if(state.index > 0){
              state.index--
              actualizarPagIndice()
              renderProducts(products)
          }


       }

       function filterProducts(filter){
       state.index=0
       var sortedPag;
       var products=state.productsToRender.flat()
        switch(filter){
          case "mayor-menor":
              products.sort(function(a,b){
                  return b.price - a.price
              })
            break;
          case "menor-mayor":
            products.sort(function(a,b){
                 return a.price - b.price
            })
            break;
         case "A-Z":
              products.sort(function(a,b){
                  if(a.name >b.name){
                    return 1;
                  }else{
                     return-1
                  }
                })
              case "Z-A":
                products.sort(function(a,b){
                  if(a.name > b.name){
                    return -1;
                  }else{
                     return 1
                  }
                })
            break;

            default:
               break;
      }
        state.productsToRender = createPagination(products)
        renderProducts()
        renderPagination()
        actualizarPagIndice()
}
       //EVENTOS
      btnSearch.addEventListener("click",function(evento){
      evento.preventDefault()
      filtered= state.allProducts.filter(function(producto){
           return producto.name.includes(inputSearch.value)

      })

          state.index=0
          state.productsToRender=createPagination(filtered)
          renderProducts()
          renderPagination()
          actualizarPagIndice()
          title.textContent="resultados de tu busqueda"
         //console.log("filtered",filtered)
})

filterMayorMenor.addEventListener("click",function(){

        filterProducts("mayor-menor")
})

filterMenorMayor.addEventListener("click",function(){

     filterProducts("menor-mayor")
})
filter_A_Z.addEventListener("click",function(){

        filterProducts("A-Z")

})
filter_A_Z.addEventListener("click",function(){

        filterProducts("Z-A")
})
categoryMan.addEventListener("click",function(){
    state.productsToRender=createPagination(state.man)
    renderProducts()
    renderPagination()
    actualizarPagIndice()
})
categoryWoman.addEventListener("click",function(){
    state.productsToRender=createPagination(state.woman)
    state.index=0
    renderProducts()
    renderPagination()
    actualizarPagIndice()
})

categoryChild.addEventListener("click",function(){
  state.productsToRender=createPagination(state.child)
  state.index=0
  renderProducts()
  renderPagination()
  actualizarPagIndice()
})
})
})