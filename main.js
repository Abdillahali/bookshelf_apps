const RENDER_EVENT = 'render-book';
const books = [];
const savedBook = 'save-book'
const localDoneReadBook = 'LOCAL_DONE_STORAGE';

function checkStorage(){
    if(typeof (Storage)=== undefined){
        alert('Browser does not compatible');
        return false;
    }
    return true;
}

function saveBookList(){
    if(checkStorage()){
        const parsed = JSON.stringify(books);
        localStorage. setItem(localDoneReadBook, parsed);
        document.dispatchEvent(new Event(savedBook))
    }
}


function loadDataFromStorage(){
    const dataBook = localStorage.getItem(localDoneReadBook);
    let data = JSON.parse(dataBook);

    if(data !== null){
        for(const book of data){
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook(){
    const judul = document.getElementById('inputBookTitle').value;
    const penulis = document.getElementById('inputBookAuthor').value;
    const tahun = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObject = generatedBookObject(generatedID, judul, penulis, tahun, isCompleted, false);
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookList()
}
function generateId(){
    return +new Date();
}

function generatedBookObject(id, judul, penulis, tahun, isCompleted){
    return{
        id, judul, penulis, tahun, isCompleted
    }
}

function bookRead(bookObject){
    const judulBuku = document.createElement('h3');
    judulBuku.innerText = bookObject.judul;

    const penulisBuku = document.createElement('p');
    penulisBuku.innerText = bookObject.penulis;
    
    const tahunTerbit = document.createElement('p');
    tahunTerbit.innerText = bookObject.tahun;

    const shelfContainer = document.createElement('div');
    shelfContainer.classList.add('inner');
    shelfContainer.append(judulBuku, penulisBuku, tahunTerbit);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(shelfContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if(bookObject.isCompleted){
        const undoButton = document.createElement('button');
        undoButton.innerText = "Belum selesai dibaca"
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function(){
        undoReadBook(bookObject.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = "Hapus Buku";
        deleteButton.classList.add('delete-button');

        deleteButton.addEventListener('click', function(){
            deleteBookRead(bookObject.id);
        })

        container.append(undoButton, deleteButton);
    }

    else{
        const doneButton = document.createElement('button');
        doneButton.classList.add('done-button');
        doneButton.innerText = "Sudah selesai dibaca"
        doneButton.addEventListener('click', function(){
            doneReadBook(bookObject.id);
        });
        

        const deleteButton = document.createElement('button');
        deleteButton.innerText = "Hapus Buku";
        deleteButton.classList.add('delete-button');

        deleteButton.addEventListener('click', function(){
            deleteBookRead(bookObject.id);
        })

        container.append(doneButton, deleteButton);
    }

    return container;

}

function doneReadBook(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookList()
}

function findBook(bookId){
    for(const bookItem of books){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function deleteBookRead(bookId){
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;

    books.splice(bookTarget,1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookList()
}

function findBookIndex(bookId){
    for(const index in books){
        if(books[index].id === bookId){
            return index;
        }

    }
    return -1;
}



function undoReadBook(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isCompleted =false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookList()
    }

const searchBook = document.getElementById('searchBook');

searchBook.addEventListener("input", e => {const value = e.target.value
console.log(value);
}
)

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event){
            event.preventDefault();
          
    addBook();
    });
    if(checkStorage()){
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function(){

    const uncompletedRead = document.getElementById('incompleteBookshelfList');
    uncompletedRead.innerHTML = '';

    const completedRead= document.getElementById('completeBookshelfList');
    completedRead.innerHTML = '';

    for (const bookItem of books){
        const bookElement = bookRead(bookItem);
        if(!bookItem.isCompleted){
            uncompletedRead.append(bookElement);
        }
        else completedRead.append(bookElement);
    }
})













