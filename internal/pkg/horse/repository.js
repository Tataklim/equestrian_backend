import {query} from "../repository_helper/query.js";

export default class HorseRepository {
    /**
     * Constructor
     * @param {Object} pool
     */
    constructor(pool) {
        this.pool = pool;
    }

    async createHorse(horse) {
        const str = 'INSERT INTO horses(moniker, sex, lear, country, breed, birth, image, passport_image, user_login) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
        const res = await query(this.pool, str, [
            horse.moniker,
            horse.sex,
            horse.lear,
            horse.country,
            horse.breed,
            horse.birth,
            horse.image,
            horse.passport_image,
            horse.login
        ]);
        return res;
    }

    async checkIfHorseExists(id) {
        const str = 'select * from horses where id = $1';
            const res = await query(this.pool, str, [
                id
            ]);
            return res.rowCount !== 0;
    }

    // async checkIfLoginExists(login) {
    //     const str = 'select * from users where login = $1';
    //     const res = await query(this.pool, str, [
    //         login
    //     ]);
    //     return res.rowCount !== 0;
    // }
}
