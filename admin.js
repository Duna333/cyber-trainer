'use strict';

/* ================= АВТОРИЗАЦИЯ ================= */
const LS_USERS = 'kg_admin_users';
const LS_SESSION = 'kg_admin_session';

function getDefaultUsers() {
  return [
    {
      username: 'admin',
      password: 'admin',
      createdAt: new Date().toISOString()
    }
  ];
}

function getUsers() {
  try {
    const data = localStorage.getItem(LS_USERS);
    if (data) {
      const users = JSON.parse(data);
      if (Array.isArray(users) && users.length > 0) return users;
    }
  } catch(e) { /* ignore */ }
  // Инициализация пользователя по умолчанию
  const defaults = getDefaultUsers();
  localStorage.setItem(LS_USERS, JSON.stringify(defaults));
  return defaults;
}

function saveUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

function getSession() {
  try {
    const data = localStorage.getItem(LS_SESSION);
    if (data) return JSON.parse(data);
  } catch(e) { /* ignore */ }
  return null;
}

function saveSession(username) {
  localStorage.setItem(LS_SESSION, JSON.stringify({
    username: username,
    loginTime: new Date().toISOString()
  }));
}

function clearSession() {
  localStorage.removeItem(LS_SESSION);
}

function isLoggedIn() {
  return getSession() !== null;
}

function getCurrentUser() {
  const session = getSession();
  return session ? session.username : null;
}

function initAuth() {
  // Всегда инициализируем пользователей (если нет - создаём admin/admin)
  getUsers();
  
  // Проверяем сессию
  if (isLoggedIn()) {
    showAdminPanel();
  } else {
    showLoginScreen();
  }
  
  // Обработчик формы логина
  document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (login(username, password)) {
      showAdminPanel();
    } else {
      const errorEl = document.getElementById('loginError');
      errorEl.classList.add('show');
      setTimeout(() => errorEl.classList.remove('show'), 3000);
    }
  };
}

function login(username, password) {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    saveSession(username);
    return true;
  }
  return false;
}

function logout() {
  clearSession();
  showLoginScreen();
  showToast('Вы вышли из системы');
}

function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  
  // Добавляем кнопку выхода в хедер
  const header = document.querySelector('.admin-header');
  if (!document.getElementById('logoutBtn')) {
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logoutBtn';
    logoutBtn.className = 'btn-sm danger';
    logoutBtn.textContent = '🚪 Выйти (' + getCurrentUser() + ')';
    logoutBtn.onclick = logout;
    header.appendChild(logoutBtn);
  } else {
    document.getElementById('logoutBtn').textContent = '🚪 Выйти (' + getCurrentUser() + ')';
  }
  
  // Рендерим таблицу пользователей
  renderUsersTable();
}

/* ================= УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ================= */
function renderUsersTable() {
  const users = getUsers();
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = '';
  
  users.forEach((user, i) => {
    const tr = document.createElement('tr');
    const isCurrentUser = user.username === getCurrentUser();
    const date = new Date(user.createdAt).toLocaleDateString('ru-RU');
    
    let actions = '<span class="muted">—</span>';
    if (!isCurrentUser) {
      actions = '<button class="btn-sm danger" onclick="removeUser(' + i + ')">🗑 Удалить</button>';
    }
    
    tr.innerHTML = 
      '<td>' + escapeHtml(user.username) + (isCurrentUser ? ' <span class="tag" style="background:#1e7e34">вы</span>' : '') + '</td>' +
      '<td>' + date + '</td>' +
      '<td class="actions">' + actions + '</td>';
    tbody.appendChild(tr);
  });
  
  document.getElementById('userCount').textContent = 'Всего администраторов: ' + users.length;
}

function showAddUserForm() {
  document.getElementById('addUserForm').style.display = 'block';
  document.getElementById('changeCredentialsForm').style.display = 'none';
  document.getElementById('newUsername').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('newPasswordConfirm').value = '';
}

