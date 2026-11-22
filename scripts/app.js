'use strict';

/* ================= ДАННЫЕ: карточки ================= */
const CARDS = [
  {
    id:'game', icon:'🎮', type:'choice', tag:'Выбор ответа', title:'Редкий скин за пароль',
    q:'В игре тебе пишет незнакомый игрок: «Дам редкий скин бесплатно! Только напиши свой логин и пароль от игры».',
    options:[
      {t:'Написать пароль — скин ведь бесплатный!', ok:false,
       why:'Настоящие администраторы игры никогда не спрашивают твой пароль — он есть только у тебя. Это мошенник: он заберёт аккаунт вместе со всеми предметами.'},
      {t:'Не отвечать и рассказать взрослым', ok:true,
       why:'Верно! Пароль нельзя сообщать никому. «Бесплатный скин за пароль» — классическая уловка мошенников.'},
      {t:'Спросить у него, настоящий ли он админ', ok:false,
       why:'Мошенники легко притворяются админами и модераторами. Правило одно: пароль не сообщаем никому, никакими обещаниями.'}
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
      {t:'Принять заявку — вежливо отказывать некрасиво', ok:false,
       why:'В интернете человек может быть кем угодно, даже если на фото «весёлый друг». Правило: не общаться с незнакомцами наедине.'},
      {t:'Не отвечать, ограничить профиль и рассказать взрослым', ok:true,
       why:'Именно так! Незнакомым взрослым не место в личных сообщениях, а взрослые помогут, если человек будет настаивать.'},
      {t:'Ответить, но ничего о себе не рассказывать', ok:false,
       why:'Мошенники умеют вытягивать информацию по крупицам и давить на жалость. Лучше вообще не отвечать и рассказать взрослым.'}
    ]
  },
  {
    id:'bully', icon:'🚫', type:'choice', tag:'Выбор ответа', title:'Травля в чате класса',
    q:'В чате класса ребята обсмеяли фотографию Маши и завалили её обидными сообщениями. Ты видишь это в чате. Как лучше поступить?',
    options:[
      {t:'Посмеяться вместе — так делают все', ok:false,
       why:'Обидные сообщения ранят не меньше, чем сказанные вживую, а «все так делают» — не оправдание. Участие в травле — тоже травля.'},
      {t:'Не участвовать, поддержать Машу и показать переписку взрослым', ok:true,
       why:'Правильно! Травлю нельзя игнорировать: поддержка, скриншоты и рассказ взрослому (родителю, учителю) — самый действенный способ её остановить.'},
      {t:'Выйти из чата и сделать вид, что этого не было', ok:false,
       why:'Молчание позволяет травле продолжаться. Маше нужна помощь: даже простое сообщение ей и рассказ взрослому меняют ситуацию.'}
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
/* ================= Загрузка карточек ================= */
const ADMIN_LS_KEY = 'kg_admin_cards';
function loadCards() {
  try {
    const data = localStorage.getItem(ADMIN_LS_KEY);
    if (data) {
      const custom = JSON.parse(data);
      if (Array.isArray(custom) && custom.length > 0) return custom;
    }
  } catch(e) { /* ignore */ }
  return CARDS; // fallback на стандартные
}
const _CARDS = loadCards();
const IDX = {}; _CARDS.forEach((c,i)=>IDX[c.id]=i);

/* ================= Состояние ================= */
let profile = null, idx = 0, results = [], correct = 0;
let ui = {};
const LS_PROFILE='kg_profile', LS_PROGRESS='kg_progress', LS_A11Y='kg_a11y';

const $ = s => document.querySelector(s);
const shuffle = a => {
  const r = a.slice();
  for(let i=r.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]]; }
  return r;
};

/* ================= Хранилище ================= */
function loadProfile(){ try{ return JSON.parse(localStorage.getItem(LS_PROFILE)||'null'); }catch(e){ return null; } }
function saveProfile(){ try{ localStorage.setItem(LS_PROFILE, JSON.stringify(profile)); }catch(e){} }
function loadProgress(){
  try{
    const p = JSON.parse(localStorage.getItem(LS_PROGRESS)||'null');
    if(p && Array.isArray(p.results) && p.idx>0 && p.idx < _CARDS.length) return p;
  }catch(e){}
  return null;
}
function saveProgress(){
  try{
    localStorage.setItem(LS_PROGRESS, JSON.stringify({idx:Math.min(idx+1,_CARDS.length), results, correct}));
  }catch(e){}
}
function clearProgress(){ try{ localStorage.removeItem(LS_PROGRESS); }catch(e){} }

/* ================= Доступность ================= */
let a11y;
try{ a11y = JSON.parse(localStorage.getItem(LS_A11Y)||'{"fs":0,"contrast":false}'); }
catch(e){ a11y = {fs:0, contrast:false}; }
function applyA11y(){
  document.documentElement.classList.remove('fs1','fs2');
  if(a11y.fs===1) document.documentElement.classList.add('fs1');
  if(a11y.fs===2) document.documentElement.classList.add('fs2');
  document.body.classList.toggle('contrast', !!a11y.contrast);
  document.querySelectorAll('.fsb').forEach(b=>b.classList.toggle('on', +b.dataset.fs===a11y.fs));
  document.getElementById('btnContrast').classList.toggle('on', !!a11y.contrast);
}
function saveA11y(){ try{ localStorage.setItem(LS_A11Y, JSON.stringify(a11y)); }catch(e){} }
document.querySelectorAll('.fsb').forEach(b=>{
  b.onclick = ()=>{ a11y.fs = +b.dataset.fs; saveA11y(); applyA11y(); };
});
document.getElementById('btnContrast').onclick = ()=>{ a11y.contrast = !a11y.contrast; saveA11y(); applyA11y(); };

/* ================= Тост ================= */
let toastTimer;
function showToast(msg){
  let el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>el.classList.remove('show'), 2200);
}

