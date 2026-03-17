import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// !!! COLOQUE SUAS CREDENCIAIS AQUI !!!
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const cart = {};
const phone = "5511953425657";
let isMagicActive = false;
let bunnyClicks = 0;
let clickTimer;
let descontoGlobal = 0;

let produtosNaMemoria = []; 
let categoriaAtual = 'Todos';

async function initStore() {
    // Carrega Desconto
    const docSnap = await getDoc(doc(db, "configuracoes", "loja"));
    if (docSnap.exists()) descontoGlobal = docSnap.data().descontoGlobal || 0;

    // Carrega Categorias
    const catMenu = document.getElementById('category-filter');
    catMenu.innerHTML = `<button class="cat-btn active" onclick="window.filterCategory('Todos')">Todos</button>`;
    
    const catSnap = await getDocs(collection(db, "categorias"));
    catSnap.forEach((doc) => {
        const nome = doc.data().nome;
        catMenu.innerHTML += `<button class="cat-btn" onclick="window.filterCategory('${nome}')">${nome}</button>`;
    });

    // Carrega Produtos
    const prodSnap = await getDocs(collection(db, "produtos"));
    prodSnap.forEach((doc) => {
        produtosNaMemoria.push({ id: doc.id, ...doc.data() });
    });

    renderProducts();
}

window.filterCategory = (nomeCat) => {
    categoriaAtual = nomeCat;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText === nomeCat) btn.classList.add('active');
    });
    renderProducts();
};

function renderProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = '';

    const produtosFiltrados = categoriaAtual === 'Todos' 
        ? produtosNaMemoria 
        : produtosNaMemoria.filter(p => p.categoria === categoriaAtual);

    if(produtosFiltrados.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding: 20px;">Nenhum produto cadastrado.</p>';
        return;
    }

    produtosFiltrados.forEach((prod, index) => {
        const delay = `delay-${(index % 5) + 2}`; 
        
        const inCart = cart[prod.id];
        const btnDisplay = inCart ? 'none' : 'block';
        const ctrlDisplay = inCart ? 'flex' : 'none';
        const qty = inCart ? inCart.qty : 1;

        list.innerHTML += `
            <div class="product-card stagger-item ${delay}" data-id="${prod.id}" data-name="${prod.nome}" data-price="${prod.preco}">
                <img src="${prod.img}" alt="${prod.nome}" class="product-img">
                <div class="product-info">
                    <div class="product-header">
                        <div class="product-title">${prod.nome}</div>
                        <div class="product-price">R$${prod.preco.toFixed(2)}</div>
                    </div>
                    <div class="product-desc">${prod.desc}</div>
                    <button class="add-btn" style="display:${btnDisplay}" onclick="window.addToCart('${prod.id}')">Adicionar</button>
                    <div class="qty-controls" style="display:${ctrlDisplay}" id="controls-${prod.id}">
                        <button class="qty-btn" onclick="window.updateQty('${prod.id}', -1)">-</button>
                        <span class="qty-display" id="qty-${prod.id}">${qty}</span>
                        <button class="qty-btn" onclick="window.updateQty('${prod.id}', 1)">+</button>
                    </div>
                </div>
            </div>
        `;
    });
}

window.addToCart = (id) => {
    const card = document.querySelector(`.product-card[data-id="${id}"]`);
    cart[id] = { name: card.dataset.name, price: parseFloat(card.dataset.price), qty: 1 };
    
    card.querySelector('.add-btn').style.display = 'none';
    card.querySelector('.qty-controls').style.display = 'flex';
    window.updateCartUI();
};

window.updateQty = (id, change) => {
    if (!cart[id]) return;
    cart[id].qty += change;

    if (cart[id].qty <= 0) {
        delete cart[id];
        const card = document.querySelector(`.product-card[data-id="${id}"]`);
        if(card) {
            card.querySelector('.qty-controls').style.display = 'none';
            card.querySelector('.add-btn').style.display = 'block';
        }
    } else {
        const display = document.getElementById(`qty-${id}`);
        if(display) display.innerText = cart[id].qty;
    }
    window.updateCartUI();
};

window.updateCartUI = () => {
    let subtotal = 0; let totalItems = 0;
    let orderText = "Olá Beatriz! Gostaria de fazer o seguinte pedido na Soraka Constella:\n\n";

    for (const id in cart) {
        const item = cart[id];
        subtotal += item.price * item.qty;
        totalItems += item.qty;
        orderText += `▪️ ${item.qty}x ${item.name} - R$ ${(item.price * item.qty).toFixed(2)}\n`;
    }

    let total = subtotal;
    if(descontoGlobal > 0 && totalItems > 0) {
        const valorDesconto = subtotal * (descontoGlobal / 100);
        total = subtotal - valorDesconto;
        orderText += `\n🎁 *Desconto da Loja (${descontoGlobal}%):* - R$ ${valorDesconto.toFixed(2)}`;
    }

    const notes = document.getElementById('order-notes') ? document.getElementById('order-notes').value.trim() : "";
    if (notes !== "") { orderText += `\n*Observações:* ${notes}\n`; }

    orderText += `\n*Total a pagar: R$ ${total.toFixed(2)}*`;

    const cartBar = document.getElementById('cart-bar');
    if(!cartBar) return;

    if (totalItems > 0) {
        cartBar.classList.add('visible');
        document.getElementById('total-price').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
        document.getElementById('checkout-btn').href = `https://wa.me/${phone}?text=${encodeURIComponent(orderText)}`;
    } else {
        cartBar.classList.remove('visible');
    }
};

window.triggerEasterEgg = () => {
    if (isMagicActive) return; 
    bunnyClicks++;
    clearTimeout(clickTimer);
    if (bunnyClicks === 5) {
        isMagicActive = true; document.body.classList.add('theme-magic');
        const toast = document.getElementById('toast');
        toast.innerText = "✨ Você descobriu o tema da Constelação!";
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3500);
    } else {
        clickTimer = setTimeout(() => { bunnyClicks = 0; }, 1000);
    }
};

window.addEventListener('DOMContentLoaded', initStore);