function hideAddUserForm() {
  document.getElementById('addUserForm').style.display = 'none';
}

function showChangeCredentialsForm() {
  document.getElementById('changeCredentialsForm').style.display = 'block';
  document.getElementById('addUserForm').style.display = 'none';
  document.getElementById('currentPassword').value = '';
  document.getElementById('newUsernameChange').value = '';
  document.getElementById('newPasswordChange').value = '';
  document.getElementById('newPasswordChangeConfirm').value = '';
}

function hideChangeCredentialsForm() {
  document.getElementById('changeCredentialsForm').style.display = 'none';
}

function addUser() {
  const username = document.getElementById('newUsername').value.trim();
  const password = document.getElementById('newPassword').value;
  const passwordConfirm = document.getElementById('newPasswordConfirm').value;
  
  if (!username) {
    alert('Введите имя пользователя');
    return;
  }
  
  if (!password) {
    alert('Введите пароль');
    return;
  }
  
  if (password !== passwordConfirm) {
    alert('Пароли не совпадают');
    return;
  }
  
  const users = getUsers();
  
  // Проверка уникальности
  if (users.find(u => u.username === username)) {
    alert('Пользователь с таким именем уже существует');
    return;
  }
  
  users.push({
    username: username,
    password: password,
    createdAt: new Date().toISOString()
  });
  
  saveUsers(users);
  hideAddUserForm();
  renderUsersTable();
  showToast('Администратор ' + username + ' добавлен');
}

function removeUser(index) {
  const users = getUsers();
  const user = users[index];
  
  if (!user) return;
  
  // Не даём удалить себя
  if (user.username === getCurrentUser()) {
    alert('Нельзя удалить текущего пользователя');
    return;
  }
  
  // Защищаем: должен остаться хотя бы 1 пользователь
  if (users.length <= 1) {
    alert('Нельзя удалить последнего администратора');
    return;
  }
  
  if (confirm('Удалить администратора "' + user.username + '"?')) {
    users.splice(index, 1);
    saveUsers(users);
    renderUsersTable();
    showToast('Администратор ' + user.username + ' удалён');
  }
}

function changeCredentials() {
  const currentPassword = document.getElementById('currentPassword').value;
  const newUsername = document.getElementById('newUsernameChange').value.trim();
  const newPassword = document.getElementById('newPasswordChange').value;
  const newPasswordConfirm = document.getElementById('newPasswordChangeConfirm').value;
  
  const currentUser = getCurrentUser();
  const users = getUsers();
  const userIndex = users.findIndex(u => u.username === currentUser);
  
  if (userIndex === -1) {
    alert('Ошибка: пользователь не найден');
    return;
  }
  
  // Проверяем текущий пароль
  if (users[userIndex].password !== currentPassword) {
    alert('Неверный текущий пароль');
    return;
  }
  
  // Валидация новых данных
  if (newUsername && !newUsername.trim()) {
    alert('Имя пользователя не может быть пустым');
    return;
  }
  
  if (newPassword && newPassword !== newPasswordConfirm) {
    alert('Новые пароли не совпадают');
    return;
  }
  
  // Обновляем данные
  if (newUsername) {
    // Проверка уникальности нового имени
    if (users.find(u => u.username === newUsername && u !== users[userIndex])) {
      alert('Пользователь с таким именем уже существует');
      return;
    }
    users[userIndex].username = newUsername.trim();
  }
  
  if (newPassword) {
    users[userIndex].password = newPassword;
  }
  
  saveUsers(users);
  
  // Если изменили имя пользователя, обновляем сессию
  const updatedUser = users[userIndex];
  if (newUsername) {
    saveSession(updatedUser.username);
  }
  
  hideChangeCredentialsForm();
  renderUsersTable();
  showToast('Данные обновлены');
}

