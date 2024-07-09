
insert into EMSARCH.DICTIONARIES (CODE,NAME,TYPE) values ('slAsRegPod', 'Podstawa utworzenia rejestru', 'U');

insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'iso','ISO','1','slAsRegPod');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'acr','Akredytacja','1','slAsRegPod');




