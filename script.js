// Select item
const alertText = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');


// edit option
let editElement;
let editFlag = false;
let editId = '';
// event listeners

window.addEventListener('DOMContentLoaded', setupItems);

// submit form
form.addEventListener('submit', addItem);
// clear btn
clearBtn.addEventListener('click', clearItems);

// function
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();
    if (value && editFlag === false) {
        // create element and add class
        const element = document.createElement('article');
        element.classList.add('grocery-item');

        // create attribute id
        // const arrtId = document.createAttribute('data-id');
        // arrtId.value = id;

        // add attribute to element
        element.setAttribute('data-id', id);

        // add data
        element.innerHTML = `<p class="title">${value}.</p>
        <div class="btn-container">
            <button class="edit-btn">edit</button>
            <button class="delete-btn">delete</button>
        </div>`;

        const editBtn = element.querySelector('.edit-btn');
        const deleteBtn = element.querySelector('.delete-btn');

        editBtn.addEventListener('click', editItem);
        deleteBtn.addEventListener('click', deleteItem);

        // grocery-list append child
        list.appendChild(element);

        // display alert
        displayAlert('item added to the list', 'success');

        // show container
        container.classList.add('show-container');

        // addto Localstorage
        addToLocalStorage(id, value);

        // setBack to default
        setBackToDefault();

    } else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert('value change', 'success');
        editLocalStorage(editId, value);
        setBackToDefault();
    }
    else {
        console.log('empty value');
        displayAlert('Please Enter Value!', 'danger')
    }

}

// clear items
function clearItems() {
    const items = document.querySelectorAll('.grocery-item');

    if (items.length > 0) {
        items.forEach(item => {
            item.remove();
            // or
            // list.removeChild(item);
        });
        container.classList.remove('show-container');
        displayAlert('empty list!', 'danger');
        setBackToDefault();

        localStorage.removeItem('list');
    }
}

// edit item
function editItem(e) {
    const element = e.target.parentElement.parentElement;
    // set edit item
    editElement = e.target.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editId = element.dataset.id;
    submitBtn.textContent = 'edit';

}

// delete item
function deleteItem(e) {
    const element = e.target.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);

    if (list.children.length === 0) {
        container.classList.remove('show-container')
    }

    removeFromLocalStorage(id);

    displayAlert('item removed!', 'danger');
    setBackToDefault();
}

function displayAlert(text, action) {
    alertText.textContent = text;
    alertText.classList.add(`alert-${action}`);

    // remove alert
    setTimeout(function () {
        alertText.textContent = '';
        alertText.classList.remove(`alert-${action}`);
    }, 1000);
}

function setBackToDefault() {
    grocery.value = '';
    editFlag = false;
    editId = '';
    submitBtn.textContent = 'submit';
}

// local storage
function addToLocalStorage(id, value) {
    const grocery = { id, value };
    const items = getLocalStorage();
    items.push(grocery);

    localStorage.setItem('list', JSON.stringify(items));
    console.log(items);
}

function getLocalStorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter(item => {
        if (item.id !== id) {
            return item;
        }
    });
    localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();

    items = items.map(item => {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });

    localStorage.setItem('list', JSON.stringify(items));
}
// setup item

function setupItems() {
    let items = getLocalStorage();

    if (items.length > 0) [
        items.forEach(item => {
            createListItem(item.id, item.value);
        })
    ]
}

function createListItem(id, value) {
    // create element and add class
    const element = document.createElement('article');
    element.classList.add('grocery-item');

    // create attribute id
    // const arrtId = document.createAttribute('data-id');
    // arrtId.value = id;

    // add attribute to element
    element.setAttribute('data-id', id);

    // add data
    element.innerHTML = `<p class="title">${value}.</p>
     <div class="btn-container">
         <button class="edit-btn">edit</button>
         <button class="delete-btn">delete</button>
     </div>`;

    const editBtn = element.querySelector('.edit-btn');
    const deleteBtn = element.querySelector('.delete-btn');

    editBtn.addEventListener('click', editItem);
    deleteBtn.addEventListener('click', deleteItem);

    // grocery-list append child
    list.appendChild(element);

    // show container
    container.classList.add('show-container');
}