import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

let idParaApagar = null;
let colecaoAtual = "";

onAuthStateChanged(auth, (user) => {
    document.getElementById('login-screen').style.display = user ? 'none' : 'block';
    document.getElementById('dashboard-screen').style.display = user ? 'block' : 'none';
    if(user) loadAll();
});

function loadAll() { loadCategories(); loadProducts(); }
function abrirSucesso() { document.getElementById('success-modal').classList.add('open'); }

// LOGIN
document.getElementById('btn-login').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    try { await signInWithEmailAndPassword(auth, email, pass); } catch (e) { alert("Erro"); }
});
document.getElementById('btn-logout').addEventListener('click', () => signOut(auth));

// MODAL EXCLUIR
window.abrirModal = (id, colecao) => { idParaApagar = id; colecaoAtual = colecao; document.getElementById('confirm-modal').classList.add('open'); };
document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
    await deleteDoc(doc(db, colecaoAtual, idParaApagar));
    document.getElementById('confirm-modal').classList.remove('open');
    loadAll();
});

// LÓGICA CATEGORIAS
async function loadCategories() {
    const list = document.getElementById('admin-category-list');
    const select = document.getElementById('prod-cat');
    list.innerHTML = ''; select.innerHTML = '<option value="">Escolha...</option>';
    const snap = await getDocs(collection(db, "categorias"));
    snap.forEach(d => {
        const cat = d.data();
        list.innerHTML += `<div class="product-item"><span>${cat.nome}</span><div class="item-actions"><button class="btn-action btn-edit" onclick="window.startEditCat('${d.id}','${cat.nome}')">Editar</button><button class="btn-action btn-del" onclick="window.abrirModal('${d.id}','categorias')">X</button></div></div>`;
        select.innerHTML += `<option value="${cat.nome}">${cat.nome}</option>`;
    });
}
document.getElementById('btn-add-category').addEventListener('click', async () => {
    await addDoc(collection(db, "categorias"), { nome: document.getElementById('cat-nome').value });
    document.getElementById('cat-nome').value = ''; loadCategories(); abrirSucesso();
});
window.startEditCat = (id, nome) => { document.getElementById('form-add-cat').style.display='none'; document.getElementById('form-edit-cat').style.display='block'; document.getElementById('edit-cat-id').value=id; document.getElementById('edit-cat-nome').value=nome; };
window.cancelEditCat = () => { document.getElementById('form-add-cat').style.display='block'; document.getElementById('form-edit-cat').style.display='none'; };
document.getElementById('btn-save-cat').addEventListener('click', async () => {
    await setDoc(doc(db, "categorias", document.getElementById('edit-cat-id').value), { nome: document.getElementById('edit-cat-nome').value }, { merge: true });
    window.cancelEditCat(); loadCategories();
});

// LÓGICA PRODUTOS
async function loadProducts() {
    const list = document.getElementById('admin-product-list');
    list.innerHTML = '';
    const snap = await getDocs(collection(db, "produtos"));
    snap.forEach(d => {
        const p = d.data();
        list.innerHTML += `<div class="product-item"><span>${p.nome}</span><div class="item-actions"><button class="btn-action btn-edit" onclick="window.startEditProd('${d.id}')">Editar</button><button class="btn-action btn-del" onclick="window.abrirModal('${d.id}','produtos')">X</button></div></div>`;
    });
}
document.getElementById('btn-add-product').addEventListener('click', async () => {
    const p = { nome: document.getElementById('prod-nome').value, categoria: document.getElementById('prod-cat').value, preco: parseFloat(document.getElementById('prod-preco').value), img: document.getElementById('prod-img').value, desc: document.getElementById('prod-desc').value };
    await addDoc(collection(db, "produtos"), p);
    loadProducts(); abrirSucesso();
});

window.startEditProd = async (id) => {
    const snap = await getDocs(collection(db, "produtos"));
    const p = snap.docs.find(d => d.id === id).data();
    document.getElementById('form-add-prod').style.display='none';
    document.getElementById('form-edit-prod').style.display='block';
    document.getElementById('edit-prod-id').value = id;
    document.getElementById('edit-prod-nome').value = p.nome;
    document.getElementById('edit-prod-preco').value = p.preco;
    document.getElementById('edit-prod-img').value = p.img;
    document.getElementById('edit-prod-desc').value = p.desc;
};
window.cancelEditProd = () => { document.getElementById('form-add-prod').style.display='block'; document.getElementById('form-edit-prod').style.display='none'; };
document.getElementById('btn-save-prod').addEventListener('click', async () => {
    const id = document.getElementById('edit-prod-id').value;
    const p = { nome: document.getElementById('edit-prod-nome').value, preco: parseFloat(document.getElementById('edit-prod-preco').value), img: document.getElementById('edit-prod-img').value, desc: document.getElementById('edit-prod-desc').value };
    await setDoc(doc(db, "produtos", id), p, { merge: true });
    window.cancelEditProd(); loadProducts(); abrirSucesso();
});
