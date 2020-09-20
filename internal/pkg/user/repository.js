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

    async addOwning(login, passport) {
        const str = 'insert into owners (horse_passport, user_login) values ($1, $2)';
        const res = await query(this.pool, str, [
            passport,
            login,
        ]);
        return 'ok';
    }

    async doesLoginExist(login) {
        const str = 'select * from users where login = $1';
        const res = await query(this.pool, str, [
            login,
        ]);
        return res.rowCount !== 0;
    }

    async getHorses(login) {
        const str = 'select passport,moniker,sex, lear, country, breed, birth, image, passport_image, o.user_login,' +
            ' o.start_owning from horses inner join owners o on horses.passport = o.horse_passport where o.user_login=$1 ' +
            'and o.end_owning is null order by o.start_owning'

        const res = await query(this.pool, str, [
            login,
        ]);
        return res.rows;
    }

    async getPastHorses(login) {
        const str = 'select passport,moniker,sex, lear, country, breed, birth, image, passport_image, o.user_login, ' +
            'o.start_owning from horses inner join owners o on horses.passport = o.horse_passport where o.user_login=$1 and ' +
            'o.end_owning is not null order by o.start_owning'
        const res = await query(this.pool, str, [
            login,
        ]);
        return res.rows;
    }
}
