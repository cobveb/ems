/* Add column public procurement application cancel user  */
alter table emsadm.acc_institution_plans add(
    economic_accept_user_id NUMBER(19,0) CONSTRAINT acc_inst_plan_economic_usr_fk REFERENCES emsarch.users(id)
);

COMMENT on COLUMN acc_institution_plans.economic_accept_user_id is 'Plan director economic accept user (FK -> users)';
/