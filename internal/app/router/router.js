import UserDelivery from '../../pkg/user/delivery.js';
import HorseDelivery from "../../pkg/horse/delivery.js";

export const router = (app, pool = null) => {
    const userDelivery = new UserDelivery(pool);
    const horseDelivery = new HorseDelivery(pool);

    app.post('/horse', (request, response) => { // Создание лошади с привязкой к пользователю
        horseDelivery.createHorse(request, response);
    })

    app.get('/horse/:passport/owner', (request, response) => { // текущий владелец лошади
        horseDelivery.getOwner(request, response);
    })

    app.post('/user', (request, response) => { // Создание пользователя
        userDelivery.createUser(request, response);
    })

    app.post('/owner/user/:login/horse/:passport', (request, response) => { // Создание связи "владение"
        userDelivery.addOwning(request, response);
    })

    app.post('/train/user/:login/horse/:passport', (request, response) => { // Создание связи "владение"
        userDelivery.addTraining(request, response);
    })

    app.get('/owning/:login/horses', (request, response) => { // Получение текущих лошадей пользователя
        userDelivery.getHorses(request, response)
    })

    app.get('/owning/:login/horses/past', (request, response) => { // Получение прошлых лошадей пользователя
        userDelivery.getPastHorses(request, response)
    })
}