/* ================= ДАННЫЕ: карточки по умолчанию ================= */
const DEFAULT_CARDS = [
  {
    id:'game', icon:'🎮', type:'choice', tag:'Выбор ответа', title:'Редкий скин за пароль',
    q:'В игре тебе пишет незнакомый игрок: «Дам редкий скин бесплатно! Только напиши свой логин и пароль от игры».',
    options:[
      {t:'Написать пароль — скин ведь бесплатный!', ok:false, why:'Настоящие администраторы игры никогда не спрашивают твой пароль — он есть только у тебя. Это мошенник: он заберёт аккаунт вместе со всеми предметами.'},
      {t:'Не отвечать и рассказать взрослым', ok:true, why:'Верно! Пароль нельзя сообщать никому. «Бесплатный скин за пароль» — классическая уловка мошенников.'},
      {t:'Спросить у него, настоящий ли он админ', ok:false, why:'Мошенники легко притворяются админами и модераторами. Правило одно: пароль не сообщаем никому, никакими обещаниями.'}
    ]
  },
  {
    id:'fish', icon:'✉️', type:'tf', tag:'Верно / Неверно', title:'Пугающее письмо',
    statement:'Тебе пришло письмо: «Ваш аккаунт заблокируют через час! Срочно перейдите по ссылке и введите пароль». Значит, надо скорее перейти по ссылке?',
    correct:false,
    why:'Верно разобрались! Письма с криками «срочно!» — классический фишинг: настоящие сервисы не выгоняют пользователей «через час» и не просят пароль в письме. Сайт лучше открыть самому, набрав адрес в браузере, а о письме рассказать взрослым.',
    whyWrong:'Осторожно: такие письма — фишинг. Ссылка ведёт на поддельный сайт, который крадёт пароль. Настоящие сервисы не просят пароль в письмах.'
  },
  {
    id:'pass', icon:'🔑', type:'tf', tag:'Верно / Неверно', title:'Пароль «123456»',
    statement:'Утверждение: «Пароль должен быть простым, чтобы его было легко запомнить».',
    correct:false,
    why:'Верно! Хороший пароль — длинный и неочевидный: несколько слов, цифр и символов. А запомнить его помогает не писать пароль на стикерах и не использовать один и тот же на всех сайтах.',
    whyWrong:'Простые пароли вроде «123456», «qwerty» и дат рождения автоматические программы подбирают за секунды.'
  },
  {
    id:'match', icon:'🧩', type:'match', tag:'Сопоставление', title:'Ситуация и реакция',
    q:'Соедини каждую ситуацию с правильной реакцией. Нажми на ситуацию, затем на реакцию.',
    whyOk:'Ты видишь связь между ситуацией и безопасной реакцией — это главный навык цифровой безопасности.',
    pairs:[
      {l:'Письмо от «банка»: «введите пароль по ссылке»', r:'Не открывать ссылку — это фишинг'},
      {l:'Незнакомец просит фотографию всего класса',     r:'Отказаться и рассказать взрослым'},
      {l:'Друг просит твой пароль «просто проверить»',    r:'Не давать пароль даже друзьям'},
      {l:'Незнакомец обещает подарок за номер телефона',  r:'Не сообщать личные данные'}
    ]
  },
  {
    id:'sort', icon:'🗂️', type:'sort', tag:'Сортировка', title:'Что можно рассказывать?',
    q:'Разложи карточки по корзинам: что можно свободно рассказывать в интернете, а что нужно держать в секрете. Нажми на карточку, затем на корзину.',
    whyOk:'Ты умеешь отличать безопасные сведения от личных данных, которые нельзя публиковать.',
    cats:['Можно рассказывать','Держать в секрете'],
    items:[
      {t:'Любимая игра',             c:0},
      {t:'Любимый цвет',             c:0},
      {t:'Любимый школьный предмет', c:0},
      {t:'Домашний адрес',           c:1},
      {t:'Пароль от аккаунта',       c:1},
      {t:'Номер телефона',           c:1}
    ]
  },
  {
    id:'stranger', icon:'👥', type:'choice', tag:'Выбор ответа', title:'Незнакомец в соцсети',
    q:'В соцсети тебе пишет незнакомый взрослый: «Привет! Ты классный. Давай дружить и общаться наедине».',
    options:[
      {t:'Принять заявку — вежливо отказывать некрасиво', ok:false, why:'В интернете человек может быть кем угодно, даже если на фото «весёлый друг». Правило: не общаться с незнакомцами наедине.'},
      {t:'Не отвечать, ограничить профиль и рассказать взрослым', ok:true, why:'Именно так! Незнакомым взрослым не место в личных сообщениях, а взрослые помогут, если человек будет настаивать.'},
      {t:'Ответить, но ничего о себе не рассказывать', ok:false, why:'Мошенники умеют вытягивать информацию по крупицам и давить на жалость. Лучше вообще не отвечать и рассказать взрослым.'}
    ]
  },
  {
    id:'bully', icon:'🚫', type:'choice', tag:'Выбор ответа', title:'Травля в чате класса',
    q:'В чате класса ребята обсмеяли фотографию Маши и завалили её обидными сообщениями. Ты видишь это в чате. Как лучше поступить?',
    options:[
      {t:'Посмеяться вместе — так делают все', ok:false, why:'Обидные сообщения ранят не меньше, чем сказанные вживую, а «все так делают» — не оправдание. Участие в травле — тоже травля.'},
      {t:'Не участвовать, поддержать Машу и показать переписку взрослым', ok:true, why:'Правильно! Травлю нельзя игнорировать: поддержка, скриншоты и рассказ взрослому (родителю, учителю) — самый действенный способ её остановить.'},
      {t:'Выйти из чата и сделать вид, что этого не было', ok:false, why:'Молчание позволяет травле продолжаться. Маше нужна помощь: даже простое сообщение ей и рассказ взрослому меняют ситуацию.'}
    ]
  },
  {
    id:'hack', icon:'🚨', type:'order', tag:'Порядок действий', title:'Аккаунт взломали!',
    q:'Представь: твой аккаунт взломали. Расставь шаги в правильном порядке — нажимай на шаги по очереди.',
    whyOk:'Алгоритм при взломе усвоен!',
    steps:[
      'Сообщить взрослым — родителям или учителю',
      'Сменить пароль на новый и надёжный',
      'Выйти со всех устройств и проверить настройки безопасности',
      'Предупредить друзей: от твоего имени могут писать мошенники'
    ]
  }
];

