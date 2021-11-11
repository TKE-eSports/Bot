import MySQL from "mysql-database";
import { container } from "@sapphire/framework";
import { AsyncQueue } from "@sapphire/async-queue";
import { Database } from "../../config";
const queue = new AsyncQueue();
const database = new MySQL();

export const connectDatabase = async () => {
    queue.wait();
    const db = await database.connect({
        ...Database
    });
    db.on('connected', () => {
        container.logger.info(`Connected to database`);
        queue.shift();
    });
    db.on("error", () => {
        container.logger.error(`Database error has ocurred`)
    });
    return db;
}