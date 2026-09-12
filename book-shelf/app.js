// app.js —— 图书收藏
const form = document.querySelector('#book-form');
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const scoreInput = document.querySelector('#score');
const searchInput = document.querySelector('#search');
const tip = document.querySelector('#tip');
const list = document.querySelector('#book-list');

let books = JSON.parse(localStorage.getItem('books') || '[]');   // || '[]' 防首次访问 null 报错

const save = () => localStorage.setItem('books', JSON.stringify(books));

// 统一渲染：列表始终由 books 数组决定（先改数组、再调 render）
const render = () => {
  list.innerHTML = '';
  if (books.length === 0) {
    const li = document.createElement('li');
    li.textContent = '书架空空，先添加一本吧';
    list.appendChild(li);
    return;
  }
  books.forEach(book => {
    const li = document.createElement('li');
    li.textContent = `《${book.title}》 ${book.author} · ${'★'.repeat(book.score)}`;
    list.appendChild(li);
  });
};

render();
