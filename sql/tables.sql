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

create table workingdays(
  id serial not null primary key, 
  weekdayid int not null, 
  waiterid int not null, 
  foreign key (waiterid) references waiters(waiter_id) on delete cascade
  foreign key (weekdayid) references daysoftheweek(id) on delete cascade
)

create table daysoftheweek(
  id serial not null primary key, 
  weekdays text not null
);