import UserDelivery from '../../pkg/user/delivery.js';
import HorseDelivery from "../../pkg/horse/delivery.js";

export const router = (app, pool = null) => {
    const userDelivery = new UserDelivery(pool);
    const horseDelivery = new HorseDelivery(pool);
    app.post('/user', (request, response) => {
        userDelivery.createUser(request, response);
    })
    app.post('/horse', (request, response) => {
        horseDelivery.createHorse(request, response);
    })
}
