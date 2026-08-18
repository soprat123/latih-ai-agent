(function () {
  "use strict";

  /* ===== Data produk ===== */
  const PRODUCTS = [
    {
      id: 1,
      nama: "Smartphone X1",
      kategori: "elektronik",
      harga: 2500000,
      deskripsi: "Smartphone layar 6.5 inci dengan kamera 48MP, baterai 5000mAh, dan performa cepat untuk kebutuhan harian.",
      stok: 10,
      emoji: "\uD83D\uDCF1"
    },
    {
      id: 2,
      nama: "Headphone Pro",
      kategori: "elektronik",
      harga: 350000,
      deskripsi: "Headphone over-ear dengan noise cancelling, bass mantap, dan bantalan empuk untuk pemakaian lama.",
      stok: 15,
      emoji: "\uD83C\uDFA7"
    },
    {
      id: 3,
      nama: "Laptop Slim 14",
      kategori: "elektronik",
      harga: 7200000,
      deskripsi: "Laptop tipis 14 inci, RAM 8GB, SSD 512GB. Cocok untuk kerja, kuliah, dan hiburan.",
      stok: 5,
      emoji: "\uD83D\uDCBB"
    },
    {
      id: 4,
      nama: "Kaos Polos Premium",
      kategori: "fashion",
      harga: 75000,
      deskripsi: "Kaos katun combed 30s, adem dan nyaman dipakai. Tersedia berbagai warna netral.",
      stok: 30,
      emoji: "\uD83D\uDC55"
    },
    {
      id: 5,
      nama: "Sepatu Lari Runner",
      kategori: "olahraga",
      harga: 480000,
      deskripsi: "Sepatu lari ringan dengan sol empuk dan grip kuat. Nyaman untuk jogging harian.",
      stok: 12,
      emoji: "\uD83D\uDC5F"
    },
    {
      id: 6,
      nama: "Cokelat Premium",
      kategori: "makanan",
      harga: 45000,
      deskripsi: "Cokelat hitam 70% kakao, rasa pekat dan tidak terlalu manis. Kemasan 100 gram.",
      stok: 25,
      emoji: "\uD83C\uDF6B"
    },
    {
      id: 7,
      nama: "Kopi Arabika 250g",
      kategori: "makanan",
      harga: 68000,
      deskripsi: "Biji kopi arabika single origin, roasting medium. Aroma harum dengan rasa fruity.",
      stok: 20,
      emoji: "\u2615"
    },
    {
      id: 8,
      nama: "Jam Tangan Classic",
      kategori: "aksesori",
      harga: 320000,
      deskripsi: "Jam tangan analog tali kulit dengan desain klasik. Tahan percikan air.",
      stok: 8,
      emoji: "\u231A"
    },
    {
      id: 9,
      nama: "Tas Ransel Urban",
      kategori: "aksesori",
      harga: 210000,
      deskripsi: "Ransel 20L dengan slot laptop 15 inci, bahan anti air, dan banyak kompartemen.",
      stok: 0,
      emoji: "\uD83C\uDF92"
    },
    {
      id: 10,
      nama: "Matras Yoga",
      kategori: "olahraga",
      harga: 95000,
      deskripsi: "Matras yoga anti slip tebal 8mm, ringan dan mudah digulung. Termasuk tali pengikat.",
      stok: 18,
      emoji: "\uD83E\uDDD8"
    },
    {
      id: 11,
      nama: "Kemeja Flanel",
      kategori: "fashion",
      harga: 135000,
      deskripsi: "Kemeja flanel motif kotak, bahan lembut dan hangat. Cocok untuk gaya kasual.",
      stok: 14,
      emoji: "\uD83E\uDDE5"
    },
    {
      id: 12,
      nama: "Mouse Wireless",
      kategori: "elektronik",
      harga: 89000,
      deskripsi: "Mouse wireless 2.4GHz silent click, DPI bisa diatur, hemat baterai.",
      stok: 0,
      emoji: "\uD83D\uDDB1\uFE0F"
    }
  ];

  const STORAGE_KEY = "lutful-store-cart";

  /* ===== Elemen DOM ===== */
  const productGrid = document.getElementById("productGrid");
  const emptyState = document.getElementById("emptyState");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const categoryList = document.getElementById("categoryList");
  const categoryChips = categoryList
    ? Array.from(categoryList.querySelectorAll(".category-chip"))
    : [];
  const sortSelect = document.getElementById("sortSelect");

  const cartButton = document.getElementById("cartButton");
  const cartBadge = document.getElementById("cartBadge");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartCloseBtn = document.getElementById("cartCloseBtn");
  const cartItemsEl = document.getElementById("cartItems");
  const cartEmptyEl = document.getElementById("cartEmpty");
  const cartSummaryEl = document.getElementById("cartSummary");
  const cartTotalItemsEl = document.getElementById("cartTotalItems");
  const cartTotalPriceEl = document.getElementById("cartTotalPrice");
  const checkoutButton = document.getElementById("checkoutButton");

  const overlay = document.getElementById("overlay");

  const detailModal = document.getElementById("detailModal");
  const detailCloseBtn = document.getElementById("detailCloseBtn");
  const detailImage = document.getElementById("detailImage");
  const detailCategory = document.getElementById("detailCategory");
  const detailName = document.getElementById("detailName");
  const detailPrice = document.getElementById("detailPrice");
  const detailStock = document.getElementById("detailStock");
  const detailDescription = document.getElementById("detailDescription");
  const detailAddBtn = document.getElementById("detailAddBtn");

  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutCloseBtn = document.getElementById("checkoutCloseBtn");
  const checkoutSummaryList = document.getElementById("checkoutSummaryList");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutError = document.getElementById("checkoutError");
  const buyerName = document.getElementById("buyerName");
  const buyerPhone = document.getElementById("buyerPhone");
  const buyerAddress = document.getElementById("buyerAddress");

  const successModal = document.getElementById("successModal");
  const successCloseBtn = document.getElementById("successCloseBtn");
  const successMessage = document.getElementById("successMessage");
  const successOkBtn = document.getElementById("successOkBtn");

  /* ===== State ===== */
  let cart = loadCart();
  let activeCategory = "semua";
  let searchQuery = "";
  let sortMode = "default";
  let detailProductId = null;

  /* ===== Util ===== */
  function normalizeText(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function formatRupiah(value) {
    const number = Number(value) || 0;
    return "Rp" + number.toLocaleString("id-ID");
  }

  function getProductById(id) {
    return PRODUCTS.find(function (p) {
      return p.id === Number(id);
    });
  }

  /* ===== localStorage ===== */
  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      // Validasi setiap item terhadap data produk & stok saat ini
      return parsed
        .map(function (item) {
          const product = getProductById(item.id);
          if (!product || product.stok <= 0) return null;
          const qty = Math.min(
            Math.max(1, Number(item.qty) || 1),
            product.stok
          );
          return { id: product.id, qty: qty };
        })
        .filter(Boolean);
    } catch (err) {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      /* storage penuh / tidak tersedia: abaikan */
    }
  }

  /* ===== Cart logic ===== */
  function findCartItem(id) {
    return cart.find(function (item) {
      return item.id === Number(id);
    });
  }

  function addToCart(id) {
    const product = getProductById(id);
    if (!product) return;

    if (product.stok <= 0) {
      return; // stok habis, tidak boleh ditambahkan
    }

    const existing = findCartItem(id);
    if (existing) {
      if (existing.qty >= product.stok) {
        return; // tidak boleh melebihi stok
      }
      existing.qty += 1;
    } else {
      cart.push({ id: product.id, qty: 1 });
    }

    saveCart();
    renderCart();
  }

  function changeQty(id, delta) {
    const product = getProductById(id);
    const item = findCartItem(id);
    if (!product || !item) return;

    const newQty = item.qty + delta;

    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }

    item.qty = Math.min(newQty, product.stok);
    saveCart();
    renderCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(function (item) {
      return item.id !== Number(id);
    });
    saveCart();
    renderCart();
  }

  function clearCart() {
    cart = [];
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      /* abaikan */
    }
    renderCart();
  }

  function getCartTotals() {
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(function (item) {
      const product = getProductById(item.id);
      if (!product) return;
      totalItems += item.qty;
      totalPrice += product.harga * item.qty;
    });

    return { totalItems: totalItems, totalPrice: totalPrice };
  }

  /* ===== Render produk ===== */
  function getFilteredSortedProducts() {
    let list = PRODUCTS.filter(function (product) {
      const matchesCategory =
        activeCategory === "semua" ||
        normalizeText(product.kategori) === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        normalizeText(product.nama).includes(searchQuery);
      return matchesCategory && matchesSearch;
    });

    if (sortMode === "price-asc") {
      list = list.slice().sort(function (a, b) {
        return a.harga - b.harga;
      });
    } else if (sortMode === "price-desc") {
      list = list.slice().sort(function (a, b) {
        return b.harga - a.harga;
      });
    } else if (sortMode === "name-asc") {
      list = list.slice().sort(function (a, b) {
        return a.nama.localeCompare(b.nama, "id");
      });
    }

    return list;
  }

  function renderProducts() {
    if (!productGrid) return;

    const list = getFilteredSortedProducts();
    productGrid.innerHTML = "";

    list.forEach(function (product) {
      const card = document.createElement("article");
      card.className = "product-card";
      card.dataset.id = String(product.id);

      const outOfStock = product.stok <= 0;

      const image = document.createElement("div");
      image.className = "product-image";
      image.setAttribute("aria-hidden", "true");
      image.textContent = product.emoji;

      const body = document.createElement("div");
      body.className = "product-body";

      const category = document.createElement("span");
      category.className = "product-category";
      category.textContent = product.kategori;

      const name = document.createElement("h3");
      name.className = "product-name";
      name.textContent = product.nama;

      const stock = document.createElement("p");
      stock.className = "product-stock" + (outOfStock ? " out-of-stock" : "");
      stock.textContent = outOfStock ? "Stok Habis" : "Stok: " + product.stok;

      const price = document.createElement("p");
      price.className = "product-price";
      price.textContent = formatRupiah(product.harga);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "buy-button";
      button.dataset.action = "add-to-cart";
      button.dataset.id = String(product.id);
      if (outOfStock) {
        button.textContent = "Stok Habis";
        button.disabled = true;
      } else {
        button.textContent = "Tambah ke Keranjang";
      }

      body.appendChild(category);
      body.appendChild(name);
      body.appendChild(stock);
      body.appendChild(price);
      body.appendChild(button);

      card.appendChild(image);
      card.appendChild(body);
      productGrid.appendChild(card);
    });

    if (emptyState) {
      emptyState.hidden = list.length > 0;
    }
  }

  /* ===== Render keranjang ===== */
  function renderCart() {
    if (!cartItemsEl) return;

    cartItemsEl.innerHTML = "";

    cart.forEach(function (item) {
      const product = getProductById(item.id);
      if (!product) return;

      const row = document.createElement("div");
      row.className = "cart-item";

      const emoji = document.createElement("div");
      emoji.className = "cart-item-emoji";
      emoji.setAttribute("aria-hidden", "true");
      emoji.textContent = product.emoji;

      const info = document.createElement("div");
      info.className = "cart-item-info";

      const name = document.createElement("p");
      name.className = "cart-item-name";
      name.textContent = product.nama;

      const price = document.createElement("p");
      price.className = "cart-item-price";
      price.textContent =
        formatRupiah(product.harga) + " \u00D7 " + item.qty;

      const subtotal = document.createElement("p");
      subtotal.className = "cart-item-subtotal";
      subtotal.textContent =
        "Subtotal: " + formatRupiah(product.harga * item.qty);

      info.appendChild(name);
      info.appendChild(price);
      info.appendChild(subtotal);

      const controls = document.createElement("div");
      controls.className = "cart-item-controls";

      const minusBtn = document.createElement("button");
      minusBtn.type = "button";
      minusBtn.className = "qty-btn";
      minusBtn.dataset.action = "qty-minus";
      minusBtn.dataset.id = String(product.id);
      minusBtn.setAttribute("aria-label", "Kurangi " + product.nama);
      minusBtn.textContent = "\u2212";

      const qty = document.createElement("span");
      qty.className = "cart-item-qty";
      qty.textContent = String(item.qty);

      const plusBtn = document.createElement("button");
      plusBtn.type = "button";
      plusBtn.className = "qty-btn";
      plusBtn.dataset.action = "qty-plus";
      plusBtn.dataset.id = String(product.id);
      plusBtn.setAttribute("aria-label", "Tambah " + product.nama);
      plusBtn.textContent = "+";
      if (item.qty >= product.stok) {
        plusBtn.disabled = true;
      }

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "remove-btn";
      removeBtn.dataset.action = "remove-item";
      removeBtn.dataset.id = String(product.id);
      removeBtn.setAttribute("aria-label", "Hapus " + product.nama);
      removeBtn.textContent = "Hapus";

      controls.appendChild(minusBtn);
      controls.appendChild(qty);
      controls.appendChild(plusBtn);
      controls.appendChild(removeBtn);

      row.appendChild(emoji);
      row.appendChild(info);
      row.appendChild(controls);
      cartItemsEl.appendChild(row);
    });

    const totals = getCartTotals();
    const isEmpty = cart.length === 0;

    if (cartEmptyEl) cartEmptyEl.hidden = !isEmpty;
    if (cartSummaryEl) cartSummaryEl.hidden = isEmpty;
    if (cartTotalItemsEl) cartTotalItemsEl.textContent = String(totals.totalItems);
    if (cartTotalPriceEl) cartTotalPriceEl.textContent = formatRupiah(totals.totalPrice);

    if (cartBadge) {
      cartBadge.textContent = String(totals.totalItems);
      cartBadge.hidden = totals.totalItems === 0;
    }
  }

  /* ===== Overlay & drawer & modal helpers ===== */
  function updateOverlay() {
    const anyOpen =
      (cartDrawer && cartDrawer.classList.contains("open")) ||
      (detailModal && !detailModal.hidden) ||
      (checkoutModal && !checkoutModal.hidden) ||
      (successModal && !successModal.hidden);

    if (overlay) overlay.hidden = !anyOpen;
    document.body.classList.toggle("no-scroll", Boolean(anyOpen));
  }

  function openCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
    updateOverlay();
  }

  function closeCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
    updateOverlay();
  }

  function openDetail(id) {
    const product = getProductById(id);
    if (!product || !detailModal) return;

    detailProductId = product.id;

    if (detailImage) detailImage.textContent = product.emoji;
    if (detailCategory) detailCategory.textContent = product.kategori;
    if (detailName) detailName.textContent = product.nama;
    if (detailPrice) detailPrice.textContent = formatRupiah(product.harga);
    if (detailStock) {
      if (product.stok <= 0) {
        detailStock.textContent = "Stok Habis";
        detailStock.classList.add("out-of-stock");
      } else {
        detailStock.textContent = "Stok tersedia: " + product.stok;
        detailStock.classList.remove("out-of-stock");
      }
    }
    if (detailDescription) detailDescription.textContent = product.deskripsi;
    if (detailAddBtn) {
      if (product.stok <= 0) {
        detailAddBtn.textContent = "Stok Habis";
        detailAddBtn.disabled = true;
      } else {
        detailAddBtn.textContent = "Tambah ke Keranjang";
        detailAddBtn.disabled = false;
      }
    }

    detailModal.hidden = false;
    updateOverlay();
  }

  function closeDetail() {
    if (!detailModal) return;
    detailModal.hidden = true;
    detailProductId = null;
    updateOverlay();
  }

  function openCheckout() {
    if (!checkoutModal || cart.length === 0) return;

    // Isi ringkasan pesanan
    if (checkoutSummaryList) {
      checkoutSummaryList.innerHTML = "";
      cart.forEach(function (item) {
        const product = getProductById(item.id);
        if (!product) return;
        const li = document.createElement("li");

        const label = document.createElement("span");
        label.textContent = product.nama + " \u00D7 " + item.qty;

        const value = document.createElement("strong");
        value.textContent = formatRupiah(product.harga * item.qty);

        li.appendChild(label);
        li.appendChild(value);
        checkoutSummaryList.appendChild(li);
      });
    }

    const totals = getCartTotals();
    if (checkoutTotal) checkoutTotal.textContent = formatRupiah(totals.totalPrice);
    if (checkoutError) checkoutError.hidden = true;

    closeCart();
    checkoutModal.hidden = false;
    updateOverlay();

    if (buyerName) buyerName.focus();
  }

  function closeCheckout() {
    if (!checkoutModal) return;
    checkoutModal.hidden = true;
    updateOverlay();
  }

  function openSuccess(name) {
    if (!successModal) return;
    if (successMessage) {
      successMessage.textContent =
        "Terima kasih, " + name + "! Pesanan Anda sedang diproses.";
    }
    successModal.hidden = false;
    updateOverlay();
  }

  function closeSuccess() {
    if (!successModal) return;
    successModal.hidden = true;
    updateOverlay();
  }

  function closeAll() {
    closeCart();
    closeDetail();
    closeCheckout();
    closeSuccess();
  }

  /* ===== Event: pencarian ===== */
  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      searchQuery = normalizeText(searchInput.value);
      renderProducts();
    });

    searchInput.addEventListener("input", function () {
      searchQuery = normalizeText(searchInput.value);
      renderProducts();
    });
  }

  /* ===== Event: kategori ===== */
  categoryChips.forEach(function (chip) {
    chip.setAttribute(
      "aria-pressed",
      chip.classList.contains("active") ? "true" : "false"
    );

    chip.addEventListener("click", function () {
      activeCategory = normalizeText(chip.dataset.category) || "semua";

      categoryChips.forEach(function (other) {
        const isActive =
          normalizeText(other.dataset.category) === activeCategory;
        other.classList.toggle("active", isActive);
        other.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      renderProducts();
    });
  });

  /* ===== Event: sorting ===== */
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      sortMode = sortSelect.value;
      renderProducts();
    });
  }

  /* ===== Event: klik pada grid produk (delegasi) ===== */
  if (productGrid) {
    productGrid.addEventListener("click", function (event) {
      const addBtn = event.target.closest('[data-action="add-to-cart"]');
      if (addBtn) {
        event.stopPropagation();
        addToCart(addBtn.dataset.id);
        return;
      }

      const card = event.target.closest(".product-card");
      if (card && card.dataset.id) {
        openDetail(card.dataset.id);
      }
    });
  }

  /* ===== Event: keranjang ===== */
  if (cartButton) {
    cartButton.addEventListener("click", openCart);
  }
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener("click", closeCart);
  }

  if (cartItemsEl) {
    cartItemsEl.addEventListener("click", function (event) {
      const btn = event.target.closest("button[data-action]");
      if (!btn) return;

      const id = btn.dataset.id;
      if (btn.dataset.action === "qty-plus") {
        changeQty(id, 1);
      } else if (btn.dataset.action === "qty-minus") {
        changeQty(id, -1);
      } else if (btn.dataset.action === "remove-item") {
        removeFromCart(id);
      }
    });
  }

  /* ===== Event: detail produk ===== */
  if (detailCloseBtn) {
    detailCloseBtn.addEventListener("click", closeDetail);
  }
  if (detailAddBtn) {
    detailAddBtn.addEventListener("click", function () {
      if (detailProductId !== null) {
        addToCart(detailProductId);
        closeDetail();
        openCart();
      }
    });
  }

  /* ===== Event: checkout ===== */
  if (checkoutButton) {
    checkoutButton.addEventListener("click", openCheckout);
  }
  if (checkoutCloseBtn) {
    checkoutCloseBtn.addEventListener("click", closeCheckout);
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = buyerName ? buyerName.value.trim() : "";
      const phone = buyerPhone ? buyerPhone.value.trim() : "";
      const address = buyerAddress ? buyerAddress.value.trim() : "";

      if (!name || !phone || !address) {
        if (checkoutError) checkoutError.hidden = false;
        return;
      }

      if (checkoutError) checkoutError.hidden = true;

      closeCheckout();
      openSuccess(name);

      clearCart();
      checkoutForm.reset();
    });
  }

  /* ===== Event: sukses ===== */
  if (successCloseBtn) {
    successCloseBtn.addEventListener("click", closeSuccess);
  }
  if (successOkBtn) {
    successOkBtn.addEventListener("click", closeSuccess);
  }

  /* ===== Event: overlay & Escape ===== */
  if (overlay) {
    overlay.addEventListener("click", closeAll);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAll();
    }
  });

  /* ===== Init ===== */
  renderProducts();
  renderCart();
})();
