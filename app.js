const cart = {};
const phone = "5511953425657"; 
let bunnyClicks = 0;
let clickTimer;
let isMagicActive = false;

// 1. Função para renderizar os produtos na tela automaticamente
function renderProducts() {
    const productList = document.getElementById('product-list');
    if(!productList) return; // Evita erro se o script rodar na página de privacidade

    productList.innerHTML = ''; // Limpa o container

    produtosData.forEach((produto, index) => {
        // Calcula o delay da animação para criar o efeito de cascata
        const delayClass = `delay-${(index % 5) + 2}`; 

        const cardHTML = `
            <div class="product-card stagger-item ${delayClass}" data-id="${produto.id}" data-name="${produto.nome}" data-price="${produto.preco}">
                <img src="${produto.img}" alt="${produto.nome}" class="product-img">
                <div class="product-info">
                    <div class="product-header">
                        <div class="product-title">${produto.nome}</div>
                        <div class="product-price">R$${produto.preco}</div>
                    </div>
                    <div class="product-desc">${produto.desc}</div>
                    <button class="add-btn" onclick="addToCart('${produto.id}')">Adicionar</button>
                    <div class="qty-controls" id="controls-${produto.id}">
                        <button class="qty-btn" onclick="updateQty('${produto.id}', -1)">-</button>
                        <span class="qty-display" id="qty-${produto.id}">1</span>
                        <button class="qty-btn" onclick="updateQty('${produto.id}', 1)">+</button>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += cardHTML;
    });
}

// 2. Funções do Carrinho
function addToCart(id) {
    const card = document.querySelector(`.product-card[data-id="${id}"]`);
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);

    cart[id] = { name, price, qty: 1 };
    card.querySelector('.add-btn').style.display = 'none';
    card.querySelector('.qty-controls').classList.add('active');
    updateCartUI();
}

function updateQty(id, change) {
    if (!cart[id]) return;
    cart[id].qty += change;

    if (cart[id].qty <= 0) {
        delete cart[id];
        const card = document.querySelector(`.product-card[data-id="${id}"]`);
        card.querySelector('.qty-controls').classList.remove('active');
        card.querySelector('.add-btn').style.display = 'block';
    } else {
        document.getElementById(`qty-${id}`).innerText = cart[id].qty;
    }
    updateCartUI();
}

function updateCartUI() {
    let total = 0;
    let totalItems = 0;
    let orderText = "Olá! Gostaria de fazer o seguinte pedido na Soraka Constella:\n\n";

    for (const id in cart) {
        const item = cart[id];
        const subtotal = item.price * item.qty;
        total += subtotal;
        totalItems += item.qty;
        orderText += `▪️ ${item.qty}x ${item.name} - R$ ${subtotal.toFixed(2)}\n`;
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
        if(document.getElementById('order-notes')) document.getElementById('order-notes').value = "";
    }
}

// 3. Funções do Easter Egg e UI
function showToast(message) {
    const toast = document.getElementById('toast');
    if(!toast) return;
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

function triggerEasterEgg() {
    if (isMagicActive) return; 
    bunnyClicks++;
    clearTimeout(clickTimer);
    if (bunnyClicks === 5) {
        isMagicActive = true;
        document.body.classList.add('theme-magic');
        showToast("✨ Você descobriu o tema da Constelação!");
    } else {
        clickTimer = setTimeout(() => { bunnyClicks = 0; }, 1000);
    }
}

// Inicializa a renderização quando a página carrega
window.onload = renderProducts;
