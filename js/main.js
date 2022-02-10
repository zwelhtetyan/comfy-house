// open / close ==> cart-item-bar

const cartBtn = document.querySelector('.cart-btn');
const cartItemBarCancel = document.querySelector('.cart-item-bar-cancel');
const cartItemBar = document.querySelector('.cart-item-bar');
const overLay = document.querySelector('.overlay');

cartBtn.addEventListener('click', () => {
    cartItemBar.style.right = '0';
    overLay.classList.add('active');
});
cartItemBarCancel.addEventListener('click', () => {
    cartItemBar.style.right = '-100%';
    overLay.classList.remove('active');
});

// day / night with localStorage

const moon = document.querySelector('.moon');
const sun = document.querySelector('.sun');

moon.addEventListener('click', () => {
    moon.classList.remove('show');
    sun.classList.add('show');
    document.body.classList.add('dark-mode');
    localStorage.setItem('dark-mode', 'dark-mode');
});

sun.addEventListener('click', () => {
    sun.classList.remove('show');
    moon.classList.add('show');
    document.body.classList.remove('dark-mode');
    localStorage.removeItem('dark-mode');
});

// dark mode / light mode
(() => {
    if (localStorage.getItem('dark-mode')) {
        document.body.classList.add('dark-mode');
        moon.classList.remove('show');
        sun.classList.add('show');
    } else {
        moon.classList.add('show');
    }
})();

const products = []; // global array
let storeId = []; // storeId inside localStorage
let notiCartAmount = 0;
let totalAmount = 0;
const cartItemContainer = document.querySelector('.cart-item-container');
const notiCart = document.querySelector('.noti-cart');
const totalPrice = document.querySelector('.total');

// getting products
const gettingProducts = async () => {
    try {
        const fetchData = await fetch('products.json');
        const data = await fetchData.json();
        const productData = data.items.map((item) => {
            const { id } = item.sys;
            const { price, title } = item.fields;
            const image = item.fields.image.fields.file.url;
            return { id, price, title, image };
        });
        return productData;
    } catch (error) {
        console.log(error);
    }
};

//display products
const productCenter = document.querySelector('.product-center');