/* ================= Навигация ================= */
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
}

/* ================= Приветствие ================= */
function renderWelcome(){
  show('scr-welcome');
  const p = loadProfile(), prog = loadProgress();
  if(p){ document.getElementById('inpName').value = p.name; document.getElementById('inpClass').value = p.cls; }
  document.getElementById('greet').textContent = p
    ? (prog ? 'С возвращением, ' + p.name + '! Ты остановился на карточке ' + (prog.idx+1) + ' — продолжим?'
            : 'С возвращением, ' + p.name + '! Пройди тренажёр снова и улучши результат.')
    : 'Пройди ' + _CARDS.length + ' карточек и узнай, насколько ты защищён в интернете.';
  document.getElementById('contBtn').style.display = (p && prog) ? '' : 'none';
}

function startGame(fromSaved){
  const name = document.getElementById('inpName').value.trim();
  if(!name){ showToast('Пожалуйста, введите ваше имя'); return; }
  const cls = document.getElementById('inpClass').value.trim();
  if(cls && (isNaN(cls) || cls < 1 || cls > 11)){
    showToast('Класс должен быть от 1 до 11'); return;
  }
  profile = {
    name: name,
    cls:  cls
  };
  saveProfile();
  const prog = fromSaved ? loadProgress() : null;
  results = new Array(_CARDS.length).fill(null); correct = 0;
  if(prog){
    idx = prog.idx; correct = prog.correct;
    prog.results.forEach((v,i)=>{ if(i < CARDS.length) results[i] = v; });
  } else { idx = 0; }
  renderCard();
}

