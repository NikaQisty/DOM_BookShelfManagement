function addBook() {
  const textBook = document.getElementById("inputTitle").value;
  const authorBook = document.getElementById("inputAuthor").value;
  const yearBook = document.getElementById("inputYear").value;
  const checkbook = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    textBook,
    authorBook,
    yearBook,
    checkbook
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isRead) {
  return {
    id,
    title,
    author,
    year,
    isRead,
  };
}

const books = [];
const RENDER_EVENT = "render-books-list";

function clearForm() {
  const clearBtn = document.getElementById("clear-form");
  const textBook = document.getElementById("inputTitle");
  const authorBook = document.getElementById("inputAuthor");
  const yearBook = document.getElementById("inputYear");
  const checkbook = document.getElementById("inputBookIsComplete");

  clearBtn.addEventListener("click", function () {
    textBook.value = " ";
    authorBook.value = " ";
    yearBook.value = " ";
    checkbook.value = " ";
  });
}

function makeBook(bookObject) {
  const bookTitle = document.createElement("h2");
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = "Author : " + bookObject.author;

  const bookYear = document.createElement("p");
  bookYear.innerText = "Release year : " + bookObject.year;

  const bookContainer = document.createElement("article");
  bookContainer.classList.add("inner-book", "item", "shadow");

  const bookBtn = document.createElement("div");
  bookBtn.classList.add("action");

  bookContainer.append(bookTitle, bookAuthor, bookYear);
  bookContainer.append(bookBtn);
  bookContainer.setAttribute("id", `books-${bookObject.id}`);

  if (bookObject.isRead) {
    const inCompleteBtn = document.createElement("button");
    inCompleteBtn.classList.add("unfinished");
    inCompleteBtn.innerText = "Unfinished Reading";

    inCompleteBtn.addEventListener("click", function () {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Moved to Unfinished Reading",
        showConfirmButton: false,
        timer: 1500,
      });
      removeBookFromRead(bookObject.id);
    });

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove");
    removeBtn.innerText = "Delete Book";

    removeBtn.addEventListener("click", function () {
      Swal.fire({
        title: "Are you sure?",
        text: "to delete it?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", "Your book has been deleted.", "success");
          removeBookshelf(bookObject.id);
        }
      });
    });

    bookContainer.append(inCompleteBtn, removeBtn);
  } else {
    const completeBtn = document.createElement("button");
    completeBtn.classList.add("finish");
    completeBtn.innerText = "Finished Reading";

    completeBtn.addEventListener("click", function () {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Moved to Finished Reading",
        showConfirmButton: false,
        timer: 1500,
      });
      addBookToRead(bookObject.id);
    });

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove");
    removeBtn.innerText = "Delete Book";

    removeBtn.addEventListener("click", function () {
      Swal.fire({
        title: "Are you sure?",
        text: "to delete it?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", "Your book has been deleted.", "success");
          removeBookshelf(bookObject.id);
        }
      });
    });

    bookContainer.append(completeBtn, removeBtn);
  }

  return bookContainer;
}

document.addEventListener(RENDER_EVENT, function () {
  const unReadBook = document.getElementById("unfinished-books");
  const readBook = document.getElementById("finished-books");

  //clearing books item
  unReadBook.innerHTML = "";
  readBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isRead) {
      unReadBook.append(bookElement);
    } else {
      readBook.append(bookElement);
    }
  }
});

function addBookToRead(generateId) {
  const bookTarget = findBook(generateId);
  if (bookTarget == null) return;

  bookTarget.isRead = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromRead(generateId) {
  const bookTarget = findBook(generateId);
  if (bookTarget === null) return;
  // books.splice(bookTarget, 1);
  bookTarget.isRead = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(generateId) {
  for (const bookItem of books) {
    if (bookItem.id === generateId) {
      return bookItem;
    }
  }
  return null;
}

function clearBook() {
  document.getElementById("input-book").reset();
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function clearSearch() {
  document.getElementById("searchBook").reset();
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("input-book");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    const checklist_read = document.getElementById("inputBookIsComplete");
    if (checklist_read.checked == true) {
      Swal.fire("Success", "Save book to Finished Reading", "success");
      document.getElementById("input-book").reset();
    } else {
      Swal.fire("Success", "Save book to Unfinished Reading", "success");
      document.getElementById("input-book").reset();
    }
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const unReadBook = document.getElementById("unfinished-books");
  const readBook = document.getElementById("finished-books");

  //clearing books item
  unReadBook.innerHTML = "";
  readBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isRead) {
      unReadBook.append(bookElement);
    } else {
      readBook.append(bookElement);
    }
  }
});

function removeBookshelf(generateId) {
  const bookTarget = findBookIndex(generateId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(generateId) {
  for (index in books) {
    if (books[index].id === generateId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document
  .getElementById("searchBook")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const searchBook = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const listBook = document.querySelectorAll(".inner-book > h2");
    for (const book of listBook) {
      if (book.innerText.toLowerCase().includes(searchBook)) {
        book.parentElement.style.display = "block";
      } else {
        book.parentElement.style.display = "none";
      }
    }
  });

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "book_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

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
