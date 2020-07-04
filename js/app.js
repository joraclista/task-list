/**
 * Define UI vars
 */

const LOCAL_STORAGE_TASKS_KEY = "tasks";

const form = document.getElementById("task-form");
const taskList = document.getElementById("collection");
const clearBtn = document.getElementById("clear-btn");
const filter = document.getElementById("filter");
const taskInput = document.getElementById("task");


const STORAGE = {
    save : function(task) {
        console.log(`save: task=${task}`);
        var tasks = this.getAll();
        tasks.push(task);
        localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
    },

    getAll : () => {
        var _tasks = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
        return _tasks != null ? JSON.parse(_tasks) : [];
    },

    clear : function () {
        console.log(`clear:`);
        localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, "[]");
    },

    remove : function(taskIndex) {
        console.log(`remove: taskIndex=${taskIndex}`);
        var tasks = this.getAll();
        tasks.splice(taskIndex, 1);

        localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
    }
}


loadEventListeners();


function loadEventListeners() {
    form.addEventListener("submit", addTask);
    taskList.addEventListener("click", removeTask);
    clearBtn.addEventListener("click", clearTasks);
    filter.addEventListener("keyup", filterTasks);

    document.addEventListener("DOMContentLoaded", init());
}

function init() {
    //get tasks from local storage if available
    STORAGE.getAll().forEach(task => drawTaskItem(task));
}



function addTask(e) {
    const taskName = taskInput.value;

    if (taskName == '') {
        alert("Add  a task");
        return;
    }
    drawTaskItem(taskName);

    taskInput.value = '';
    taskInput.focus();

    STORAGE.save(taskName);

    e.preventDefault();
}

function drawTaskItem(task) {
    const li = document.createElement("li");
    li.className = "collection-item";
    li.appendChild(document.createTextNode(task));

    const link = document.createElement("a");
    link.className = "delete-item secondary-content";
    link.innerHTML = "<i class='fa fa-remove'></i>"
    li.appendChild(link);

    taskList.appendChild(li);
}



function removeTask(e) {
    if (e.target.parentElement.classList.contains("delete-item")) {
        if (confirm("Are You Sure?")) {
            let taskName = e.target.parentElement.parentElement.textContent;
            console.log(`removeTask: taskName=${taskName}`);
            liItem = e.target.parentElement.parentElement;
            var taskIndex = Array.from(liItem.parentElement.children).indexOf(liItem);
            console.log(`removeTask: taskIndex=${taskIndex}`);
            liItem.remove();
            STORAGE.remove(taskIndex);
        }
    }
}

function clearTasks() {
    if (confirm("Are You Sure?")) {
        while (taskList.firstChild) {
            taskList.firstChild.remove();
        }
        STORAGE.clear();
    }

}

function filterTasks(e) {
    const filterText = e.target.value.toLowerCase();
    console.log(`filterTasks: filter=${filterText}`);
    taskList.childNodes.forEach(item => {
        console.log(`filterTasks: item=${item}`);
        if (item.textContent.toLowerCase().match(filterText) == null) {
            item.style.display = 'none';
        } else {
            item.style.display = 'block';
        }

    });

}