ALTER TABLE emsadm.cor_pub_proc_groups
    ADD (
        am_ctr_awa_net NUMBER(20,5),
        am_ctr_awa_gross NUMBER(20,5)
    );

COMMENT on COLUMN cor_pub_proc_groups.am_ctr_awa_net is 'Amount contract awarded net';
COMMENT on COLUMN cor_pub_proc_groups.am_ctr_awa_gross is 'Amount contract awarded gross';
/
ALTER TABLE emsadm.cor_pub_proc_groups
    MODIFY (
        plan_position_id NUMBER(19,0) NULL,
        order_value_year_net NUMBER(20,5) NULL
    );
/
/* Create the table of Public Procurement Protocol */
drop table emsadm.cor_pub_proc_gr_pos cascade constraints purge;
/
create TABLE emsadm.cor_pub_proc_gr_pos(
    id NUMBER(19,0) NOT NULL,
    pos_am_net NUMBER(20,5) NOT NULL,
    vat NUMBER(3,2) NOT NULL,
    pos_am_gross NUMBER(20,5) NOT NULL,
    plan_position_id NUMBER(19,0) NOT NULL,
    apl_pub_proc_gr_id  NUMBER(19,0) NOT NULL,
    CONSTRAINT cor_pub_proc_gr_pos_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_gr_pos_fk FOREIGN KEY (plan_position_id) REFERENCES emsadm.cor_plan_positions(id),
    CONSTRAINT cor_pub_proc_gr_fk FOREIGN KEY (apl_pub_proc_gr_id) REFERENCES emsadm.cor_pub_proc_groups(id)
)TABLESPACE  ems_data;

COMMENT on COLUMN cor_pub_proc_gr_pos.id is 'Application Assortment Group Plan Position PK';
COMMENT on COLUMN cor_pub_proc_gr_pos.pos_am_net is 'Assortment group plan position value Net';
COMMENT on COLUMN cor_pub_proc_gr_pos.vat is 'VAT for the assortment group plan position';
COMMENT on COLUMN cor_pub_proc_gr_pos.pos_am_gross is 'Assortment group plan position value Gross';
COMMENT on COLUMN cor_pub_proc_gr_pos.plan_position_id is 'Plan financial or inwestment position FK';
COMMENT on COLUMN cor_pub_proc_gr_pos.apl_pub_proc_gr_id is 'Application assortment group FK';
/
-- Create sequence of table texts
drop sequence cor_pub_apl_gr_pos_seq;
/
create sequence cor_pub_apl_gr_pos_seq start with 1 increment by 1 nomaxvalue;
/
---------------------------------------------------------------------------------------------------
/* Add column public procurement accept plan user to coordinator plan */
alter table emsadm.cor_pub_proc_group_sub_year add(
  apl_gr_pl_pos_id NUMBER(19,0) CONSTRAINT apl_ass_gr_pl_pos_fk REFERENCES emsadm.cor_pub_proc_gr_pos(id)
);

COMMENT on COLUMN cor_pub_proc_group_sub_year.apl_gr_pl_pos_id is 'Application assortment group plan position FK (ApplicationAssortmentGroupPlanPosition)';
/
ALTER TABLE emsadm.cor_pub_proc_group_sub_year
    MODIFY (
        apl_pub_proc_gr_id NUMBER(19,0) NULL,
        vat NUMBER(3,2) NULL
    )
/