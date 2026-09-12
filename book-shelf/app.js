// app.js —— 图书收藏
const form = document.querySelector('#book-form');
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const scoreInput = document.querySelector('#score');
const searchInput = document.querySelector('#search');
const tip = document.querySelector('#tip');
const list = document.querySelector('#book-list');
const submitBtn = document.querySelector('#submit-btn');

let books = JSON.parse(localStorage.getItem('books') || '[]');   // || '[]' 防首次访问 null 报错
let editIndex = -1;   // -1 表示新增模式，>=0 表示正在修改该位置的图书

const save = () => localStorage.setItem('books', JSON.stringify(books));

// 统一渲染：按关键词过滤后由数组决定列表（先改数组、再调 render）
const render = () => {
  const keyword = searchInput.value.trim();
  const shown = books.filter(b =>
    keyword === '' || b.title.includes(keyword) || b.author.includes(keyword)
  );
  list.innerHTML = '';
  if (shown.length === 0) {
    const li = document.createElement('li');
    li.textContent = '没有匹配的图书';
    list.appendChild(li);
    return;
  }
  shown.forEach(book => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = `《${book.title}》 ${book.author} · ${'★'.repeat(book.score)}`;
    const editBtn = document.createElement('button');
    editBtn.textContent = '编辑';
    editBtn.addEventListener('click', () => startEdit(book));
    const delBtn = document.createElement('button');
    delBtn.textContent = '删除';
    delBtn.addEventListener('click', () => removeBook(book));
    li.append(span, editBtn, delBtn);
    list.appendChild(li);
  });
};

// 删除：先改数组、再保存并渲染（同时退出编辑态，防止索引错位）
const removeBook = (book) => {
  books = books.filter(b => b !== book);
  exitEdit();
  save();
  render();
};

// 编辑：把该行数据填回表单，按钮切换为"保存修改"
const startEdit = (book) => {
  editIndex = books.indexOf(book);
  titleInput.value = book.title;
  authorInput.value = book.author;
  scoreInput.value = book.score;
  submitBtn.textContent = '保存修改';
  tip.style.color = '#0a0';
  tip.textContent = `正在编辑《${book.title}》，改完点"保存修改"`;
};

// 恢复新增模式
const exitEdit = () => {
  editIndex = -1;
  submitBtn.textContent = '添加';
};

// 提交：三处校验；编辑模式下更新原记录，否则新增
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
  if (editIndex >= 0) {
    books[editIndex] = { title: title, author: author, score: score };
    exitEdit();
  } else {
    books.push({ title: title, author: author, score: score });
  }
  save();
  tip.style.color = '';
  tip.textContent = '';
  form.reset();
  render();
});

// 搜索：输入即过滤（查询功能）
searchInput.addEventListener('input', render);

render();