/* ================= Карточка ================= */
function renderCard(){
  show('scr-card');
  const card = _CARDS[idx];
  document.getElementById('cardNum').textContent = 'Карточка ' + (idx+1) + ' из ' + _CARDS.length;
  document.getElementById('barFill').style.width = (idx/_CARDS.length*100)+'%';
  document.getElementById('scoreLine').textContent = 'Правильных ответов: ' + correct;
  ui = {};
  document.getElementById('cardBox').innerHTML =
    '<span class="tag ' + card.type + '">' + card.tag + '</span>' +
    '<div class="emoji" aria-hidden="true">' + card.icon + '</div>' +
    '<h2>' + card.title + '</h2>' +
    '<p class="q">' + (card.q || card.statement) + '</p>' +
    '<div id="task"></div>' +
    '<div id="fb" class="feedback"></div>' +
    '<div class="next-row" id="actions"></div>';
  const task = document.getElementById('task');
  if(card.type==='choice')      renderChoice(card, task);
  else if(card.type==='tf')     renderTf(card, task);
  else if(card.type==='match')  renderMatch(card, task);
  else if(card.type==='sort')   renderSort(card, task);
  else if(card.type==='order')  renderOrder(card, task);
}

/* Завершение карточки: обратная связь + сохранение прогресса */
function finishCard(ok, head, why, correctHtml){
  results[idx] = ok;
  if(ok) correct++;
  saveProgress();
  const fb = document.getElementById('fb');
  fb.className = 'feedback show ' + (ok?'ok':'err');
  fb.innerHTML = '<div class="head">' + head + '</div>' +
                 '<div class="why">' + why + '</div>' +
                 (correctHtml ? '<div class="correct">' + correctHtml + '</div>' : '');
  const t = document.getElementById('task');
  if(t){ t.style.pointerEvents='none'; t.style.opacity='.6'; }
  document.getElementById('actions').innerHTML =
    '<button class="btn" id="nextBtn">' + (idx+1<_CARDS.length ? 'Следующая карточка →' : 'Показать результат') + '</button>';
  document.getElementById('nextBtn').onclick = next;
}
function next(){ idx++; if(idx < _CARDS.length) renderCard(); else renderFinal(); }

/* Тип 1: выбор ответа */
function renderChoice(card, task){
  const wrap = document.createElement('div');
  card.options.forEach(o=>{
    const b = document.createElement('button');
    b.className='opt'; b.textContent = o.t;
    b.onclick = ()=> finishCard(o.ok, o.ok?'✅ Верно!':'❌ Не совсем.', o.why,
      o.ok ? null : 'Правильный ответ: «'+card.options.find(x=>x.ok).t+'»');
    wrap.appendChild(b);
  });
  task.appendChild(wrap);
}

/* Тип 2: верно/неверно */
function renderTf(card, task){
  const wrap = document.createElement('div');
  [{t:'✅ Верно', v:true},{t:'❌ Неверно', v:false}].forEach(o=>{
    const b = document.createElement('button');
    b.className='opt'; b.textContent = o.t;
    b.onclick = ()=>{
      const ok = (o.v === card.correct);
      finishCard(ok, ok?'✅ Верно!':'❌ Не совсем.',
        ok ? card.why : card.whyWrong,
        ok ? null : 'Правильный ответ: «'+(card.correct?'Верно':'Неверно')+'»');
    };
    wrap.appendChild(b);
  });
  task.appendChild(wrap);
}

