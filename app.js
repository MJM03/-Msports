const WHATSAPP_NUMBER = "51999999999"; // Reemplaza por el número real, solo dígitos.

const products = [
  {id:1,name:"Polo Dry Fit Essential",category:"Polos",price:49.90,emoji:"👕",tag:"NUEVO"},
  {id:2,name:"Short Training Core",category:"Shorts",price:44.90,emoji:"🩳",tag:"TOP"},
  {id:3,name:"Conjunto Active Black",category:"Conjuntos",price:109.90,emoji:"🥋",tag:"OFERTA"},
  {id:4,name:"Casaca Sport Urban",category:"Casacas",price:99.90,emoji:"🧥",tag:"NUEVO"},
  {id:5,name:"Polo Oversize Performance",category:"Polos",price:54.90,emoji:"👕",tag:""},
  {id:6,name:"Short Running Flex",category:"Shorts",price:39.90,emoji:"🩳",tag:""},
  {id:7,name:"Conjunto Motion Grey",category:"Conjuntos",price:119.90,emoji:"🥋",tag:"TOP"},
  {id:8,name:"Gorra Msports Classic",category:"Accesorios",price:34.90,emoji:"🧢",tag:""}
];

let currentCategory = "Todos";
let searchTerm = "";
let cart = [];

const grid = document.getElementById("productsGrid");
const empty = document.getElementById("emptyState");
const filters = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartWhatsapp = document.getElementById("cartWhatsapp");

function money(value){ return `S/ ${value.toFixed(2)}`; }

function renderProducts(){
  const visible = products.filter(p => {
    const categoryOk = currentCategory === "Todos" || p.category === currentCategory;
    const searchOk = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryOk && searchOk;
  });

  grid.innerHTML = visible.map(p => `
    <article class="product-card">
      <div class="product-image">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
        <span>${p.emoji}</span>
      </div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="product-meta">
          <span class="price">${money(p.price)}</span>
          <button class="add-btn" data-id="${p.id}" aria-label="Agregar ${p.name}">+</button>
        </div>
      </div>
    </article>
  `).join("");

  empty.classList.toggle("hidden", visible.length > 0);
}

function updateCart(){
  cartCount.textContent = cart.length;
  cartItems.innerHTML = cart.length
    ? cart.map((p,i)=>`<div class="cart-row"><div><strong>${p.name}</strong><br><small>${money(p.price)}</small></div><button class="remove-btn" data-index="${i}">✕</button></div>`).join("")
    : "<p style='color:#888'>Aún no agregaste productos.</p>";

  const total = cart.reduce((sum,p)=>sum+p.price,0);
  cartTotal.textContent = money(total);

  const message = cart.length
    ? `Hola Msports, quiero consultar por estos productos:\n${cart.map(p=>`- ${p.name} (${money(p.price)})`).join("\n")}\nTotal referencial: ${money(total)}`
    : "Hola Msports, quiero información sobre su catálogo.";
  cartWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

filters.addEventListener("click", e=>{
  if(!e.target.classList.contains("filter")) return;
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
  e.target.classList.add("active");
  currentCategory = e.target.dataset.category;
  renderProducts();
});

searchInput.addEventListener("input", e=>{
  searchTerm = e.target.value;
  renderProducts();
});

grid.addEventListener("click", e=>{
  const btn = e.target.closest(".add-btn");
  if(!btn) return;
  const product = products.find(p=>p.id===Number(btn.dataset.id));
  cart.push(product);
  updateCart();
  openCart();
});

cartItems.addEventListener("click", e=>{
  const btn = e.target.closest(".remove-btn");
  if(!btn) return;
  cart.splice(Number(btn.dataset.index),1);
  updateCart();
});

function openCart(){
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
  cartDrawer.setAttribute("aria-hidden","false");
}
function closeCart(){
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
  cartDrawer.setAttribute("aria-hidden","true");
}

document.getElementById("cartButton").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);

document.getElementById("whatsappMain").href =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Msports, quiero información sobre su catálogo.")}`;

renderProducts();
updateCart();
