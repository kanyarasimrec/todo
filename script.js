document.addEventListener("DOMContentLoaded", function () {

    const taskList = document.getElementById("taskList");
    const taskInput = document.getElementById("taskInput");
    const prioritySelect = document.getElementById("prioritySelect");
    const dailyNote = document.getElementById("dailyNote");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    /* DAILY NOTE AUTO RESIZE */
    dailyNote.value = localStorage.getItem("dailyNote") || "";
    autoResize();
    dailyNote.addEventListener("input", function () {
        localStorage.setItem("dailyNote", dailyNote.value);
        autoResize();
    });

    function autoResize() {
        dailyNote.style.height = "auto";
        dailyNote.style.height = dailyNote.scrollHeight + "px";
    }

    window.addTask = function () {
        if (taskInput.value.trim() === "") return;

        tasks.push({
            title: taskInput.value,
            completed: false,
            priority: prioritySelect.value,
            subtasks: []
        });

        taskInput.value = "";
        saveAndRender();
    };

    function saveAndRender() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = "";

        tasks.forEach((task, index) => {

            const card = document.createElement("div");
            card.className = `task-card ${task.priority}`;

            const header = document.createElement("div");
            header.className = "task-header";

            const title = document.createElement("span");
            title.className = "task-title";
            if (task.completed) title.classList.add("completed");
            title.innerText = task.title;

            title.onclick = () => {
                task.completed = !task.completed;
                saveAndRender();
            };

            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "❌";
            deleteBtn.onclick = () => {
                tasks.splice(index, 1);
                saveAndRender();
            };

            header.appendChild(title);
            header.appendChild(deleteBtn);
            card.appendChild(header);

            /* Subtask Input */
            const wrapper = document.createElement("div");
            wrapper.className = "subtask-input-wrapper";

            const subInput = document.createElement("input");
            subInput.placeholder = "Add subtask...";

            const subBtn = document.createElement("button");
            subBtn.innerText = "Add";

            subBtn.onclick = () => {
                if (subInput.value.trim() === "") return;

                task.subtasks.push({
                    title: subInput.value,
                    completed: false
                });

                subInput.value = "";
                saveAndRender();
            };

            wrapper.appendChild(subInput);
            wrapper.appendChild(subBtn);
            card.appendChild(wrapper);

            /* Subtask List */
            task.subtasks.forEach((sub, subIndex) => {

                const subDiv = document.createElement("div");
                subDiv.className = "subtask";

                const subTitle = document.createElement("span");
                subTitle.innerText = sub.title;
                if (sub.completed) subTitle.classList.add("completed");

                subTitle.onclick = () => {
                    sub.completed = !sub.completed;
                    saveAndRender();
                };

                const subDelete = document.createElement("button");
                subDelete.innerText = "❌";
                subDelete.onclick = () => {
                    task.subtasks.splice(subIndex, 1);
                    saveAndRender();
                };

                subDiv.appendChild(subTitle);
                subDiv.appendChild(subDelete);
                card.appendChild(subDiv);
            });

            taskList.appendChild(card);
        });
    }

    renderTasks();
});