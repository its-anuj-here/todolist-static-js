let taskListArr = [];
let editingTaskId = null;

function createTemplate(){

    //body tag parts
    let pageHeader = document.createElement('h1');
    pageHeader.id="page-header";
    pageHeader.innerText="To-Do List";
    document.body.appendChild(pageHeader);
    
    let mainContainer = document.createElement('div');
    mainContainer.id="main-container";

    //main container parts
    let taskListArea = document.createElement('div');
    taskListArea.id="task-list-area";
    
    //task list parts
    let taskListHeader = document.createElement('div');
    taskListHeader.id="task-list-header";
    taskListHeader.innerText="Task List";

    taskListArea.appendChild(taskListHeader);

    let taskListSpace = document.createElement('div');
    taskListSpace.id="task-list-space";
    taskListSpace.addEventListener('change', function(event){
        let target = event.target;
        let eleParent = document.getElementById(target.id).parentElement;
        let parentId = eleParent.id.split("-")[1];

        if(target.classList.contains('task-item-checkbox')){
            //editBtn will be disabled if task is marked as complete
            let taskEditBtn = eleParent.children[2];
            let currentTextTag=  eleParent.children[1];
            if (eleParent.children[0].checked) {
                taskEditBtn.disabled = true;
                updateTaskComplete(parentId, true);
                currentTextTag.classList.add("task-item-text-checkedBg");
            }else {
                taskEditBtn.disabled = false;
                updateTaskComplete(parentId, false);
                currentTextTag.classList.remove("task-item-text-checkedBg");
            }
        }else if(target.classList.contains('task-item-textbox')){

        }
    });
    taskListSpace.addEventListener('click', function(event){
        let target = event.target;
        let eleParent = document.getElementById(target.id).parentElement;
        let parentId = eleParent.id.split("-")[1];

        if(target.classList.contains('task-item-editBtn')){
            //checking if already checked as complete then can't edit it
            if(eleParent.children[0].checked){
                return ;
            }
            const taskTextTag = eleParent.children[1];

            const taskInputArea = document.getElementById("task-input-area");
            taskInputArea.value = taskTextTag.innerText;
                
            editingTaskId = parentId;
            taskInputArea.focus();
        }else if(target.classList.contains('task-item-deleteBtn')){
            let delResponse = true//confirm("Are you sure about deleting the task?", false);
            if(delResponse){
                deleteTask(parentId);
                if(editingTaskId===parentId){
                    editingTaskId=null;
                }
                eleParent.remove();
            }
        }

    })

    taskListArea.appendChild(taskListSpace);
    
    //task input space part
    let taskInputSpace = document.createElement('div');
    taskInputSpace.id="task-input-space";

    //task input space container heading
    let taskInputHeader = document.createElement('div');
    taskInputHeader.id="task-input-header";
    taskInputHeader.innerText="Enter Tasks and Press Enter";

    //task input space container inputArea
    let taskInputArea = document.createElement('textarea');
    taskInputArea.id="task-input-area";
    
    //task input actions
    let actionBtns = document.createElement('div');
    actionBtns.id= 'task-input-area-action-btns-div';

    let taskInputAreaClear = document.createElement('input');
    taskInputAreaClear.type = 'button';
    taskInputAreaClear.value= 'Clear';
    taskInputAreaClear.id= 'task-input-area-clear-btn';
    taskInputAreaClear.classList.add('task-input-area-action-btns');
    taskInputAreaClear.addEventListener("click", function(){
        document.getElementById("task-input-area").value = "";
        if(editingTaskId!=null){
            editingTaskId=null;
        }
    });


    actionBtns.appendChild(taskInputAreaClear);

    taskInputArea.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const taskText = this.value.trim();
            if (taskText == "") return;

            if(editingTaskId!=null){
                const editingTaskParent =document.getElementById(`task-${editingTaskId}`);
                const taskTextTag = document.getElementById(`task-${editingTaskId}-text`);
                taskTextTag.innerText = taskText;
                updateTaskText(editingTaskId, taskText);
                editingTaskId = null;
            }else{
                let currentId = 1;
                const listSpace = document.getElementById("task-list-space");
                if(listSpace.children.length>0){
                    let firstId = listSpace.firstElementChild.id.split("-");
                    currentId= 1+parseInt(firstId[1]);
                }
                let task = {
                    text : taskText,
                    id: currentId,
                    complete: false
                }
                createTask(task);
            }
            this.value="";
        }

    });


    //appending child to parent according to structure
    taskInputSpace.appendChild(taskInputHeader);
    taskInputSpace.appendChild(taskInputArea);
    taskInputSpace.appendChild(actionBtns);

    mainContainer.appendChild(taskListArea);
    mainContainer.appendChild(taskInputSpace);
    document.body.appendChild(mainContainer);
    printStoredTask();
}

