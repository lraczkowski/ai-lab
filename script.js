document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.getElementById("task-list");
    const newTaskInput = document.getElementById("new-task");
    const taskDueDateInput = document.getElementById("task-due-date");
    const addTaskButton = document.getElementById("add-task");
    const searchInput = document.getElementById("search");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let filteredTasks = [];

    function updateTaskListDisplay(searchTerm = "") {
        taskList.innerHTML = "";
        const taskArray = searchTerm ? filteredTasks : tasks;

        taskArray.forEach((task, index) => {
            const listItem = document.createElement("li");
            const taskName = task.name.toLowerCase();
            const highlightedName = taskName.replace(
                new RegExp(searchTerm, "gi"),
                (match) => `<mark>${match}</mark>`
            );
            listItem.innerHTML = `
                <span>${highlightedName}</span>
                <input class="task-due-date" type="datetime-local" value="${task.dueDate}">
                <button class="delete">Delete</button>
            `;
            taskList.appendChild(listItem);

            // Handle task editing for name
            listItem.querySelector("span").addEventListener("dblclick", () => {
                const taskNameSpan = listItem.querySelector("span");
                taskNameSpan.setAttribute("contentEditable", "true");
                taskNameSpan.focus();

                taskNameSpan.addEventListener("blur", () => {
                    const editedTaskName = taskNameSpan.textContent;
                    if (editedTaskName.trim() !== "" && editedTaskName.length > 2) {
                        taskArray[index].name = editedTaskName;
                        saveTasksToLocalStorage(taskArray);
                    } else {
                        taskNameSpan.textContent = task.name;
                    }
                    updateTaskList(searchTerm);
                });
            });

            // Handle task editing for due-date
            const taskDueDateInput = listItem.querySelector(".task-due-date");
            taskDueDateInput.addEventListener("blur", () => {
                const editedDueDate = taskDueDateInput.value;

                if (editedDueDate === "" || new Date() < new Date(editedDueDate)){
                    taskArray[index].dueDate = editedDueDate;
                    saveTasksToLocalStorage(taskArray);
                    updateTaskList(searchTerm);
                } else {
                    alert("YOU DONT HAVE TIME MACHINE.");
                }
                updateTaskList();
            });

            // Handle task deletion button
            const deleteButton = listItem.querySelector(".delete");
            deleteButton.addEventListener("click", () => {
                const filteredIndex = tasks.findIndex((taskItem) => taskItem === task);
                tasks.splice(filteredIndex, 1);
                saveTasksToLocalStorage(tasks);
                if (searchTerm) {
                    updateTaskList(searchTerm);
                } else {
                    updateTaskList();
                }
            });
        });
    }

    function updateTaskList(searchTerm = "") {
        if (searchTerm) {
            filteredTasks = tasks.filter((task) =>
                task.name.toLowerCase().includes(searchTerm)
            );
        }
        updateTaskListDisplay(searchTerm);
    }

    // Initial update of task list
    updateTaskListDisplay();

    // Handle adding new task button
    addTaskButton.addEventListener("click", () => {
        const taskName = newTaskInput.value;
        const dueDate = taskDueDateInput.value;

        if (taskName.length >= 3 && taskName.length <= 255) {
            if (dueDate === "" || new Date() < new Date(dueDate)) {
                tasks.push({ name: taskName, dueDate });
                newTaskInput.value = "";
                taskDueDateInput.value = "";
                updateTaskListDisplay();
                saveTasksToLocalStorage(tasks);
            } else {
                alert("YOU DONT HAVE TIME MACHINE.");
            }
        } else {
            alert("3 to 255 chars.");
        }
    });

    // Handle searching for tasks
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();

        if (searchTerm.length >= 2) {
            updateTaskList(searchTerm);
        } else {
            updateTaskList();
        }
    });

    function saveTasksToLocalStorage(taskArray) {
        localStorage.setItem("tasks", JSON.stringify(taskArray));
    }
});