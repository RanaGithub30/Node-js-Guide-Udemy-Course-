// Import necessary modules from Oak
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// Create a new Router instance
const router = new Router();

// Define the structure of a Todo item
interface todoInterface {
    id: string,   // unique identifier for the todo
    text: string  // description or content of the todo
}

// In-memory array to store todo items
let todos: todoInterface[] = [];

// ---------------------- ROUTES ---------------------- //

// GET /todos - return all todos
router.get('/todos', (ctx) => {
    ctx.response.body = { todos: todos }; // respond with all current todos
});

// POST /todos - create a new todo item
router.post('/todos', async (ctx) => {
    const body = ctx.request.body({ type: "json" }); // expect JSON body
    const value = await body.value; // await parsed JSON data

    // Create a new todo object
    const newTodo: todoInterface = {
        id: new Date().toISOString(), // generate unique timestamp-based ID
        text: value.text              // get 'text' from request body
    }

    todos.push(newTodo); // add new todo to the list

    ctx.response.body = {
        message: 'Created todo',
        todos: newTodo // respond with the newly created todo
    };
});

// PUT /todos/:todoId - update a specific todo item by ID
router.put('/todos/:todoId', async (ctx) => {
    const tid = ctx.params.todoId; // get the ID from URL
    const body = ctx.request.body({ type: "json" }); // expect JSON body
    const value = await body.value; // await parsed JSON data

    const todoIndex = todos.findIndex(todo => todo.id === tid); // find index of the todo

    // Update the todo if it exists
    if (todoIndex !== -1) {
        todos[todoIndex] = {
            id: todos[todoIndex].id, // keep the same ID
            text: value.text         // update the text
        };
        ctx.response.body = {
            message: 'Updated todo',
            todos: todos[todoIndex] // return the updated todo
        };
    } else {
        ctx.response.status = 404;
        ctx.response.body = { message: 'Todo not found' };
    }
});

// DELETE /todos/:todoId - delete a specific todo item by ID
router.delete('/todos/:todoId', (ctx) => {
    const tid = ctx.params.todoId; // get the ID from URL

    // Filter out the todo to delete
    todos = todos.filter(todo => todo.id !== tid);

    ctx.response.body = {
        message: 'Deleted todo',
        todos: todos // return remaining todos
    };
});

// Export the router to be used in your main server file
export default router;