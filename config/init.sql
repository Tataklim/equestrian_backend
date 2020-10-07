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
    passport       varchar(20) PRIMARY KEY,
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

ALTER TABLE horses ALTER passport_image TYPE varchar(200);

CREATE TABLE owners
(
    horse_passport varchar(20)        NOT NULL,
    user_login     varchar(60)        NOT NULL,
    start_owning   date DEFAULT now() NOT NULL,
    end_owning     date,
    FOREIGN KEY (horse_passport) REFERENCES horses (passport),
    FOREIGN KEY (user_login) REFERENCES users (login)
);

CREATE TABLE trains
(
    horse_passport varchar(20) NOT NULL,
    user_login     varchar(60) NOT NULL,
    FOREIGN KEY (horse_passport) REFERENCES horses (passport),
    FOREIGN KEY (user_login) REFERENCES users (login),
    PRIMARY KEY (horse_passport, user_login);
);

CREATE OR REPLACE FUNCTION add_owner() RETURNS trigger AS
$add_owner$
BEGIN
    insert into owners(horse_passport, user_login) values (new.passport, new.user_login);
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
    where horse_passport = new.horse_passport
      and end_owning is null;
    UPDATE horses SET user_login=new.user_login where passport = new.horse_passport;
    RETURN NEW;
END;
$change_owner_and_set_end_owning$ LANGUAGE plpgsql;

CREATE TRIGGER change_owner_and_set_end_owning
    before insert
    ON owners
    FOR EACH ROW
EXECUTE PROCEDURE change_owner_and_set_end_owning();


CREATE OR REPLACE FUNCTION check_training_duplication() RETURNS triggn-shcher AS
$check_training_duplication$
BEGIN
    select * from trains where horse_passport=NEW.horse_passport and user_login=new.user_login;
    UPDATE owners
    set end_owning = new.start_owning
    where horse_passport = new.horse_passport
      and end_owning is null;
    UPDATE horses SET user_login=new.user_login where passport = new.horse_passport;
    RETURN NEW;
END;
$check_training_duplication$ LANGUAGE plpgsql;

CREATE TRIGGER check_training_duplication
    instead of insert
    ON trains
    FOR EACH ROW
EXECUTE PROCEDURE check_training_duplication();

CREATE INDEX past_horse_owners ON owners (horse_passport) where end_owning IS NOT NULL;
CREATE INDEX actual_horse_owners ON owners (horse_passport) where end_owning IS NULL;

CREATE INDEX past_users_horses ON owners (user_login) where end_owning IS NOT NULL;
CREATE INDEX actual_users_horses ON owners (user_login) where end_owning IS NULL;

---------------------------------------------------------------------------------------------------

INSERT INTO users(login, name, country, sex)
VALUES ('dimochka', 'Дмитрий', 'Россия', false),
       ('shatanchik', 'Наталия', 'Россия', true),
       ('krisssss', 'Кристина', 'Украина', true),
       ('olya', 'Олег', 'Россия', false);


INSERT INTO horses(passport, moniker, sex, lear, country, breed, user_login, passport_image)
VALUES ('123EG311', 'Роза', true, 'буланая', 'Россия', 'Арабская', 'dimochka', '/'),
       ('123EG312', 'Мила', false, 'рыжая', 'Польша', 'Криолло', 'dimochka', '/'),
       ('123EG313', 'Барон', true, 'игреневая', 'Украина', 'Фризская', 'dimochka', '/'),
       ('123EG314', 'Мухтар', true, 'мышастая', 'Россия', 'Арабская', 'dimochka', '/'),
       ('123EG315', 'Адмирал', true, 'рыжая', 'Россия', 'Криолло', 'dimochka', '/'),
       ('123EG316', 'Рассвет', false, 'игреневая', 'Польша', 'Фризская', 'dimochka', '/'),
       ('123EG317', 'Алмаз', true, 'буланая', 'Украина', 'Морган', 'dimochka', '/'),
       ('123EG318', 'Янтарь', false, 'мышастая', 'Россия', 'Арабская', 'dimochka', '/'),
       ('123EG319', 'Вологда', true, 'рыжая', 'Россия', 'Фризская', 'dimochka', '/'),
       ('123EG320', 'Игра', false, 'буланая', 'Польша', 'Морган', 'dimochka', '/'),
       ('123EG321', 'Домино', false, 'игреневая', 'Украина', 'Арабская', 'dimochka', '/'),
       ('123EG322', 'Руза', true, 'игреневая', 'Россия', 'Криолло', 'dimochka', '/'),
       ('123EG323', 'Василек', true, 'рыжая', 'Украина', 'Фризская', 'dimochka', '/');


INSERT INTO owners (horse_passport, user_login)
VALUES ('123EG321', 'olya');

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

select *
from horses
         left join owners o on horses.passport = o.horse_passport
where o.user_login = 'olya'
  and o.end_owning is not null
order by start_owning;

select passport,
       moniker,
       sex,
       lear,
       country,
       breed,
       birth,
       image,
       passport_image,
       o.user_login,
       o.start_owning
from horses
         inner join owners o on horses.passport = o.horse_passport
where o.user_login = 'olya'
  and o.end_owning is null
order by o.start_owning;

select passport, moniker, sex, lear, country, breed, birth, image, passport_image from horses where passport='123EG313';

select passport,
       moniker,
       sex,
       lear,
       country,
       breed,
       birth,
       image,
       passport_image,
       o.user_login,
       o.start_owning
from horses
         inner join owners o on horses.passport = o.horse_passport
where o.user_login = 'olya'
  and o.end_owning is not null
order by o.end_owning;

select o.user_login, o.start_owning, u.name, u.country, u.image
from users u inner join owners o on o.horse_passport = '123EG313' where o.user_login = u.login and o.end_owning is null;

insert into trains(horse_passport, user_login)
VALUES ('123EG312', 'olya'),
       ('123EG312', 'dimochka');

select login, name, image, country from users order by login limit 2 offset 2;

-- truncate table horses RESTART IDENTITY cascade;
