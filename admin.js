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

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard-screen').style.display = 'block';
        loadAll();
    } else {
        document.getElementById('login-screen').style.display = 'block';
        document.getElementById('dashboard-screen').style.display = 'none';
    }
});

function loadAll() { loadGlobalConfig(); loadCategories(); loadProducts(); }

// LOGIN / LOGOUT
document.getElementById('btn-login').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    try { await signInWithEmailAndPassword(auth, email, pass); } 
    catch (e) { document.getElementById('login-error').style.display = 'block'; }
});
document.getElementById('btn-logout').addEventListener('click', () => signOut(auth));

// CONFIG
async function loadGlobalConfig() {
    const snap = await getDoc(doc(db, "configuracoes", "loja"));
    if (snap.exists()) document.getElementById('global-discount').value = snap.data().descontoGlobal || 0;
}
document.getElementById('btn-save-config').addEventListener('click', async () => {
    await setDoc(doc(db, "configuracoes", "loja"), { descontoGlobal: parseInt(document.getElementById('global-discount').value) || 0 });
    alert("Salvo!");
});

// CATEGORIAS
async function loadCategories() {
    const list = document.getElementById('admin-category-list');
    const select = document.getElementById('prod-cat');
    list.innerHTML = ''; select.innerHTML = '';
    const snap = await getDocs(collection(db, "categorias"));
    snap.forEach(d => {
        list.innerHTML += `<div class="product-item"><span>${d.data().nome}</span><button class="btn-delete" onclick="window.delCat('${d.id}')">X</button></div>`;
        select.innerHTML += `<option value="${d.data().nome}">${d.data().nome}</option>`;
    });
}
window.delCat = async (id) => { if(confirm("Apagar?")) { await deleteDoc(doc(db, "categorias", id)); loadCategories(); } };
document.getElementById('btn-add-category').addEventListener('click', async () => {
    await addDoc(collection(db, "categorias"), { nome: document.getElementById('cat-nome').value });
    document.getElementById('cat-nome').value = ''; loadCategories();
});

// PRODUTOS
async function loadProducts() {
    const list = document.getElementById('admin-product-list');
    list.innerHTML = '';
    const snap = await getDocs(collection(db, "produtos"));
    snap.forEach(d => {
        const p = d.data();
        list.innerHTML += `<div class="product-item"><div><img src="${p.img}"> <b>${p.nome}</b></div><button class="btn-delete" onclick="window.delProd('${d.id}')">Apagar</button></div>`;
    });
}
window.delProd = async (id) => { if(confirm("Apagar?")) { await deleteDoc(doc(db, "produtos", id)); loadProducts(); } };
document.getElementById('btn-add-product').addEventListener('click', async () => {
    const p = {
        nome: document.getElementById('prod-nome').value,
        preco: parseFloat(document.getElementById('prod-preco').value),
        img: document.getElementById('prod-img').value,
        desc: document.getElementById('prod-desc').value,
        categoria: document.getElementById('prod-cat').value
    };
    await addDoc(collection(db, "produtos"), p);
    alert("Adicionado!"); loadProducts();
});
