// Variables
const btnBurger = document.querySelector('#btn-burger');
const burger = document.querySelector('.burger');
const images = document.querySelectorAll('img');
const inputName = document.querySelector('#name');
const inputLastName = document.querySelector('#last-name');
const inputEmail = document.querySelector('#email');
const inputPhone = document.querySelector('#phone');
const inputMessage = document.querySelector('#message');
const form = document.querySelector('#contact-form');


// Object with the form information
const formObj = {
  name: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
}


class UI {
  showAlert(message, type) {
    const divMessage = document.createElement('div');
    divMessage.classList.add('alert-text');
    // The class is added depending on the type
    if (type === 'error') {
      divMessage.classList.add('error');
      divMessage.innerHTML = `
      <i class="bi bi-exclamation-circle"></i> ${message}
      `;
    } else {
      divMessage.classList.add('success');
      divMessage.innerHTML = `
      <i class="bi bi-check-circle"></i> ${message}
      `;
    }

    // Add to the DOM
    form.insertBefore(divMessage, document.querySelector('.form-input'));

    setTimeout(() => {
      divMessage.remove();
    }, 3000);
  }
}

const ui = new UI();

// Events
btnBurger.addEventListener('click', openMenu);
inputName.addEventListener('input', formData);
inputLastName.addEventListener('input', formData);
inputEmail.addEventListener('input', formData);
inputPhone.addEventListener('input', formData);
inputMessage.addEventListener('input', formData);
form.addEventListener('submit', sendForm);


// Functions

function openMenu() {
  burger.classList.remove('hidden');
  closeBtn();
}

function closeBtn() {
  const exitBtn = document.createElement('p');
  const overlay = document.createElement('div');
  const body = document.querySelector('body');

  // We validate the existence of the DIV overlay to prevent more from being created
  if (document.querySelectorAll('.full-screen').length > 0) return;

  overlay.classList.add('full-screen');
  exitBtn.classList.add('btn-close');

  exitBtn.textContent = 'x';

  burger.appendChild(exitBtn);
  body.appendChild(overlay);
  closeMenu(exitBtn, overlay);
}

function closeMenu(btn, overlay) {
  btn.addEventListener('click', () => {
    burger.classList.add('hidden');
    overlay.remove();
    btn.remove();
  });

  overlay.onclick = function () {
    overlay.remove();
    btn.remove();
    burger.classList.add('hidden');
  }
}

// Add data to the form object
function formData(e) {
  formObj[e.target.name] = e.target.value;
}

function sendForm(e) {
  e.preventDefault();

  // Extract the data from the form object through destructuring
  const { name, lastName, email, phone, message } = formObj;

  // Validate
  if (name === '' || lastName === '' || email === '' || phone === '' || message === '') {
    ui.showAlert('All fields are required', 'error');
  } else {
    ui.showAlert('your message has been sent');
    formObj.name = '';
    formObj.lastName = '';
    formObj.email = '';
    formObj.phone = '';
    formObj.message = '';

    form.reset();
  }
}




const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const image = entry.target;
      observer.unobserve(image);
    }
  })
})

images.forEach(image => {
  image.src = image.dataset.src;
  observer.observe(image);
});
