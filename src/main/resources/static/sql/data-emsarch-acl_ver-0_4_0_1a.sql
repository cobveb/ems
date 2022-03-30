/* Add new privilege */
REM INSERTING into EMSARCH.AC_PRIVILEGES
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (43,'1113','Odczyt wniosków o udzielenie zamówienia publicznego');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (44,'2113','Akceptacja wniosku o udzielenie zamówienia publicznego');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (45,'3113','Wycofanie wniosku o udzielenie zamówienia publicznego do Koordynatora');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (46,'1124','Odczyt wniosków o udzielenie zamówienia publicznego');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (47,'2124','Akceptacja wniosku o udzielenie zamówienia publicznego');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (48,'3124','Wycofanie wniosku o udzielenie zamwienia publicznego do Koordynatora');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (49,'1115','Odczyt wniosków o udzielenie zamówienia publicznego');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (50,'2115','Akceptacja wniosku ZP Dyrektor pionu');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (51,'3115','Akceptacja wniosku ZP Dyrektor medyczny');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (52,'4115','Akceptacja wniosku ZP Dyrektor naczelny');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (53,'5115','Wycofanie wniosku o udzielenie zamwienia publicznego do Koordynatora');
REM INSERTING into EMSARCH.AC_OBJECT_PRIVILEGES
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,43);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,44);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,45);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,46);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,47);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,48);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,49);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,50);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,51);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,52);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,53);

