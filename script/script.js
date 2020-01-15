document.addEventListener('DOMContentLoaded', function () {

    //Elements
    const search = document.querySelector('.search');
    const cartBtn = document.getElementById('cart');
    const wishlistBtn = document.getElementById('wishlist');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const cart = document.querySelector('.cart');


    //Functions
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
    goodsWrapper.append(createCardGoods(1, 'Дартс', 2000, 'img/temp/Archer.jpg'));
    goodsWrapper.append(createCardGoods(2, 'Фламинго', 3000, 'img/temp/Flamingo.jpg'));
    goodsWrapper.append(createCardGoods(3, 'Носки', 333, 'img/temp/Socks.jpg'));

    //ф-ция открывает корзину
    const openCart = (e) => {

        if (e.target.classList.contains('card-title')) {
            e.preventDefault();
            return;
        }
        cart.style.display = 'flex';
    }

    //ф-ция закрывает корзину
    const closeCart = ({
        target,
        key
    }) => {

        if (target === cart || target.classList.contains('cart-close') || key === 'Escape')
            cart.style.display = '';
    }

    //Events
    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    document.body.addEventListener('keydown', closeCart);
    document.querySelectorAll('.card-title').forEach(link => link.addEventListener('click', openCart));
});