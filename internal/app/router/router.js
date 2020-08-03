import UserDelivery from '../../pkg/user/delivery.js';
import HorseDelivery from "../../pkg/horse/delivery.js";

export const router = (app, pool = null) => {
    const userDelivery = new UserDelivery(pool);
    const horseDelivery = new HorseDelivery(pool);

    app.post('/user', (request, response) => { // Создание пользователя
        userDelivery.createUser(request, response);
    })

    app.post('/horse', (request, response) => { // Создание лошади с привязкой к пользователю
        horseDelivery.createHorse(request, response);
    })

    app.post('/user/:login/horse/:id', (request, response) => {
        userDelivery.addOwning(request, response);
    });
}
