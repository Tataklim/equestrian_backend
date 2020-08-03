import HorseRepository from './repository.js';
import UserRepository from "../user/repository.js";
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
        const loginExists = await this.userRepository.doesLoginExist(horse.login);
        if (!loginExists) {
            return {type: STATUS.NOT_FOUND, body: STATUS.NOT_FOUND}
        }
        // TODO добавить загрузку фоточек на MCS - оттуда получение ссылки на картинку и паспорт
        // TODO подумать - мб сделать уникальным у лошади пару кличка+дата рождения??
        const creationResult = await this.repository.createHorse(horse);
        return {type: STATUS.SUCCESS, body: creationResult};
    }
}
