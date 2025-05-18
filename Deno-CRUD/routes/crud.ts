import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { usersCollection } from "../db/mongo-connection.ts";

// Create a new Router instance
const router = new Router();

router.get('/', async (ctx) => {
    const users = await usersCollection.find().toArray();
    ctx.response.body = users;
    ctx.response.body = {
        message: 'Users fetched successfully',
        status: 200,
        data: users
    };
});

router.post('/create', async (ctx) => {
    const data = await ctx.request.body().value;
    await usersCollection.insertOne(data);
    ctx.response.body = {
        message: 'User created successfully',
        status: 200,
        data
    };    
});

router.get('/get/:id', async (ctx) => {
    const userId = ctx.params.id;
    const user = await usersCollection.findOne({ _id: userId });
    ctx.response.body = {
        message: 'User fetched successfully',
        status: 200,
        data: user
    };
});


router.put('/update/:id', async (ctx) => {
    const userId = ctx.params.id;
    const data = await ctx.request.body().value;
    await usersCollection.updateOne({ _id: userId }, { $set: data });
    ctx.response.body = {
        message: 'User updated successfully',
        status: 200
    }    
});

router.delete('/delete/:id', async (ctx) => {
    const userId = ctx.params.id;
    await usersCollection.deleteOne({ _id: userId });
    ctx.response.body = {
        message: 'User deleted successfully',
        status: 200
    }    
});

export default router;