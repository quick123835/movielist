const BASE_URL = 'https://webdev.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
// 設定 cors-anywhere 以解決同源問題
const cors = 'https://cors-anywhere.herokuapp.com/'
const movies= JSON.parse(localStorage.getItem('favoriteMovies')) || []


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
                        <button class="btn btn-info btn-del-favorite" data-id="${item.id}">x</button>
                    </div>
                </div>
            </div>
        </div>
        `
        dataPanel.innerHTML= rawHTML
    })
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

    }else if(e.target.matches('.btn-del-favorite')){
        delFavorite(e.target.dataset.id)
    }
})

function delFavorite(id){
    if (!movies || !movies.length) return 
    
    const movieIndex = movies.findIndex((movie) => movie.id == id)
    //透過 id 找到要刪除電影的 index
    if(movieIndex === -1) return
  

    movies.splice(movieIndex,1)
    console.log(movies)
    localStorage.setItem('favoriteMovies',JSON.stringify(movies))
    renderMovieList(movies)

}
renderMovieList(movies)