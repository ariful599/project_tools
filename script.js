const tasks = [
    {
        id: 1,
        company: "Shop Ease",
        title: "Fix Mobile Button Issue",
        description: "A card component has a figure, a body part, and inside body there are title and actions parts",
        deadline: "21 March 2025"
    },
    {
        id: 2,
        company: "Soft Pay",
        title: "Add Pay Success Modal",
        description: "A card component has a figure, a body part, and inside body there are title and actions parts",
        deadline: "25 March 2025"
    },
    {
        id: 3,
        company: "Meta",
        title: "Add new reaction",
        description: "A card component has a figure, a body part, and inside body there are title and actions parts",
        deadline: "31 March 2025"
    },
    {
        id: 4,
        company: "Programming Hero",
        title: "Fix Video Loading Issue",
        description: "A card component has a figure, a body part, and inside body there are title and actions parts",
        deadline: "21 March 2025"
    },
    {
        id: 5,
        company: "Google LLC",
        title: "Integrate AI search",
        description: "A card component has a figure, a body part, and inside body there are title and actions parts",
        deadline: "01 April 2025"
    },
    {
        id: 6,
        company: "Polygon Tech",
        title: "Review Ami Probashi Site",
        description: "A card component has a figure, a body part, and inside body there are title and actions parts",
        deadline: "5 May 2025"
    }
];

const taskGrid = document.getElementById("taskGrid");
const taskCount = document.getElementById("taskCount");
const activityLog = document.getElementById("activityLog");
const alertBox = document.getElementById("alertBox");
const colorChangeBtn = document.getElementById("colorChangeBtn");
const discoverBtn = document.getElementById("discoverBtn");
const backBtn = document.getElementById("backBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const currentDate = document.getElementById("currentDate");

const completedTasks = new Set(
    JSON.parse(localStorage.getItem("completedTasks") || "[]")
);

const activityHistory = JSON.parse(
    localStorage.getItem("activityHistory") || "[]"
);

const backgroundColors = [
    "#f2f5ff",
    "#f1f8f4",
    "#fff8ed",
    "#f7f1ff",
    "#eef8fb",
    "#fff1f4"
];

let colorIndex = Number(localStorage.getItem("colorIndex") || 0);
let alertTimer;

function renderTasks() {
    if (!taskGrid) {
        return;
    }

    taskGrid.innerHTML = "";

    tasks.forEach((task) => {
        const isCompleted = completedTasks.has(task.id);

        const card = document.createElement("article");
        card.className = "task-card";

        card.innerHTML = `
            <div class="company">${task.company}</div>
            <h2 class="task-title">${task.title}</h2>
            <p class="task-description">${task.description}</p>
            <div class="task-footer">
                <div class="deadline">
                    Deadline
                    <strong>${task.deadline}</strong>
                </div>
                <button
                    class="complete-button ${isCompleted ? "completed" : ""}"
                    data-task-id="${task.id}"
                    type="button"
                    ${isCompleted ? "disabled" : ""}
                >
                    ${isCompleted ? "Completed" : "Complete"}
                </button>
            </div>
        `;

        taskGrid.appendChild(card);
    });

    updateTaskCount();
}

function updateTaskCount() {
    if (taskCount) {
        taskCount.textContent = tasks.length - completedTasks.size;
    }
}

function formatTime(date) {
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
    });
}

function addActivity(message) {
    activityHistory.unshift(message);
    localStorage.setItem("activityHistory", JSON.stringify(activityHistory));
    renderActivityLog();
}

function renderActivityLog() {
    if (!activityLog) {
        return;
    }

    activityLog.innerHTML = "";

    if (activityHistory.length === 0) {
        activityLog.innerHTML = '<p class="empty-log">No activity yet.</p>';
        return;
    }

    activityHistory.forEach((message) => {
        const item = document.createElement("p");
        item.className = "activity-item";
        item.textContent = message;
        activityLog.appendChild(item);
    });
}

function showAlert(message) {
    if (!alertBox) {
        return;
    }

    clearTimeout(alertTimer);
    alertBox.textContent = message;
    alertBox.classList.add("show");

    alertTimer = setTimeout(() => {
        alertBox.classList.remove("show");
    }, 3000);
}

function completeTask(taskId) {
    const task = tasks.find((item) => item.id === taskId);

    if (!task || completedTasks.has(taskId)) {
        return;
    }

    completedTasks.add(taskId);
    localStorage.setItem(
        "completedTasks",
        JSON.stringify([...completedTasks])
    );

    const time = formatTime(new Date());
    const message = `You have completed the task ${task.title} at ${time}.`;

    addActivity(message);
    renderTasks();
    showAlert(`${task.title} is completed.`);
}

function changeBackgroundColor() {
    colorIndex = (colorIndex + 1) % backgroundColors.length;

    document.body.style.backgroundColor = backgroundColors[colorIndex];
    localStorage.setItem("colorIndex", colorIndex);
}

function applySavedBackgroundColor() {
    if (document.body) {
        document.body.style.backgroundColor = backgroundColors[colorIndex];
    }
}

if (taskGrid) {
    taskGrid.addEventListener("click", (event) => {
        const button = event.target.closest(".complete-button");

        if (!button) {
            return;
        }

        const taskId = Number(button.dataset.taskId);
        completeTask(taskId);
    });
}

if (colorChangeBtn) {
    colorChangeBtn.addEventListener("click", changeBackgroundColor);
}

if (discoverBtn) {
    discoverBtn.addEventListener("click", () => {
        window.location.href = "questions.html";
    });
}

if (backBtn) {
    backBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => {
        activityHistory.length = 0;
        localStorage.setItem("activityHistory", JSON.stringify(activityHistory));
        renderActivityLog();
    });
}

if (currentDate) {
    currentDate.textContent = new Date().toDateString();
}

applySavedBackgroundColor();
renderTasks();
renderActivityLog();
