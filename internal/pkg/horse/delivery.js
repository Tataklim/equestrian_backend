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
            request.body.passport,
            request.body.moniker,
            request.body.sex,
            request.body.lear,
            request.body.country,
            request.body.breed,
            request.body.birth,
            request.body.image,
            request.body.passport_image,
            request.body.login
        );

        this.horseUseCase.createHorse(horse)
            .then((answer) => {
                switch (answer.type) {
                    case STATUS.SUCCESS:
                        response.status(201).send(answer.body);
                        break;
                    case STATUS.NOT_FOUND:
                        response.status(404).send(answer.body);
                        break;
                    case STATUS.DUPLICATION:
                        response.status(409).send(answer.body);
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

    getHorse(request, response) {
        const passport = request.params.passport
        this.horseUseCase.getHorse(passport)
            .then((answer) => {
                switch (answer.type) {
                    case STATUS.SUCCESS:
                        response.status(200).send(answer.body);
                        break;
                    case STATUS.NOT_FOUND:
                        response.status(404).send(answer.body);
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

    getOwner(request, response) {
        const passport = request.params.passport;
        this.horseUseCase.getOwner(passport)
            .then((answer) => {
                switch (answer.type) {
                    case STATUS.SUCCESS:
                        response.status(201).send(answer.body);
                        break;
                    case STATUS.NOT_FOUND:
                        response.status(404).send(answer.body);
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

    getPastOwners(request, response) {
        const passport = request.params.passport;
        console.log(passport)
        this.horseUseCase.getPastOwners(passport)
            .then((answer) => {
                switch (answer.type) {
                    case STATUS.SUCCESS:
                        response.status(201).send(answer.body);
                        break;
                    case STATUS.NOT_FOUND:
                        response.status(404).send(answer.body);
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

    getHorses(request, response) {
        const start = request.params.start;
        const end = request.params.end;
        this.horseUseCase.getHorses(start, end)
            .then((answer) => {
                switch (answer.type) {
                    case STATUS.SUCCESS:
                        response.status(200).send(answer.body);
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

    getTraining(request, response) {
        this.horseUseCase
            .getTraining(request.params.passport)
            .then((answer) => {
                switch (answer.type) {
                    case STATUS.SUCCESS:
                        response.status(201).send(answer.body);
                        break;
                    case STATUS.NOT_FOUND:
                        response.status(404).send(answer.body);
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
