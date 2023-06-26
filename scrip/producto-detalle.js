//obtener el producto storge
var producto=JSON.parse(localStorage.getItem("selected-product"))
//DOM
var img = document.getElementById("product-img")
var title = document.getElementById("title")
var price = document.getElementById("price")
var description = document.getElementById("descripton")


img.src = producto.image
title.textContent = producto.title
price.textContent = producto.price
description.textContent = producto.description