/* Тип 3: сопоставление */
function renderMatch(card, task){
  ui.rights = shuffle(card.pairs.map((p,i)=>({t:p.r, i})));
  ui.selL = null; ui.matched = {};
  const draw = ()=>{
    task.innerHTML = '';
    const mL = document.createElement('div');
    card.pairs.forEach((p,i)=>{
      const row = document.createElement('div'); row.className='match-row';
      const b = document.createElement('button'); b.className='pill'; b.textContent = p.l;
      if(ui.matched[i] !== undefined){ b.classList.add('done'); b.disabled = true; }
      else{
        b.classList.toggle('sel', ui.selL === i);
        b.onclick = ()=>{ ui.selL = i; draw(); };
      }
      row.appendChild(b);
      const chip = document.createElement('span'); chip.className='pill answer';
      chip.textContent = (ui.matched[i] !== undefined) ? '→ '+card.pairs[ui.matched[i]].r : '— выбери реакцию —';
      row.appendChild(chip);
      mL.appendChild(row);
    });
    const hr = document.createElement('div'); hr.className='sep';
    const mR = document.createElement('div');
    ui.rights.forEach(R=>{
      const used = Object.values(ui.matched).includes(R.i);
      const b = document.createElement('button'); b.className='pill'; b.textContent = R.t;
      if(used){ b.classList.add('done'); b.disabled = true; }
      else b.onclick = ()=>{
        if(ui.selL === null){ showToast('Сначала выбери ситуацию слева'); return; }
        ui.matched[ui.selL] = R.i; ui.selL = null; draw();
        if(Object.keys(ui.matched).length === card.pairs.length){
          const ok = card.pairs.every((p,i)=> ui.matched[i] === i);
          const correctList = card.pairs.map(p=>'«'+p.l+'» → «'+p.r+'»').join('<br>');
          finishCard(ok, ok?'✅ Все пары верны!':'❌ Есть ошибки.',
            ok ? card.whyOk : 'Посмотри на правильные пары:',
            ok ? null : correctList);
        }
      };
      mR.appendChild(b);
    });
    task.appendChild(mL); task.appendChild(hr); task.appendChild(mR);
  };
  draw();
}

/* Тип 4: сортировка */
function renderSort(card, task){
  ui.pool = shuffle(card.items.map((it,i)=>i));
  ui.placed = {}; ui.selChip = null;
  const evaluate = ()=>{
    const ok = card.items.every((it,i)=> ui.placed[i] === it.c);
    const r0 = card.items.filter(it=>it.c===0).map(it=>it.t).join(', ');
    const r1 = card.items.filter(it=>it.c===1).map(it=>it.t).join(', ');
    finishCard(ok, ok?'✅ Всё верно!':'❌ Есть ошибки.',
      ok ? card.whyOk : 'Правильная раскладка:<br>«'+card.cats[0]+'»: '+r0+'.<br>«'+card.cats[1]+'»: '+r1+'.',
      ok ? null : '');
  };
  const draw = ()=>{
    task.innerHTML = '';
    const chips = document.createElement('div'); chips.className='chips';
    if(ui.pool.length){
      ui.pool.forEach(i=>{
        const c = document.createElement('button'); c.className='chip';
        c.textContent = card.items[i].t;
        c.classList.toggle('sel', ui.selChip === i);
        c.onclick = ()=>{ ui.selChip = (ui.selChip===i ? null : i); draw(); };
        chips.appendChild(c);
      });
    } else {
      chips.innerHTML = '<div class="all-placed">Все карточки разложены ✔</div>';
    }
    const baskets = document.createElement('div'); baskets.className='baskets';
    card.cats.forEach((cat, ci)=>{
      const b = document.createElement('div'); b.className='basket '+(ci===0?'blue':'red');
      const h = document.createElement('h4'); h.textContent = cat; b.appendChild(h);
      Object.keys(ui.placed).forEach(k=>{
        if(ui.placed[k] === ci){
          const i = +k;
          const c = document.createElement('button'); c.className='chip placed';
          c.textContent = card.items[i].t;
          c.onclick = e=>{ e.stopPropagation(); delete ui.placed[k]; ui.pool.push(i); draw(); };
          b.appendChild(c);
        }
      });
      b.onclick = e=>{
        if(e.target !== b && e.target !== h) return;
        if(ui.selChip === null){ showToast('Сначала выбери карточку сверху'); return; }
        ui.placed[ui.selChip] = ci;
        ui.pool = ui.pool.filter(x=> x !== ui.selChip);
        ui.selChip = null; draw();
        if(!ui.pool.length) evaluate();
      };
      baskets.appendChild(b);
    });
    task.appendChild(chips); task.appendChild(baskets);
  };
  draw();
}

