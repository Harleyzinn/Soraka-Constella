import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Suas credenciais oficiais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC1-7TW2qAIyClAvvN54LyY7ubiXV9ajw0",
  authDomain: "soraka-constella.firebaseapp.com",
  projectId: "soraka-constella",
  storageBucket: "soraka-constella.firebasestorage.app",
  messagingSenderId: "593569822773",
  appId: "1:593569822773:web:5d44d9cd41518b7f59597c",
  measurementId: "G-57JW68RKZL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const produtosColRef = collection(db, "produtos");
const categoriasColRef = collection(db, "categorias");

onAuthStateChanged(auth, (user) => {
    if (user) {
        loginScreen.style.display = 'none';
        dashboardScreen.style.display = 'block';
        loadGlobalConfig();
        loadCategories();
        loadProducts();
    } else {
        loginScreen.style.display = 'block';
        dashboardScreen.style.display = 'none';
    }
});

document.getElementById('btn-login').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error');
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        errorMsg.style.display = 'none';
    } catch (error) { errorMsg.style.display = 'block'; }
});

document.getElementById('btn-logout').addEventListener('click', () => { signOut(auth); });

const configDocRef = doc(db, "configuracoes", "loja");
async function loadGlobalConfig() {
    const docSnap = await getDoc(configDocRef);
    if (docSnap.exists()) document.getElementById('global-discount').value = docSnap.data().descontoGlobal || 0;
}

document.getElementById('btn-save-config').addEventListener('click', async () => {
    const desconto = parseInt(document.getElementById('global-discount').value) || 0;
    try {
        await setDoc(configDocRef, { descontoGlobal: desconto }, { merge: true });
        alert("Configurações atualizadas!");
    } catch (error) { alert("Erro ao salvar."); }
});

document.getElementById('btn-add-category').addEventListener('click', async () => {
    const nome = document.getElementById('cat-nome').value.trim();
    if(!nome) return alert("Digite um nome!");
    try {
        await addDoc(categoriasColRef, { nome: nome });
        document.getElementById('cat-nome').value = '';
        loadCategories();
    } catch (e) { alert("Erro ao criar categoria."); }
});

async function loadCategories() {
    const listDiv = document.getElementById('admin-category-list');
    const select = document.getElementById('prod-cat');
    listDiv.innerHTML = '';
    select.innerHTML = '<option value="">Selecione uma categoria...</option>';

    const querySnapshot = await getDocs(categoriasColRef);
    querySnapshot.forEach((doc) => {
        const cat = doc.data();
        listDiv.innerHTML += `
            <div class="product-item">
                <span style="font-weight:bold;">${cat.nome}</span>
                <button class="btn-delete" onclick="window.deleteCategory('${doc.id}')">Apagar</button>
            </div>
        `;
        select.innerHTML += `<option value="${cat.nome}">${cat.nome}</option>`;
    });
}

window.deleteCategory = async (id) => {
    if(confirm("Apagar esta categoria?")) {
        await deleteDoc(doc(db, "categorias", id));
        loadCategories();
    }
};

document.getElementById('btn-add-product').addEventListener('click', async () => {
    const nome = document.getElementById('prod-nome').value;
    const preco = parseFloat(document.getElementById('prod-preco').value);
    const img = document.getElementById('prod-img').value;
    const desc = document.getElementById('prod-desc').value;
    const cat = document.getElementById('prod-cat').value;

    if(!nome || !preco || !img || !desc || !cat) return alert("Preencha todos os campos!");

    try {
        await addDoc(produtosColRef, { nome, preco, img, desc, categoria: cat, ativo: true });
        alert("Produto adicionado!");
        
        document.getElementById('prod-nome').value = '';
        document.getElementById('prod-preco').value = '';
        document.getElementById('prod-img').value = '';
        document.getElementById('prod-desc').value = '';
        
        loadProducts(); 
    } catch (e) { alert("Erro ao adicionar produto."); }
});

async function loadProducts() {
    const listDiv = document.getElementById('admin-product-list');
    listDiv.innerHTML = '<p style="text-align:center; font-weight:bold;">Carregando...</p>';
    
    try {
        const querySnapshot = await getDocs(produtosColRef);
        listDiv.innerHTML = '';
        if(querySnapshot.empty) return listDiv.innerHTML = '<p style="font-weight:bold;">Nenhum produto cadastrado.</p>';

        querySnapshot.forEach((doc) => {
            const prod = doc.data();
            listDiv.innerHTML += `
                <div class="product-item">
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <img src="${prod.img}" alt="${prod.nome}">
                        <div>
                            <strong>${prod.nome}</strong> (${prod.categoria})<br>
                            R$ ${prod.preco.toFixed(2)}
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn-delete" onclick="window.deleteProduct('${doc.id}')">Apagar</button>
                    </div>
                </div>
            `;
        });
    } catch (e) { console.error("Erro", e); }
}

window.deleteProduct = async (id) => {
    if(confirm("Apagar este produto?")) {
        await deleteDoc(doc(db, "produtos", id));
        loadProducts();
    }
};
