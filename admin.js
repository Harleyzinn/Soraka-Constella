import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC1-7TW2qAIyClAvvN54LyY7ubiXV9ajw0",
    authDomain: "soraka-constella.firebaseapp.com",
    projectId: "soraka-constella",
    storageBucket: "soraka-constella.firebasestorage.app",
    messagingSenderId: "593569822773",
    appId: "1:593569822773:web:5d44d9cd41518b7f59597c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// VARIAVEIS DE CONTROLE
let idParaApagar = null;
const modal = document.getElementById('confirm-modal');

// MONITOR DE LOGIN
onAuthStateChanged(auth, (user) => {
    document.getElementById('login-screen').style.display = user ? 'none' : 'block';
    document.getElementById('dashboard-screen').style.display = user ? 'block' : 'none';
    if(user) loadAll();
});

function loadAll() { loadCategories(); loadProducts(); }

// LOGIN / LOGOUT
document.getElementById('btn-login').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    try { await signInWithEmailAndPassword(auth, email, pass); } 
    catch (e) { document.getElementById('login-error').style.display = 'block'; }
});
document.getElementById('btn-logout').addEventListener('click', () => signOut(auth));

// MODAL LÓGICA
window.abrirModal = (id) => { idParaApagar = id; modal.classList.add('open'); };
document.getElementById('modal-cancel').addEventListener('click', () => modal.classList.remove('open'));
document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
    if(idParaApagar) {
        await deleteDoc(doc(db, "categorias", idParaApagar));
        modal.classList.remove('open');
        loadCategories();
    }
});

// CATEGORIAS
async function loadCategories() {
    const list = document.getElementById('admin-category-list');
    const select = document.getElementById('prod-cat');
    list.innerHTML = ''; select.innerHTML = '<option value="">Escolha...</option>';
    const snap = await getDocs(collection(db, "categorias"));
    snap.forEach(d => {
        const cat = d.data();
        list.innerHTML += `
            <div class="product-item">
                <span style="font-weight:800">${cat.nome}</span>
                <div class="category-actions">
                    <button class="admin-btn btn-small btn-edit" onclick="window.startEdit('${d.id}', '${cat.nome}')">Editar</button>
                    <button class="admin-btn btn-small danger" onclick="window.abrirModal('${d.id}')">Excluir</button>
                </div>
            </div>`;
        select.innerHTML += `<option value="${cat.nome}">${cat.nome}</option>`;
    });
}

document.getElementById('btn-add-category').addEventListener('click', async () => {
    const nome = document.getElementById('cat-nome').value;
    if(!nome) return;
    await addDoc(collection(db, "categorias"), { nome });
    document.getElementById('cat-nome').value = ''; loadCategories();
});

// EDITAR CATEGORIA
window.startEdit = (id, nome) => {
    document.getElementById('form-add-category').style.display = 'none';
    document.getElementById('form-edit-category').style.display = 'block';
    document.getElementById('edit-cat-id').value = id;
    document.getElementById('edit-cat-nome').value = nome;
};

document.getElementById('btn-cancel-edit-category').addEventListener('click', () => {
    document.getElementById('form-add-category').style.display = 'block';
    document.getElementById('form-edit-category').style.display = 'none';
});

document.getElementById('btn-save-edit-category').addEventListener('click', async () => {
    const id = document.getElementById('edit-cat-id').value;
    const novoNome = document.getElementById('edit-cat-nome').value;
    await setDoc(doc(db, "categorias", id), { nome: novoNome }, { merge: true });
    document.getElementById('btn-cancel-edit-category').click();
    loadCategories();
});

// PRODUTOS (IGUAL ANTERIOR)
async function loadProducts() {
    const list = document.getElementById('admin-product-list');
    list.innerHTML = '';
    const snap = await getDocs(collection(db, "produtos"));
    snap.forEach(d => {
        const p = d.data();
        list.innerHTML += `<div class="product-item"><div><b>${p.nome}</b></div><button class="admin-btn btn-small danger" onclick="window.delProd('${d.id}')">Apagar</button></div>`;
    });
}
window.delProd = async (id) => { if(confirm("Apagar produto?")) { await deleteDoc(doc(db, "produtos", id)); loadProducts(); } };
document.getElementById('btn-add-product').addEventListener('click', async () => {
    const p = {
        nome: document.getElementById('prod-nome').value,
        preco: parseFloat(document.getElementById('prod-preco').value),
        img: document.getElementById('prod-img').value,
        desc: document.getElementById('prod-desc').value,
        categoria: document.getElementById('prod-cat').value
    };
    await addDoc(collection(db, "produtos"), p);
    alert("Produto cadastrado!"); loadProducts();
});
