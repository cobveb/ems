/* Add column update coordinator plan number  */
alter table emsadm.cor_plans add(
  update_number INTEGER
);

COMMENT on COLUMN cor_plans.update_number is 'Plan update number';
/

/* Add column update institution plan number  */
alter table emsadm.acc_institution_plans add(
  update_number INTEGER
);

COMMENT on COLUMN acc_institution_plans.update_number is 'Plan update number';
/