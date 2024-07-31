class todoClass {   

    constructor(value) {
        this.todo = JSON.parse(localStorage.getItem(value)) ?? [];
    }

    gettodo() {
        return this.todo;
    }

    settodo(value, todo) {
        this.todo = todo;
        localStorage.setItem(value, JSON.stringify(todo));
    }

}

document.getElementById('datepicker').valueAsDate = new Date();
const todoobj = new todoClass('todo');
let clearAlertTimeout = '';
let updatedtodolisttext = '';
showTodo();

function onDateChange() {
    if(updatedtodolisttext !== '') {
        updatedtodolisttext = '';
        todoinput.value = "";
        todoaddicondiv.setAttribute('onclick',"addTodo();");
        todoaddicondiv.firstElementChild.classList.replace('fa-pen-to-square', 'fa-plus');
    }
    todoalert.innerHTML = '';
    showTodo();
}

function addTodo() {

    const todoinput = document.getElementById('todoinput');
    const tododate = document.getElementById('datepicker');
    const todoul = document.getElementById('todoul');

    todoinput.value = todoinput.value.replace(/\s+/g,' ').trim();;

    if(!todoinput.value) {
        alertMessage('Please enter your TODO text!!', 'red');
        todoinput.focus();
        return;
    }

    const todovalue = {
        text : todoinput.value,
        status : false,
    } 
    let todo = todoobj.gettodo();
    let todoitem = gettodoitembydate(todo);

    if(todoitem == undefined ){
        todoitem = {
            date : tododate.value,
            todolist : [todovalue],
        };
        todo.push(todoitem);
    }
    else {
        let isPresent = false;
        todoitem.todolist.forEach(element => {
            if(element.text === todoinput.value){
                isPresent = true;
                return;
            }
        });
        if(isPresent)
        {
            alertMessage('The Above TODO task is already Present!!', 'red');
            todoinput.focus();
            return;
        }
        todoitem.todolist.push(todovalue);
    }

    todoobj.settodo('todo', todo);
    todoul.innerHTML += newtodocontent(todoinput.value,false);
    todoinput.value = '';
    alertMessage('TODO Task is Successfully Created!!', 'green');

} 

function showTodo() {

    const todoul = document.getElementById('todoul');
    
    let todo = todoobj.gettodo();
    let todoitem = gettodoitembydate(todo);
    if(todoitem == undefined || todoitem.todolist.length == 0) {
        todoul.innerHTML='';
        alertMessage('No TODO Tasks!!', 'green');
        return;
    }
    todoul.innerHTML=''
    todoitem.todolist.forEach( todovalue => {
        if(todovalue.status) {
            todoul.innerHTML+=newtodocontent(todovalue.text, true);
        }
        else {
            todoul.innerHTML+=newtodocontent(todovalue.text, false);
        }
    });

}


function completedTodoTask(ev) {

    let todolisttext = ev.firstElementChild.lastElementChild;
    if(todolisttext.style.textDecoration === '') {
        todolisttext.style.textDecoration = 'line-through';
        ev.querySelector(".todoedit").remove();
        const checkicon = document.createElement('i');
        checkicon.classList.add('fa-solid','fa-check','todocheckicon');
        ev.firstElementChild.insertBefore(checkicon, todolisttext);
        let todo = todoobj.gettodo();
        let todoitem = gettodoitembydate(todo);
        todoitem.todolist.forEach(element => {
            if(element.text === todolisttext.innerHTML){
                element.status = true;
            }
        });
        todoobj.settodo('todo', todo);
    }
    else {
        todolisttext.style.textDecoration = '';
        ev.firstElementChild.firstElementChild.remove();
        const deleteicon = ev.lastElementChild.lastElementChild;
        const editicon = document.createElement('i');
        editicon.classList.add('fa-solid', 'fa-pen-to-square', 'todoedit');
        editicon.setAttribute('onclick', 'edittodo(this);');
        ev.lastElementChild.insertBefore(editicon, deleteicon);

        let todo = todoobj.gettodo();
        let todoitem = gettodoitembydate(todo);
        todoitem.todolist.forEach(element => {
            if(element.text === todolisttext.innerHTML){
                element.status = false;
            }
        });
        todoobj.settodo('todo', todo);
    }
}


