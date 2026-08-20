(() => {
  "use strict";

  const STORAGE_KEY = "lutful-store-cart";

  const products = [
    {
      id: "p1",
      nama: "Headphone Bluetooth",
      kategori: "Elektronik",
      harga: 299000,
      deskripsi: "Headphone nirkabel dengan bass dalam, baterai tahan lama, dan cocok untuk musik harian maupun rapat online.",
      emoji: "🎧",
      stok: 12
    },
    {
      id: "p2",
      nama: "Sepatu Sneakers Casual",
      kategori: "Fashion",
      harga: 450000,
      deskripsi: "Sneakers nyaman untuk aktivitas harian. Desain kasual, ringan, dan mudah dipadukan dengan berbagai outfit.",
      emoji: "👟",
      stok: 8
    },
    {
      id: "p3",
      nama: "Kopi Arabika 250g",
      kategori: "Makanan",
      harga: 85000,
      deskripsi: "Biji kopi arabika pilihan dengan aroma fruity dan aftertaste lembut. Cocok untuk manual brew maupun espresso.",
      emoji: "☕",
      stok: 25
    },
    {
      id: "p4",
      nama: "Jam Tangan Digital",
      kategori: "Aksesori",
      harga: 199000,
      deskripsi: "Jam tangan digital sporty dengan tampilan jelas, tahan percikan air, dan cocok untuk gaya kasual.",
      emoji: "⌚",
      stok: 15
    },
    {
      id: "p5",
      nama: "Tas Ransel Laptop",
      kategori: "Fashion",
      harga: 325000,
      deskripsi: "Ransel multifungsi dengan kompartemen laptop hingga 15 inci, bahan tahan air ringan, dan tali bahu empuk.",
      emoji: "🎒",
      stok: 10
    },
    {
      id: "p6",
      nama: "Bola Basket Ukuran 7",
      kategori: "Olahraga",
      harga: 150000,
      deskripsi: "Bola basket grip kuat untuk latihan indoor maupun outdoor. Ukuran standar 7 untuk pemain dewasa.",
      emoji: "🏀",
      stok: 18
    },
    {
      id: "p7",
      nama: "Mouse Wireless Ergonomis",
      kategori: "Elektronik",
      harga: 175000,
      deskripsi: "Mouse nirkabel nyaman digenggam, responsif, dan hemat baterai. Ideal untuk kerja maupun belajar.",
      emoji: "🖱️",
      stok: 0
    },
    {
      id: "p8",
      nama: "Botol Minum Olahraga 1L",
      kategori: "Olahraga",
      harga: 65000,
      deskripsi: "Botol minum 1 liter bebas BPA, mudah dibawa, dan cocok untuk gym, lari, maupun aktivitas outdoor.",
      emoji: "🧴",
      stok: 30
    },
    {
      id: "p9",
      nama: "Kemeja Flanel Premium",
      kategori: "Fashion",
      harga: 189000,
      deskripsi: "Kemeja flanel adem dengan potongan modern. Nyaman dipakai harian dan cocok untuk gaya kasual.",
      emoji: "👕",
      stok: 6
    },
    {
      id: "p10",
      nama: "Snack Granola Mix",
      kategori: "Makanan",
      harga: 45000,
      deskripsi: "Camilan granola renyah dengan kacang dan kismis. Praktis dibawa sebagai bekal sehat.",
      emoji: "🥣",
      stok: 40
    }
  ];

  const state = {
    cart: [],
    searchQuery: "",
    activeCategory: "Semua",
    sortBy: "default",
    activeModal: null,
    detailProductId: null
  };

  const els = {
    productGrid: document.getElementById("productGrid"),
    emptyState: document.getElementById("emptyState"),
    searchForm: document.getElementById("searchForm"),
    searchInput: document.getElementById("searchInput"),
    categoryList: document.getElementById("categoryList"),
    sortSelect: document.getElementById("sortSelect"),
    cartToggle: document.getElementById("cartToggle"),
    cartBadge: document.getElementById("cartBadge"),
    cartDrawer: document.getElementById("cartDrawer"),
    cartClose: document.getElementById("cartClose"),
    cartList: document.getElementById("cartList"),
    cartEmpty: document.getElementById("cartEmpty"),
    cartItemCount: document.getElementById("cartItemCount"),
    cartSubtotal: document.getElementById("cartSubtotal"),
    checkoutButton: document.getElementById("checkoutButton"),
    overlay: document.getElementById("overlay"),
    toast: document.getElementById("toast"),
    productModal: document.getElementById("productModal"),
    productModalClose: document.getElementById("productModalClose"),
    productDetail: document.getElementById("productDetail"),
    checkoutModal: document.getElementById("checkoutModal"),
    checkoutModalClose: document.getElementById("checkoutModalClose"),
    checkoutFormView: document.getElementById("checkoutFormView"),
    checkoutSuccessView: document.getElementById("checkoutSuccessView"),
    checkoutItems: document.getElementById("checkoutItems"),
    checkoutTotal: document.getElementById("checkoutTotal"),
    checkoutForm: document.getElementById("checkoutForm"),
    checkoutError: document.getElementById("checkoutError"),
    buyerName: document.getElementById("buyerName"),
    buyerPhone: document.getElementById("buyerPhone"),
    buyerAddress: document.getElementById("buyerAddress"),
    checkoutSuccessClose: document.getElementById("checkoutSuccessClose"),
    checkoutSuccessMessage: document.getElementById("checkoutSuccessMessage")
  };

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  let toastTimer = null;

  function formatRupiah(value) {
    return currencyFormatter.format(Number(value) || 0);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getProductById(id) {
    return products.find((product) => product.id === id) || null;
  }

  function getCartItemCount() {
    return state.cart.reduce((total, item) => total + item.qty, 0);
  }

  function getCartSubtotal() {
    return state.cart.reduce((total, item) => {
      const product = getProductById(item.id);
      if (!product) return total;
      return total + product.harga * item.qty;
    }, 0);
  }

  function showToast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.hidden = false;
    els.toast.classList.add("show");

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      els.toast.classList.remove("show");
      els.toast.hidden = true;
    }, 2200);
  }

  function saveCart() {
    try {
      const payload = state.cart.map((item) => ({
        id: item.id,
        qty: item.qty
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn("Gagal menyimpan keranjang:", error);
    }
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        state.cart = [];
        return;
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        state.cart = [];
        return;
      }

      const cleaned = [];

      parsed.forEach((entry) => {
        if (!entry || typeof entry !== "object") return;

        const id = typeof entry.id === "string" ? entry.id : "";
        const qty = Number(entry.qty);
        const product = getProductById(id);

        if (!product || !Number.isFinite(qty) || qty <= 0) return;

        const safeQty = Math.min(Math.floor(qty), product.stok);
        if (safeQty <= 0) return;

        const existing = cleaned.find((item) => item.id === id);
        if (existing) {
          existing.qty = Math.min(existing.qty + safeQty, product.stok);
        } else {
          cleaned.push({ id, qty: safeQty });
        }
      });

      state.cart = cleaned;
      saveCart();
    } catch (error) {
      console.warn("Data keranjang rusak, direset:", error);
      state.cart = [];
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (removeError) {
        console.warn(removeError);
      }
    }
  }

  function filterProducts() {
    const query = state.searchQuery.trim().toLowerCase();

    let list = products.filter((product) => {
      const matchCategory =
        state.activeCategory === "Semua" ||
        product.kategori.toLowerCase() === state.activeCategory.toLowerCase();

      const matchSearch =
        !query || product.nama.toLowerCase().includes(query);

      return matchCategory && matchSearch;
    });

    switch (state.sortBy) {
      case "price-asc":
        list = [...list].sort((a, b) => a.harga - b.harga);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.harga - a.harga);
        break;
      case "name-asc":
        list = [...list].sort((a, b) => a.nama.localeCompare(b.nama, "id"));
        break;
      default:
        break;
    }

    return list;
  }

  function renderProducts() {
    const list = filterProducts();
    els.productGrid.innerHTML = "";

    if (list.length === 0) {
      els.emptyState.hidden = false;
      return;
    }

    els.emptyState.hidden = true;

    const fragment = document.createDocumentFragment();

    list.forEach((product) => {
      const isOut = product.stok <= 0;
      const card = document.createElement("article");
      card.className = "product-card";
      card.dataset.productId = product.id;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute(
        "aria-label",
        `Lihat detail ${product.nama}, harga ${formatRupiah(product.harga)}`
      );

      card.innerHTML = `
        <div class="product-image" aria-hidden="true">${product.emoji}</div>
        <div class="product-body">
          <span class="product-category">${escapeHtml(product.kategori)}</span>
          <h3 class="product-name">${escapeHtml(product.nama)}</h3>
          <p class="product-price">${formatRupiah(product.harga)}</p>
          <p class="product-stock ${isOut ? "is-out" : ""}">
            ${isOut ? "Stok Habis" : `Stok: ${product.stok}`}
          </p>
          <button
            class="buy-button"
            type="button"
            data-action="add-to-cart"
            data-id="${escapeHtml(product.id)}"
            ${isOut ? "disabled" : ""}
            aria-label="${isOut ? `${escapeHtml(product.nama)} stok habis` : `Tambah ${escapeHtml(product.nama)} ke keranjang`}"
          >
            ${isOut ? "Stok Habis" : "Tambah ke Keranjang"}
          </button>
        </div>
      `;

      fragment.appendChild(card);
    });

    els.productGrid.appendChild(fragment);
  }

  function renderCart() {
    const count = getCartItemCount();
    const subtotal = getCartSubtotal();

    if (count > 0) {
      els.cartBadge.hidden = false;
      els.cartBadge.textContent = String(count);
    } else {
      els.cartBadge.hidden = true;
      els.cartBadge.textContent = "0";
    }

    els.cartItemCount.textContent = `${count} item`;
    els.cartSubtotal.textContent = formatRupiah(subtotal);
    els.checkoutButton.disabled = count === 0;

    els.cartList.innerHTML = "";

    if (state.cart.length === 0) {
      els.cartEmpty.hidden = false;
      return;
    }

    els.cartEmpty.hidden = true;

    const fragment = document.createDocumentFragment();

    state.cart.forEach((item) => {
      const product = getProductById(item.id);
      if (!product) return;

      const subtotalItem = product.harga * item.qty;
      const atMax = item.qty >= product.stok;

      const li = document.createElement("li");
      li.className = "cart-item";
      li.dataset.id = product.id;

      li.innerHTML = `
        <div class="cart-item-emoji" aria-hidden="true">${product.emoji}</div>
        <div class="cart-item-info">
          <h3 class="cart-item-name">${escapeHtml(product.nama)}</h3>
          <p class="cart-item-price">${formatRupiah(product.harga)} / pcs</p>
          <p class="cart-item-subtotal">Subtotal: ${formatRupiah(subtotalItem)}</p>
          <p class="cart-item-stock">Stok: ${product.stok}</p>
          <div class="qty-controls">
            <button
              class="qty-button"
              type="button"
              data-action="decrease"
              data-id="${escapeHtml(product.id)}"
              aria-label="Kurangi jumlah ${escapeHtml(product.nama)}"
            >−</button>
            <span class="qty-value" aria-label="Jumlah ${escapeHtml(product.nama)}">${item.qty}</span>
            <button
              class="qty-button"
              type="button"
              data-action="increase"
              data-id="${escapeHtml(product.id)}"
              aria-label="Tambah jumlah ${escapeHtml(product.nama)}"
              ${atMax ? "disabled" : ""}
            >+</button>
            <button
              class="remove-button"
              type="button"
              data-action="remove"
              data-id="${escapeHtml(product.id)}"
              aria-label="Hapus ${escapeHtml(product.nama)} dari keranjang"
            >Hapus</button>
          </div>
        </div>
      `;

      fragment.appendChild(li);
    });

    els.cartList.appendChild(fragment);
  }

  function openOverlay() {
    els.overlay.hidden = false;
    document.body.classList.add("no-scroll");
  }

  function closeOverlayIfIdle() {
    if (!state.activeModal) {
      els.overlay.hidden = true;
      document.body.classList.remove("no-scroll");
    }
  }

  function openCart() {
    if (state.activeModal === "product") {
      closeProductDetail();
    }
    if (state.activeModal === "checkout") {
      closeCheckout();
    }

    state.activeModal = "cart";
    els.cartDrawer.hidden = false;
    openOverlay();
    els.cartClose.focus();
  }

  function closeCart() {
    if (state.activeModal === "cart") {
      state.activeModal = null;
    }
    els.cartDrawer.hidden = true;
    closeOverlayIfIdle();
  }

  function openProductDetail(productId) {
    const product = getProductById(productId);
    if (!product) return;

    if (state.activeModal === "cart") {
      closeCart();
    }
    if (state.activeModal === "checkout") {
      closeCheckout();
    }

    state.detailProductId = product.id;
    state.activeModal = "product";

    const isOut = product.stok <= 0;

    els.productDetail.innerHTML = `
      <div class="detail-image" aria-hidden="true">${product.emoji}</div>
      <div class="detail-body">
        <span class="product-category">${escapeHtml(product.kategori)}</span>
        <h2 id="productModalTitle" class="detail-name">${escapeHtml(product.nama)}</h2>
        <p class="detail-price">${formatRupiah(product.harga)}</p>
        <p class="detail-stock ${isOut ? "is-out" : ""}">
          ${isOut ? "Stok Habis" : `Stok tersedia: ${product.stok}`}
        </p>
        <p class="detail-description">${escapeHtml(product.deskripsi)}</p>
        <button
          class="primary-button"
          type="button"
          data-action="add-to-cart-detail"
          data-id="${escapeHtml(product.id)}"
          ${isOut ? "disabled" : ""}
        >
          ${isOut ? "Stok Habis" : "Tambah ke Keranjang"}
        </button>
      </div>
    `;

    els.productModal.hidden = false;
    openOverlay();
    els.productModalClose.focus();
  }

  function closeProductDetail() {
    if (state.activeModal === "product") {
      state.activeModal = null;
    }
    state.detailProductId = null;
    els.productModal.hidden = true;
    els.productDetail.innerHTML = "";
    closeOverlayIfIdle();
  }

  function openCheckout() {
    if (state.cart.length === 0) {
      showToast("Keranjang masih kosong.");
      return;
    }

    closeCart();

    state.activeModal = "checkout";
    els.checkoutFormView.hidden = false;
    els.checkoutSuccessView.hidden = true;
    els.checkoutError.hidden = true;
    els.checkoutError.textContent = "";
    els.checkoutForm.reset();

    els.checkoutItems.innerHTML = "";

    state.cart.forEach((item) => {
      const product = getProductById(item.id);
      if (!product) return;

      const li = document.createElement("li");
      li.className = "checkout-item";
      li.innerHTML = `
        <span class="checkout-item-name">${product.emoji} ${escapeHtml(product.nama)} × ${item.qty}</span>
        <span class="checkout-item-price">${formatRupiah(product.harga * item.qty)}</span>
      `;
      els.checkoutItems.appendChild(li);
    });

    els.checkoutTotal.textContent = formatRupiah(getCartSubtotal());
    els.checkoutModal.hidden = false;
    openOverlay();
    els.buyerName.focus();
  }

  function closeCheckout() {
    if (state.activeModal === "checkout") {
      state.activeModal = null;
    }
    els.checkoutModal.hidden = true;
    els.checkoutError.hidden = true;
    closeOverlayIfIdle();
  }

  function closeAllOverlays() {
    closeCart();
    closeProductDetail();
    closeCheckout();
  }

  function addToCart(productId, amount = 1) {
    const product = getProductById(productId);
    if (!product) return;

    if (product.stok <= 0) {
      showToast("Produk ini stoknya habis.");
      return;
    }

    const existing = state.cart.find((item) => item.id === productId);
    const currentQty = existing ? existing.qty : 0;
    const nextQty = currentQty + amount;

    if (nextQty > product.stok) {
      showToast(`Stok ${product.nama} hanya ${product.stok}.`);
      if (existing) {
        existing.qty = product.stok;
        saveCart();
        renderCart();
      }
      return;
    }

    if (existing) {
      existing.qty = nextQty;
    } else {
      state.cart.push({ id: productId, qty: amount });
    }

    saveCart();
    renderCart();
    showToast(`${product.nama} ditambahkan ke keranjang.`);
  }

  function updateQuantity(productId, nextQty) {
    const product = getProductById(productId);
    if (!product) return;

    const item = state.cart.find((entry) => entry.id === productId);
    if (!item) return;

    if (nextQty <= 0) {
      removeFromCart(productId, { silent: true });
      showToast(`${product.nama} dihapus dari keranjang.`);
      return;
    }

    if (nextQty > product.stok) {
      item.qty = product.stok;
      saveCart();
      renderCart();
      showToast(`Maksimal stok ${product.nama} adalah ${product.stok}.`);
      return;
    }

    item.qty = nextQty;
    saveCart();
    renderCart();
  }

  function removeFromCart(productId, options = {}) {
    const { silent = false } = options;
    state.cart = state.cart.filter((item) => item.id !== productId);
    saveCart();
    renderCart();
    if (!silent) {
      showToast("Produk dihapus dari keranjang.");
    }
  }

  function checkout(event) {
    event.preventDefault();

    if (state.cart.length === 0) {
      showToast("Keranjang masih kosong.");
      closeCheckout();
      return;
    }

    const name = els.buyerName.value.trim();
    const phone = els.buyerPhone.value.trim();
    const address = els.buyerAddress.value.trim();

    if (!name || !phone || !address) {
      els.checkoutError.hidden = false;
      els.checkoutError.textContent = "Semua field wajib diisi: nama, nomor HP, dan alamat.";
      if (!name) {
        els.buyerName.focus();
      } else if (!phone) {
        els.buyerPhone.focus();
      } else {
        els.buyerAddress.focus();
      }
      return;
    }

    const total = formatRupiah(getCartSubtotal());
    const itemCount = getCartItemCount();

    state.cart = [];
    saveCart();
    renderCart();

    els.checkoutFormView.hidden = true;
    els.checkoutSuccessView.hidden = false;
    els.checkoutSuccessMessage.textContent =
      `Terima kasih, ${name}! ${itemCount} item senilai ${total} berhasil dipesan (simulasi).`;
    els.checkoutSuccessClose.focus();
  }

  function bindEvents() {
    els.searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      state.searchQuery = els.searchInput.value;
      renderProducts();
    });

    els.searchInput.addEventListener("input", () => {
      state.searchQuery = els.searchInput.value;
      renderProducts();
    });

    els.categoryList.addEventListener("click", (event) => {
      const button = event.target.closest(".category-chip");
      if (!button) return;

      const category = button.dataset.category || "Semua";
      state.activeCategory = category;

      els.categoryList.querySelectorAll(".category-chip").forEach((chip) => {
        const isActive = chip === button;
        chip.classList.toggle("active", isActive);
        chip.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      renderProducts();
    });

    els.sortSelect.addEventListener("change", () => {
      state.sortBy = els.sortSelect.value;
      renderProducts();
    });

    els.productGrid.addEventListener("click", (event) => {
      const addButton = event.target.closest('[data-action="add-to-cart"]');
      if (addButton) {
        event.preventDefault();
        event.stopPropagation();
        if (!addButton.disabled) {
          addToCart(addButton.dataset.id);
        }
        return;
      }

      const card = event.target.closest(".product-card");
      if (card) {
        openProductDetail(card.dataset.productId);
      }
    });

    els.productGrid.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest(".product-card");
      if (!card || event.target.closest("button")) return;
      event.preventDefault();
      openProductDetail(card.dataset.productId);
    });

    els.cartToggle.addEventListener("click", () => {
      if (els.cartDrawer.hidden) {
        openCart();
      } else {
        closeCart();
      }
    });

    els.cartClose.addEventListener("click", closeCart);

    els.cartList.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;

      const { action, id } = button.dataset;
      const item = state.cart.find((entry) => entry.id === id);
      if (!item && action !== "remove") return;

      if (action === "increase") {
        updateQuantity(id, item.qty + 1);
      } else if (action === "decrease") {
        updateQuantity(id, item.qty - 1);
      } else if (action === "remove") {
        removeFromCart(id);
      }
    });

    els.checkoutButton.addEventListener("click", openCheckout);

    els.productModalClose.addEventListener("click", closeProductDetail);

    els.productDetail.addEventListener("click", (event) => {
      const button = event.target.closest('[data-action="add-to-cart-detail"]');
      if (!button || button.disabled) return;
      addToCart(button.dataset.id);
    });

    els.productModal.addEventListener("click", (event) => {
      if (event.target === els.productModal) {
        closeProductDetail();
      }
    });

    els.checkoutModalClose.addEventListener("click", closeCheckout);
    els.checkoutSuccessClose.addEventListener("click", closeCheckout);
    els.checkoutForm.addEventListener("submit", checkout);

    els.checkoutModal.addEventListener("click", (event) => {
      if (event.target === els.checkoutModal) {
        closeCheckout();
      }
    });

    els.overlay.addEventListener("click", () => {
      closeAllOverlays();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeAllOverlays();
      }
    });
  }

  function init() {
    const required = [
      "productGrid",
      "emptyState",
      "searchForm",
      "searchInput",
      "categoryList",
      "sortSelect",
      "cartToggle",
      "cartBadge",
      "cartDrawer",
      "cartClose",
      "cartList",
      "cartEmpty",
      "cartItemCount",
      "cartSubtotal",
      "checkoutButton",
      "overlay",
      "toast",
      "productModal",
      "productModalClose",
      "productDetail",
      "checkoutModal",
      "checkoutModalClose",
      "checkoutFormView",
      "checkoutSuccessView",
      "checkoutItems",
      "checkoutTotal",
      "checkoutForm",
      "checkoutError",
      "buyerName",
      "buyerPhone",
      "buyerAddress",
      "checkoutSuccessClose",
      "checkoutSuccessMessage"
    ];

    const missing = required.filter((key) => !els[key]);
    if (missing.length > 0) {
      console.error("Elemen DOM tidak ditemukan:", missing.join(", "));
      return;
    }

    loadCart();
    bindEvents();
    renderProducts();
    renderCart();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
