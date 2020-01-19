document.addEventListener('DOMContentLoaded', function () {

    //Elements
    const search = document.querySelector('.search');
    const cartBtn = document.getElementById('cart');
    const wishlistBtn = document.getElementById('wishlist');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const cart = document.querySelector('.cart');
    const category = document.querySelector('.category');
    const preloader = document.querySelector('.preloader');
    const cardCounter = cartBtn.querySelector('.counter');
    const wishlistCounter = wishlistBtn.querySelector('.counter');
    const cartWrapper = document.querySelector('.cart-wrapper');

    let wishlist = [];
    goodsBasket = {};
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
        }, 1000)
    }

    //ф-ция создает карточки товаров
    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `
        <div class="card">
            <div class="card-img-wrapper">
                    <img class="card-img-top" src="${img}" alt="">
                    <button class="card-add-wishlist ${wishlist.includes(id) ? 'active' : ''}" data-goods-id="${id}"></button>
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

    const calcTotalPrice = (goods) => {
        //let sum = 0;

        // for (const item of goods) {
        //     sum += item.price * goodsBasket[item.id]
        // }
        let sum = goods.reduce((acc, item) => {
            return acc += item.price * goodsBasket[item.id];
        }, 0)
        cart.querySelector('.cart-total>span').textContent = sum.toFixed(2);
    }
    const showCardBasket = (goods) => {
        const basketGoods = goods.filter(item => goodsBasket.hasOwnProperty(item.id));
        calcTotalPrice(basketGoods);
        return basketGoods;
    }


    //ф-ция открывает корзину
    const openCart = (e) => {
        e.preventDefault();
        cart.style.display = 'flex';
        document.body.addEventListener('keydown', closeCart);
        getGoods(renderBasket, showCardBasket);
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

        if (items.length) {
            items.forEach(({
                id,
                title,
                price,
                imgMin
            } = {}) => {
                goodsWrapper.append(createCardGoods(id, title, price, imgMin));
            })
        } else {
            goodsWrapper.textContent = '❌ Извините, мы не нашли товаров по вашему запросу!';
        }

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

    //ф-ция ищет товары по запросу
    const searchGoods = (e) => {
        e.preventDefault();
        const input = e.target.elements.searchGoods;
        const inputValue = input.value.trim();
        if (inputValue !== '') {
            const searchString = new RegExp(inputValue, 'i')
            getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
        } else {
            search.classList.add('error');
            setTimeout(() => search.classList.remove('error'), 2000)
        }
        inputValue.textContent = '';
    }

    const getCookie = (name) => {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    const cookieQuery = get => {

        if (get) {
            if (getCookie('goodsBasket')) {
                Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket')))
                // goodsBasket = JSON.parse(getCookie('goodsBasket'));
            }
            checkCount();
        } else {
            document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=86400e3`
        }

    }






    const addBasket = (id) => {
        if (goodsBasket[id]) {
            goodsBasket[id] += 1;
        } else {
            goodsBasket[id] = 1;
        }
        checkCount();
        cookieQuery();
    };

    const checkCount = () => {
        wishlistCounter.textContent = wishlist.length;
        cardCounter.textContent = Object.keys(goodsBasket).length;
    }
    const storageQuery = (get) => {
        if (get) {
            if (localStorage.getItem('wishlist')) {
                // wishlist.splice(0, 0, ...JSON.parse(localStorage.getItem('wishlist')));

                wishlist.push(...JSON.parse(localStorage.getItem('wishlist')));

                // const wishlistStorage = JSON.parse(localStorage.getItem('wishlist'));
                // wishlistStorage.forEach(id => wishlist.push(id));
            }
            checkCount();
        } else {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }

    }

    const toggleWishlist = (id, target) => {
        if (wishlist.includes(id)) {
            wishlist.splice(wishlist.indexOf(id), 1);
            target.classList.remove('active');
        } else {
            wishlist.push(id);
            target.classList.add('active');
        }

        checkCount();
        storageQuery();
        console.log(wishlist);
    }
    const handlerGoods = ({
        target
    }) => {

        if (target.classList.contains('card-add-wishlist')) {
            toggleWishlist(target.dataset.goodsId, target);
        }

        if (target.classList.contains('card-add-cart')) {
            addBasket(target.dataset.goodsId)
        }
    }
    const showWishlist = () => {
        getGoods(renderCard, goods => goods.filter((item) => wishlist.includes(item.id)))
    }

    getGoods(renderCard, randomSort);
    storageQuery(true);
    cookieQuery(true);







    const renderBasket = items => {

        // clearGoods();
        cartWrapper.textContent = '';

        hideSpinner();

        if (items.length) {
            items.forEach(({
                id,
                title,
                price,
                imgMin
            }) => {
                cartWrapper.append(createCartGoods(id, title, price, imgMin))

            })
        } else {
            cartsWrapper.innerHTML = '<div id="cart-empty">Ваша корзина пока пуста </div>';
        }

        items.forEach(({
            id,
            title,
            price,
            imgMin
        } = {}) => {
            goodsWrapper.append(createCardGoodsBasket(id, title, price, imgMin));
        });
    }

    const createCartGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `
    <div class="goods-img-wrapper">
        <img class="goods-img" src="${img}" alt="">
    </div>
    <div class="goods-description">
        <h2 class="goods-title">${title}</h2>
        <p class="goods-price">${price} ₽</p>
    </div>
    <div class="goods-price-count">
        <div class="goods-trigger">
            <button class="goods-add-wishlist ${wishlist.includes(id)  ? 'active' : ''}" data-goods-id="${id}" ></button>
            <button class="goods-delete" data-goods-id="${id}"></button>
        </div>
        <div class="goods-count" >1</div>
    </div>`;
        // ${gooodsBasket[id]}
        return card;
    }

    const removeGoods = (id) => {
        delete goodsBasket[id];
        checkCount();
        cookieQuery();
        getGoods(renderBasket, showCardBasket);
    }

    const handlerBasket = (e) => {
        const target = e.target;

        if (target.classList.contains('goods-add-wishlist')) {
            toggleWishlist(target.dataset.goodsId, target);
        }
        if (target.classList.contains('goods-add-wishlist')) {
            removeGoods(target.dataset.goodsId);
        }
    }

    //Events
    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', chooseCategory);
    search.addEventListener('submit', searchGoods);
    goodsWrapper.addEventListener('click', handlerGoods);
    cartWrapper.addEventListener('click', handlerBasket);
    wishlistBtn.addEventListener('click', showWishlist)
});