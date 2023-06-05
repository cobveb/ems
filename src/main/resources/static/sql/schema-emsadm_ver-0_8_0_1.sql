/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TABLES                                            				   */
/*-------------------------------------------------------------------------------------------------------------------- */
/* Add column is active to table register_positions  */
alter table emsadm.register_positions add(
  is_active NUMBER(1) DEFAULT 1 NOT NULL
);

COMMENT on COLUMN register_positions.is_active is 'Register position is active';
/

/* Add column data set connection to table iod register cpdo positions */
alter table emsadm.iod_reg_pos_cpdo add(
  data_set_conn_id NUMBER(19,0)
);

COMMENT on COLUMN iod_reg_pos_cpdo.data_set_conn_id is 'Connection with the data set';
/
