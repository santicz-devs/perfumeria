/* =========================================================
   DECANT'STYLE PARFUM
   CATÁLOGO + FILTROS + FAVORITOS + WHATSAPP
   ========================================================= */

const CONFIG = {
    whatsapp: "5491133853115", // Número de WhatsApp (formato: 54 9 + código de área + número)
    instagram: "https://www.instagram.com/decant_style.parfum/"
};


/* =========================================================
   PRODUCTOS

   IMÁGENES DE CATÁLOGO: cada perfume puede tener una foto propia.
   Por defecto no tienen "image", así que se muestra el ícono
   "DS" de placeholder (ver .bottle-placeholder en styles.css).

   Para agregar la foto real de un perfume:
   1) Guardá la imagen en una carpeta del sitio, por ejemplo
      "images/khamrah-qahwa.jpg"
   2) Agregá la propiedad "image" a ese producto, por ejemplo:

        {
            id: 1,
            name: "Khamrah Qahwa",
            category: "arabes",
            description: "Aroma cálido y cautivador",
            image: "images/khamrah-qahwa.jpg",   // <- agregar esta línea
            sizes: [ ... ]
        }

   Si un producto no tiene "image", se sigue mostrando el
   placeholder automáticamente (no hace falta tocar nada más).
   ========================================================= */

const perfumes = [
    {
        id: 1,
        name: "Khamrah Qahwa",
        category: "arabes",
        description: "Aroma cálido y cautivador",
        sizes: [
            { ml: 3, price: 9000 },
            { ml: 5, price: 9000 },
            { ml: 10, price: 15000 }
        ]
    },
    {
        id: 2,
        name: "Khamrah Negro",
        category: "arabes",
        description: "Intensidad absoluta",
        sizes: [
            { ml: 3, price: 9000 },
            { ml: 5, price: 9000 },
            { ml: 10, price: 15000 }
        ]
    },
    {
        id: 3,
        name: "Asad Bourbon",
        category: "arabes",
        description: "Sofisticación en botella",
        sizes: [
            { ml: 5, price: 10000 },
            { ml: 10, price: 18000 }
        ]
    },
    {
        id: 4,
        name: "Fakhar Black",
        category: "arabes",
        description: "Misterio y elegancia",
        sizes: [
            { ml: 5, price: 9000 },
            { ml: 10, price: 17000 }
        ]
    },
    {
        id: 5,
        name: "Sublime Lattafa",
        category: "arabes",
        description: "Sublime y duradero",
        sizes: [
            { ml: 5, price: 9500 },
            { ml: 10, price: 17000 }
        ]
    },
    {
        id: 6,
        name: "Oud For Glory",
        category: "arabes",
        description: "Gloria olfativa",
        sizes: [
            { ml: 5, price: 8000 },
            { ml: 10, price: 15000 }
        ]
    },
    {
        id: 7,
        name: "Honnor And Glory",
        category: "arabes",
        description: "Excelencia garantizada",
        sizes: [
            { ml: 5, price: 9500 },
            { ml: 10, price: 16000 }
        ]
    },
    {
        id: 8,
        name: "Mandarin Sky Odyssey",
        category: "arabes",
        description: "Aventura cítrica",
        sizes: [
            { ml: 5, price: 10000 },
            { ml: 10, price: 17000 }
        ]
    },
    {
        id: 9,
        name: "9 PM Black",
        category: "arabes",
        description: "Midnight elegance",
        sizes: [
            { ml: 5, price: 9000 },
            { ml: 10, price: 16000 }
        ]
    },
    {
        id: 10,
        name: "9PM Night Out",
        category: "arabes",
        description: "Noche inolvidable",
        sizes: [
            { ml: 5, price: 11000 },
            { ml: 10, price: 18000 }
        ]
    },
    {
        id: 11,
        name: "Odyssey Limoni",
        category: "arabes",
        description: "Frescura mediterránea",
        sizes: [
            { ml: 5, price: 9000 },
            { ml: 10, price: 15000 }
        ]
    },
    {
        id: 12,
        name: "Musamam Lattafa",
        category: "arabes",
        description: "Esencia pura",
        sizes: [
            { ml: 5, price: 7500 },
            { ml: 10, price: 16000 }
        ]
    },
    {
        id: 13,
        name: "Jean Lowe Immortel",
        category: "arabes",
        description: "Inmortalidad aromática",
        sizes: [
            { ml: 5, price: 10000 },
            { ml: 10, price: 17000 }
        ]
    },
    {
        id: 14,
        name: "Philos Pura",
        category: "arabes",
        description: "Filosofía en aromas",
        sizes: [
            { ml: 5, price: 10000 },
            { ml: 10, price: 18000 }
        ]
    },
    {
        id: 15,
        name: "Odyssey Spectra",
        category: "arabes",
        description: "Espectro aromático",
        sizes: [
            { ml: 5, price: 9000 },
            { ml: 10, price: 15000 }
        ]
    }
];


