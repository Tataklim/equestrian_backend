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

    async addOwning(login, passport) {
        const loginExists = await this.repository.doesLoginExist(login);
        if (!loginExists) {
            return {type: STATUS.NOT_FOUND, body: 'No user with this login'}
        }
        const horseOwner = await this.horseRepository.checkIfHorseExistsAndGetOwner(passport);
        if (horseOwner === undefined) {
            return {type: STATUS.NOT_FOUND, body: 'No horse with this id'}
        }
        if (horseOwner === login) {
            return {type: STATUS.DUPLICATION, body: 'It is already users horse'};
        }
        const res = await this.repository.addOwning(login, passport);
        return {type: STATUS.SUCCESS, body: 'Created'};
    }

    async addTraining(login, passport) {
        const loginExists = await this.repository.doesLoginExist(login);
        if (!loginExists) {
            return {type: STATUS.NOT_FOUND, body: 'No user with this login'}
        }
        const horseOwner = await this.horseRepository.checkIfHorseExistsAndGetOwner(passport);
        if (horseOwner === undefined) {
            return {type: STATUS.NOT_FOUND, body: 'No horse with this id'}
        }
        const alreadyTrains = await this.repository.checkIfAlreadyTrains(login, passport);
        if (alreadyTrains){
            return {type: STATUS.DUPLICATION, body: 'User is already trains with this horse'};
        }
        await this.repository.addTraining(login, passport)
        return {type: STATUS.SUCCESS, body: 'Created'};
    }

    async getTraining(login) {
        const loginExists = await this.repository.doesLoginExist(login);
        if (!loginExists) {
            return {type: STATUS.NOT_FOUND, body: 'No user with this login'}
        }
        const res = await this.repository.getTraining(login)
        return {type: STATUS.SUCCESS, body: res};
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
        const res = await this.repository.getPastHorses(login)
        return {type: STATUS.SUCCESS, body: res};
    }

    async getUsers(start, end) {
        const limit = (+end === -1)? 0 : end - start + 1;
        const offset = start - 1;
        const res = await this.repository.getUsers(limit, offset);
        return {type: STATUS.SUCCESS, body: res};
    }

    async getUser(login) {
        const loginExists = await this.repository.doesLoginExist(login);
        if (!loginExists) {
            return {type: STATUS.NOT_FOUND, body: 'No user with this login'}
        }
        const res = await this.repository.getUser(login);
        return {type: STATUS.SUCCESS, body: res};
    }
}
