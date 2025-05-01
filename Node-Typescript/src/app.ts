import express from 'express';
import bodyParser from 'body-parser';
import todosRoute from './routes/todos';

const app = express();

app.use(bodyParser.json());

app.use('/todos', todosRoute);

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${3000}`);
});