/* =========================================================
   ESTADO
   ========================================================= */

let filters = {
    category: "all",
    search: "",
    sizes: [],
    maxPrice: 18000,
    favoritesOnly: false,
    sort: "featured"
};

let favorites = new Set();


/* =========================================================
   UTILIDADES
   ========================================================= */

function formatPrice(price) {
    return `$${Number(price).toLocaleString("es-AR")}`;
}

function getLowestPrice(product) {
    return Math.min(...product.sizes.map(size => size.price));
}

function getProductById(id) {
    return perfumes.find(product => product.id === Number(id));
}


/* =========================================================
   FAVORITOS
   ========================================================= */

function loadFavorites() {
    try {
        const saved = JSON.parse(localStorage.getItem("decant_favorites"));

        if (Array.isArray(saved)) {
            favorites = new Set(saved.map(Number));
        }
    } catch {
        favorites = new Set();
    }
}

function saveFavorites() {
    localStorage.setItem(
        "decant_favorites",
        JSON.stringify([...favorites])
    );
}

function toggleFavorite(id) {
    id = Number(id);

    if (favorites.has(id)) {
        favorites.delete(id);
    } else {
        favorites.add(id);
    }

    saveFavorites();
    renderProducts();
}


/* =========================================================
   FILTRADO
   ========================================================= */

function getFilteredProducts() {

    let products = [...perfumes];

    /* Categoría */
    if (filters.category !== "all") {
        products = products.filter(product =>
            product.category === filters.category
        );
    }

    /* Buscador */
    if (filters.search.length > 0) {

        const search = filters.search
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        products = products.filter(product => {

            const name = product.name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            const description = product.description
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            return (
                name.includes(search) ||
                description.includes(search)
            );
        });
    }

    /* Tamaños */
    if (filters.sizes.length > 0) {

        products = products.filter(product =>
            filters.sizes.some(size =>
                product.sizes.some(option =>
                    Number(option.ml) === Number(size)
                )
            )
        );
    }

    /* Precio máximo */
    products = products.filter(product =>
        getLowestPrice(product) <= filters.maxPrice
    );

    /* Favoritos */
    if (filters.favoritesOnly) {
        products = products.filter(product =>
            favorites.has(product.id)
        );
    }

    /* Orden */
    switch (filters.sort) {

        case "price-asc":
            products.sort(
                (a, b) =>
                    getLowestPrice(a) - getLowestPrice(b)
            );
            break;

        case "price-desc":
            products.sort(
                (a, b) =>
                    getLowestPrice(b) - getLowestPrice(a)
            );
            break;

        case "name":
            products.sort((a, b) =>
                a.name.localeCompare(b.name, "es")
            );
            break;

        default:
            break;
    }

    return products;
}


/* =========================================================
   CARD DE PRODUCTO
   ========================================================= */

