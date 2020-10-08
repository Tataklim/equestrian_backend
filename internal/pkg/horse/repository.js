import {query} from '../repository_helper/query.js';
import {STATUS} from '../../../config/consts.js';

export default class HorseRepository {
    /**
     * Constructor
     * @param {Object} pool
     */
    constructor(pool) {
        this.pool = pool;
    }

    async createHorse(horse) {
        const str = 'INSERT INTO horses(passport, moniker, sex, lear, country, breed, birth, image, passport_image, user_login) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
        await query(this.pool, str, [
            horse.passport,
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
        return STATUS.SUCCESS;
    }

    async checkIfHorseExists(passport) {
        const str = 'select * from horses where passport = $1';
        const res = await query(this.pool, str, [
            passport
        ]);
        return res.rowCount !== 0;
    }

    async checkIfHorseExistsAndGetOwner(passport) {
        const str = 'select user_login from horses where passport = $1';
        const res = await query(this.pool, str, [
            passport
        ]);
        return res.rows[0]?.user_login;
    }

    async getOwner(passport) {
        const str = `select o.user_login, o.start_owning, u.name, u.country, u.image 
        from users u inner join owners o on o.horse_passport = $1 where o.user_login = u.login and o.end_owning is null`;
        const res = await query(this.pool, str, [
            passport
        ]);
        return res.rows[0];
    }

    async getPastOwners(passport) {
        const str = `select o.user_login, o.start_owning, o.end_owning, u.name, u.country, u.image 
        from users u inner join owners o on o.horse_passport = $1 where o.user_login = u.login and o.end_owning is not null`;
        const res = await query(this.pool, str, [
            passport
        ]);
        return res.rows;
    }

    async getHorses(limit, offset) {
        const str = 'select passport, moniker, sex, lear, country, breed, birth, image, passport_image ' +
            'from horses order by passport limit $1 offset $2;';
        const res = await query(this.pool, str, [
            limit,
            offset,
        ]);
        return res.rows;
    }

    async getHorse(passport) {
        const str = 'select passport, moniker, sex, lear, country, breed, birth, image, passport_image from horses where passport=$1';
        const res = await query(this.pool, str, [
            passport
        ]);
        return res.rows[0];
    }

    async getTraining(passport) {
        const str = 'select name, country, image, o.user_login ' +
            'from users  inner join trains o on users.login = o.user_login ' +
            'where o.horse_passport = $1';
        const res = await query(this.pool, str, [
            passport
        ]);
        return res.rows;
    }

    // async checkIfLoginExists(login) {
    //     const str = 'select * from users where login = $1';
    //     const res = await query(this.pool, str, [
    //         login
    //     ]);
    //     return res.rowCount !== 0;
    // }
}
