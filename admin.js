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

let idApagar = ""; let colApagar = "";

onAuthStateChanged(auth, u => {
    document.getElementById('login-screen').style.display = u ? 'none' : 'block';
    document.getElementById('dashboard-screen').style.display = u ? 'block' : 'none';
    if(u) {
        loadAll();
        loadFooterConfig();
    }
});

function loadAll() { loadCats(); loadProds(); }
function showSuccess() { document.getElementById('success-modal').classList.add('open'); }

document.getElementById('btn-login').onclick = () => {
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-password').value;
    
    signInWithEmailAndPassword(auth, email, senha)
        .catch(erro => {
            console.error(erro);
            if (erro.code === 'auth/invalid-credential' || erro.code === 'auth/user-not-found' || erro.code === 'auth/wrong-password') {
                alert("E-mail ou senha incorretos!");
            } else if (erro.code === 'auth/invalid-email') {
                alert("Formato de e-mail inválido!");
            } else {
                alert("Erro ao logar: " + erro.message);
            }
        });
};

document.getElementById('btn-logout').onclick = () => signOut(auth);

// MODAL DELETE
window.askDel = (id, col) => { idApagar = id; colApagar = col; document.getElementById('confirm-modal').classList.add('open'); };
document.getElementById('confirm-del-btn').onclick = async () => {
    await deleteDoc(doc(db, colApagar, idApagar));
    document.getElementById('confirm-modal').classList.remove('open');
    loadAll();
};

// CATEGORIAS (DE VOLTA!)
async function loadCats() {
    const list = document.getElementById('list-categorias'); const sel = document.getElementById('p-cat');
    list.innerHTML = ''; sel.innerHTML = '<option value="">Escolha...</option>';
    const snap = await getDocs(collection(db, "categorias"));
    snap.forEach(d => {
        const c = d.data();
        list.innerHTML += `
            <div class="item-list-row">
                <span style="font-weight:800;">${c.nome}</span>
                <div class="item-actions">
                    <button class="btn-tool btn-edit" onclick="window.editCat('${d.id}','${c.nome}')">Editar</button>
                    <button class="btn-tool btn-del" onclick="window.askDel('${d.id}','categorias')">X</button>
                </div>
            </div>`;
        sel.innerHTML += `<option value="${c.nome}">${c.nome}</option>`;
    });
}
document.getElementById('btn-add-cat').onclick = async () => { await addDoc(collection(db, "categorias"), {nome: document.getElementById('cat-nome').value}); document.getElementById('cat-nome').value=''; loadCats(); showSuccess(); };
window.editCat = (id, n) => { document.getElementById('form-cat-add').style.display='none'; document.getElementById('form-cat-edit').style.display='block'; document.getElementById('edit-cat-id').value=id; document.getElementById('edit-cat-nome').value=n; };
window.cancelEditCat = () => { document.getElementById('form-cat-add').style.display='block'; document.getElementById('form-cat-edit').style.display='none'; };
document.getElementById('btn-save-cat').onclick = async () => { await setDoc(doc(db, "categorias", document.getElementById('edit-cat-id').value), {nome: document.getElementById('edit-cat-nome').value}); window.cancelEditCat(); loadCats(); showSuccess(); };

// PRODUTOS
async function loadProds() {
    const list = document.getElementById('list-produtos'); list.innerHTML = '';
    const snap = await getDocs(collection(db, "produtos"));
    snap.forEach(d => {
        const p = d.data();
        list.innerHTML += `
            <div class="item-list-row">
                <span style="font-weight:800;">${p.nome} ${p.esgotado ? '(🚫)' : ''}</span>
                <div class="item-actions">
                    <button class="btn-tool btn-edit" onclick="window.editProd('${d.id}')">Editar</button>
                    <button class="btn-tool btn-del" onclick="window.askDel('${d.id}','produtos')">X</button>
                </div>
            </div>`;
    });
}
document.getElementById('btn-save-prod').onclick = async () => {
    const id = document.getElementById('edit-prod-id').value;
    const p = { 
        nome: document.getElementById('p-nome').value, 
        categoria: document.getElementById('p-cat').value, 
        preco: parseFloat(document.getElementById('p-preco').value), 
        img: document.getElementById('p-img').value, 
        desc: document.getElementById('p-desc').value,
        esgotado: document.getElementById('p-esgotado').checked // NOVO
    };
    if(id) await setDoc(doc(db, "produtos", id), p); else await addDoc(collection(db, "produtos"), p);
    window.cancelEditProd(); loadProds(); showSuccess();
};
window.editProd = async (id) => {
    const snap = await getDocs(collection(db, "produtos"));
    const p = snap.docs.find(x => x.id === id).data();
    document.getElementById('edit-prod-id').value = id;
    document.getElementById('p-nome').value = p.nome;
    document.getElementById('p-cat').value = p.categoria;
    document.getElementById('p-preco').value = p.preco;
    document.getElementById('p-img').value = p.img;
    document.getElementById('p-desc').value = p.desc;
    document.getElementById('p-esgotado').checked = p.esgotado || false; // NOVO
    document.getElementById('btn-cancel-prod').style.display = 'block';
    window.scrollTo(0,0);
};
window.cancelEditProd = () => {
    document.getElementById('edit-prod-id').value = '';
    document.querySelectorAll('#form-prod-box input, #form-prod-box textarea').forEach(i => {
        if(i.type === 'checkbox') i.checked = false; else i.value = '';
    });
    document.getElementById('btn-cancel-prod').style.display = 'none';
};

// INFORMAÇÕES DO RODAPÉ (NOVO)
async function loadFooterConfig() {
    const snap = await getDocs(collection(db, "configuracoes"));
    if (!snap.empty) {
        const dados = snap.docs[0].data();
        document.getElementById('conf-pagamentos').value = dados.pagamentos || '';
        document.getElementById('conf-contato').value = dados.contato || '';
        document.getElementById('conf-chocolate').value = dados.chocolate || '';
        document.getElementById('conf-destaques').value = dados.destaques || '';
        window.footerConfigId = snap.docs[0].id;
    }
}

document.getElementById('btn-save-info').onclick = async () => {
    const info = {
        pagamentos: document.getElementById('conf-pagamentos').value,
        contato: document.getElementById('conf-contato').value,
        chocolate: document.getElementById('conf-chocolate').value,
        destaques: document.getElementById('conf-destaques').value
    };

    if (window.footerConfigId) {
        await setDoc(doc(db, "configuracoes", window.footerConfigId), info);
    } else {
        await addDoc(collection(db, "configuracoes"), info);
    }
    showSuccess();
    loadFooterConfig();
};