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
            return {type: STATUS.NOT_FOUND, body: STATUS.NOT_FOUND};
        }
        const horseExists = await this.repository.checkIfHorseExists(horse.passport)
        if (horseExists) {
            return {type: STATUS.DUPLICATION, body: STATUS.DUPLICATION};
        }
        // TODO добавить загрузку фоточек на MCS - оттуда получение ссылки на картинку и паспорт
        // TODO подумать - мб сделать уникальным у лошади пару кличка+дата рождения??
        const creationResult = await this.repository.createHorse(horse);
        return {type: STATUS.SUCCESS, body: creationResult};
    }

    async getHorse(passport) {
        const horseExists = await this.repository.checkIfHorseExists(passport)
        if (!horseExists) {
            return {type: STATUS.NOT_FOUND, body: STATUS.NOT_FOUND};
        }
        const res = await this.repository.getHorse(passport);
        return {type: STATUS.SUCCESS, body: res};

    }

    async getOwner(passport) {
        const horseExists = await this.repository.checkIfHorseExists(passport)
        if (!horseExists) {
            return {type: STATUS.NOT_FOUND, body: STATUS.NOT_FOUND};
        }
        const res = await this.repository.getOwner(passport);
        return {type: STATUS.SUCCESS, body: res};
    }

    async getHorses(start, end) {
        const limit = (+end === -1)? 0 : end - start + 1;
        const offset = start - 1;
        const res = await this.repository.getHorses(limit, offset);
        return {type: STATUS.SUCCESS, body: res};
    }
}
