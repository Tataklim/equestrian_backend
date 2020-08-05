import UserRepository from './repository.js';
import HorseRepository from "../horse/repository.js";
import {STATUS} from "../../../config/consts.js";

export default class UserUseCase {
    /**
     * Constructor
     * @param {Object} pool
     */
    constructor(pool) {
        this.repository = new UserRepository(pool);
        this.horseRepository = new HorseRepository(pool);
    }

    async createUser(user) {
        const loginExists = await this.repository.doesLoginExist(user.login);
        if (loginExists) {
            return {type: STATUS.DUPLICATION, body: STATUS.DUPLICATION}
        }
        // TODO добавить загрузку фоточек на MCS
        const creationResult = await this.repository.createUser(user);
        return {type: STATUS.SUCCESS, body: creationResult};
    }

    async addOwning(login, horseID) {
        // TODO добавить проверку на то, владеет ли уже пользователь данной лошадью
        const loginExists = await this.repository.doesLoginExist(login);
        if (!loginExists) {
            return {type: STATUS.NOT_FOUND, body: 'No user with this login'}
        }
        const horseOwner = await this.horseRepository.checkIfHorseExistsAndGetOwner(horseID);
        if (horseOwner === undefined) {
            return {type: STATUS.NOT_FOUND, body: 'No horse with this id'}
        }
        if (horseOwner === login) {
            return {type: STATUS.DUPLICATION, body: 'It is already users horse'};
        }
        const res = await this.repository.addOwning(login, horseID);
        return {type: STATUS.SUCCESS, body: 'Created'};
    }

    async getHorses(login) {
        const loginExists = await this.repository.doesLoginExist(login);
        if (!loginExists) {
            return {type: STATUS.NOT_FOUND, body: 'No user with this login'}
        }
        const res = await this.repository.getHorses(login)
        return {type: STATUS.SUCCESS, body: res};
    }

    async getPastHorses(login) {
        const loginExists = await this.repository.doesLoginExist(login);
        if (!loginExists) {
            return {type: STATUS.NOT_FOUND, body: 'No user with this login'}
        }
        const res = await this.repository.getHorses(login)
        return {type: STATUS.SUCCESS, body: res};
    }
}
