
REM INSERTING into EMSARCH.MODULES
SET DEFINE OFF;
Insert into EMSARCH.MODULES (ID,CODE,NAME) values (module_seq.nextval,'accountant','Ksi�gowy');
Insert into EMSARCH.MODULES (ID,CODE,NAME) values (module_seq.nextval,'coordinator','Koordynator');
Insert into EMSARCH.MODULES (ID,CODE,NAME) values (module_seq.nextval,'applicant','Wnioskodawca');
Insert into EMSARCH.MODULES (ID,CODE,NAME) values (module_seq.nextval,'administrator','Administrator');
Insert into EMSARCH.MODULES (ID,CODE,NAME) values (module_seq.nextval,'hr','Kadry');
REM INSERTING into EMSARCH.USERS
SET DEFINE OFF;
Insert into EMSARCH.USERS (ID,CREATED_AT,UPDATED_AT,CREATED_BY,UPDATED_BY,NAME,PASSWORD,SURNAME,USERNAME) values (user_seq.nextval,to_timestamp('19/05/01 04:12:16,588344000','RR/MM/DD HH24:MI:SSXFF'),to_timestamp('19/05/01 04:12:16,588344000','RR/MM/DD HH24:MI:SSXFF'),null,null,'User','$2a$10$/ymH1SVrQkQ78TJl.s0ShuwvawFQGJ0fGNksn4kE2/wVHzSK5SXd2','Name','user');
Insert into EMSARCH.USERS (ID,CREATED_AT,UPDATED_AT,CREATED_BY,UPDATED_BY,NAME,PASSWORD,SURNAME,USERNAME) values (user_seq.nextval,to_timestamp('19/05/01 04:12:16,662541000','RR/MM/DD HH24:MI:SSXFF'),to_timestamp('19/05/01 04:12:16,662541000','RR/MM/DD HH24:MI:SSXFF'),null,null,'Admin','$2a$10$z0cmw4Oywh6C0IBnrQ6hku9BIxG5.0WltxYc.rY2nEHrLL4DUf7xe','Root','administrator');
REM INSERTING into EMSARCH.USER_ROLES
SET DEFINE OFF;
Insert into EMSARCH.USER_ROLES (USER_ID,ROLE_ID) values ('1','1');
REM INSERTING into EMSARCH.DICTIONARIES
SET DEFINE OFF;
Insert into EMSARCH.DICTIONARIES (CODE,NAME,TYPE) values ('jedMiar', 'Jednostki miary', 'A');
Insert into EMSARCH.DICTIONARIES (CODE,NAME,TYPE) values ('dicFunSour', 'Źródła finansowania', 'U');
Insert into EMSARCH.DICTIONARIES (CODE,NAME,TYPE) values ('slAsortGr', 'Grupy Asortymentowe', 'U');
Insert into EMSARCH.DICTIONARIES (CODE,NAME,TYPE) values ('slTryUdzZp', 'Tryb udzielenia zamówienia', 'U');
REM INSERTING into jedMiar - EMSARCH.DICTIONARY_ITEMS
SET DEFINE OFF;
Insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'szt', 'sztuka', 1, 'jedMiar');
Insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'opa', 'opakowanie', 1, 'jedMiar');
Insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'g', 'gram', 1, 'jedMiar');
Insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'kg', 'kilorgam', 1, 'jedMiar');
Insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'cm', 'centymetr', 1, 'jedMiar');
Insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'m', 'metr', 1, 'jedMiar');
Insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'km', 'kilometr', 1, 'jedMiar');
Insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'ml', 'mililitr', 1, 'jedMiar');
Insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'l', 'litr', 1, 'jedMiar');
Insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'dm3', 'dm3', 1, 'jedMiar');
Insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'m3', 'm3', 1, 'jedMiar');
Insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'cm2', 'cm2', 1, 'jedMiar');
Insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'m2', 'm2', 1, 'jedMiar');
REM INSERTING into dicFunSour - EMSARCH.DICTIONARY_ITEMS
SET DEFINE OFF;
Insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'ue', 'UE', 1, 'dicFunSour');
Insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'wlasne', 'Własne', 1, 'dicFunSour');
Insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'inne', 'Inne', 1, 'dicFunSour');
REM INSERTING into EMSARCH.PARAMETERS
SET DEFINE OFF;
Insert into EMSARCH.PARAMETERS (CODE,CATEGORY,SECTION,NAME,DESCRIPTION,VALUE_TYPE,VALUE) values ('minDigits','System','Password','Minimalna liczba cyfr w ha�le','Minimalna liczba cyfr w ha�le. Domyslna wartosc: 1','N','');
Insert into EMSARCH.PARAMETERS (CODE,CATEGORY,SECTION,NAME,DESCRIPTION,VALUE_TYPE,VALUE) values ('minLowercase','System','Password','Minimalna liczba ma�ych liter w ha�le','Minimalna liczba ma�ych liter w ha�le. Domy�lna warto��: 1','N','');
Insert into EMSARCH.PARAMETERS (CODE,CATEGORY,SECTION,NAME,DESCRIPTION,VALUE_TYPE,VALUE) values ('minUppercase','System','Password','Minimalna liczba du�ych liter w ha�le','Minimalna liczba du�ych liter w ha�le. Domy�lna warto��: 1','N','');
Insert into EMSARCH.PARAMETERS (CODE,CATEGORY,SECTION,NAME,DESCRIPTION,VALUE_TYPE,VALUE) values ('minSpecialChar','System','Password','Minimalna liczba znak�w specjalnych w ha�le','Minimalna liczba znak�w specjalnych w ha�le. Domy�lna warto��: 1','N','');
Insert into EMSARCH.PARAMETERS (CODE,CATEGORY,SECTION,NAME,DESCRIPTION,VALUE_TYPE,VALUE) values ('minCharLength','System','Password','Minimalna ilo�� znak�w w ha�le','Minimalna ilo�� znak�w w ha�le. Domy�lna warto��: 1','N','');
Insert into EMSARCH.PARAMETERS (CODE,CATEGORY,SECTION,NAME,DESCRIPTION,VALUE_TYPE,VALUE) values ('passValidPeriod','System','Password','Okres wa�no�ci has�a','Okres wa�no�ci has�a (liczba dni), po kt�rym nast�pi wymuszenie zmiany has�a przez u�ytkownika.','N','');
