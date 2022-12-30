const BASE_URL = 'https://webdev.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
// 設定 cors-anywhere 以解決同源問題
const cors = 'https://cors-anywhere.herokuapp.com/'
const MOVIES_PER_PAGE = 12


const movies=[]
let filteredMovies = []

const paginator = document.querySelector('#paginator')
const listType = document.querySelector('.list-type')
const cardType = document.querySelector('.card-type')

// axios.get('www.example.com/api/')
//   .then(function (response) {
//     console.log(response)
//   })
//   .catch(function (error) {
//     console.log(error)
//   })
localStorage.removeItem('page')

// 動態顯示電影清單
const dataPanel = document.querySelector('#data-panel')
function renderMovieList(data){
    let rawHTML = ''
    data.forEach((item) => {
        rawHTML += `
        <div class="col-sm-3 mt-2">
            <div class="mb-2">
                <div class="card">
                    <img src="${POSTER_URL}${item.image}" class="card-img-top" alt="Movie Post">
                    <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                        <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                    </div>
                </div>
            </div>
        </div>
        `
        dataPanel.innerHTML= rawHTML
    })
}

// 列表顯示電影清單
function renderListType(data){
    let rawHTML = ''
    data.forEach((item)=>{
        rawHTML+=`
            <li class="list-group-item d-flex">
                    <div class="col-8 fs-5">
                        ${item.title}
                    </div>
                    <div class="col-4">
                        <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                        <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                    </div>
            </li>
        `
    })
    dataPanel.innerHTML = rawHTML
}



// 處理 search form
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
searchForm.addEventListener('submit',function onSearchFormSubmit(e){
    e.preventDefault() // 阻止瀏覽器預設動作
    const keyword = searchInput.value.trim().toLowerCase()
    // 錯誤處理
    if(!keyword.length){
        alert('請輸入有效字串')
    }

    filteredMovies = movies.filter((movie)=>
        movie.title.toLowerCase().includes(keyword)
    )
    if(listType.checked){
        renderListType(getMoviesByPage(1))
    }else(
        renderMovieList(getMoviesByPage(1))
    )
    renderPaginator(filteredMovies.length)

})

// 添加最愛
function addToFavorite(id){
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    // const movie = movies.find(isMovieIdMatched)
    // function isMovieIdMatched(movie){
    //     return movie.id == id
    // } 改成箭頭函式
    const movie = movies.find((movie) => movie.id == id)
        // 檢查重複
    if(list.some((movie)=> movie.id == id)){
        return alert('此電影已收藏')
    }

    list.push(movie)
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// 渲染分頁器
function renderPaginator(amount){
    const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
    //80 / 12 = 6 ... 8  Math.ceil 無條件進位
    let rawHTML = ''
    for(let page=1; page<=numberOfPages; page++){
        rawHTML += `
        <li class="page-item"><a class="page-link" href="javascript:void(0)" data-page="${page}">${page}</a></li>
        `
    }
    paginator.innerHTML = rawHTML
}


// 處理分頁
function getMoviesByPage(page){
    // movies ? "movies" : "filteredMovies"
    const data = filteredMovies.length ? filteredMovies : movies

    const startIndex = (page-1)*MOVIES_PER_PAGE
    return data.slice(startIndex , MOVIES_PER_PAGE + startIndex)
}


// 處理 modal
function showMovieModal(id){
    const modalTitle = document.querySelector('#movie-modal-title')
    const modalImage = document.querySelector('#movie-modal-image')
    const modalDate = document.querySelector('#movie-modal-date')
    const modalDescription = document.querySelector('#movie-modal-description')

    axios.get(INDEX_URL+id).then((response)=>{
        const result = response.data.results
        const title = result.title
        const image = result.image
        const date = result.release_date
        const description = result.description

        modalTitle.innerText = title
        modalImage.innerHTML = `<img id="movie-modal-image"src="${POSTER_URL}${image}" class="img-fluid"/>`
        modalDate.innerText = 'releasedate: ' + date
        modalDescription.innerText = description
    })
    
}

dataPanel.addEventListener('click',function onPamelClick(e){
    if(e.target.matches('.btn-show-movie')){
        showMovieModal(e.target.dataset.id)

    }else if(e.target.matches('.btn-add-favorite')){
        addToFavorite(e.target.dataset.id)
    }
})


paginator.addEventListener('click', function onPaginatorClick(e){
    if(e.target.tagName !== 'A') return
    const page = Number(e.target.dataset.page)
    if(listType.checked){
        renderListType(getMoviesByPage(page))
    }
    if(cardType.checked){
        renderMovieList(getMoviesByPage(page))
    }
    localStorage.setItem('page',page)
})

// 點擊變列表模式
listType.addEventListener('click',function turnToList(){
    const page = localStorage.getItem('page')
    if(page){
        renderListType(getMoviesByPage(page))
    }else{
        renderListType(getMoviesByPage(1))
    }
    
})

// 點擊變卡片模式
cardType.addEventListener('click',function turnToCard(){
    const page = localStorage.getItem('page')
    if(page){
        renderMovieList(getMoviesByPage(page))
    }else{
        renderMovieList(getMoviesByPage(1))
    }
})


axios.get(`${INDEX_URL}`)
    .then((response) => {
        for(const movie of response.data.results){
            movies.push(movie)
        }
        renderMovieList(getMoviesByPage(1))
        renderPaginator(movies.length)

    })