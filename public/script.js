const listEl = document.getElementById('items-list');
const form = document.getElementById('create-form');
const newNameInput = document.getElementById('new-name');

// fetch & render
async function loadItems() {
    const res = await fetch('/items');
    const items = await res.json();
    listEl.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.name;
        // edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editItem(item);
        // delete button
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => deleteItem(item.id);
        li.append(' ', editBtn, ' ', delBtn);
        listEl.append(li);
    });
}

// create
form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = newNameInput.value.trim();
    if (!name) return;
    await fetch('/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    newNameInput.value = '';
    loadItems();
});

// update
async function editItem(item) {
    const newName = prompt('New name:', item.name);
    if (!newName) return;
    await fetch(`/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
    });
    loadItems();
}

// delete
async function deleteItem(id) {
    await fetch(`/items/${id}`, { method: 'DELETE' });
    loadItems();
}

// initial load
loadItems();
