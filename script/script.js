document.addEventListener('DOMContentLoaded', function () {

    //Elements
    const search = document.querySelector('.search');
    const cartBtn = document.getElementById('cart');
    const wishlistBtn = document.getElementById('wishlist');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const cart = document.querySelector('.cart');
    const category = document.querySelector('.category');
    const preloader = document.querySelector('.preloader');

    //Functions

    //ф-ция показывает прелоадер
    const showSpinner = () => {
        document.querySelector('main').style.display = 'none';
        preloader.style.display = 'flex';
    }

    //ф-ция скрывает прелоадер
    const hideSpinner = () => {
        setTimeout(() => {
            document.querySelector('main').style.display = 'block';
            preloader.style.display = 'none';
        }, 2000)
    }

    //ф-ция создает карточки товаров
    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `
        <div class="card">
            <div class="card-img-wrapper">
                    <img class="card-img-top" src="${img}" alt="">
                    <button class="card-add-wishlist" data-goods-id="${id}"></button>
            </div>
            <div class="card-body justify-content-between">
                    <a href="" class="card-title">${title}</a>
                    <div class="card-price">${price} ₽</div>
                    <div>
                        <button class="card-add-cart" data-goods-id="${id}">Добавить в корзину</button>
                    </div>
        </div>`;
        return card;
    }


    //ф-ция открывает корзину
    const openCart = (e) => {
        e.preventDefault();
        cart.style.display = 'flex';
        document.body.addEventListener('keydown', closeCart);
    }

    //ф-ция закрывает корзину
    const closeCart = ({
        target,
        key
    }) => {
        if (target === cart || target.classList.contains('cart-close') || key === 'Escape') {
            cart.style.display = '';
            document.body.removeEventListener('keydown', closeCart);
        }
    }

    //ф-ция выводит товары на страницу
    const renderCard = items => {

        clearGoods();

        hideSpinner();

        items.forEach(({
            id,
            title,
            price,
            imgMin
        } = {}) => {
            goodsWrapper.append(createCardGoods(id, title, price, imgMin));
        });
    }

    //ф-ция очищает товары
    const clearGoods = () => {
        //goodsWrapper.textContent = '';

        let child = goodsWrapper.lastElementChild;
        while (child) {
            child.remove();
            child = goodsWrapper.lastElementChild;
        }
    }

    //ф-ция получает товары
    const getGoods = (handler, filter) => {

        showSpinner();

        fetch('db/db.json')
            .then(response => response.json())
            .then(filter)
            .then(handler)
    }

    //ф-ция фильтрует по категориям
    const chooseCategory = (e) => {
        e.preventDefault();
        const target = e.target;

        if (target.classList.contains('category-item')) {
            const category = target.dataset.category;

            getGoods(renderCard, (goods) => {
                return newGoods = goods.filter(item => item.category.includes(category));
            });
        }
    };

    //ф-ция сортирует товары в случайном порядке
    const randomSort = item => {
        return item.sort(() => Math.random() - 0.5);
    }


    getGoods(renderCard, randomSort);

    //Events
    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', chooseCategory)

});