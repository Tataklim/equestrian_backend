import {query} from "../repository_helper/query.js";

export default class UserRepository {
    /**
     * Constructor
     * @param {Object} pool
     */
    constructor(pool) {
        this.pool = pool;
    }

    async createUser(user) {
        const str = 'INSERT INTO users(login, name, country, sex, birth, image) ' +
            'VALUES ($1, $2, $3, $4, $5, $6)';
        const res = await query(this.pool, str, [
            user.login,
            user.name,
            user.country,
            user.sex,
            user.birth,
            user.image,
        ]);
        return user;
    }

    async addOwning(login, horseID) {
        console.log(login)
        console.log(horseID)
        const str = 'insert into owners (horse_id, login) values ($1, $2)';
        const res = await query(this.pool, str, [
            horseID,
            login,
        ]);
        console.log(res)
        return 'ok';
    }

    async doesLoginExist(login) {
        const str = 'select * from users where login = $1';
        const res = await query(this.pool, str, [
            login
        ]);
        return res.rowCount !== 0;
    }
}
