/* Add new privilege */
REM INSERTING into EMSARCH.AC_PRIVILEGES
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (38,'1032','Odczyt wniosków o udzielenie zamówienia publicznego');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (39,'2032','Modyfikacja wniosków o udzielenie zamówienia publicznego');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (40,'3032','Wysłanie wniosku o udzielenie zamówienia publicznego do jesnostki nadrzędnej');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (41,'4032','Wycofanie wysłanego wniosku o udzielenie zamówienia publicznego');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (42,'5032','Usuwanie wniosku o udzielenie zamówienia publicznego');
REM INSERTING into EMSARCH.AC_OBJECT_PRIVILEGES
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,38);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,39);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,40);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,41);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,42);
