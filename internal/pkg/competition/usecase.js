import CompetitionRepository from './repository.js';
import UserRepository from '../user/repository.js';
import HorseRepository from '../horse/repository.js';
import {STATUS} from '../../../config/consts.js';

export default class HorseUseCase {
    /**
     * Constructor
     * @param {Object} pool
     */
    constructor(pool) {
        this.repository = new CompetitionRepository(pool);
        this.userRepository = new UserRepository(pool);
        this.horseRepository = new HorseRepository(pool);
    }

    async createCompetition(competition) {
        const nameExists = await this.repository.doesNameExists(competition.name);
        if (nameExists) {
            return {type: STATUS.NOT_FOUND, body: STATUS.NOT_FOUND};
        }
        await this.repository.createCompetition(competition);
        return {type: STATUS.SUCCESS, body: STATUS.SUCCESS};
    }

    async getCompetition(name) {
        const nameExists = await this.repository.doesNameExists(name);
        if (!nameExists) {
            return {type: STATUS.NOT_FOUND, body: STATUS.NOT_FOUND};
        }
        const res = await this.repository.getCompetition(name);
        return {type: STATUS.SUCCESS, body: res};
    }

    async getCompetitionMembers(name) {
        const nameExists = await this.repository.doesNameExists(name);
        if (!nameExists) {
            return {type: STATUS.NOT_FOUND, body: STATUS.NOT_FOUND};
        }
        const res = await this.repository.getCompetitionMembers(name);
        return {type: STATUS.SUCCESS, body: res};
    }

    async getCompetitionList(start, end) {
        const limit = (+end === -1)? 0 : end - start + 1;
        const offset = start - 1;
        const res = await this.repository.getCompetitionList(limit, offset);
        return {type: STATUS.SUCCESS, body: res};
    }
}
