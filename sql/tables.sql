create table admin(
  admin_id serial not null primary key,
  admin_name text not null,
  password varchar(50) int not null,
)
create table waiters(
  waiter_id serial not null primary key,
  waiter_name text not null,
  password varchar(50) not null,
  employee_id int not null
)
