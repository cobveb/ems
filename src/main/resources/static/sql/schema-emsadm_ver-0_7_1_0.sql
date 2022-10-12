/* Add column institution plan to coordinator plan table  */
alter table emsadm.cor_plans add(
  institution_plan_id NUMBER(19,0) CONSTRAINT cor_plan_inst_plan_fk REFERENCES emsarch.institution_plan(id)
);

COMMENT on COLUMN cor_plans.institution_plan_id is 'Institution plan of current coordinator plan FK (institution_plan)';
/