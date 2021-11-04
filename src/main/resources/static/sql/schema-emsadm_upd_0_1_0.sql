/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TABLES                                            				   */
/*-------------------------------------------------------------------------------------------------------------------- */

/*-----------------------------------------Tables Module Public Procurement -------------------------------------------*/

/*Create the table of Institution Plans Positions Financial on module Accountant*/
drop table emsadm.pub_institution_plan_pos cascade constraints purge;
/
create TABLE emsadm.pub_institution_plan_pos(
    id NUMBER(19,0) NOT NULL,
    estimation_type VARCHAR(5) NOT NULL,
    order_type VARCHAR(3) NOT NULL,
    assortment_id NUMBER(19,0) NOT NULL,
	CONSTRAINT pub_inst_plan_pos_pk PRIMARY KEY(id),
	CONSTRAINT pub_inst_plan_pos_fk FOREIGN KEY (id) REFERENCES emsadm.acc_institution_plan_positions(id),
	CONSTRAINT pub_inst_plan_pos_assort_gr_fk FOREIGN KEY (assortment_id) REFERENCES emsarch.dictionary_items(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN pub_institution_plan_pos.id is 'Instituton financial position ID PK and FK';
COMMENT on COLUMN pub_institution_plan_pos.estimation_type is 'Position estimation type';
COMMENT on COLUMN pub_institution_plan_pos.order_type is 'Position order type';
COMMENT on COLUMN pub_institution_plan_pos.assortment_id is 'Position assortment group (FK -> slAsortGr)';
/
/*--------------------------------------------  Tables Module Coordinator  -------------------------------------------*/
/* Add column realized date and category to investment position */
    alter table emsadm.cor_investment_positions add(
        category_id NUMBER(19,0) NOT NULL CONSTRAINT cor_inv_category_fk REFERENCES emsarch.dictionary_items(id),
        realization_date DATE NOT NULL

    );
COMMENT on COLUMN cor_investment_positions.category_id is 'Position category (FK -> slKatSlInw)';
COMMENT on COLUMN cor_investment_positions.realization_date is 'Realized position date';

alter table emsadm.cor_investment_positions
    add name VARCHAR(200);
COMMENT on COLUMN cor_investment_positions.name is 'Position accountant task name';
/

/* Resize task column */
alter table emsadm.cor_investment_positions modify
    task VARCHAR(200);
/

/* Rename funding source amount columns */
alter table emsadm.cor_inv_founding_source
    rename COLUMN so_am_awa_net TO so_am_net;

alter table emsadm.cor_inv_founding_source
    rename COLUMN so_ex_plan_net TO so_am_gross;
/
/* Add funding source amount columns */

alter table emsadm.cor_inv_founding_source add(
    so_awa_net NUMBER(20,5),
    so_awa_gross NUMBER(20,5),
    so_exp_net NUMBER(20,5) NOT NULL,
    so_exp_gross NUMBER(20,5) NOT NULL,
    so_exp_awa_net NUMBER(20,5),
    so_exp_awa_gross NUMBER(20,5),
    so_rea_net NUMBER(20,5),
    so_rea_gross NUMBER(20,5),
    sub_position_id NUMBER(19,0) CONSTRAINT cor_inv_sub_pos_fk REFERENCES emsarch.cor_inv_sub_positions(id)
);
COMMENT ON COLUMN cor_inv_founding_source.so_awa_net is 'Funding source task amount awarded net';
COMMENT ON COLUMN cor_inv_founding_source.so_awa_gross is 'Funding source task amount awarded gross';
COMMENT ON COLUMN cor_inv_founding_source.so_exp_net is 'Funding source expenses plan amount net';
COMMENT ON COLUMN cor_inv_founding_source.so_exp_gross is 'Funding source expenses plan amount gross';
COMMENT ON COLUMN cor_inv_founding_source.so_exp_awa_net is 'Funding source expenses plan amount awarded net';
COMMENT ON COLUMN cor_inv_founding_source.so_rea_net is 'Funding source expenses plan amount realized net';
COMMENT ON COLUMN cor_inv_founding_source.so_rea_gross is 'Funding source expenses plan amount realized gross';
COMMENT ON COLUMN cor_inv_founding_source.sub_position_id is 'Sub position ID (FK -> cor_inv_sub_positions)';

/* Create the table of Plan Sub Positions Investment on module Coordinator */
drop table emsadm.cor_inv_sub_positions cascade constraints purge;
/

create TABLE emsadm.cor_inv_sub_positions(
    id NUMBER(19,0) NOT NULL,
    quantity NUMBER(8,0) NOT NULL,
    target_unit VARCHAR2(10),
    CONSTRAINT cor_inv_sub_pos_pk PRIMARY KEY(id),
    CONSTRAINT cor_inv_target_unit_fk FOREIGN KEY (target_unit) REFERENCES emsadm.organization_units(code)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_inv_sub_positions.id is 'Investment sub position ID PK and FK';
COMMENT on COLUMN cor_inv_sub_positions.quantity is 'Quantity per target unit';
COMMENT on COLUMN cor_inv_sub_positions.target_unit is 'Target Unit FK (FK -> organization_units)';
/

/* Resize comments column */
alter table emsadm.cor_plan_sub_positions modify
    comments VARCHAR(500);
/

/* Resize name column */
alter table emsadm.cor_plan_sub_positions modify
    name VARCHAR(200);
/