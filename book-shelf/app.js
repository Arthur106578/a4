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
    const span = document.createElement('span');
    span.textContent = `《${book.title}》 ${book.author} · ${'★'.repeat(book.score)}`;
    const delBtn = document.createElement('button');
    delBtn.textContent = '删除';
    delBtn.addEventListener('click', () => removeBook(book));
    li.append(span, delBtn);
    list.appendChild(li);
  });
};

// 删除：先改数组、再保存并渲染
const removeBook = (book) => {
  books = books.filter(b => b !== book);
  save();
  render();
};

// 添加：三处校验，不通过时页面红字提示
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const score = Number(scoreInput.value);
  if (title === '') {
    tip.textContent = '书名不能为空';
    return;
  }
  if (author === '') {
    tip.textContent = '作者不能为空';
    return;
  }
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    tip.textContent = '评分需为1~5的整数';
    return;
  }
  books.push({ title: title, author: author, score: score });
  save();
  tip.textContent = '';
  form.reset();
  render();
});

render();
