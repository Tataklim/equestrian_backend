import HorseUseCase from './usecase.js';
import {horseModel} from "../../app/models/horse.js";
import {STATUS} from "../../../config/consts.js";

export default class HorseDelivery {
    /**
     * Constructor
     * @param {Object} pool
     */
    constructor(pool) {
        this.horseUseCase = new HorseUseCase(pool);
    }

    createHorse(request, response) {
        const horse = horseModel(
            request.body.moniker,
            request.body.sex,
            request.body.lear,
            request.body.country,
            request.body.breed,
            request.body.birth,
            request.body.image,
            request.body.passport_image,
            request.body.user_login
        );

        this.horseUseCase.createHorse(horse)
            .then((answer) => {
                switch (answer.type) {
                    case STATUS.SUCCESS:
                        response.status(201).send(answer.body);
                        break;
                    default:
                        response.status(500);
                        break;
                }
            })
            .catch((error) => {
                response.status(500);
            });
    }

}