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
        const horseExists = await this.horseRepository.checkIfHorseExists(horseID);
        if (!horseExists) {
            return {type: STATUS.NOT_FOUND, body: 'No horse with this id'}
        }
        console.log('lolkek');
        const res = await this.repository.addOwning(login, horseID);
        return 'ok';
    }
}