function createProductCard(product) {

    const favorite = favorites.has(product.id);

    const sizesHTML = product.sizes.map(size => `
        <div class="size-row">
            <span>${size.ml} ml</span>
            <strong>${formatPrice(size.price)}</strong>
        </div>
    `).join("");

    return `
        <article class="product-card">

            <div class="product-visual">

                ${product.image
                    ? `<img class="product-photo" src="${product.image}" alt="${product.name}">`
                    : `<div class="bottle-placeholder"><span>DS</span></div>`
                }

                <span class="product-category">
                    PERFUME ÁRABE
                </span>

                <button
                    class="btn-favorite ${favorite ? "active" : ""}"
                    data-action="favorite"
                    data-id="${product.id}"
                    aria-label="${favorite
                        ? "Quitar de favoritos"
                        : "Agregar a favoritos"}"
                >
                    <svg viewBox="0 0 24 24">
                        <path
                            d="M20.8 8.8
                            c0 5.1-8.8 10.3-8.8 10.3
                            S3.2 13.9 3.2 8.8
                            A4.8 4.8 0 0 1 12 6.1
                            a4.8 4.8 0 0 1 8.8 2.7Z"
                        />
                    </svg>
                </button>

            </div>

            <div class="product-body">

                <span class="product-small-label">
                    DECANT'STYLE
                </span>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <p class="product-desc">
                    ${product.description}
                </p>

                <div class="size-options">
                    ${sizesHTML}
                </div>

                <div class="product-footer">

                    <div class="from-price">
                        Desde
                        <strong>
                            ${formatPrice(getLowestPrice(product))}
                        </strong>
                    </div>

                    <button
                        class="btn-consult"
                        data-action="consult"
                        data-id="${product.id}"
                    >
                        Consultar

                        <svg viewBox="0 0 24 24">
                            <path d="M5 12h13"/>
                            <path d="m13 6 6 6-6 6"/>
                        </svg>

                    </button>

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   RENDER
   ========================================================= */

function renderProducts() {

    const container =
        document.getElementById("catalog-products");

    const emptyState =
        document.getElementById("empty-state");

    if (!container) return;

    const products = getFilteredProducts();

    container.innerHTML =
        products.map(createProductCard).join("");

    updateResults(products.length);
    updateActiveFilters();

    if (emptyState) {
        emptyState.classList.toggle(
            "hidden",
            products.length !== 0
        );
    }
}


function renderFeaturedProducts() {

    const container =
        document.getElementById("featured-products");

    if (!container) return;

    container.innerHTML =
        perfumes
            .slice(0, 6)
            .map(createProductCard)
            .join("");
}


/* =========================================================
   RESULTADOS
   ========================================================= */

function updateResults(count) {

    const element =
        document.getElementById("results-count");

    if (!element) return;

    element.textContent =
        `${count} ${count === 1 ? "perfume" : "perfumes"}`;
}


/* =========================================================
   FILTROS ACTIVOS
   ========================================================= */

function updateActiveFilters() {

    const container =
        document.getElementById("active-filters");

    const badge =
        document.getElementById("filter-badge");

    if (!container) return;

    const active = [];

    if (filters.category !== "all") {
        active.push({
            type: "category",
            label: "Perfumes árabes"
        });
    }

    filters.sizes.forEach(size => {
        active.push({
            type: `size-${size}`,
            label: `${size} ml`
        });
    });

    if (filters.maxPrice < 18000) {
        active.push({
            type: "price",
            label: `Hasta ${formatPrice(filters.maxPrice)}`
        });
    }

    if (filters.favoritesOnly) {
        active.push({
            type: "favorites",
            label: "Favoritos"
        });
    }

    container.innerHTML = active.map(item => `
        <button
            type="button"
            class="active-filter"
            data-remove-filter="${item.type}"
        >
            ${item.label}
            <span>×</span>
        </button>
    `).join("");

    if (badge) {

        badge.textContent = active.length;

        badge.classList.toggle(
            "visible",
            active.length > 0
        );
    }
}


/* =========================================================
   LIMPIAR FILTROS
   ========================================================= */

function clearFilters() {

    filters = {
        category: "all",
        search: "",
        sizes: [],
        maxPrice: 18000,
        favoritesOnly: false,
        sort: "featured"
    };

    const search =
        document.getElementById("product-search");

    if (search) {
        search.value = "";
    }

    const range =
        document.getElementById("price-range");

    if (range) {
        range.value = 18000;
    }

    const sort =
        document.getElementById("sort-products");

    if (sort) {
        sort.value = "featured";
    }

    document
        .querySelectorAll(".filter-panel input[type='checkbox']")
        .forEach(input => {
            input.checked = false;
        });

    document
        .querySelectorAll(".filter-chip")
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.category === "all"
            );
        });

    updatePriceLabel();

    renderProducts();
}


/* =========================================================
   PRECIO
   ========================================================= */

function updatePriceLabel() {

    const label =
        document.getElementById("price-value");

    if (label) {
        label.textContent =
            formatPrice(filters.maxPrice);
    }
}


/* =========================================================
   CONSULTAR POR WHATSAPP
   ========================================================= */

function consultProduct(id) {

    const product = getProductById(id);

    if (!product) return;

    const message =
        `Hola Decant'Style Parfum, me interesa consultar sobre ${product.name}.`;

    const url =
        `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}


/* =========================================================
   EVENTOS
   ========================================================= */

function setupEvents() {

    /* -------------------------
       BUSCADOR
       ------------------------- */

    const search =
        document.getElementById("product-search");

    if (search) {

        search.addEventListener("input", event => {

            filters.search =
                event.target.value.trim();

            renderProducts();
        });
    }


    /* -------------------------
       LIMPIAR BUSCADOR
       ------------------------- */

    const clearSearch =
        document.getElementById("clear-search");

    if (clearSearch) {

        clearSearch.addEventListener("click", () => {

            filters.search = "";

            if (search) {
                search.value = "";
                search.focus();
            }

            renderProducts();
        });
    }


    /* -------------------------
       CATEGORÍAS
       ------------------------- */

    document
        .querySelectorAll(".filter-chip")
        .forEach(button => {

            button.addEventListener("click", () => {

                filters.category =
                    button.dataset.category;

                document
                    .querySelectorAll(".filter-chip")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );

                button.classList.add("active");

                renderProducts();
            });
        });


    /* -------------------------
       TAMAÑOS
       ------------------------- */

    document
        .querySelectorAll(".filter-panel input[id^='size-']")
        .forEach(input => {

            input.addEventListener("change", () => {

                filters.sizes =
                    [...document.querySelectorAll(
                        ".filter-panel input[id^='size-']:checked"
                    )].map(input => Number(input.value));

                renderProducts();
            });
        });


    /* -------------------------
       PRECIO
       ------------------------- */

    const priceRange =
        document.getElementById("price-range");

    if (priceRange) {

        priceRange.addEventListener("input", event => {

            filters.maxPrice =
                Number(event.target.value);

            updatePriceLabel();
            renderProducts();
        });
    }


    /* -------------------------
       FAVORITOS
       ------------------------- */

    const favoritesOnly =
        document.getElementById("favorites-only");

    if (favoritesOnly) {

        favoritesOnly.addEventListener(
            "change",
            event => {

                filters.favoritesOnly =
                    event.target.checked;

                renderProducts();
            }
        );
    }


    /* -------------------------
       ORDEN
       ------------------------- */

    const sort =
        document.getElementById("sort-products");

    if (sort) {

        sort.addEventListener("change", event => {

            filters.sort =
                event.target.value;

            renderProducts();
        });
    }


    /* -------------------------
       LIMPIAR
       ------------------------- */

    const clear =
        document.getElementById("clear-filters");

    if (clear) {
        clear.addEventListener(
            "click",
            clearFilters
        );
    }


    const emptyClear =
        document.getElementById("empty-clear");

    if (emptyClear) {
        emptyClear.addEventListener(
            "click",
            clearFilters
        );
    }


    /* -------------------------
       BOTÓN MOBILE
       ------------------------- */

    const mobileToggle =
        document.getElementById("mobile-filters-toggle");

    const filterPanel =
        document.getElementById("filter-panel");

    const closeFilters =
        document.getElementById("close-filters");

    if (mobileToggle && filterPanel) {

        mobileToggle.addEventListener("click", () => {

            const isOpen =
                filterPanel.classList.toggle("open");

            mobileToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            document.body.classList.toggle(
                "filters-open",
                isOpen
            );
        });
    }


    if (closeFilters && filterPanel) {

        closeFilters.addEventListener("click", () => {

            filterPanel.classList.remove("open");

            if (mobileToggle) {
                mobileToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

            document.body.classList.remove(
                "filters-open"
            );
        });
    }


    /* -------------------------
       CLICK EN PRODUCTOS
       ------------------------- */

    document.addEventListener("click", event => {

        const actionElement =
            event.target.closest("[data-action]");

        if (!actionElement) return;

        const action =
            actionElement.dataset.action;

        const id =
            Number(actionElement.dataset.id);

        if (action === "favorite") {
            toggleFavorite(id);
        }

        if (action === "consult") {
            consultProduct(id);
        }
    });


    /* -------------------------
       FILTROS ACTIVOS
       ------------------------- */

    document.addEventListener("click", event => {

        const button =
            event.target.closest("[data-remove-filter]");

        if (!button) return;

        const type =
            button.dataset.removeFilter;

        if (type === "category") {
            filters.category = "all";
        }

        if (type.startsWith("size-")) {

            const size =
                Number(type.replace("size-", ""));

            filters.sizes =
                filters.sizes.filter(
                    value => value !== size
                );

            const checkbox =
                document.getElementById(`size-${size}`);

            if (checkbox) {
                checkbox.checked = false;
            }
        }

        if (type === "price") {
            filters.maxPrice = 18000;

            const range =
                document.getElementById("price-range");

            if (range) {
                range.value = 18000;
            }
        }

        if (type === "favorites") {
            filters.favoritesOnly = false;

            const checkbox =
                document.getElementById("favorites-only");

            if (checkbox) {
                checkbox.checked = false;
            }
        }

        document
            .querySelectorAll(".filter-chip")
            .forEach(btn => {

                btn.classList.toggle(
                    "active",
                    btn.dataset.category === filters.category
                );
            });

        updatePriceLabel();
        renderProducts();
    });
}


/* =========================================================
   INICIO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadFavorites();

    setupEvents();

    updatePriceLabel();

    renderFeaturedProducts();

    renderProducts();
});