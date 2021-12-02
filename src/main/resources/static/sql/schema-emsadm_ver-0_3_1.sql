/*--------------------------------------------  Tables Module Coordinator  -------------------------------------------*/

/* Add column public procurement accept plan user to coordinator plan */
alter table emsadm.cor_plans add(
  public_accept_user_id NUMBER(19,0) CONSTRAINT cor_plan_pub_accept_usr_fk REFERENCES emsarch.users(id)
);

COMMENT on COLUMN cor_plans.public_accept_user_id is 'Plan public procurement accept user (Users)';
/