/* Тип 5: порядок действий */
function renderOrder(card, task){
  ui.rem = shuffle(card.steps.map((s,i)=>({t:s, i})));
  ui.seq = [];
  const draw = ()=>{
    task.innerHTML = '';
    const steps = document.createElement('div'); steps.className='steps';
    ui.rem.forEach(S=>{
      const b = document.createElement('button'); b.className='step'; b.textContent = S.t;
      b.onclick = ()=>{ ui.seq.push(S.i); ui.rem = ui.rem.filter(x=>x!==S); draw(); };
      steps.appendChild(b);
    });
    const seq = document.createElement('div'); seq.className='seq';
    seq.innerHTML = '<b>Твой порядок действий:</b>';
    if(!ui.seq.length) seq.innerHTML += '<div class="muted">Нажимай на шаги сверху, чтобы собрать порядок</div>';
    ui.seq.forEach((si, n)=>{
      const d = document.createElement('div'); d.className='item';
      d.innerHTML = '<b>'+(n+1)+'.</b> ' + card.steps[si];
      const x = document.createElement('button'); x.className='del'; x.textContent='✕';
      x.onclick = ()=>{ ui.rem.push({t:card.steps[si], i:si}); ui.seq.splice(n,1); draw(); };
      d.appendChild(x);
      seq.appendChild(d);
    });
    task.appendChild(steps); task.appendChild(seq);
    const acts = document.createElement('div'); acts.className='next-row';
    const check = document.createElement('button');
    check.className='btn green'; check.textContent='Проверить';
    check.disabled = ui.seq.length !== card.steps.length;
    check.onclick = ()=>{
      const ok = ui.seq.every((v,i)=> v === i);
      const rightList = card.steps.map((s,i)=>(i+1)+'. '+s).join('<br>');
      finishCard(ok, ok?'✅ Порядок верный!':'❌ Порядок не тот.',
        ok ? card.whyOk : 'Правильный порядок:', ok ? null : rightList);
    };
    const reset = document.createElement('button');
    reset.className='btn secondary'; reset.textContent='Сбросить';
    reset.onclick = ()=>{ ui.rem = shuffle(card.steps.map((s,i)=>({t:s,i}))); ui.seq=[]; draw(); };
    acts.appendChild(check); acts.appendChild(reset);
    task.appendChild(acts);
  };
  draw();
}

/* ================= Финал ================= */
function resultMessage(pct){
  if(pct === 100) return 'Идеально! Ты настоящий кибергений — все ловушки тебе не страшны.';
  if(pct >= 70)  return 'Отличный результат! Большинство интернет-ловушек тебе не страшны.';
  if(pct >= 40)  return 'Хорошее начало! Пройди ещё раз, чтобы закрепить правила.';
  return 'Не переживай — ошибки помогают учиться. Пройди ещё раз и внимательно читай объяснения!';
}

