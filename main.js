// console.log('hello world!')

const categoryList = document.querySelector("#category-list");
// console.log(categories)

const productList = document.getElementById("products");
// console.log(productList);

// Sepeti açma kapama işlemi için lazım olan elemanlar

// Açma butonu
const openButton = document.querySelector("#open-button");
// console.log(openButton)

// Kapama butonu
const closeButton = document.querySelector("#close-button");
// console.log(closeButton)

// Sepet modalı
const modal = document.getElementById("modal");
// console.log(modal)
const modalList = document.querySelector(".modal-list");
// console.log(modalList)
const totalPrice = document.getElementById("total-price");
// console.log(totalPrice)

/*
 *API ye istek at
 *istekten dönen verileri işle
 */

//  API ye kategori listesi için istek attığımız ve uygulamada kategori bastırmak için fonksiyon
function fetchCategories() {
  // console.log('fonksiyon çalıştır')

  /**
   * isteklerin 2 sonucu vardır
   * olumlu olma durumu: "then" metoduyla ele alınır
   * olumsuz olma durumu: "error" metoduyla ele alınır
   * her iki durumda anlık gerçekleşmez belli bir süreç geçer
   * Bunun için async/await yapısı ile veya then/catch yada try catsh gibi fonksiyon blokları ile bu istekler yapılır
   */

  // API den veri çekme isteği atma
  fetch("https://fakestoreapi.com/products")
    // Eğer API den olumlu sonuç gelmiş ise then bloğu çalışır
    // API den gelen ilk cevabı json verisine çeviriyoruz

    .then((response) => response.json())
    // json çevirme işlemi de bir süreç alır ve bunun içinde bir than bloğu daha kullanılır
    .then((data) =>
      // Gelen data verisi çok fazla olduğu için slice metodu ile diziy böldük ve
      // bölünmüş olan ilgili diziye map metodu uygulayarak her bir eleman için işlem gerçekleştirdik
      data.slice(0, 5).map((categoryy) => {
        // obje destructor
        // verileri kullanılacak objeden bir kere en başta çıkarıp
        // daha sonra ilgili yerlerde sadece key i yazarak erişmek için yapılır
        const { category, image } = categoryy;

        // console.log(category);
        // console.log(category.image);

        // map metodu diziyi dönerken döndüğü her bir eleman için bir div oluşturuyor

        const categoryDiv = document.createElement("div");
        // oluşturulan bu div e istinilen class ekleniyor

        categoryDiv.classList.add("category");
        // oluşturulmuş olan div in içeriği innerHTML ile düzenleniyor

        categoryDiv.innerHTML = `
        <img
        src=${image}
        alt=""
        />
        <span>${category}</span>`;

        // console.log(categoryDiv);
        // daha sonra js tarafından oluşturulan bu elemanın HTML tarafından da gözükmesi için appendChild metodu ile HTML gönderilir
        categoryList.appendChild(categoryDiv);
      })
    )
    .catch((error) => console.log(error));
}

fetchCategories();

function fetchProducts() {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) =>
      data.map((product) => {
        // console.log(product);

        const { title, price, category, image, id } = product;
        // console.log(product)
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        productDiv.innerHTML = `
        <img
              src=${image} alt=""/>
              
            <p>${title}</p>
            <p>${category}</p>
            <div class="product-action">
                <p>${price} ₺</p>
                <button onclick="addToBasket({id:${id},title:'${title}', price:${price}, image:'${image}', amount:1})">Sepete Ekle</button>
            </div>
        `;

        productList.appendChild(productDiv);
        // console.log(productDiv);
      })
    )
    .catch((error) => console.log(error));
}

fetchProducts();

let basket = [];
let total = 0;

// Sepete ekleme işlemleri

function addToBasket(product) {
  //  console.log('sepete ekleme fonksiyonu')
  // console.log(product);

  // eğer benim sepetimde
  // dışarıdan gelen product ile aynı id numarasına sahip eleman varsa
  // o elamanın amount bilgisini arttır

  const idsiAynıEleman = basket.find(
    (sepettekiEleman) => sepettekiEleman.id === product.id
  );
  // console.log(idsiAynıEleman)

  if (idsiAynıEleman) {
    idsiAynıEleman.amount++;
  } else {
    basket.push(product);
  }

  // console.log(basket);
}

function showBasketItems() {
  // console.log('se0peti listeleme')

  basket.map((basketProduct) => {
    const listItem = document.createElement("div");
    listItem.classList.add("list-item");

    const { image, title, price, amount, id } = basketProduct;

    listItem.innerHTML = `
    <img 
    src=${image} 
    alt="">
    <h4>${title}</h4>
    <h4 class="price">${price} ₺</h4>
    <p>Miktar: ${amount}</p>
    <button class="delete-button" onclick='deleteItem({id:${id}, price:${price}, amount:${amount}})' >Sil</button>
      `;

    modalList.appendChild(listItem);

    // console.log(listItem);

    total += price * amount;
  });
}

// Sepet açma-kapama işlemleri
// Sepet butonuna tıklanılan anın olayı
openButton.addEventListener("click", () => {
  // console.log('sepete tıklandı')

  showBasketItems();
  // HTML de oluşturduğumuz modal a active class ını ekliyoruz
  modal.classList.add("active");

  totalPrice.innerText = total;
});

// X resmine tıklanma anını yakalıyoruz
closeButton.addEventListener("click", () => {
  // console.log(closeButton)
  // Modal dan active class ını kaldırıyoruz
  modal.classList.remove("active");
  modalList.innerHTML = "";
  total = 0;
});

// Eğer X değilde modal ın dışındaki gri alana
// tıklanınca kapatmak için modalın tıklanmasını dinleme
modal.addEventListener("click", (e) => {
  // Tıklanma olayından dönen etkinliği analiz edip
  // console.log(e.target)

  // tıklanılan elemanların classları eğer modal-wrapper
  // içeriyorsa (yani gri alana tıklandıysı)
  if (e.target.classList.contains("modal-wrapper")) {
    // Modal dan active class ını kaldırıyoruz
    modal.classList.remove("active");
  }
  // modal.classList.remove('active')
});

/* silme işlemi */

function deleteItem(willDeleteItem) {
  // console.log(willDeleteItem)
  // console.log('silmeden önce',basket)
  basket = basket.filter((eleman) => eleman.id !== willDeleteItem.id);
  // console.log('sildikten sonra',basket)
/**Filter Metodu tüm diziyi gezer ve bize her dizi elemanını geri verir
 * daha sonra bizim yapacağımız kıyasa göre o eleman olmadan bir dizi döner
 * 
 */

// Tüm sepeti dön ve eğer sepetteki elmanın id si benim silinecek
// elemanınımın id sine eşit değilse bunu diziye koy ve bana yeni diziyi geri döndür

// Toplam fiyatı HTML ye göndermeJ
  total -= willDeleteItem.price * willDeleteItem.amount;
  totalPrice.innerText = total;
}

modalList.addEventListener("click", (tiklamaOlayiBilgileri) => {
  console.log(tiklamaOlayiBilgileri.target);
  if (tiklamaOlayiBilgileri.target.classList.contains("delete-button")) {
    tiklamaOlayiBilgileri.target.parentElement.remove();
  }

  if (basket.length === 0) {
    modal.classList.remove("active");
  }
});
