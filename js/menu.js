// Variables
const productsContainer = document.querySelector('.menu-list');
const categoryBtns = document.querySelectorAll('.btn-category');
const number = document.querySelector('.counter');
const cartList = document.querySelector('.cart-list');
const cartEmpty = document.querySelector('.cart-empty');
const cartActions = document.querySelector('.cart-actions');
const total = document.querySelector('#total');
const clearCart = document.querySelector('.btn-clear');
const buyCart = document.querySelector('.btn-buy');
let btnsAdd = document.querySelectorAll('.add');
let btnsDelete = document.querySelectorAll('.btn-delete');
let productsInTheCart;
let products = [];



fetch('/js/products.json')
  .then(response => response.json())
  .then(data => {
    products = data;
    loadProducts(products);
  });


// Events
clearCart.addEventListener('click', emptyCart);
buyCart.addEventListener('click', buy);



// Functions

function loadProducts(chosenProducts) {
  // Clear the existing HTML
  productsContainer.innerHTML = '';

  chosenProducts.forEach(product => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
    <img class="card-img" src="${product.image}" alt="${product.title}">
    <div class="card-text">
      <h2>${product.title}</h2>
      <div class="card-bottom">
        <p>$${product.price}</p>
        <button class="btn-buy add" id="${product.id}"><i class="bi bi-basket2-fill"></i></button>
      </div>
    </div>
    `
    productsContainer.appendChild(div);
  });

  updateBtnsAdd();
}

categoryBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    // Select the product category to display
    if (e.target.id != 'all') {
      const producstBtn = products.filter(product => product.category.id === e.target.id);
      loadProducts(producstBtn);
    } else {
      loadProducts(products);
    }
  })
});

function updateBtnsAdd() {
  btnsAdd = document.querySelectorAll('.add');
  btnsAdd.forEach(btn => {
    btn.addEventListener('click', addToCart);
  })
}

const productsInTheCartLS = JSON.parse(localStorage.getItem("products-in-the-cart"));

if (productsInTheCartLS) {
  productsInTheCart = productsInTheCartLS;
  updateCartNumber();
  loadCart();
} else {
  productsInTheCart = [];
}
function addToCart(e) {
  Toastify({
    text: "Added",
    className: "success, btn-green",
    style: {
      background: "#00A149",
    }
  }).showToast();

  const btnId = e.currentTarget.id;
  const productAdded = products.find(product => product.id === btnId);
  if (productsInTheCart.some(product => product.id === btnId)) {
    const index = productsInTheCart.findIndex(product => product.id === btnId)
    productsInTheCart[index].quantity++;
  } else {
    productAdded.quantity = 1;
    productsInTheCart.push(productAdded);

  }

  updateCartNumber()
  loadCart();

  localStorage.setItem("products-in-the-cart", JSON.stringify(productsInTheCart));
}

function updateCartNumber() {
  let newNumber = productsInTheCart.reduce((acc, product) => acc + product.quantity, 0);
  number.innerText = newNumber;
  if (newNumber > 0) {
    cartEmpty.classList.add('hidden');
    cartActions.classList.remove('hidden');

  } else {
    cartEmpty.classList.remove('hidden');
    cartActions.classList.add('hidden');
  }
}

function loadCart() {
  // Clear the previous HTML
  cartList.innerHTML = '';

  productsInTheCart.forEach(product => {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
    <img class="cart-item-img" src="${product.image}" alt="${product.title}">
    <div class="cart-item-title">
      <small>Title</small>
      <h3>${product.title}</h3>
    </div>
    <div class="cart-item-quantity">
      <small>Quantity</small>
      <p>${product.quantity}</p>
    </div>
    <div class="cart-item-price">
      <small>Price</small>
      <p>$${product.price}</p>
    </div>
    <div class="cart-item-subtotal">
      <small>Subtotal</small>
      <p>$${product.price * product.quantity}</p>
    </div>
    <button id="${product.id}" class="btn-delete"><i class="bi bi-x-circle"></i></button>
    `;

    cartList.appendChild(div);
  });

  updateCartNumber();
  updateBtnsDelete();
  updateTotal();
}


function updateBtnsDelete() {
  btnsDelete = document.querySelectorAll('.btn-delete');
  btnsDelete.forEach(btn => {
    btn.addEventListener('click', deleteFromCart);
  })
}

function deleteFromCart(e) {
  Toastify({
    text: "Deleted",
    className: "error, btn-red",
    style: {
      background: "#881014",
    }
  }).showToast();

  const btnId = e.currentTarget.id;
  const index = productsInTheCart.findIndex(product => product.id === btnId);
  productsInTheCart.splice(index, 1);
  loadCart();

  localStorage.setItem("products-in-the-cart", JSON.stringify(productsInTheCart));
}

function updateTotal() {
  const calculatedTotal = productsInTheCart.reduce((acc, product) => acc + (product.price * product.quantity), 0);
  total.innerText = `$${calculatedTotal}
  `;
}

function emptyCart() {
  Swal.fire({
    title: 'The cart has been cleared',
    timer: 2500,
    color: '#ff0000',
    background: '#000',
    showConfirmButton: false,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  })

  productsInTheCart.length = 0;
  localStorage.setItem("products-in-the-cart", JSON.stringify(productsInTheCart));
  loadCart();
}

function buy() {
  Swal.fire({
    title: 'Thanks, enjoy your food!',
    timer: 2500,
    color: '#00A149',
    background: '#000',
    showConfirmButton: false,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  })

  productsInTheCart.length = 0;
  localStorage.setItem("products-in-the-cart", JSON.stringify(productsInTheCart));
  loadCart();
}

