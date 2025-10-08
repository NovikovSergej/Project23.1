/*
   ДЗ 23.1. Cтворення АПІ для TODO списку

    За допомогою Node.js та Express створити API для TODO списку, яке буде включати в себе:
    - Create, Read, Update, Delete - методи
    - Налаштування CORS
    - Використання mongoDB
    - Окрему папку з Front-end частиною, для роботи з API
*/

let todos = [];

init();

async function init() {
    await loadTodosFromServer();
    renderAllTodos();
    attachFormListener();
}

async function loadTodosFromServer() {
    try {
        const response = await fetch('https://project23-1-4.onrender.com/todo-list');
        const data = await response.json();
        todos = data;
    } catch (err) {
        console.error('Помилка завантаження TODO з сервера', err);
    }
}

function renderAllTodos() {
    const wrapper = document.querySelector('.js--todos-wrapper');
    wrapper.innerHTML = '';
    todos.forEach(renderTodo);
}

function renderTodo(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    if (todo.isDone) li.classList.add('todo-item--checked');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.isDone;

    const span = document.createElement('span');
    span.className = 'todo-item__description';
    span.textContent = todo.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'todo-item__delete';
    deleteBtn.textContent = 'Видалити';

    checkbox.addEventListener('change', async () => {
        await toggleTodo(todo._id, checkbox.checked);
        todo.isDone = checkbox.checked;
        li.classList.toggle('todo-item--checked', checkbox.checked);
    });

    deleteBtn.addEventListener('click', async () => {
        await deleteTodo(todo._id);
        todos = todos.filter(t => t._id !== todo._id);
        li.remove();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    const todosWrapper = document.querySelector('.js--todos-wrapper');
    todosWrapper.appendChild(li);
}

function attachFormListener() {
    document.querySelector('.js--form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const input = document.querySelector('.js--form__input');
        const value = input.value.trim();
        if (value === '') return;

        try {
            const response = await fetch('https://project23-1-4.onrender.com/add-todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: value, isDone: false })
            });

            const newTodo = await response.json();
            todos.push(newTodo);
            renderTodo(newTodo);
            input.value = '';
        } catch (err) {
            console.error('Error add TODO', err);
        }
    });
}

async function toggleTodo(id, isDone) {
    try {
        await fetch(`https://project23-1-4.onrender.com/update-todo/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isDone })
        });
    } catch (err) {
        console.error('TODO update error', err);
    }
}

async function deleteTodo(id) {
    try {
        await fetch(`https://project23-1-4.onrender.com/delete-todo/${id}`, {
            method: 'DELETE'
        });
    } catch (err) {
        console.error('TODO delete error', err);
    }
}