function renderFinal(){
  show('scr-final');
  clearProgress();
  const N = _CARDS.length;
  const pct = Math.round(correct / N * 100);
  const C = 2 * Math.PI * 80;
  document.getElementById('ringFg').setAttribute('stroke-dasharray', C);
  document.getElementById('ringFg').setAttribute('stroke-dashoffset', C * (1 - pct/100));
  document.getElementById('ringTxt').textContent = pct + '%';
  document.getElementById('medal').textContent = pct===100 ? '🥇' : (pct>=70 ? '🥈' : (pct>=40 ? '🥉' : '📕'));
  document.getElementById('finName').textContent = profile.name + (profile.cls ? ', ' + profile.cls + ' класс' : '');
  document.getElementById('finMsg').textContent = 'Правильных ответов: ' + correct + ' из ' + N + '. ' + resultMessage(pct);

  const badges = [
    {icon:'🏆', t:'Без ошибок',       d:'Все карточки пройдены верно', on: results.every(Boolean)},
    {icon:'🔑', t:'Мастер паролей',   d:'Карточки про пароли', on: (IDX.game!==undefined && IDX.pass!==undefined && [IDX.game,IDX.pass].every(i=>results[i]))},
    {icon:'🕵️', t:'Сыщик',           d:'Сопоставление и порядок', on: (IDX.match!==undefined && IDX.hack!==undefined && [IDX.match,IDX.hack].every(i=>results[i]))},
    {icon:'🛡️', t:'Хранитель тайн',  d:'Сортировка личных данных', on: (IDX.sort!==undefined && !!results[IDX.sort])}
  ];
  document.getElementById('badges').innerHTML = badges.map(b=>
    '<div class="badge ' + (b.on?'':'off') + '">' +
    '<div class="bi">' + b.icon + '</div><div class="bt">' + b.t + '</div><div class="bd">' + b.d + '</div></div>').join('');

  document.getElementById('certBtn').onclick = makeCert;
  document.getElementById('againBtn').onclick = ()=>{ idx=0; results=new Array(_CARDS.length).fill(null); correct=0; renderCard(); };
}

/* ================= Сертификат (PNG) ================= */
function makeCert(){
  const N = _CARDS.length;
  const pct = Math.round(correct / N * 100);
  const earned = [];
  if(results.every(Boolean)) earned.push('🏆');
  if(IDX.game!==undefined && IDX.pass!==undefined && [IDX.game,IDX.pass].every(i=>results[i])) earned.push('🔑');
  if(IDX.match!==undefined && IDX.hack!==undefined && [IDX.match,IDX.hack].every(i=>results[i])) earned.push('🕵️');
  if(IDX.sort!==undefined && results[IDX.sort]) earned.push('🛡️');

  const c = document.createElement('canvas'); c.width=1200; c.height=850;
  const x = c.getContext('2d');
  x.fillStyle='#f5f7fa'; x.fillRect(0,0,1200,850);
  x.strokeStyle='#1e5aa8'; x.lineWidth=10; x.strokeRect(30,30,1140,790);
  x.fillStyle='#1e5aa8'; x.fillRect(30,30,1140,140);
  x.fillStyle='#fff'; x.textAlign='center';
  x.font='bold 40px Arial'; x.fillText('🛡 Цифровой гражданин Югры', 600, 100);
  x.fillStyle='#1f2937'; x.font='bold 64px Arial'; x.fillText('СЕРТИФИКАТ', 600, 265);
  x.font='30px Arial'; x.fillStyle='#4b5563';
  x.fillText('Кибер-карточки Югры · тренажёр по цифровой безопасности', 600, 315);
  x.fillStyle='#1f2937'; x.font='36px Arial'; x.fillText('Награждается', 600, 405);
  x.font='bold 52px Arial';
  x.fillText(profile.name + (profile.cls ? ', ' + profile.cls + ' класс' : ''), 600, 475);
  x.font='32px Arial';
  x.fillText('Правильных ответов: ' + correct + ' из ' + N + ' (' + pct + '%)', 600, 560);
  x.font='60px Arial'; x.fillText(earned.join('  '), 600, 660);
  x.font='30px Arial'; x.fillStyle='#4b5563';
  x.fillText(resultMessage(pct), 600, 725);
  x.fillText('Дата: ' + new Date().toLocaleDateString('ru-RU'), 600, 775);

  const a = document.createElement('a');
  const safeName = (profile.name || 'ученик').replace(/[^а-яёa-z0-9]/gi, '_');
  a.download = 'sertifikat_' + safeName + '_yugra.png';
  a.href = c.toDataURL('image/png');
  a.click();
}

/* ================= Запуск ================= */
document.getElementById('startBtn').onclick = ()=>startGame(false);
document.getElementById('contBtn').onclick  = ()=>startGame(true);
applyA11y();
renderWelcome();
