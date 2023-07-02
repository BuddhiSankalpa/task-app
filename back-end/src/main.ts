import express, {json} from 'express';
import {router} from "./api/task-controller";
import cors from 'cors';

export const app = express();
app.use(cors());

app.use(json());
app.use("/app/api/v1/task", router);
app.listen(8080,() => console.log("Server has been started at 8080"));