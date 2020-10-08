import CompetitionUseCase from './usecase.js';
import {CompetitionModel} from "../../app/models/competition.js";
import {STATUS} from "../../../config/consts.js";

export default class CompetitionDelivery {
    /**
     * Constructor
     * @param {Object} pool
     */
    constructor(pool) {
        this.horseUseCase = new CompetitionUseCase(pool);
    }
}
