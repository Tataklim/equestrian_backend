DROP INDEX IF EXISTS past_horse_owners;
DROP INDEX IF EXISTS actual_horse_owners;
DROP INDEX IF EXISTS past_users_horses;
DROP INDEX IF EXISTS actual_users_horses;
DROP TABLE IF EXISTS owners;
DROP TABLE IF EXISTS trains;
DROP TABLE IF EXISTS horses;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    login   varchar(60) PRIMARY KEY,
    name    varchar(100) NOT NULL,
    country varchar(60)  NOT NULL,
    sex     boolean      NOT NULL,
    birth   date        DEFAULT now(),
    image   varchar(60) DEFAULT '/user.jpg'
);

CREATE TABLE horses
(
    id             SERIAL PRIMARY KEY,
    moniker        varchar(60) NOT NULL, -- кличка
    sex            boolean     NOT NULL,
    lear           varchar(60) NOT NULL, -- масть
    country        varchar(60) NOT NULL,
    breed          varchar(60) NOT NULL, -- порода
    birth          date        DEFAULT now(),
    image          varchar(60) default '/horse.jpg',
    passport_image varchar(60) NOT NULL,
    user_login     varchar(60) NOT NULL,
    FOREIGN KEY (user_login) REFERENCES users (login)
);

CREATE TABLE owners
(
    horse_id     int4               NOT NULL,
    login        varchar(60)        NOT NULL,
    start_owning date DEFAULT now() NOT NULL,
    end_owning   date,
    FOREIGN KEY (horse_id) REFERENCES horses (id),
    FOREIGN KEY (login) REFERENCES users (login)
);

CREATE TABLE trains
(
    horse_id int4        NOT NULL,
    login    varchar(60) NOT NULL,
    FOREIGN KEY (horse_id) REFERENCES horses (id),
    FOREIGN KEY (login) REFERENCES users (login)
);

CREATE OR REPLACE FUNCTION add_owner() RETURNS trigger AS
$add_owner$
BEGIN
    insert into owners(horse_id, login) values (new.id, new.user_login);
    RETURN NEW;
END;
$add_owner$ LANGUAGE plpgsql;

CREATE TRIGGER add_owner
    after insert
    ON horses
    FOR EACH ROW
EXECUTE PROCEDURE add_owner();

CREATE OR REPLACE FUNCTION change_owner_and_set_end_owning() RETURNS trigger AS
$change_owner_and_set_end_owning$
BEGIN
    UPDATE owners
    set end_owning = new.start_owning
    where horse_id = new.horse_id
      and end_owning is null;
    UPDATE horses SET user_login=new.login where id = new.horse_id;
    RETURN NEW;
END;
$change_owner_and_set_end_owning$ LANGUAGE plpgsql;

CREATE TRIGGER change_owner_and_set_end_owning
    before insert
    ON owners
    FOR EACH ROW
EXECUTE PROCEDURE change_owner_and_set_end_owning();

CREATE INDEX past_horse_owners ON owners (horse_id) where end_owning IS NOT NULL;
CREATE INDEX actual_horse_owners ON owners (horse_id) where end_owning IS NULL;

CREATE INDEX past_users_horses ON owners (login) where end_owning IS NOT NULL;
CREATE INDEX actual_users_horses ON owners (login) where end_owning IS NULL;

---------------------------------------------------------------------------------------------------

INSERT INTO users(login, name, country, sex)
VALUES ('dimochka', 'Дмитрий', 'Россия', false),
       ('shatanchik', 'Наталия', 'Россия', true),
       ('krisssss', 'Кристина', 'Украина', true),
       ('olya', 'Олег', 'Россия', false);

insert into horses(moniker, sex, lear, country, breed, birth, image, passport_image, user_login)

INSERT INTO horses(moniker, sex, lear, country, breed, user_login, passport_image)
VALUES ('Роза', true, 'буланая', 'Россия', 'Арабская', 'dimochka', '/'),
       ('Мила', false, 'рыжая', 'Польша', 'Криолло', 'dimochka', '/'),
       ('Барон', true, 'игреневая', 'Украина', 'Фризская', 'dimochka', '/'),
       ('Мухтар', true, 'мышастая', 'Россия', 'Арабская', 'dimochka', '/'),
       ('Адмирал', true, 'рыжая', 'Россия', 'Криолло', 'dimochka', '/'),
       ('Рассвет', false, 'игреневая', 'Польша', 'Фризская', 'dimochka', '/'),
       ('Алмаз', true, 'буланая', 'Украина', 'Морган', 'dimochka', '/'),
       ('Янтарь', false, 'мышастая', 'Россия', 'Арабская', 'dimochka', '/'),
       ('Вологда', true, 'рыжая', 'Россия', 'Фризская', 'dimochka', '/'),
       ('Игра', false, 'буланая', 'Польша', 'Морган', 'dimochka', '/'),
       ('Домино', false, 'игреневая', 'Украина', 'Арабская', 'dimochka', '/'),
       ('Руза', true, 'игреневая', 'Россия', 'Криолло', 'dimochka', '/'),
       ('Василек', true, 'рыжая', 'Украина', 'Фризская', 'dimochka', '/');


INSERT INTO owners (horse_id, login)
VALUES (1, 'olya');

select *
from users
where login = 'dimochka';

-- create or replace view actor_view as
-- SELECT p.primary_name,
--        array_agg(t.primary_title) as famous_titles
-- FROM person p
--          JOIN movie t
--               ON t.t_const = any (p.known_for_titles)
-- group by primary_name

select * from horses left join owners o on horses.id = o.horse_id where o.login='olya' and o.end_owning is not null order by start_owning;

select id,moniker,sex, lear, country, breed, birth, image, passport_image, user_login, o.start_owning from horses inner join owners o on horses.id = o.horse_id where user_login='olya' and o.end_owning is null order by o.start_owning;

select id,moniker,sex, lear, country, breed, birth, image, passport_image, user_login, o.start_owning from horses inner join owners o on horses.id = o.horse_id where o.login='olya' and o.end_owning is not null order by o.end_owning;


-- truncate table horses RESTART IDENTITY cascade;
