/* Add new privilege */
REM INSERTING into EMSARCH.AC_PRIVILEGES
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (34,'1023','Odczyt planu instytucji');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (35,'2023','Akceptacja pozycji w planie instytucji');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (36,'3023','Zatwierdzenie planu instytucji');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (37,'4023','Wycofanie planu instytucji');
REM INSERTING into EMSARCH.AC_OBJECT_PRIVILEGES
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,34);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,35);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,36);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,37);

/*-----------------------------------------Tables Module Public Procurement -------------------------------------------*/

/*Re-create the table of Public Procurement Institution Plans Positions on module Public Procurement*/
drop table emsadm.pub_institution_plan_pos cascade constraints purge;
/
create TABLE emsadm.pub_institution_plan_pos(
    id NUMBER(19,0) NOT NULL,
    estimation_type VARCHAR(5) NOT NULL,
    order_type VARCHAR(3) NOT NULL,
    am_inferred_net NUMBER(20,5),
    am_inferred_gross NUMBER(20,5),
    am_art30_net NUMBER(20,5),
    am_art30_gross NUMBER(20,5),
    assortment_id NUMBER(19,0) NOT NULL,
	CONSTRAINT pub_inst_plan_pos_pk PRIMARY KEY(id),
	CONSTRAINT pub_inst_plan_pos_fk FOREIGN KEY (id) REFERENCES emsadm.acc_institution_plan_positions(id),
	CONSTRAINT pub_inst_plan_pos_assort_gr_fk FOREIGN KEY (assortment_id) REFERENCES emsarch.dictionary_items(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN pub_institution_plan_pos.id is 'Instituton financial position ID PK and FK';
COMMENT on COLUMN pub_institution_plan_pos.estimation_type is 'Position estimation type';
COMMENT on COLUMN pub_institution_plan_pos.order_type is 'Position order type';
COMMENT on COLUMN pub_institution_plan_pos.am_inferred_net is 'Value net of submitted applications for public procurement';
COMMENT on COLUMN pub_institution_plan_pos.am_inferred_gross is 'Value gross of submitted applications for public procurement';
COMMENT on COLUMN pub_institution_plan_pos.am_art30_net is 'Value net of art 30 submitted applications for public procurement';
COMMENT on COLUMN pub_institution_plan_pos.am_art30_gross is 'Value gross of art 30 submitted applications for public procurement';
COMMENT on COLUMN pub_institution_plan_pos.assortment_id is 'Position assortment group (FK -> slAsortGr)';
/