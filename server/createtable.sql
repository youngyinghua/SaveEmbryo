CREATE TABLE embryo
(
    id CHAR(8) NOT NULL,
    name VARCHAR(50) NOT NULL,
    birthday DATE NOT NULL,
    opu_day DATE,
    frozen_day DATE NOT null,
    embryo_id serial PRIMARY KEY,
    embryo_stage text NOT NULL,
    quantity SMALLINT NOT NULL,
    color VARCHAR(5) NOT NULL,
    tank CHAR NOT null,
    canister SMALLINT NOT null,
    cane SMALLINT NOT null,
    expire_day DATE ,
    mail_day DATE ,
    extend_times SMALLINT ,
    thaw_day DATE ,
    note text
);

-- to get total cane num from each tank and canister
select loc, count(cane) from (select distinct id, tank || canister as loc, cane from embryo) as result group by loc order by loc;