REM INSERTING into EMSARCH.AC_PRIVILEGES
SET DEFINE OFF;
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (1,'0001','Uruchomienie modułu');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (2,'1011','Odczyt wniosków w ramach jednostki organizacyjnej');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (3,'2011','Modyfikacja wniosków w ramach jednostki organizacyjnej');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (4,'3011','Usuwanie wniosków w ramach jednostki organizacyjnej');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (5,'4011','Wysłanie wniosku');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (6,'5011','Wycofanie wysłanego wniosku');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (7,'1013','Odczyt słownika rodzajów kosztów');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (8,'2013','Modyfikacja rodzaju kosztu');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (9,'3013','Usuwanie rodzaju kosztu');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (10,'1022','Odczyt planów koordynatora');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (11,'2022','Modyfikacja planów koordynatora');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (12,'3022','Usuwanie planów koordynatora');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (13,'4022','Wysłanie planu do jednstki nardzędnej');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (14,'5022','Wycofanie wysłanego planu do jednstki nardzędnej');

REM INSERTING into EMSARCH.AC_OBJECTS
SET DEFINE OFF;
Insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (1,'3','Moduł Wnioskodawca','MODULE');
Insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (2,'2','Moduł Koordynator','MODULE');
Insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (3,'1','Moduł Księgowy','MODULE');

REM INSERTING into EMSARCH.AC_OBJECT_PRIVILEGES
SET DEFINE OFF;
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,1);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,1);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,1);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,2);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,3);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,4);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,5);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,6);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,7);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,8);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,9);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,10);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,11);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,12);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,13);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,14);


