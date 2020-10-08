import {query} from '../repository_helper/query.js';
import {STATUS} from '../../../config/consts.js';

export default class CompetitionRepository {
    /**
     * Constructor
     * @param {Object} pool
     */
    constructor(pool) {
        this.pool = pool;
    }

    async createCompetition(competition) {
        const str = 'INSERT INTO competitions(name, image, year) ' +
            'VALUES ($1, $2, $3)';
        await query(this.pool, str, [
            competition.name,
            competition.image,
            competition.year,
        ]);
        return STATUS.SUCCESS;
    }

    async doesNameExists(name) {
        const str = 'SELECT * from competitions where name = $1';
        const res = await query(this.pool, str, [
            name,
        ]);
        return res.rowCount !== 0
    }

    async getCompetition(name) {
        const str = 'SELECT name, year, image from competitions where name = $1';
        const res = await query(this.pool, str, [
            name,
        ]);
        return res.rows[0]
    }

    async getCompetitionMembers(name) {
        const str = 'select * from competition_members where comp_name = $1';
        const res = await query(this.pool, str, [
            name,
        ]);
        return res.rows;
    }

    async getCompetitionList(limit, offset) {
        const str = 'select name, image, year from competitions order by year limit $1 offset $2';
        const res = await query(this.pool, str, [
            limit,
            offset,
        ]);
        return res.rows;
    }
}
