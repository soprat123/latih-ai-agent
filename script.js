(() => {
  "use strict";

  const STORAGE_KEY = "lutful-store-cart";
  const WISHLIST_KEY = "lutful-store-wishlist";
  const THEME_KEY = "lutful-store-theme";

  const SHIPPING_OPTIONS = {
    hemat: { label: "Hemat (5-7 hari)", cost: 9000 },
    reguler: { label: "Reguler (2-4 hari)", cost: 15000 },
    kilat: { label: "Kilat (1 hari)", cost: 30000 }
  };

  const DEFAULT_SHIPPING = "reguler";

  const products = [
    {
      id: "p1",
      nama: "Headphone Bluetooth",
      kategori: "Elektronik",
      harga: 299000,
      rating: 4.7,
      terjual: 128,
      deskripsi: "Headphone nirkabel dengan bass dalam, baterai tahan lama, dan cocok untuk musik harian maupun rapat online.",
      emoji: "🎧",
      stok: 12
    },
    {
      id: "p2",
      nama: "Sepatu Sneakers Casual",
      kategori: "Fashion",
      harga: 450000,
      rating: 4.5,
      terjual: 86,
      deskripsi: "Sneakers nyaman untuk aktivitas harian. Desain kasual, ringan, dan mudah dipadukan dengan berbagai outfit.",
      emoji: "👟",
      stok: 8
    },
    {
      id: "p3",
      nama: "Kopi Arabika 250g",
      kategori: "Makanan",
      harga: 85000,
      rating: 4.8,
      terjual: 342,
      deskripsi: "Biji kopi arabika pilihan dengan aroma fruity dan aftertaste lembut. Cocok untuk manual brew maupun espresso.",
      emoji: "☕",
      stok: 25
    },
    {
      id: "p4",
      nama: "Jam Tangan Digital",
      kategori: "Aksesori",
      harga: 199000,
      rating: 4.3,
      terjual: 64,
      deskripsi: "Jam tangan digital sporty dengan tampilan jelas, tahan percikan air, dan cocok untuk gaya kasual.",
      emoji: "⌚",
      stok: 15
    },
    {
      id: "p5",
      nama: "Tas Ransel Laptop",
      kategori: "Fashion",
      harga: 325000,
      rating: 4.6,
      terjual: 155,
      deskripsi: "Ransel multifungsi dengan kompartemen laptop hingga 15 inci, bahan tahan air ringan, dan tali bahu empuk.",
      emoji: "🎒",
      stok: 10
    },
    {
      id: "p6",
      nama: "Bola Basket Ukuran 7",
      kategori: "Olahraga",
      harga: 150000,
      rating: 4.4,
      terjual: 47,
      deskripsi: "Bola basket grip kuat untuk latihan indoor maupun outdoor. Ukuran standar 7 untuk pemain dewasa.",
      emoji: "🏀",
      stok: 18
    },
    {
      id: "p7",
      nama: "Mouse Wireless Ergonomis",
      kategori: "Elektronik",
      harga: 175000,
      rating: 4.2,
      terjual: 210,
      deskripsi: "Mouse nirkabel nyaman digenggam, responsif, dan hemat baterai. Ideal untuk kerja maupun belajar.",
      emoji: "🖱️",
      stok: 0
    },
    {
      id: "p8",
      nama: "Botol Minum Olahraga 1L",
      kategori: "Olahraga",
      harga: 65000,
      rating: 4.1,
      terjual: 98,
      deskripsi: "Botol minum 1 liter bebas BPA, mudah dibawa, dan cocok untuk gym, lari, maupun aktivitas outdoor.",
      emoji: "🧴",
      stok: 30
    },
    {
      id: "p9",
      nama: "Kemeja Flanel Premium",
      kategori: "Fashion",
      harga: 189000,
      rating: 4.5,
      terjual: 73,
      deskripsi: "Kemeja flanel adem dengan potongan modern. Nyaman dipakai harian dan cocok untuk gaya kasual.",
      emoji: "👕",
      stok: 6
    },
    {
      id: "p10",
      nama: "Snack Granola Mix",
      kategori: "Makanan",
      harga: 45000,
      rating: 4.9,
      terjual: 411,
      deskripsi: "Camilan granola renyah dengan kacang dan kismis. Praktis dibawa sebagai bekal sehat.",
      emoji: "🥣",
      stok: 40
    },
    {
      id: "p11",
      nama: "Keyboard Mekanik TKL",
      kategori: "Elektronik",
      harga: 520000,
      rating: 4.7,
      terjual: 59,
      deskripsi: "Keyboard mekanik tenkeyless dengan switch taktil, hot-swap, dan backlight putih hemat daya.",
      emoji: "⌨️",
      stok: 9
    },
    {
      id: "p12",
      nama: "Topi Baseball Katun",
      kategori: "Aksesori",
      harga: 79000,
      rating: 4.0,
      terjual: 132,
      deskripsi: "Topi baseball bahan katun adem dengan strap belakang yang bisa disesuaikan ukuran kepala.",
      emoji: "🧢",
      stok: 22
    }
  ];

  const state = {
    cart: [],
    wishlist: [],
    searchQuery: "",
    activeCategory: "Semua",
    sortBy: "default",
    onlyWishlist: false,
    activeModal: null,
    detailProductId: null,
    shipping: DEFAULT_SHIPPING,
    theme: "dark"
  };

  const els = {
    themeToggle: document.getElementById("themeToggle"),
    themeToggleIcon: document.getElementById("themeToggleIcon"),
    themeToggleText: document.getElementById("themeToggleText"),
    wishlistToggle: document.getElementById("wishlistToggle"),
    wishlistBadge: document.getElementById("wishlistBadge"),
    productGrid: document.getElementById("productGrid"),
    emptyState: document.getElementById("emptyState"),
    productSectionTitle: document.getElementById("productSectionTitle"),
    resultInfo: document.getElementById("resultInfo"),
    searchForm: document.getElementById("searchForm"),
    searchInput: document.getElementById("searchInput"),
    searchClear: document.getElementById("searchClear"),
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
    clearCartButton: document.getElementById("clearCartButton"),
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
    checkoutSubtotal: document.getElementById("checkoutSubtotal"),
    checkoutShippingCost: document.getElementById("checkoutShippingCost"),
    checkoutTotal: document.getElementById("checkoutTotal"),
    checkoutForm: document.getElementById("checkoutForm"),
    checkoutError: document.getElementById("checkoutError"),
    buyerName: document.getElementById("buyerName"),
    buyerPhone: document.getElementById("buyerPhone"),
    buyerAddress: document.getElementById("buyerAddress"),
    shippingSelect: document.getElementById("shippingSelect"),
    buyerNote: document.getElementById("buyerNote"),
    checkoutSuccessClose: document.getElementById("checkoutSuccessClose"),
    checkoutSuccessMessage: document.getElementById("checkoutSuccessMessage"),
    checkoutOrderCode: document.getElementById("checkoutOrderCode")
  };

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  let toastTimer = null;
  let lastFocusedElement = null;

  /* ===== Util ===== */

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

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn("localStorage tidak bisa dibaca:", error);
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("localStorage tidak bisa ditulis:", error);
    }
  }

  function removeStorage(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("localStorage tidak bisa dihapus:", error);
    }
  }

  function renderStars(rating) {
    const value = Number(rating) || 0;
    const full = Math.round(value);
    let stars = "";
    for (let i = 1; i <= 5; i += 1) {
      stars += i <= full ? "★" : "☆";
    }
    return stars;
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

  /* ===== Tema ===== */

  function applyTheme(theme) {
    const nextTheme = theme === "light" ? "light" : "dark";
    state.theme = nextTheme;
    document.documentElement.setAttribute("data-theme", nextTheme);

    const isLight = nextTheme === "light";
    els.themeToggleIcon.textContent = isLight ? "☀️" : "🌙";
    els.themeToggleText.textContent = isLight ? "Terang" : "Gelap";
    els.themeToggle.setAttribute("aria-pressed", isLight ? "true" : "false");
    els.themeToggle.setAttribute(
      "aria-label",
      isLight ? "Aktifkan tema gelap" : "Aktifkan tema terang"
    );
  }

  function loadTheme() {
    const saved = readStorage(THEME_KEY);
    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
      return;
    }

    const prefersLight =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: light)").matches;

    applyTheme(prefersLight ? "light" : "dark");
  }

  function toggleTheme() {
    const next = state.theme === "light" ? "dark" : "light";
    applyTheme(next);
    writeStorage(THEME_KEY, next);
  }

  /* ===== Penyimpanan keranjang & favorit ===== */

  function saveCart() {
    const payload = state.cart.map((item) => ({ id: item.id, qty: item.qty }));
    writeStorage(STORAGE_KEY, JSON.stringify(payload));
  }

  function loadCart() {
    const raw = readStorage(STORAGE_KEY);
    if (!raw) {
      state.cart = [];
      return;
    }

    try {
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
      removeStorage(STORAGE_KEY);
    }
  }

  function saveWishlist() {
    writeStorage(WISHLIST_KEY, JSON.stringify(state.wishlist));
  }

  function loadWishlist() {
    const raw = readStorage(WISHLIST_KEY);
    if (!raw) {
      state.wishlist = [];
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        state.wishlist = [];
        return;
      }

      state.wishlist = parsed.filter(
        (id, index) =>
          typeof id === "string" &&
          getProductById(id) &&
          parsed.indexOf(id) === index
      );
      saveWishlist();
    } catch (error) {
      console.warn("Data favorit rusak, direset:", error);
      state.wishlist = [];
      removeStorage(WISHLIST_KEY);
    }
  }

  function isWishlisted(productId) {
    return state.wishlist.includes(productId);
  }

  function toggleWishlist(productId) {
    const product = getProductById(productId);
    if (!product) return;

    if (isWishlisted(productId)) {
      state.wishlist = state.wishlist.filter((id) => id !== productId);
      showToast(`${product.nama} dihapus dari favorit.`);
    } else {
      state.wishlist.push(productId);
      showToast(`${product.nama} ditambahkan ke favorit.`);
    }

    saveWishlist();
    renderWishlistState();
    renderProducts();

    if (state.activeModal === "product" && state.detailProductId === productId) {
      openProductDetail(productId, { keepFocus: true });
    }
  }

  /* ===== Hitungan ===== */

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

  function getShippingCost() {
    const option = SHIPPING_OPTIONS[state.shipping] || SHIPPING_OPTIONS[DEFAULT_SHIPPING];
    return option.cost;
  }

  function getShippingLabel() {
    const option = SHIPPING_OPTIONS[state.shipping] || SHIPPING_OPTIONS[DEFAULT_SHIPPING];
    return option.label;
  }

  function getGrandTotal() {
    return getCartSubtotal() + getShippingCost();
  }

  function createOrderCode() {
    const now = new Date();
    const datePart = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("");
    const randomPart = String(Math.floor(Math.random() * 9000) + 1000);
    return `LS-${datePart}-${randomPart}`;
  }

  /* ===== Filter & sort ===== */

  function filterProducts() {
    const query = state.searchQuery.trim().toLowerCase();

    let list = products.filter((product) => {
      const matchCategory =
        state.activeCategory === "Semua" ||
        product.kategori.toLowerCase() === state.activeCategory.toLowerCase();

      const matchSearch =
        !query ||
        product.nama.toLowerCase().includes(query) ||
        product.kategori.toLowerCase().includes(query) ||
        product.deskripsi.toLowerCase().includes(query);

      const matchWishlist = !state.onlyWishlist || isWishlisted(product.id);

      return matchCategory && matchSearch && matchWishlist;
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
      case "rating-desc":
        list = [...list].sort((a, b) => b.rating - a.rating || b.terjual - a.terjual);
        break;
      default:
        break;
    }

    return list;
  }

  /* ===== Render ===== */

  function renderResultInfo(total) {
    const parts = [`${total} produk ditampilkan`];

    if (state.activeCategory !== "Semua") {
      parts.push(`kategori ${state.activeCategory}`);
    }
    if (state.searchQuery.trim()) {
      parts.push(`pencarian "${state.searchQuery.trim()}"`);
    }
    if (state.onlyWishlist) {
      parts.push("hanya favorit");
    }

    els.resultInfo.textContent = parts.join(" • ");
    els.productSectionTitle.textContent = state.onlyWishlist
      ? "Produk Favorit"
      : "Produk Pilihan";
  }

  function renderProducts() {
    const list = filterProducts();
    els.productGrid.innerHTML = "";

    renderResultInfo(list.length);

    if (list.length === 0) {
      els.emptyState.hidden = false;
      els.emptyState.textContent = state.onlyWishlist
        ? "Belum ada produk favorit yang cocok dengan filter ini."
        : "Produk tidak ditemukan";
      return;
    }

    els.emptyState.hidden = true;

    const fragment = document.createDocumentFragment();

    list.forEach((product) => {
      const isOut = product.stok <= 0;
      const isLow = !isOut && product.stok <= 8;
      const liked = isWishlisted(product.id);

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
        <div class="product-media">
          <div class="product-image" aria-hidden="true">${product.emoji}</div>
          <button
            class="wishlist-button ${liked ? "is-active" : ""}"
            type="button"
            data-action="toggle-wishlist"
            data-id="${escapeHtml(product.id)}"
            aria-pressed="${liked ? "true" : "false"}"
            aria-label="${liked ? `Hapus ${escapeHtml(product.nama)} dari favorit` : `Simpan ${escapeHtml(product.nama)} ke favorit`}"
          >${liked ? "❤️" : "🤍"}</button>
          ${isOut ? '<span class="product-flag is-out">Habis</span>' : ""}
          ${isLow ? `<span class="product-flag is-low">Sisa ${product.stok}</span>` : ""}
        </div>
        <div class="product-body">
          <span class="product-category">${escapeHtml(product.kategori)}</span>
          <h3 class="product-name">${escapeHtml(product.nama)}</h3>
          <p class="product-rating">
            <span class="stars" aria-hidden="true">${renderStars(product.rating)}</span>
            <span class="rating-value">${product.rating.toFixed(1)}</span>
            <span class="rating-sold">· ${product.terjual} terjual</span>
          </p>
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

  function renderWishlistState() {
    const count = state.wishlist.length;

    if (count > 0) {
      els.wishlistBadge.hidden = false;
      els.wishlistBadge.textContent = String(count);
    } else {
      els.wishlistBadge.hidden = true;
      els.wishlistBadge.textContent = "0";
    }

    els.wishlistToggle.classList.toggle("is-active", state.onlyWishlist);
    els.wishlistToggle.setAttribute("aria-pressed", state.onlyWishlist ? "true" : "false");
    els.wishlistToggle.setAttribute(
      "aria-label",
      state.onlyWishlist
        ? "Tampilkan semua produk"
        : "Tampilkan hanya produk favorit"
    );
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
    els.clearCartButton.disabled = count === 0;

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

  function renderCheckoutSummary() {
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

    els.checkoutSubtotal.textContent = formatRupiah(getCartSubtotal());
    els.checkoutShippingCost.textContent = formatRupiah(getShippingCost());
    els.checkoutTotal.textContent = formatRupiah(getGrandTotal());
  }

  /* ===== Overlay / drawer / modal ===== */

  function openOverlay() {
    els.overlay.hidden = false;
    document.body.classList.add("no-scroll");
  }

  function closeOverlayIfIdle() {
    if (!state.activeModal) {
      els.overlay.hidden = true;
      document.body.classList.remove("no-scroll");
      if (lastFocusedElement && document.contains(lastFocusedElement)) {
        lastFocusedElement.focus();
      }
      lastFocusedElement = null;
    }
  }

  function rememberFocus() {
    if (!state.activeModal) {
      lastFocusedElement = document.activeElement;
    }
  }

  function openCart() {
    rememberFocus();
    if (state.activeModal === "product") closeProductDetail();
    if (state.activeModal === "checkout") closeCheckout();

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

  function openProductDetail(productId, options = {}) {
    const { keepFocus = false } = options;
    const product = getProductById(productId);
    if (!product) return;

    if (!keepFocus) rememberFocus();
    if (state.activeModal === "cart") closeCart();
    if (state.activeModal === "checkout") closeCheckout();

    state.detailProductId = product.id;
    state.activeModal = "product";

    const isOut = product.stok <= 0;
    const liked = isWishlisted(product.id);

    els.productDetail.innerHTML = `
      <div class="detail-image" aria-hidden="true">${product.emoji}</div>
      <div class="detail-body">
        <span class="product-category">${escapeHtml(product.kategori)}</span>
        <h2 id="productModalTitle" class="detail-name">${escapeHtml(product.nama)}</h2>
        <p class="product-rating">
          <span class="stars" aria-hidden="true">${renderStars(product.rating)}</span>
          <span class="rating-value">${product.rating.toFixed(1)}</span>
          <span class="rating-sold">· ${product.terjual} terjual</span>
        </p>
        <p class="detail-price">${formatRupiah(product.harga)}</p>
        <p class="detail-stock ${isOut ? "is-out" : ""}">
          ${isOut ? "Stok Habis" : `Stok tersedia: ${product.stok}`}
        </p>
        <p class="detail-description">${escapeHtml(product.deskripsi)}</p>
        <div class="detail-actions">
          <button
            class="primary-button"
            type="button"
            data-action="add-to-cart-detail"
            data-id="${escapeHtml(product.id)}"
            ${isOut ? "disabled" : ""}
          >
            ${isOut ? "Stok Habis" : "Tambah ke Keranjang"}
          </button>
          <button
            class="ghost-button ${liked ? "is-active" : ""}"
            type="button"
            data-action="toggle-wishlist"
            data-id="${escapeHtml(product.id)}"
            aria-pressed="${liked ? "true" : "false"}"
          >
            ${liked ? "❤️ Favorit" : "🤍 Favoritkan"}
          </button>
        </div>
      </div>
    `;

    els.productModal.hidden = false;
    openOverlay();
    if (!keepFocus) {
      els.productModalClose.focus();
    }
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

    const previousFocus = lastFocusedElement;
    closeCart();
    lastFocusedElement = previousFocus || els.cartToggle;

    state.activeModal = "checkout";
    els.checkoutFormView.hidden = false;
    els.checkoutSuccessView.hidden = true;
    els.checkoutError.hidden = true;
    els.checkoutError.textContent = "";
    els.checkoutForm.reset();
    els.shippingSelect.value = state.shipping;

    renderCheckoutSummary();

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

  /* ===== Aksi keranjang ===== */

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

  function clearCart() {
    if (state.cart.length === 0) {
      showToast("Keranjang sudah kosong.");
      return;
    }
    state.cart = [];
    saveCart();
    renderCart();
    showToast("Keranjang dikosongkan.");
  }

  function isValidPhone(value) {
    const digits = value.replace(/[\s-]/g, "");
    return /^(\+62|62|0)[0-9]{8,13}$/.test(digits);
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
    const note = els.buyerNote.value.trim();

    function fail(message, field) {
      els.checkoutError.hidden = false;
      els.checkoutError.textContent = message;
      if (field) field.focus();
    }

    if (!name || !phone || !address) {
      if (!name) return fail("Nama pembeli wajib diisi.", els.buyerName);
      if (!phone) return fail("Nomor HP wajib diisi.", els.buyerPhone);
      return fail("Alamat pengiriman wajib diisi.", els.buyerAddress);
    }

    if (name.length < 3) {
      return fail("Nama pembeli minimal 3 karakter.", els.buyerName);
    }

    if (!isValidPhone(phone)) {
      return fail("Nomor HP tidak valid. Contoh: 081234567890.", els.buyerPhone);
    }

    if (address.length < 10) {
      return fail("Alamat terlalu singkat, minimal 10 karakter.", els.buyerAddress);
    }

    const total = formatRupiah(getGrandTotal());
    const itemCount = getCartItemCount();
    const shippingLabel = getShippingLabel();
    const orderCode = createOrderCode();

    state.cart = [];
    saveCart();
    renderCart();

    els.checkoutError.hidden = true;
    els.checkoutFormView.hidden = true;
    els.checkoutSuccessView.hidden = false;
    els.checkoutSuccessMessage.textContent =
      `Terima kasih, ${name}! ${itemCount} item senilai ${total} akan dikirim via ${shippingLabel} (simulasi).` +
      (note ? ` Catatan: ${note}` : "");
    els.checkoutOrderCode.textContent = `Kode pesanan: ${orderCode}`;
    els.checkoutSuccessClose.focus();
  }

  /* ===== Event ===== */

  function syncSearchClear() {
    els.searchClear.hidden = els.searchInput.value.length === 0;
  }

  function bindEvents() {
    els.themeToggle.addEventListener("click", toggleTheme);

    els.wishlistToggle.addEventListener("click", () => {
      state.onlyWishlist = !state.onlyWishlist;
      if (state.onlyWishlist && state.wishlist.length === 0) {
        state.onlyWishlist = false;
        showToast("Belum ada produk favorit.");
      }
      renderWishlistState();
      renderProducts();
    });

    els.searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      state.searchQuery = els.searchInput.value;
      syncSearchClear();
      renderProducts();
    });

    els.searchInput.addEventListener("input", () => {
      state.searchQuery = els.searchInput.value;
      syncSearchClear();
      renderProducts();
    });

    els.searchClear.addEventListener("click", () => {
      els.searchInput.value = "";
      state.searchQuery = "";
      syncSearchClear();
      renderProducts();
      els.searchInput.focus();
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
      const wishButton = event.target.closest('[data-action="toggle-wishlist"]');
      if (wishButton) {
        event.preventDefault();
        event.stopPropagation();
        toggleWishlist(wishButton.dataset.id);
        return;
      }

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
    els.clearCartButton.addEventListener("click", clearCart);

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
      const wishButton = event.target.closest('[data-action="toggle-wishlist"]');
      if (wishButton) {
        toggleWishlist(wishButton.dataset.id);
        return;
      }

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

    els.shippingSelect.addEventListener("change", () => {
      const value = els.shippingSelect.value;
      state.shipping = SHIPPING_OPTIONS[value] ? value : DEFAULT_SHIPPING;
      renderCheckoutSummary();
    });

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
    const required = Object.keys(els);
    const missing = required.filter((key) => !els[key]);

    if (missing.length > 0) {
      console.error("Elemen DOM tidak ditemukan:", missing.join(", "));
      return;
    }

    loadTheme();
    loadCart();
    loadWishlist();
    bindEvents();
    syncSearchClear();
    renderWishlistState();
    renderProducts();
    renderCart();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
