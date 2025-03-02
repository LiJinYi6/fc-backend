/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2025/3/2 10:46:10                            */
/*==============================================================*/


drop table if exists chart_gallery;

drop table if exists patient_user;

drop table if exists user_info;

/*==============================================================*/
/* Table: chart_gallery                                         */
/*==============================================================*/
create table chart_gallery
(
   img_id               varchar(50) not null,
   patient_id           varchar(50),
   id                   varchar(50),
   img_url              varchar(500) not null,
   primary key (img_id)
);

/*==============================================================*/
/* Table: patient_user                                          */
/*==============================================================*/
create table patient_user
(
   patient_id           varchar(50) not null,
   id                   varchar(50) not null,
   patient_name         varchar(20) not null,
   patient_phone        char(11),
   patient_address      varchar(50) not null,
   patient_sex          smallint not null,
   patient_age          smallint not null,
   curestate            varchar(25),
   result               varchar(25),
   cureadvice           varchar(1000),
   cost                 varchar(50),
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

alter table chart_gallery add constraint FK_Relationship_3 foreign key (patient_id)
      references patient_user (patient_id) on delete restrict on update restrict;

alter table chart_gallery add constraint FK_Relationship_4 foreign key (id)
      references user_info (id) on delete restrict on update restrict;

alter table patient_user add constraint FK_Relationship_2 foreign key (id)
      references user_info (id) on delete restrict on update restrict;