function updateLocalStorage(arr){
    localStorage.setItem("todoTaskList", JSON.stringify(arr));
}

function printStoredTask(){
    let oldTasks = JSON.parse(localStorage.getItem("todoTaskList"));
    if (oldTasks!==null) oldTasks.forEach(oldTask => taskListArr.push(oldTask));
    if(taskListArr.length>0){
        taskListArr.forEach((task)=> addTask(task));
    }
}

function createTask(task){
    taskListArr.push({
        id:task.id,
        text:task.text,
        complete:task.complete
    });
    updateLocalStorage(taskListArr);
    addTask(task);
}

function updateTaskText(taskId, newText){
    taskListArr.forEach((item)=>{
        if(parseInt(taskId)===item.id){
            item.text= newText;
        }
    });
    updateLocalStorage(taskListArr);
}

function updateTaskComplete(taskId, complete){
    taskListArr.forEach((item)=>{
        if(parseInt(taskId)===item.id){
            item.complete= complete;
        }
    });
    updateLocalStorage(taskListArr);
}

function deleteTask(taskId){
    taskListArr.forEach((item, index)=>{
        if(parseInt(taskId)===item.id){
            taskListArr.splice(index, 1);
        }
    });
    updateLocalStorage(taskListArr);
}

function addTask(task){
    let taskDiv = document.createElement('div');
    taskDiv.id='task-'+task.id;
    taskDiv.className="task-list-item";

    //Task Text Input
    let taskTextTag = document.createElement('label');
    taskTextTag.innerText = task.text;
    taskTextTag.id = 'task-'+task.id+'-text';
    taskTextTag.className='task-item-text';

    //Task CheckBox
    let taskCheckBox = document.createElement('input');
    taskCheckBox.type = 'checkbox';
    taskCheckBox.id = 'task-'+task.id+'-checkbox';
    taskCheckBox.className='task-item-checkbox';

    //Task Edit Button
    let taskEditBtn = document.createElement('input');
    taskEditBtn.type = 'button';
    taskEditBtn.value = 'Edit';
    taskEditBtn.id = 'task-'+task.id+'-editBtn';
    taskEditBtn.className='task-item-editBtn';

    //Task Delete Button
    let taskDeleteBtn = document.createElement('input');
    taskDeleteBtn.type = 'button';
    taskDeleteBtn.value = 'Delete';
    taskDeleteBtn.id = 'task-'+task.id+'-deleteBtn';
    taskDeleteBtn.className='task-item-deleteBtn';

    if(task.complete===true){
        taskTextTag.classList.add("task-item-text-checkedBg");
        taskCheckBox.checked=true;
        taskEditBtn.disabled=true;
    }

    taskDiv.appendChild(taskCheckBox);
    taskDiv.appendChild(taskTextTag);
    taskDiv.appendChild(taskEditBtn);
    taskDiv.appendChild(taskDeleteBtn);
    let taskListSpaceParent = document.getElementById("task-list-space");
    taskListSpaceParent.insertBefore(taskDiv, taskListSpaceParent.firstElementChild);
}


createTemplate();
