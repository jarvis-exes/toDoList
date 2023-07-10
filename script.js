(function(){ // inside IIFE function so that no ome can elements directly from DOM
    let tasks = []; // Empty array for list of tasks
    const taskList = document.getElementById('list');
    const addTaskInput = document.getElementById('add');
    const tasksCounter = document.getElementById('tasks-counter');
    const notification = document.getElementById('notification');

    // Function to get ToDO List items from given URL using API's
    async function fetchTodos(){
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            const data = await response.json();
            tasks = data.slice(0,10);
            renderList();
        } 
        catch (error) {
            console.log('Error', error);
        }
    }

    //Function to display the list of tasks on the webPage
    function renderList() {
        taskList.innerHTML = '';
        //Reading array in reverse direction to render the lastet item at top
        for(let i=tasks.length-1; i>=0; i--){
            addTaskToDOM(tasks[i]);
        }
        // This will populate the total number of tasks
        tasksCounter.innerHTML = tasks.length;
    }

    // Function to add task to the webPage as an list item
    function addTaskToDOM(task){
        const li = document.createElement('li');
        const hr = document.createElement('hr');

        li.innerHTML = `
            <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''} class="custom-checkbox">
            <label for="${task.id}">${task.title}</label>
            <img src="images/remove.png" class="delete" data-id="${task.id}" />
            `;

        taskList.append(li);
        taskList.append(hr);
       
    }

    // Function to mark task as completed
    function toggleTask(taskId) {
        const task = tasks.filter(function(task){
            return task.id == Number(taskId);
        });

        if(task.length>0){
            const currentTask = task[0];

            currentTask.completed = !currentTask.completed;
            renderList();
            showNotification('Task Toggled successfully','Blue');
            return;
        }
    }

    //Function to delete a task
    function deleteTask(taskId) {
        const newTasks = tasks.filter(function(task){
            return task.id != Number(taskId);
        });

        tasks = newTasks;
        renderList();
        showNotification('Task Deleted','Red');
    }

    //Function to add a task
    function addTask(task) {
        if(task){
            tasks.push(task);
            renderList();
            showNotification('Task Added', 'Green');
            return;
        }
    }

    //Function to display notifications
    //Accepts two parameters, one is the text of notifcation and second is BG color of notification
    function showNotification(text, color) {
        notification.innerHTML = text;
        notification.style.backgroundColor = color;
        notification.style.animation ='myAnimation 3s linear';
        notification.style.display = 'inline';
        // Calling this funtion to hide notification after some time
        hideNotification();
    }

    // Function to hide the pop up notification
    function hideNotification(){
        var timeInterval = 3000; // 3 seconds

         // Function to hide the element
        function hideElement() {
            notification.style.display = "none";
        }
        // Call the hideElement function after the specified time interval
        setTimeout(hideElement, timeInterval);
    }
    
    // Function to handle the key presses
    function handleInputKeypress(e) {
        if(e.key == 'Enter'){
            const title = e.target.value;

            if(!title){
                showNotification('Tast text is empty','Orange');
                return;
            }

            const task = {
                title,
                id: Date.now(),
                completed: false
            }

            e.target.value = '';
            addTask(task);
        }
    }

    // Function for handling mouse click events on various elements
    function handleClickListener(e){
        const target = e.target;

        if(target.className == 'custom-checkbox'){
            const taskId = target.id;
            toggleTask(taskId);
            return;
        }

        else if(target.className == 'delete'){
            const taskId = target.dataset.id;
            deleteTask(taskId);
            return;
        }
    }

    //Function to start event listners and default functions
    function initializeApp(){
        fetchTodos();
        addTaskInput.addEventListener('keyup', handleInputKeypress);
        document.addEventListener('click', handleClickListener);
    }

    initializeApp();
})()
