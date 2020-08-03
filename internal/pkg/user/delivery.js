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
        const owning = {
            login: request.params.login,
            id: request.params.id
        };
        this.userUseCase
            .addOwning(request.params.login, request.params.id)
            .then((answer) => {
                switch (answer.type) {
                    case STATUS.SUCCESS:
                        response.status(201).send(answer.body);
                        break;
                    case STATUS.NOT_FOUND:
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

}