/* ================= Хранилище ================= */
const LS_KEY = 'kg_admin_cards';
let cards = [];
let editIndex = -1;

function loadCards() {
  try {
    const data = localStorage.getItem(LS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch(e) { /* ignore */ }
  return null;
}

function saveCards() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(cards));
  } catch(e) {
    alert('Ошибка сохранения: переполнено хранилище');
  }
}

function resetToDefaults() {
  if (confirm('Сбросить все карточки к стандартным (8 штук)? Текущие изменения будут утеряны.')) {
    cards = JSON.parse(JSON.stringify(DEFAULT_CARDS));
    saveCards();
    renderTable();
    showToast('Карточки сброшены к стандартным');
  }
}

/* ================= Таблица ================= */
function renderTable() {
  const tbody = document.getElementById('cardsTableBody');
  tbody.innerHTML = '';
  cards.forEach((card, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${card.icon} ${escapeHtml(card.title)}</td>
      <td><span class="tag ${card.type}">${escapeHtml(card.tag)}</span></td>
      <td class="actions">
        <button class="btn-sm" onclick="editCard(${i})">✏️ Редактировать</button>
        <button class="btn-sm danger" onclick="deleteCard(${i})">🗑 Удалить</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  document.getElementById('cardCount').textContent = 'Всего карточек: ' + cards.length;
}

function deleteCard(index) {
  const card = cards[index];
  if (confirm('Удалить карточку «' + card.title + '»?')) {
    cards.splice(index, 1);
    saveCards();
    renderTable();
  }
}

/* ================= Форма ================= */
function openForm(card, index) {
  editIndex = index;
  const modal = document.getElementById('formModal');
  const title = index >= 0 ? 'Редактировать карточку' : 'Добавить карточку';
  document.getElementById('modalTitle').textContent = title;

  // Общие поля
  document.getElementById('fieldId').value = card ? card.id : '';
  // Установить иконку из select (или fallback на 📋)
  const iconSelect = document.getElementById('fieldIcon');
  const iconVal = card ? (card.icon || '📋') : '📋';
  const iconExists = Array.from(iconSelect.options).some(o => o.value === iconVal);
  iconSelect.value = iconExists ? iconVal : '📋';
  document.getElementById('fieldTag').value = card ? (card.tag || '') : '';
  document.getElementById('fieldTitle').value = card ? (card.title || '') : '';

  // Сброс секций типов
  document.querySelectorAll('.type-section').forEach(s => s.classList.remove('active'));

  if (card) {
    document.getElementById('fieldType').value = card.type || 'choice';
    populateTypeFields(card);
  } else {
    document.getElementById('fieldType').value = 'choice';
    // Дефолтное заполнение для нового choice
    clearDynamicLists();
    addOption();
  }

  switchTypeSection();
  modal.classList.add('active');
}

function addCard() { openForm(null, -1); }

function editCard(index) { openForm(cards[index], index); }

function closeModal() {
  document.getElementById('formModal').classList.remove('active');
  editIndex = -1;
}

function switchTypeSection() {
  const type = document.getElementById('fieldType').value;
  document.querySelectorAll('.type-section').forEach(s => s.classList.remove('active'));
  const section = document.getElementById('section-' + type);
  if (section) section.classList.add('active');
}

/* ================= Динамические списки ================= */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

// Choice: options
function addOption(text, ok, why) {
  const container = document.getElementById('optionsList');
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.innerHTML = `
    <input type="text" placeholder="Текст варианта" value="${escapeHtml(text || '')}" class="opt-text">
    <label style="white-space:nowrap"><input type="checkbox" class="opt-correct" ${ok ? 'checked' : ''}> Верный</label>
    <input type="text" placeholder="Объяснение" value="${escapeHtml(why || '')}" class="opt-why">
    <button type="button" class="btn-sm danger" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(div);
}

// Match: pairs
function addPair(l, r) {
  const container = document.getElementById('pairsList');
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.innerHTML = `
    <input type="text" placeholder="Ситуация (левая)" value="${escapeHtml(l || '')}" class="pair-l">
    <input type="text" placeholder="Реакция (правая)" value="${escapeHtml(r || '')}" class="pair-r">
    <button type="button" class="btn-sm danger" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(div);
}

// Sort: items
function addSortItem(text, cat) {
  const container = document.getElementById('sortItemsList');
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.innerHTML = `
    <input type="text" placeholder="Элемент" value="${escapeHtml(text || '')}" class="sort-item-text">
    <select class="sort-item-cat">
      <option value="0" ${cat === 0 ? 'selected' : ''}>Корзина 1</option>
      <option value="1" ${cat === 1 ? 'selected' : ''}>Корзина 2</option>
    </select>
    <button type="button" class="btn-sm danger" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(div);
}

// Order: steps
function addStep(text) {
  const container = document.getElementById('stepsList');
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.innerHTML = `
    <input type="text" placeholder="Шаг" value="${escapeHtml(text || '')}" class="step-text">
    <button type="button" class="btn-sm" onclick="moveUp(this)">↑</button>
    <button type="button" class="btn-sm" onclick="moveDown(this)">↓</button>
    <button type="button" class="btn-sm danger" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(div);
}

function moveUp(btn) {
  const item = btn.parentElement;
  const prev = item.previousElementSibling;
  if (prev) {
    item.parentElement.insertBefore(item, prev);
  }
}

function moveDown(btn) {
  const item = btn.parentElement;
  const next = item.nextElementSibling;
  if (next) {
    item.parentElement.insertBefore(next, item);
  }
}

function clearDynamicLists() {
  document.getElementById('optionsList').innerHTML = '';
  document.getElementById('pairsList').innerHTML = '';
  document.getElementById('sortItemsList').innerHTML = '';
  document.getElementById('stepsList').innerHTML = '';
}

/* ================= Заполнение формы ================= */
function populateTypeFields(card) {
  const type = card.type;

  if (type === 'choice') {
    document.getElementById('fieldQ').value = card.q || '';
    clearDynamicLists();
    (card.options || []).forEach(o => addOption(o.t, o.ok, o.why));
    document.getElementById('fieldWhy').value = card.why || '';
  } else if (type === 'tf') {
    document.getElementById('fieldStatement').value = card.statement || '';
    const radios = document.querySelectorAll('input[name="fieldCorrect"]');
    radios.forEach(r => { r.checked = (r.value === String(card.correct)); });
    document.getElementById('fieldWhy').value = card.why || '';
    document.getElementById('fieldWhyWrong').value = card.whyWrong || '';
  } else if (type === 'match') {
    document.getElementById('fieldMatchQ').value = card.q || '';
    document.getElementById('fieldWhyOk').value = card.whyOk || '';
    clearDynamicLists();
    (card.pairs || []).forEach(p => addPair(p.l, p.r));
  } else if (type === 'sort') {
    document.getElementById('fieldSortQ').value = card.q || '';
    document.getElementById('fieldSortWhyOk').value = card.whyOk || '';
    document.getElementById('fieldCat0').value = (card.cats && card.cats[0]) || '';
    document.getElementById('fieldCat1').value = (card.cats && card.cats[1]) || '';
    clearDynamicLists();
    (card.items || []).forEach(it => addSortItem(it.t, it.c));
  } else if (type === 'order') {
    document.getElementById('fieldOrderQ').value = card.q || '';
    document.getElementById('fieldOrderWhyOk').value = card.whyOk || '';
    clearDynamicLists();
    (card.steps || []).forEach(s => addStep(s));
  }
}

/* ================= Сбор формы ================= */
function collectForm() {
  const form = document.getElementById('cardForm');
  const type = document.getElementById('fieldType').value;

  const card = {
    id: document.getElementById('fieldId').value.trim(),
    icon: document.getElementById('fieldIcon').value.trim() || '📋',
    type: type,
    tag: document.getElementById('fieldTag').value.trim(),
    title: document.getElementById('fieldTitle').value.trim(),
  };

  if (type === 'choice') {
    card.q = document.getElementById('fieldQ').value.trim();
    card.options = [];
    document.querySelectorAll('#optionsList .dynamic-item').forEach(row => {
      card.options.push({
        t: row.querySelector('.opt-text').value.trim(),
        ok: row.querySelector('.opt-correct').checked,
        why: row.querySelector('.opt-why').value.trim(),
      });
    });
  } else if (type === 'tf') {
    card.statement = document.getElementById('fieldStatement').value.trim();
    const radio = document.querySelector('input[name="fieldCorrect"]:checked');
    card.correct = radio ? (radio.value === 'true') : true;
    card.why = document.getElementById('fieldWhy').value.trim();
    card.whyWrong = document.getElementById('fieldWhyWrong').value.trim();
  } else if (type === 'match') {
    card.q = document.getElementById('fieldMatchQ').value.trim();
    card.whyOk = document.getElementById('fieldWhyOk').value.trim();
    card.pairs = [];
    document.querySelectorAll('#pairsList .dynamic-item').forEach(row => {
      const l = row.querySelector('.pair-l').value.trim();
      const r = row.querySelector('.pair-r').value.trim();
      if (l && r) card.pairs.push({ l, r });
    });
  } else if (type === 'sort') {
    card.q = document.getElementById('fieldSortQ').value.trim();
    card.whyOk = document.getElementById('fieldSortWhyOk').value.trim();
    card.cats = [
      document.getElementById('fieldCat0').value.trim(),
      document.getElementById('fieldCat1').value.trim(),
    ];
    card.items = [];
    document.querySelectorAll('#sortItemsList .dynamic-item').forEach(row => {
      const t = row.querySelector('.sort-item-text').value.trim();
      const c = parseInt(row.querySelector('.sort-item-cat').value);
      if (t) card.items.push({ t, c });
    });
  } else if (type === 'order') {
    card.q = document.getElementById('fieldOrderQ').value.trim();
    card.whyOk = document.getElementById('fieldOrderWhyOk').value.trim();
    card.steps = [];
    document.querySelectorAll('#stepsList .dynamic-item').forEach(row => {
      const val = row.querySelector('.step-text').value.trim();
      if (val) card.steps.push(val);
    });
  }

  return card;
}

/* ================= Валидация и сохранение ================= */
document.getElementById('cardForm').onsubmit = function(e) {
  e.preventDefault();

  const card = collectForm();

  // Валидация
  if (!card.id) { alert('Поле "ID" обязательно'); return; }
  if (!card.title) { alert('Поле "Название" обязательно'); return; }
  if (!card.tag) { alert('Поле "Метка" обязательно'); return; }

  // Проверка уникальности ID
  const existingIdx = cards.findIndex(c => c.id === card.id && c !== card);
  if (existingIdx !== -1) { alert('Карточка с ID «' + card.id + '» уже существует'); return; }

  // Сохранение
  if (editIndex >= 0) {
    cards[editIndex] = card;
  } else {
    cards.push(card);
  }

  saveCards();
  renderTable();
  closeModal();
  showToast('Карточка сохранена');
};

/* ================= Экспорт / Импорт ================= */
function exportJson() {
  if (cards.length === 0) { alert('Нет карточек для экспорта'); return; }
  const data = JSON.stringify(cards, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cyber-cards_' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Экспорт завершён');
}

document.getElementById('importFile').onchange = function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const imported = JSON.parse(ev.target.result);
      if (!Array.isArray(imported)) {
        alert('Файл должен содержать массив карточек');
        return;
      }
      // Валидация
      for (let i = 0; i < imported.length; i++) {
        const c = imported[i];
        if (!c.id || !c.type || !c.title) {
          alert('Карточка #' + (i+1) + ' не содержит обязательных полей (id, type, title)');
          return;
        }
        if (!['choice','tf','match','sort','order'].includes(c.type)) {
          alert('Неизвестный тип карточки: ' + c.type);
          return;
        }
      }
      if (confirm('Импортировать ' + imported.length + ' карточек? Текущие карточки будут заменены.')) {
        cards = imported;
        saveCards();
        renderTable();
        showToast('Импортировано ' + imported.length + ' карточек');
      }
    } catch(err) {
      alert('Ошибка чтения файла: ' + err.message);
    }
  };
  reader.readAsText(file);
  // Сброс input для повторного импорта того же файла
  e.target.value = '';
};

/* ================= Toast ================= */
function showToast(msg) {
  let el = document.getElementById('adminToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'adminToast';
    el.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(20px);background:#1f2937;color:#fff;padding:10px 20px;border-radius:12px;opacity:0;pointer-events:none;transition:.25s;font-size:.9rem;z-index:200';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  el.style.opacity = '1';
  el.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2000);
}

/* ================= Инициализация ================= */
function init() {
  // Проверяем, что мы в админке (уже авторизованы)
  if (!isLoggedIn()) return;
  
  const loaded = loadCards();
  cards = loaded || JSON.parse(JSON.stringify(DEFAULT_CARDS));
  renderTable();
}
