REM INSERTING into EMSARCH.ORGANIZATION_UNITS
SET DEFINE OFF;
Insert into EMSADM.ORGANIZATION_UNITS (CODE,BUILDING,CITY,EMAIL,FAX,NAME,NIP,PARENT,PHONE,REGON,SHORT_NAME,STREET,ZIP_CODE,STATUS) values ('uck',null,null,'uck@uck.katowice.pl',null,'UCK im. Prof. K. Gibińskiego SUM',null,null,null,null,'Uniwersyteckie Centrum Kliniczne im. Prof. K. Gibińskiego Śląskiego Uniwersytetu Medycznego',null,null,1);
Insert into EMSADM.ORGANIZATION_UNITS (CODE,BUILDING,CITY,EMAIL,FAX,NAME,NIP,PARENT,PHONE,REGON,SHORT_NAME,STREET,ZIP_CODE,STATUS) values ('it',null,null,'it@uck.katowice.pl',null,'Dział Informatyki',null,'uck',null,null,'Dział Informatyki',null,null,1);
Insert into EMSADM.ORGANIZATION_UNITS (CODE,BUILDING,CITY,EMAIL,FAX,NAME,NIP,PARENT,PHONE,REGON,SHORT_NAME,STREET,ZIP_CODE,STATUS) values ('itc',null,null,'itc@uck.katowice.pl',null,'Dział Informatyki - C',null,'it',null,null,'Dział Informatyki - C',null,null,1);
Insert into EMSADM.ORGANIZATION_UNITS (CODE,BUILDING,CITY,EMAIL,FAX,NAME,NIP,PARENT,PHONE,REGON,SHORT_NAME,STREET,ZIP_CODE,STATUS) values ('lab',null,null,'lab@uck.katowice.pl',null,'Laboratorium',null,'uck',null,null,'Laboratorium',null,null,1);
Insert into EMSADM.ORGANIZATION_UNITS (CODE,BUILDING,CITY,EMAIL,FAX,NAME,NIP,PARENT,PHONE,REGON,SHORT_NAME,STREET,ZIP_CODE,STATUS) values ('ag',null,null,'ag@uck.katowice.pl',null,'Dział AG',null,'adm',null,null,'Dział AG',null,null,1);
Insert into EMSADM.ORGANIZATION_UNITS (CODE,BUILDING,CITY,EMAIL,FAX,NAME,NIP,PARENT,PHONE,REGON,SHORT_NAME,STREET,ZIP_CODE,STATUS) values ('adm',null,null,'adm@uck.katowice.pl',null,'Dział Administracji',null,'uck',null,null,'Dział AG',null,null,1);
REM INSERTING into EMSARCH.REGISTERS
SET DEFINE OFF;
insert into EMSADM.REGISTERS (ID,CODE,NAME) values (register_seq.nextval,'cpdo','Czynności przetwarzania danych osobowych');