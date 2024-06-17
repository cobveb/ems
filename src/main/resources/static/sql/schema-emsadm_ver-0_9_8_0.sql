/* Add column is active to table register_positions  */
alter table emsadm.cor_pub_proc_application add(
  is_pub_real NUMBER(1)
);

COMMENT on COLUMN cor_pub_proc_application.is_pub_real is 'Whether the application is carried out by the public procurement department';
/