const displayProducts = () => {
    gettingProducts().then((product) => {
        product.map((item) => {
            products.push(item);
            productCenter.innerHTML += `
            <div class="product-item-container">
                <div class="product-item" id=${item.id}>
                    <div class="product-item-img-container">
                        <img src=${item.image} class="product-img">
                        <button class="cart-alert" data-id=${item.id}><i class="feather-shopping-cart"></i> Add to cart</button>
                    </div>
                    <p class="product-title">${item.title}</p>
                    <p class="product-price">$ ${item.price}</p>
                </div>
            </div>`;
        });

        //adding item to cart
        const addingItemToCart = (
            idToTakeCartItem,
            dataNum,
            cartItemAmount
        ) => {
            const adding = `
            <div class="cart-item">
            <div class="cart-item-detail">
                <div class="cart-item-img">
                    <img src=${products[idToTakeCartItem].image} alt="">
                </div>
                <div class="cart-item-about">
                    <p class="cart-item-title">${products[idToTakeCartItem].title}</p>
                    <p class="cart-item-price">${products[idToTakeCartItem].price}</p>
                    <p class="cart-item-remove"  data-count=${dataNum}>remove</p>
                </div>
            </div>
            <div class="cart-item-counter">
                <i class="feather-chevron-up up"></i>
                <p class="cart-item-amount" data-num=${dataNum}>${cartItemAmount}</p>
                <i class="feather-chevron-down down"></i>
            </div>
        </div>`;
            return adding;
        };

        // add to cart
        const buttons = [...document.querySelectorAll('.cart-alert')];
        buttons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.id - 1; // in products array index start form 0
                cartBtn.click();
                e.target.textContent = 'In cart';
                e.target.disabled = true;
                notiCartAmount += 1;
                notiCart.textContent = notiCartAmount;
                storeId.push(e.target.dataset.id);
                storeId = storeId.sort((a, b) => a - b);
                storingToLocalStorage('In cart', storeId);
                storingToLocalStorage('notiCart', notiCartAmount);
                cartItemContainer.innerHTML += addingItemToCart(
                    index,
                    e.target.dataset.id,
                    1
                );
                storingToLocalStorage(`${e.target.dataset.id}`, `1`);

                // calculate total
                totalAmount += products[index].price;
                totalAmount = Number(totalAmount.toFixed(2));
                totalPrice.innerHTML = `$${totalAmount}`;
                storingToLocalStorage('totalAmount', totalAmount);

                //selecting up and down arrows and looping it and listen click event
                const upArrow = document.querySelectorAll('.up');
                const downArrow = document.querySelectorAll('.down');
                upArrow.forEach((u) =>
                    u.addEventListener('click', () => {
                        arrowFunc(u);
                    })
                );
                downArrow.forEach((d) =>
                    d.addEventListener('click', () => {
                        arrowFunc(d);
                    })
                );

                // removing item
                const removeBtn =
                    document.querySelectorAll('.cart-item-remove');
                removeBtn.forEach((btn) =>
                    btn.addEventListener('click', () => {
                        removing(btn);
                    })
                );
            });
        });

        //take item form localStorage
        const takeItemsFormLocalStorage = () => {
            // is In cart ?
            if (localStorage.getItem('In cart')) {
                const idOfInCardBtn =
                    gettingFromLocalStorage('In cart').split(',');
                storeId = idOfInCardBtn;

                idOfInCardBtn.forEach((id) => {
                    //display In cart buttons
                    const inCartBtn = document.querySelector(
                        `.cart-alert[data-id = "${id}"]`
                    );
                    console.log(inCartBtn);
                    inCartBtn.textContent = 'In cart';
                    inCartBtn.disabled = true;

                    //display item in cart
                    cartItemContainer.innerHTML += addingItemToCart(
                        id - 1,
                        id,
                        gettingFromLocalStorage(id)
                    );
                });

                // //selecting up and down arrows and looping it and listen click event inside localStorage
                const upArrow = document.querySelectorAll('.up');
                const downArrow = document.querySelectorAll('.down');

                upArrow.forEach((u) =>
                    u.addEventListener('click', () => {
                        arrowFunc(u);
                    })
                );
                downArrow.forEach((d) =>
                    d.addEventListener('click', () => {
                        arrowFunc(d);
                    })
                );

                // removing item
                const removeBtn =
                    document.querySelectorAll('.cart-item-remove');
                removeBtn.forEach((btn) =>
                    btn.addEventListener('click', () => {
                        removing(btn);
                    })
                );

                // display noti cart amount
                const notiCartAmountFromLocalStorage =
                    gettingFromLocalStorage('notiCart');
                notiCartAmount = Number(notiCartAmountFromLocalStorage);
                notiCart.textContent = notiCartAmount;

                // calculating total
                totalAmount = gettingFromLocalStorage('totalAmount');
                totalAmount = Number(Number(totalAmount).toFixed(2));
                totalPrice.innerHTML = `$${totalAmount}`;
            }
        };
        takeItemsFormLocalStorage();

        // up arrow and down arrow
        let cartItemAmountResult;
        function arrowFunc(arrow) {
            const cartItemAmount =
                arrow.parentElement.querySelector('.cart-item-amount');
            if (arrow.classList.contains('up')) {
                // updating cartItemAmount
                cartItemAmountResult = Number(cartItemAmount.textContent) + 1;
                totalAmount += products[cartItemAmount.dataset.num - 1].price;
                totalAmount = Number(totalAmount.toFixed(2));

                // updating notiCartAmount
                notiCartAmount += 1;
            } else {
                if (Number(cartItemAmount.textContent === '1')) {
                    return;
                }
                // updating cartItemAmount
                cartItemAmountResult = Number(cartItemAmount.textContent) - 1;
                totalAmount -= products[cartItemAmount.dataset.num - 1].price;
                totalAmount = Number(totalAmount.toFixed(2));

                // updating notiCartAmount
                notiCartAmount -= 1;
            }
            cartItemAmount.textContent = cartItemAmountResult;
            totalPrice.innerHTML = `$${totalAmount}`;
            storingToLocalStorage('totalAmount', totalAmount);

            // storing cartItemAmount to local Storage
            storingToLocalStorage(
                `${cartItemAmount.dataset.num}`,
                `${cartItemAmountResult}`
            );

            notiCart.textContent = notiCartAmount;
            storingToLocalStorage('notiCart', notiCartAmount);
        }

        //removing
        const removing = (btn) => {
            // calculate total
            const currentPrice = products[btn.dataset.count - 1].price;
            const currentAmount = document.querySelector(
                `.cart-item-amount[data-num='${btn.dataset.count}']`
            ).textContent;
            totalAmount -= currentPrice * currentAmount;
            totalAmount = Number(totalAmount.toFixed(2));
            totalPrice.innerHTML = `$${totalAmount}`;
            storingToLocalStorage('totalAmount', totalAmount);
            // update notiCart amount
            notiCartAmount -= currentAmount;
            notiCart.textContent = notiCartAmount;
            storingToLocalStorage('notiCart', notiCartAmount);
            // remove cartItemAmount form local storage
            removingFromLocalStorage(btn.dataset.count);
            // update cartAlert
            const updateBtn = buttons.find(
                (button) => button.dataset.id === btn.dataset.count
            );
            updateBtn.innerHTML = `<i class="feather-shopping-cart"></i> Add to cart`;
            updateBtn.disabled = false;
            // remove inCart Button form localStorage and set the new array
            const inCartBtnFromLocalStorage = localStorage
                .getItem('In cart')
                .split(',');
            const indexOfInCartBtn = inCartBtnFromLocalStorage.indexOf(
                btn.dataset.count
            );
            inCartBtnFromLocalStorage.splice(indexOfInCartBtn, 1);
            const newInCartBtn = inCartBtnFromLocalStorage; // new array after slice
            storeId = newInCartBtn;
            storingToLocalStorage('In cart', newInCartBtn);
            // remove parent element
            const cartItemToRemove = document.querySelector(
                `.cart-item-remove[data-count='${btn.dataset.count}']`
            ).parentElement.parentElement.parentElement;
            cartItemToRemove.remove();
        };

        //clear all
        const clearAll = document.querySelector('.clear-all');
        clearAll.addEventListener('click', () => {
            removingFromLocalStorage('notiCart');
            removingFromLocalStorage('totalAmount');
            const cartItemAmountToRemove = localStorage
                .getItem('In cart')
                .split(',');
            cartItemAmountToRemove.forEach((id) => localStorage.removeItem(id));
            removingFromLocalStorage('In cart');
            storeId = [];
            buttons.forEach((btn) => {
                btn.innerHTML = `<i class="feather-shopping-cart"></i> Add to cart`;
                btn.disabled = false;
            });
            notiCartAmount = 0;
            notiCart.textContent = 0;
            cartItemBarCancel.click();
            const cartItem = [...document.querySelectorAll('.cart-item')];
            cartItem.forEach((item) => item.remove());
            totalAmount = 0;
            totalPrice.innerHTML = `$${totalAmount}`;
        });
    });
};

// storing to localStorage
const storingToLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
};

// getting form localStorage
const gettingFromLocalStorage = (key) => {
    return localStorage.getItem(key);
};

//removing form localStorage
const removingFromLocalStorage = (key) => {
    localStorage.removeItem(key);
};

window.addEventListener('load', displayProducts);
