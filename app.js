import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC1-7TW2qAIyClAvvN54LyY7ubiXV9ajw0",
    authDomain: "soraka-constella.firebaseapp.com",
    projectId: "soraka-constella",
    storageBucket: "soraka-constella.firebasestorage.app",
    messagingSenderId: "593569822773",
    appId: "1:593569822773:web:5d44d9cd41518b7f59597c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const cart = {};
const phone = "5511953425657";
let produtosNaMemoria = [];
let categoriaAtual = 'Todos';

async function init() {
    const catMenu = document.getElementById('category-filter');
    catMenu.innerHTML = `<button class="cat-btn active" onclick="window.filterCategory('Todos')">Todos</button>`;
    const catSnap = await getDocs(collection(db, "categorias"));
    catSnap.forEach(d => {
        catMenu.innerHTML += `<button class="cat-btn" onclick="window.filterCategory('${d.data().nome}')">${d.data().nome}</button>`;
    });

    const prodSnap = await getDocs(collection(db, "produtos"));
    produtosNaMemoria = prodSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderProducts();
}

window.filterCategory = (nome) => {
    categoriaAtual = nome;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.innerText === nome));
    renderProducts();
};

function renderProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = '';
    const filtrados = categoriaAtual === 'Todos' ? produtosNaMemoria : produtosNaMemoria.filter(p => p.categoria === categoriaAtual);

    filtrados.forEach(prod => {
        const itemInCart = cart[prod.id];
        const precoFormatado = prod.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        let botaoHTML = '';
        if(prod.esgotado) {
            botaoHTML = `<button class="add-btn" disabled style="background:#bbb; cursor:not-allowed;">Esgotado</button>`;
        } else {
            botaoHTML = `
                <button class="add-btn" style="display:${itemInCart ? 'none' : 'block'}" onclick="window.addToCart('${prod.id}')">Adicionar</button>
                <div class="qty-controls" style="display:${itemInCart ? 'flex' : 'none'}">
                    <button class="qty-btn" onclick="window.updateQty('${prod.id}', -1)">-</button>
                    <span style="font-weight:800">${itemInCart ? itemInCart.qty : 0}</span>
                    <button class="qty-btn" onclick="window.updateQty('${prod.id}', 1)">+</button>
                </div>`;
        }

        list.innerHTML += `
            <div class="product-card ${prod.esgotado ? 'esgotado-card' : ''}">
                <img src="${prod.img}" class="product-img" onerror="this.src='https://via.placeholder.com/100?text=Doce'">
                <div class="product-info-wrapper">
                    <div class="product-header-row">
                        <div class="product-title">${prod.nome}</div>
                        <div class="product-price">${precoFormatado}</div>
                    </div>
                    <div class="product-desc">${prod.desc}</div>
                    ${botaoHTML}
                </div>
            </div>`;
    });
}

window.addToCart = (id) => {
    const p = produtosNaMemoria.find(x => x.id === id);
    cart[id] = { nome: p.nome, preco: p.preco, qty: 1 };
    renderProducts();
    updateCartUI();
};

window.updateQty = (id, n) => {
    cart[id].qty += n;
    if(cart[id].qty <= 0) delete cart[id];
    renderProducts();
    updateCartUI();
};

function updateCartUI() {
    let total = 0; 
    let texto = "Olá Beatriz! Gostaria de fazer um pedido na Soraka Constella:\n\n";
    Object.values(cart).forEach(i => {
        total += i.preco * i.qty;
        texto += `▪️ ${i.qty}x ${i.nome} - ${(i.preco * i.qty).toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}\n`;
    });

    const bar = document.getElementById('cart-bar');
    if(total > 0) {
        bar.classList.add('visible');
        document.getElementById('total-price').innerText = total.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
        const notas = document.getElementById('order-notes').value;
        if(notas) texto += `\n*Observações:* ${notas}`;
        texto += `\n\n*Total: ${total.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}*`;
        document.getElementById('checkout-btn').href = `https://wa.me/${phone}?text=${encodeURIComponent(texto)}`;
    } else {
        bar.classList.remove('visible');
    }
}
window.addEventListener('DOMContentLoaded', init);
