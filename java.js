(function(){

  // ---------------- Data ----------------
  const tasks = [
    { id: 1, company: "ShopEase",  title: "Fix Mobile Button Issue", desc: "Debug using Chrome DevTools, check for overlapping elements, ensure onClick works properly and ensure onClick works properly", deadline: "21 March 2025" },
    { id: 2, company: "Cloud Sync", title: "Add Dark Mode",          desc: "Store the user's preference in localStorage, update CSS variables dynamically, and apply a smooth transition effect.", deadline: "21 March 2025" },
    { id: 3, company: "SwiftPay",  title: "Optimize Home page",      desc: "Debug using Chrome DevTools, check for overlapping elements, ensure onClick works properly and ensure onClick works properly", deadline: "21 March 2025" },
    { id: 4, company: "Meta",      title: "Add new emoji 😀",        desc: "Debug using Chrome DevTools, check for overlapping elements, ensure onClick works properly", deadline: "21 March 2025" },
    { id: 5, company: "Google LLC",title: "Integrate OpenAI API",    desc: "Debug using Chrome DevTools, check for overlapping elements, ensure onClick works properly", deadline: "21 March 2025" },
    { id: 6, company: "Glassdoor", title: "Improve Job searching",   desc: "Debug using Chrome DevTools, check for overlapping elements, ensure onClick works properly", deadline: "21 March 2025" }
  ];

  const qaData = [
    { q: "What are the different ways to select an element in the DOM?", a: "We can select elements using getElementById, getElementsByClassName, getElementsByTagName, querySelector, and querySelectorAll." },
    { q: "What is the difference between innerHTML, innerText, and textContent?", a: "innerHTML returns HTML content, innerText gets visible text, and textContent retrieves all text, including hidden elements." },
    { q: "What is event delegation in the DOM?", a: "Event delegation is a technique where you add a single event listener to a parent element to handle events for all its current and future child elements, leveraging event bubbling." },
    { q: "What is event bubbling in the DOM?", a: "Event bubbling is a mechanism in the DOM where an event triggered on a child element propagates upward through its parent elements in the hierarchy." },
    { q: "How do you create, add, and remove elements using JavaScript?", a: "We can create an element using document.createElement(), add it with appendChild() and remove it with removeChild()." }
  ];

  const bgColors = ["#baf2c0", "#bcd8f7", "#fbe0b0", "#f6c6d6", "#d8c8f8", "#ffffff"];
  let bgIndex = 0;

  let completedCount = 0;

  // ---------------- DOM refs ----------------
  const taskGrid = document.getElementById('taskGrid');
  const taskCountEl = document.getElementById('taskCount');
  const logList = document.getElementById('logList');
  const toastEl = document.getElementById('toast');
  const colorBtn = document.getElementById('colorToggleBtn');
  const discoverBtn = document.getElementById('discoverBtn');
  const quizOverlay = document.getElementById('quizOverlay');
  const quizClose = document.getElementById('quizClose');
  const qaList = document.getElementById('qaList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');

  // ---------------- Render tasks ----------------
  function renderTasks(){
    taskGrid.innerHTML = "";
    tasks.forEach((t) => {
      const card = document.createElement('div');
      card.className = 'task-card';
      card.innerHTML =
        '<div class="company">' + t.company + '</div>' +
        '<div class="task-title">' + t.title + '</div>' +
        '<div class="task-desc">' + t.desc + '</div>' +
        '<div class="task-footer">' +
          '<div>' +
            '<div class="deadline-label">Deadline</div>' +
            '<div class="deadline-date">' + t.deadline + '</div>' +
          '</div>' +
          '<button class="complete-btn" data-id="' + t.id + '">Completed</button>' +
        '</div>';
      taskGrid.appendChild(card);
    });
    updateTaskCount();
  }

  function updateTaskCount(){
    const remaining = tasks.length - completedCount;
    taskCountEl.textContent = String(Math.max(remaining, 0)).padStart(2, '0');
  }

  // ---------------- Complete task ----------------
  taskGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.complete-btn');
    if(!btn || btn.classList.contains('done')) return;

    const id = Number(btn.getAttribute('data-id'));
    const task = tasks.find((t) => t.id === id);
    if(!task) return;

    btn.classList.add('done');
    completedCount++;
    updateTaskCount();

    const timeStr = formatTime(new Date());
    showToast('Task "' + task.title + '" marked as completed!');
    addLogEntry('You have completed the task ' + task.title + ' at ' + timeStr + '.');
  });

  // ---------------- Toast ----------------
  let toastTimer = null;
  function showToast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2600);
  }

  // ---------------- Activity log ----------------
  function addLogEntry(text){
    const empty = logList.querySelector('.log-empty');
    if(empty) empty.remove();

    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = text;
    logList.insertBefore(entry, logList.firstChild);
  }

  clearHistoryBtn.addEventListener('click', () => {
    logList.innerHTML = '<div class="log-empty">No activity yet.</div>';
  });

  function formatTime(d){
    let h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if(h === 0) h = 12;
    const pad = (n) => (n < 10 ? '0' + n : n);
    return pad(h) + ':' + pad(m) + ':' + pad(s) + ' ' + ampm;
  }

  // ---------------- Background color toggle ----------------
  colorBtn.addEventListener('click', () => {
    bgIndex = (bgIndex + 1) % bgColors.length;
    document.documentElement.style.setProperty('--bg', bgColors[bgIndex]);
  });

  // ---------------- Discover Something New (quiz page) ----------------
  function renderQA(){
    qaList.innerHTML = "";
    qaData.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'qa-item';
      el.innerHTML =
        '<div class="q">Q' + (i+1) + '. ' + item.q + '</div>' +
        '<div class="a">' + item.a + '</div>';
      qaList.appendChild(el);
    });
  }

  discoverBtn.addEventListener('click', () => {
    renderQA();
    quizOverlay.classList.add('open');
  });
  quizClose.addEventListener('click', () => {
    quizOverlay.classList.remove('open');
  });
  quizOverlay.addEventListener('click', (e) => {
    if(e.target === quizOverlay) quizOverlay.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') quizOverlay.classList.remove('open');
  });

  // ---------------- Date ----------------
  function renderDate(){
    const d = new Date();
    const dow = d.toLocaleDateString('en-US', { weekday: 'short' });
    const full = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    document.getElementById('dowLabel').textContent = dow;
    document.getElementById('dateLabel').textContent = full;
  }

  // ---------------- Init ----------------
  renderTasks();
  renderDate();

})();
