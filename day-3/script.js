let todos = [];
let draggedIndex = null;
const saveKey = "dailyTodos";

let todoInput, todoList, emptyState, addBtn, prioritySelect, priorityFilter, tagInput;

const getElements = () => {
    todoInput = document.getElementById("todo-input");
    todoList = document.getElementById("todo-list");
    emptyState = document.getElementById("empty-state");
    addBtn = document.getElementById("add-btn");
    prioritySelect = document.getElementById("priority-select");
    priorityFilter = document.getElementById("priority-filter");
    tagInput = document.getElementById("tag-input");
}

const init = () => {
    getElements();
    addBtn.addEventListener("click", addTodo);
    todoInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addTodo();
    });

    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    priorityFilter.addEventListener("change", renderTodos);

    loadTheme();
    loadTodos();
};

const addTodo = () => {
    const text = todoInput.value.trim();
    if (!isValidInput(text)) return;
    const priority = prioritySelect.value;
    const rawTags = tagInput.value.trim();
    const tags = rawTags ? rawTags.split(",").map(t => t.trim()): [];

    if (text === "") return;

    todos.push({ 
        text,
        done: false,
        createdAt: new Date().toISOString(),
        priority,
        tags
     });
    todoInput.value = "";
    tagInput.value = "";
    prioritySelect.value = "medium";
    saveTodos();
    renderTodos();
};

const isValidInput = (text) => text.trim() !== "";

const setupDragEvents = (item, index) => {
    item.addEventListener("dragstart", () => draggedIndex = index);
    item.addEventListener("dragover", e => e.preventDefault());
    item.addEventListener("drop", () => {
        [todos[draggedIndex], todos[index]] = [todos[index], todos[draggedIndex]];
        saveTodos();
        renderTodos();
    });
};

const setupToggleDone = (item, index) => {
    item.addEventListener("click", () => {
        todos[index].done = !todos[index].done;
        saveTodos();
        renderTodos();
    });
};

const createRemoveButton = (index) => {
    const btn = document.createElement("button");
    btn.textContent = "x";
    btn.className = "remover-btn";
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    });
    return btn;
};

const createTodoElement = (todo, index) => {
    const item = document.createElement("li");
    item.className = "todo-item" + (todo.done ? " done" : "");
    item.classList.add(`priority-${todo.priority}`);
    item.draggable = true;
    item.style.position = "relative";

    setupDragEvents(item, index);
    setupToggleDone(item, index);

    item.appendChild(createSpan("todo-text", todo.text));
    item.appendChild(createSpan("todo-tags", Array.isArray(todo.tags) ? todo.tags.join(" • ") : ""));
    item.appendChild(createSpan("todo-meta", `${new Date(todo.createdAt).toLocaleDateString("hu-HU")} • ${todo.priority}`));
    item.appendChild(createRemoveButton(index));
    
    return item;
};

const createSpan = (className, text) => {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = text;
    return span;
};

const renderTodos = () => {
    todoList.innerHTML = "";

    const visibleTodos = getVisibleTodos();
    if (visibleTodos.length === 0) {
        emptyState.style.display = "block";
        return;
    }
    emptyState.style.display = "none";

    visibleTodos.forEach((todo, index) => {
        todoList.appendChild(createTodoElement(todo, index));
    });

    renderStats();
};

const getVisibleTodos = () => {
    const filter = priorityFilter.value;
    return filter ? todos.filter(t => t.priority === filter) : todos;
}

const saveTodos = () => {
    localStorage.setItem(saveKey, JSON.stringify(todos));
};

const loadTodos = () => {
    try {
        const saved = localStorage.getItem(saveKey);
        todos = saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error("JSON Error at localStorage:", error.message);
    }
    renderTodos();
};

const toggleTheme = () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
};

const loadTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
        document.body.classList.add("dark");
    }
};

const getStats = () => {
    const total = todos.length;
    const completed = todos.filter(t => t.done).length;
    const today = todos.filter(t => {
        const d = new Date(t.createdAt);
        const now = new Date();
        return d.toDateString() === now.toDateString();
    }).length;
    return { total, completed, today };
};

const renderStats = () => {
    const { total, completed, today } = getStats();
    animateCount(document.getElementById("stat-total"), total);
    animateCount(document.getElementById("stat-completed"), completed);
    animateCount(document.getElementById("stat-today"), today);
};

const animateCount = (element, target) => {
    let current = 0;
    const duration = 500;
    const startTime = performance.now();

    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * target);
        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };
    requestAnimationFrame(update);
}

window.addEventListener("load", init);