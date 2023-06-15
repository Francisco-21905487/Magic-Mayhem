# Do not change the order or names of states 
#(the code is assuming specific IDs and names)
# You can add more in the end
insert into game_state (gst_state) values ('Waiting');
insert into game_state (gst_state) values ('Started');
insert into game_state (gst_state) values ('Finished');
insert into game_state (gst_state) values ('Canceled');

# Do not change the order, but you can add more in the end
insert into user_game_state (ugst_state) values ('Waiting');
insert into user_game_state (ugst_state) values ('Playing');
insert into user_game_state (ugst_state) values ('End');

# ----------- NEW --------------

insert into wizard_state (wzds_state) values ('Ready');
insert into wizard_state (wzds_state) values ('Acted');
insert into wizard_state (wzds_state) values ('Defensive');

insert into card_type (ct_name) values ('Attack'),('Heal');


insert into card (crd_cost,crd_name, crd_effect,crd_type_id) values 
   (1,"Lifedrain Potion","Does 10 damage",1),
   (2,"Lifedrain Potion","Does 20 damage",1),
   (3,"Lifedrain Potion","Does 30 damage",1),
   (1,"Healing Potion","Recovers 10 HP",2),
   (2,"Healing Potion","Recovers 20 HP",2),
   (3,"Healing Potion","Recovers 30 HP",2),
   (1,"Equilibrium Potion","Recovers 20 HP to both Wizards",2),
   (2,"Equilibrium Potion","Recovers 40 HP to both Wizards",2),
   (3,"Equilibrium Potion","Recovers 60 HP to both Wizards",2),
   (1,"Cursed Drain Potion","Does 20 damage to both Wizards",1),
   (2,"Cursed Drain Potion","Does 40 damage to both Wizards",1),
   (3,"Cursed Drain Potion","Does 60 damage to both Wizards",1);

INSERT INTO user VALUES (1,'me','$2b$10$Wemfac2wY/7RSCdKxuYUL.GV2clfhXC66OL76uCpDFUmpYZ/bGZtW','48MnTVJ6sKIvanVHbP5Vx5rysbYrVN4EbYmk4D8xESdfm1hx8jDfNFZGNw9OZs'),(2,'me2','$2b$10$6j2xIDnnxv.TLfBSstbbO.qE7wFTf5envx/uijiFjCP3slsy7EE4K','dQ7NrsbPsuF81xFGNioR1K0tiYkjtxOhemcgMhuFIS68VrFUC9gggm3JCgzkqe');
INSERT INTO game VALUES (1,1,2);
INSERT INTO user_game VALUES (1,1,1,2),(2,2,1,1);

INSERT INTO wizard VALUES (1,1,1,500,2),(2,2,1,500,0);

INSERT INTO user_game_card VALUES (1,1,CEIL(RAND()*7),1),(2,1,CEIL(RAND()*7),1),(3,1,CEIL(RAND()*7),1);
