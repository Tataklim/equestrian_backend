import UserDelivery from '../../pkg/user/delivery.js';
import HorseDelivery from "../../pkg/horse/delivery.js";

export const router = (app, pool = null) => {
    const userDelivery = new UserDelivery(pool);
    const horseDelivery = new HorseDelivery(pool);

    app.post('/horse', (request, response) => { // Создание лошади с привязкой к пользователю +
        horseDelivery.createHorse(request, response);
    })

    app.get('/horse/:passport/owner', (request, response) => { // текущий владелец лошади +
        horseDelivery.getOwner(request, response);
    })

    app.get('/horse/:passport/owners/past', (request, response) => { // текущий владелец лошади +
        horseDelivery.getPastOwners(request, response);
    })

    app.get('/horse/:passport', (request, response) => { // Получение данных лошади +
        horseDelivery.getHorse(request, response);
    })

    app.get('/horses/:start/:end', (request, response) => { // получение списка лошадей от start до end +
        horseDelivery.getHorses(request, response);
    })

    app.get('/users/:start/:end', (request, response) => { // получение списка пользователей от start до end +
        userDelivery.getUsers(request, response);
    })

    app.post('/user', (request, response) => { // Создание пользователя +
        userDelivery.createUser(request, response);
    })

    app.get('/user/:login', (request, response) => { // Получение пользователя +
        userDelivery.getUser(request, response);
    })

    app.post('/owner/user/:login/horse/:passport', (request, response) => { // Создание связи "владение" +
        userDelivery.addOwning(request, response);
    })

    app.get('/owning/:login/horses', (request, response) => { // Получение текущих лошадей пользователя +
        userDelivery.getHorses(request, response)
    })

    app.get('/owning/:login/horses/past', (request, response) => { // Получение прошлых лошадей пользователя +
        userDelivery.getPastHorses(request, response)
    })

    app.post('/train/user/:login/horse/:passport', (request, response) => { // Создание связи "тренировка"
        userDelivery.addTraining(request, response);
    })

    app.get('/train/user/:login', (request, response) => { // Получение все лошадей, на которых тренировался пользователь
        userDelivery.getTraining(request, response);
    })

    app.get('/train/horse/:passport', (request, response) => { // Получение всех пользователей, тренировавшихся на лошади
        horseDelivery.getTraining(request, response);
    })

    // реализовать два запросы
    // Связать их с фронтом + addTraining тоже
    // Мур
}
