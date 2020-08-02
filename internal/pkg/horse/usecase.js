import HorseRepository from './repository.js';
import UserRepository from "../user/repository";
import {STATUS} from "../../../config/consts.js";

export default class HorseUseCase {
    /**
     * Constructor
     * @param {Object} pool
     */
    constructor(pool) {
        this.repository = new HorseRepository(pool);
        this.userRepository = new UserRepository(pool);
    }

    async createHorse(horse) {
        // TODO добавить загрузку фоточек на MCS - оттуда получение ссылки на картинку и паспорт
        const creationResult = await this.repository.createHorse(horse);
        return {type: STATUS.SUCCESS, body: creationResult};
    }
}