function edittodo(ev) {

    if(updatedtodolisttext !== '') {
        updatedtodolisttext.parentElement.parentElement.lastElementChild.style.display = 'block';
        updatedtodolisttext = ''
    }

    const todoinput = document.getElementById('todoinput');
    const todoaddicondiv = document.getElementById('todoaddicondiv');
    updatedtodolisttext = ev.parentElement.parentElement.firstElementChild.lastElementChild;
    ev.parentElement.style.display = 'none';
    todoinput.value = updatedtodolisttext.innerText;
    todoaddicondiv.setAttribute('onclick',`saveedit(this);`);
    todoaddicondiv.firstElementChild.classList.replace('fa-plus','fa-pen-to-square');
    todoinput.focus();

}

function saveedit(ev) {

    const todoinput = document.getElementById('todoinput');

    todoinput.value = todoinput.value.replace(/\s+/g,' ').trim();;

    if(!todoinput.value) {
        alertMessage('Please enter your TODO text!!', 'red');
        todoinput.focus();
        return;
    }

    if(todoinput.value === updatedtodolisttext.innerText) {
        updatedtodolisttext.parentElement.parentElement.lastElementChild.style.display = 'block';
        updatedtodolisttext = '';
        todoinput.value = "";
        todoaddicondiv.setAttribute('onclick',"addTodo();");
        todoaddicondiv.firstElementChild.classList.replace('fa-pen-to-square', 'fa-plus');
        return;
    }

    let todo = todoobj.gettodo();
    let todoitem = gettodoitembydate(todo);

    let isPresent = false;
    todoitem.todolist.forEach(element => {
        if(element.text === todoinput.value){
            isPresent = true;
            return;
        }
    });
    if(isPresent)
    {
        alertMessage('The Above TODO task is already Present!!', 'red');
        todoinput.focus();
        return;
    }

    const todovalue = todoitem.todolist.find(element => {
        return element.text === updatedtodolisttext.innerText;
    });
    todovalue.text = todoinput.value;
    todoobj.settodo('todo', todo);

    updatedtodolisttext.innerText = todoinput.value;
    updatedtodolisttext.parentElement.parentElement.lastElementChild.style.display = 'block';

    updatedtodolisttext = '';
    todoinput.value = "";
    todoaddicondiv.setAttribute('onclick',"addTodo();");
    todoaddicondiv.firstElementChild.classList.replace('fa-pen-to-square', 'fa-plus');

    alertMessage('Todo Task value updated!!', 'green');

}


function deletetodo(ev) {
    let todo = todoobj.gettodo();
    let todoitem = gettodoitembydate(todo);
    const deleteIndex = todoitem.todolist.findIndex((element) => {
        return element.text === ev.parentElement.parentElement.firstElementChild.lastElementChild.innerText;
    });
    todoitem.todolist.splice(deleteIndex, 1);
    todoobj.settodo('todo', todo);
    ev.parentElement.parentElement.remove();
    if(todoitem.todolist.length == 0) {
        todoul.innerHTML='';
        alertMessage('No TODO Tasks!!', 'green')
    }
}

function alertMessage(text, color) {
    if(clearAlertTimeout !== '') {
        clearTimeout(clearAlertTimeout);
        clearAlertTimeout = undefined;
    }
    const todoalert = document.getElementById('todoalert');
    todoalert.innerHTML = text;
    todoalert.style.color = color;
    clearAlertTimeout = setTimeout(function() {
        todoalert.innerHTML = '';
    },3000);
}

function gettodoitembydate(todo) {
    const tododate = document.getElementById('datepicker');
    return todo.find(element => {
        return element.date === tododate.value;       
    });
}

function todoinputvalidation(ev) {
    if(ev.value.startsWith(" ")) {
        ev.value = '';
    }
}

function newtodocontent(todovalue,status) {
    if(status) {
        return  `
                    <li ondblclick="completedTodoTask(this);">
                        <div class="todolistcontent">
                            <i class="fa-solid fa-check todocheckicon"></i>
                            <p class="todolisttext" style="text-decoration:line-through;">${todovalue}</p>
                        </div>
                        <div class="todolisticons">
                            <i class="fa-solid fa-trash tododelete" onclick="deletetodo(this);"></i>
                        </div>
                    </li>
                `;
    }
    else {
        return  `
                    <li ondblclick="completedTodoTask(this);">
                        <div class="todolistcontent">
                            <p class="todolisttext">${todovalue}</p>
                        </div>
                        <div class="todolisticons">
                            <i class="fa-solid fa-pen-to-square todoedit" onclick="edittodo(this);"></i>
                            <i class="fa-solid fa-trash tododelete" onclick="deletetodo(this);"></i>
                        </div>
                    </li>
                `;
    }
        
}
