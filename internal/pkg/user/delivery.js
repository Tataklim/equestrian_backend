import UserUseCase from './usecase.js';
import {userModel} from "../../app/models/user.js";
import {STATUS} from "../../../config/consts.js";

export default class UserDelivery {
    /**
     * Constructor
     * @param {Object} pool
     */
    constructor(pool) {
        this.userUseCase = new UserUseCase(pool);
    }

    createUser(request, response) {
        // TODO проверка, стоит ли кука
        const user = userModel(
            request.body.login,
            request.body.name,
            request.body.country,
            request.body.sex,
            request.body.birth,
            request.body.image,
        );
        this.userUseCase.createUser(user)
            .then((answer) => {
                switch (answer.type) {
                    case STATUS.SUCCESS:
                        response.status(201).send(answer.body);
                        // TODO установка куки
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

    addOwning(request, response) {
        // TODO проверка куки
        const owning = {
            login: request.params.login,
            passport: request.params.passport
        };
        this.userUseCase
            .addOwning(request.params.login, request.params.passport)
            .then((answer) => {
                switch (answer.type) {
                    case STATUS.SUCCESS:
                        response.status(201).send(answer.body);
                        break;
                    case STATUS.NOT_FOUND:
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

    addTraining(request, response) {
        // TODO проверка куки
        this.userUseCase
            .addTraining(request.params.login, request.params.passport)
            .then((answer) => {
                switch (answer.type) {
                    case STATUS.SUCCESS:
                        response.status(201).send(answer.body);
                        break;
                    case STATUS.NOT_FOUND:
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

    getHorses(request, response) {
        // TODO проверка куки
        const login = request.params.login;
        this.userUseCase.getHorses(login)
            .then((answer) => {
                switch (answer.type) {
                    case STATUS.SUCCESS:
                        response.status(200).send(answer.body);
                        break;
                    case STATUS.NOT_FOUND:
                        response.status(409).send(answer.body);
                        break;
                    default:
                        response.status(500);
                        break;
                }
            });
    }

    getPastHorses(request, response) {
        // TODO проверка куки
        const login = request.params.login;
        this.userUseCase.getPastHorses(login)
            .then((answer) => {
                switch (answer.type) {
                    case STATUS.SUCCESS:
                        response.status(200).send(answer.body);
                        break;
                    case STATUS.NOT_FOUND:
                        response.status(409).send(answer.body);
                        break;
                    default:
                        response.status(500);
                        break;
                }
            });
    }

}
