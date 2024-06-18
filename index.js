async function openFilters() {
    document.getElementById('filter-dialog').showModal();
}

function closeFilters() {
    document.getElementById('filter-dialog').close();
}

async function fetchTypes() {
    const types = ["release", "post", "note"];
    const tipoFilter = document.getElementById('tipo-filter');
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        tipoFilter.appendChild(option);
    });
}

function countFilters() {
    const params = new URLSearchParams(window.location.search);
    let count = 0;
    for (const [key, value] of params) {
        if (key !== 'page' && key !== 'busca' && value) {
            count++;
        }
        if (key === 'busca') {
            document.getElementById('search-input').value = value;
            document.getElementById('search-filter').value = value;
        }
        if (key === 'tipo') {
            document.getElementById('tipo-filter').value = value;
        }
        if (key === 'quantidade') {
            document.getElementById('quantidade-filter').value = value;
        }
        if (key === 'de') {
            document.getElementById('de-filter').value = value;
        }
        if (key === 'ate') {
            document.getElementById('ate-filter').value = value;
        }
    }
    document.getElementById('filter-count').innerText = count;
}

function applyFilters(event) {
    event.preventDefault();
    const form = document.getElementById('filter-form');
    const params = new URLSearchParams(new FormData(form)).toString();
    const newUrl = `${window.location.pathname}?${params}`;
    window.history.pushState({}, '', newUrl);
    closeFilters();
    countFilters();
    fetchNews();
}

async function fetchNews() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('quantidade')) {
        params.set('quantidade', 10);
    }
    console.log('Fetching news with params:', params.toString());
    try {
        const response = await fetch(`http://servicodados.ibge.gov.br/api/v3/noticias?${params.toString()}`);
        const data = await response.json();
        console.log('Fetched news data:', data);
        displayNews(data.items, data.total, params.get('quantidade'), params.get('page') || 1);
    } catch (error) {
        console.error('Erro ao buscar as notícias:', error);
    }
}

function displayNews(newsItems, totalItems, itemsPerPage, currentPage) {
    const newsContent = document.getElementById('news-content');
    newsContent.innerHTML = '';
    const newsBaseUrl = "https://agenciadenoticias.ibge.gov.br/";

    newsItems.forEach(item => {
        const newsItem = document.createElement('li');
        newsItem.classList.add('news-item');

        let imageUrl = "";
        try {
            if (item.imagens && item.imagens.length > 0 && item.imagens[0].image) {
                const imageObject = JSON.parse(item.imagens[0].image);
                if (imageObject.sizes && imageObject.sizes.medium_large) {
                    imageUrl = `${newsBaseUrl}${imageObject.sizes.medium_large}`;
                }
            }
        } catch (e) {
            console.error("Erro ao processar a imagem:", e);
        }

        const publishDate = new Date(item.data_publicacao);
        const timeSincePublish = getTimeSincePublish(publishDate);

        newsItem.innerHTML = `
            ${imageUrl ? `<img src="${imageUrl}" alt="${item.titulo}">` : ''}
            <h2>${item.titulo}</h2>
            <p>${item.introducao}</p>
            <p class="editorias">${Array.isArray(item.editorias) ? item.editorias.map(e => `#${e}`).join(' ') : ''}</p>
            <p class="data-publicacao">${timeSincePublish}</p>
            <a class="leia-mais" href="${newsBaseUrl}${item.link}" target="_blank">Leia Mais</a>
        `;
        newsContent.appendChild(newsItem);
    });

    displayPagination(totalItems, itemsPerPage, currentPage);
}

function displayPagination(totalItems, itemsPerPage, currentPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const startPage = Math.max(1, currentPage - 5);
    const endPage = Math.min(totalPages, currentPage + 4);

    for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement('li');
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === parseInt(currentPage)) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            const params = new URLSearchParams(window.location.search);
            params.set('page', i);
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.pushState({}, '', newUrl);
            fetchNews();
        });
        pageItem.appendChild(pageButton);
        pagination.appendChild(pageItem);
    }
}

function getTimeSincePublish(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
        return 'Publicado hoje';
    } else if (diffDays === 1) {
        return 'Publicado ontem';
    } else {
        return `Publicado há ${diffDays} dias`;
    }
}

document.getElementById('filter-form').addEventListener('submit', applyFilters);

window.onload = () => {
    countFilters();
    fetchTypes();
    fetchNews();
};
