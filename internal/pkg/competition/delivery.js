import CompetitionUseCase from './usecase.js';
import {CompetitionModel} from "../../app/models/competition.js";
import {STATUS} from "../../../config/consts.js";

export default class CompetitionDelivery {
    /**
     * Constructor
     * @param {Object} pool
     */
    constructor(pool) {
        this.useCase = new CompetitionUseCase(pool);
    }

    createCompetition(request, response) {
        const competition = CompetitionModel(
            request.body.name,
            request.body.image,
            request.body.year,
        );

        this.useCase.createCompetition(competition)
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

    getCompetition(request, response) {
        const name = request.params.name

        this.useCase.getCompetition(name)
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

    getCompetitionMembers(request, response) {
        const name = request.params.name
        this.useCase.getCompetitionMembers(name)
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

    getCompetitionList(request, response) {
        const start = request.params.start
        const end = request.params.end
        this.useCase.getCompetitionList(start, end)
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
