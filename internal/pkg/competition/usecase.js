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
}
