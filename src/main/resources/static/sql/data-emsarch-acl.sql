REM INSERTING into EMSARCH.AC_PRIVILEGES
SET DEFINE OFF;
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (1,'0001','Uruchomienie modułu');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (2,'1011','Odczyt wniosków w ramach jednostki organizacyjnej');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (3,'2011','Modyfikacja wniosków w ramach jednostki organizacyjnej');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (4,'3011','Usuwanie wniosków w ramach jednostki organizacyjnej');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (5,'4011','Wysłanie wniosku');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (6,'5011','Wycofanie wysłanego wniosku');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (7,'1014','Odczyt słownika rodzajów kosztów');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (8,'2014','Modyfikacja rodzaju kosztu');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (9,'3014','Usuwanie rodzaju kosztu');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (10,'1022','Odczyt planów koordynatora');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (11,'2022','Modyfikacja planów koordynatora');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (12,'3022','Usuwanie planów koordynatora');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (13,'4022','Wysłanie planu do jednstki nardzędnej');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (14,'5022','Wycofanie wysłanego planu do jednstki nardzędnej');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (15,'1024','Odczyt planów koordynatora');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (16,'2024','Akceptacja pozycji planu koordynatora');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (17,'3024','Zatwierdzenie planu koordynatora');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (18,'1013','Odczyt planów koordynatora');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (19,'2013','Zatwierdzenie planu koordynatora');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (20,'1015','Odczyt planów koordynatora');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (21,'2015','Zatwierdzenie planu koordynatora Dyrektor pionu');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (22,'3015','Zatwierdzenie planu koordynatora Dyrektor naczelny');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (23,'4024','Wycofanie zatwierdzonego planu');

REM INSERTING into EMSARCH.AC_OBJECTS
SET DEFINE OFF;
Insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (1,5,'Moduł Wnioskodawca','MODULE');
Insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (2,4,'Moduł Koordynator','MODULE');
Insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (3,3,'Moduł Zamówienia Publiczne','MODULE');
Insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (4,2,'Moduł Księgowy','MODULE');
Insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (5,1,'Moduł Dyrektor','MODULE');

REM INSERTING into EMSARCH.AC_OBJECT_PRIVILEGES
SET DEFINE OFF;
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,1);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,1);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,1);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,1);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,1);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,2);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,3);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,4);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,5);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,6);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,7);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,8);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,9);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,15);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,16);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,17);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,10);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,11);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,12);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,13);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,14);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,18);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,19);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,20);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,21);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,22);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,23);


