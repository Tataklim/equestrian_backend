import UserRepository from './repository.js';
import {STATUS} from "../../../config/consts.js";

export default class UserUseCase {
    /**
     * Constructor
     * @param {Object} pool
     */
    constructor(pool) {
        this.repository = new UserRepository(pool);
    }

    async createUser(user) {
        const ifLoginExists = await this.repository.checkIfLoginExists(user.login);
        if (ifLoginExists) {
            return {type: STATUS.DUPLICATION, body: STATUS.DUPLICATION}
        }
        // TODO добавить загрузку фоточек на MCS
        const creationResult = await this.repository.createUser(user);
        return {type: STATUS.SUCCESS, body: creationResult};
    }
}
