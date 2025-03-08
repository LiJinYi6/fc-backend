/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2025/3/8 12:15:10                            */
/*==============================================================*/


drop table if exists medical_record;

drop table if exists patient_user;

drop table if exists user_info;

/*==============================================================*/
/* Table: medical_record                                        */
/*==============================================================*/
create table medical_record
(
   result               varchar(5000),
   advice               varchar(5000),
   cost                 varchar(50),
   record_time          varchar(32),
   cure_state           varchar(32),
   record_id            varchar(50) not null,
   patient_id           varchar(50),
   check_items          varchar(32),
   left_eye             varchar(100),
   right_eye            varchar(100),
   primary key (record_id)
);

/*==============================================================*/
/* Table: patient_user                                          */
/*==============================================================*/
create table patient_user
(
   patient_id           varchar(50) not null,
   id                   varchar(50),
   patient_name         varchar(20),
   patient_phone        char(11),
   patient_address      varchar(50),
   patient_sex          smallint,
   patient_age          numeric(8,0),
   primary key (patient_id)
);

/*==============================================================*/
/* Table: user_info                                             */
/*==============================================================*/
create table user_info
(
   name                 varchar(20),
   username             varchar(32),
   password             varchar(32),
   id                   varchar(50) not null,
   type                 smallint,
   phone                char(11),
   email                varchar(20),
   address              varchar(50),
   sex                  smallint,
   primary key (id)
);

alter table medical_record add constraint FK_Relationship_7 foreign key (patient_id)
      references patient_user (patient_id) on delete restrict on update restrict;

alter table patient_user add constraint FK_Relationship_8 foreign key (id)
      references user_info (id) on delete restrict on update restrict;

