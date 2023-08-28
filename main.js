const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
 
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookIsComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookIsComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
  }
   
function generateBookObject(id, title, author, year, isComplete) {
    return {
        id, 
        title,
        author,
        year,
        isComplete
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerHTML = '';
   
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) 
            uncompletedBOOKList.append(bookElement);
        else
            completedBOOKList.append(bookElement);
    }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;
   
    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;
    
    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');
   
    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle, textAuthor, textYear, buttonContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isComplete) {
        const incompleteButton = document.createElement('button');
        incompleteButton.classList.add('green');
        incompleteButton.innerText = 'Belum selesai di Baca';
     
        incompleteButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id);
        });
     
        const removeButton = document.createElement('button');
        removeButton.classList.add('red');
        removeButton.innerText = 'Hapus buku';
     
        removeButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });
     
        buttonContainer.append(incompleteButton, removeButton);

    } else {
        const completedButton = document.createElement('button');
        completedButton.classList.add('green');
        completedButton.innerText = 'Selesai dibaca';
        
        completedButton.addEventListener('click', function () {
            addBookToCompleted(bookObject.id);
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('red');
        removeButton.innerText = 'Hapus buku';
        
        removeButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });
               
        buttonContainer.append(completedButton, removeButton);
    }
   
    return container;
}

function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }

    return null;
}
  
function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
   
    return -1;
}
   
   
function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}  

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}