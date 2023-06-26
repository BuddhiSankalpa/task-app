import express, {json} from 'express';
import {router} from "./api/task-controller";


export const app = express();


app.use(json());
app.use("/app/api/v1/task", router);
app.listen(8080,() => console.log("Server has been started at 8080"));