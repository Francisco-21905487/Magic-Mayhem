create database magicmayhem;

use magicmayhem;

create table user (
    usr_id int not null auto_increment,
    usr_name varchar(60) not null,
    usr_pass varchar(200) not null, 
    usr_token varchar(200),
    primary key (usr_id));

create table game (
    gm_id int not null auto_increment,
    gm_turn int not null default 1,
    gm_state_id int not null,
    primary key (gm_id));

create table game_state (
    gst_id int not null auto_increment,
    gst_state varchar(60) not null,
    primary key (gst_id));

create table user_game (
    ug_id int not null auto_increment,
    ug_user_id int not null,
    ug_game_id int not null,
    ug_state_id int not null,
    primary key (ug_id));

create table user_game_state (
    ugst_id int not null auto_increment,
    ugst_state varchar(60) not null,
    primary key (ugst_id));

# ----------- NEW ---------------

create table wizard (
    wzd_id int not null auto_increment,
    wzd_user_game_id int not null,
    wzd_state_id int not null,
    wzd_hp int not null,
    wzd_ap int not null,
    primary key (wzd_id));

create table wizard_state (
    wzds_id int not null auto_increment,
    wzds_state varchar (60) not null,
    primary key (wzds_id));

# could add a card type, but for now it does not seem useful
# each card is very different from the others and needs specific code
# later we would also need image, lore, etc
create table card (
    crd_id int not null auto_increment,
    crd_cost int not null,
    crd_name varchar(50) not null,
    crd_effect varchar(150) not null,
    crd_type_id int not null,
    primary key (crd_id));

create table card_type (
    ct_id int not null auto_increment,
    ct_name varchar (60) not null,
    primary key (ct_id));

create table user_game_card (
    ugc_id int not null auto_increment,
    ugc_user_game_id int not null,
    ugc_crd_id int not null,
    ugc_active tinyint(1) not null,
    primary key (ugc_id)
);

# Foreign Keys

alter table game add constraint game_fk_match_state
            foreign key (gm_state_id) references game_state(gst_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table user_game add constraint user_game_fk_user
            foreign key (ug_user_id) references user(usr_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table user_game add constraint user_game_fk_game
            foreign key (ug_game_id) references game(gm_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table user_game add constraint user_game_fk_user_game_state
            foreign key (ug_state_id) references user_game_state(ugst_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

# ----------- NEW ---------------

alter table wizard add constraint wizard_fk_user_game
            foreign key (wzd_user_game_id) references user_game(ug_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table wizard add constraint wizard_fk_wizard_state
            foreign key (wzd_state_id) references wizard_state(wzds_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table user_game_card add constraint user_game_card_fk_user_game
            foreign key (ugc_user_game_id) references user_game(ug_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table user_game_card add constraint user_game_card_fk_card
            foreign key (ugc_crd_id) references card(crd_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table card add constraint card_fk_card_type
            foreign key (crd_type_id) references card_type(ct_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;
