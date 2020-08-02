import {query} from "../repository_helper/query.js";

export default class UserRepository {
    /**
     * Constructor
     * @param {Object} pool
     */
    constructor(pool) {
        this.pool = pool;
        // this.repository = new UserRepository(pool);
    }

    async createUser(user) {
        console.log(user);
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

    async checkIfLoginExists(login) {
        const str = 'select * from users where login = $1';
        const res = await query(this.pool, str, [
            login
        ]);
        return res.rowCount !== 0;
    }
}
