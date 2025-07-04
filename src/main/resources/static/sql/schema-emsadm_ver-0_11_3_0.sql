/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TABLES                                            				   */
/*-------------------------------------------------------------------------------------------------------------------- */
/* Add invoices, realized, option value column in the coordinator realization contract */
alter table emsadm.cor_real_contracts add(
  inv_val_net NUMBER(20,5),
  inv_val_gross NUMBER(20,5),
  percent_opt INTEGER,
  opt_val_net NUMBER(20,5),
  opt_val_gross NUMBER(20,5),
  rel_opt_val_net NUMBER(20,5),
  rel_opt_val_gross NUMBER(20,5)
);

COMMENT on COLUMN cor_real_contracts.inv_val_net is 'Contract invoces value net';
COMMENT on COLUMN cor_real_contracts.inv_val_gross is 'Contract invoices value gross';
COMMENT on COLUMN cor_real_contracts.percent_opt is 'Contract percent option value';
COMMENT on COLUMN cor_real_contracts.opt_val_net is 'Contract option value net';
COMMENT on COLUMN cor_real_contracts.opt_val_gross is 'Contract option value gross';
COMMENT on COLUMN cor_real_contracts.rel_opt_val_net is 'Contract realized option value net';
COMMENT on COLUMN cor_real_contracts.rel_opt_val_gross is 'Contract realized option value gross';
/

/* Add invoice, option value column in the coordinator realization invoice */
alter table emsadm.cor_real_invoices add(
  inv_val_net NUMBER(20,5),
  inv_val_gross NUMBER(20,5),
  opt_val_net NUMBER(20,5),
  opt_val_gross NUMBER(20,5)
);

COMMENT on COLUMN cor_real_invoices.inv_val_net is 'Invoice value net';
COMMENT on COLUMN cor_real_invoices.inv_val_gross is 'Invoice value gross';
COMMENT on COLUMN cor_real_invoices.opt_val_net is 'Invoice option value net';
COMMENT on COLUMN cor_real_invoices.opt_val_gross is 'Invoice option value gross';
/

/* Add option value column in the coordinator realization invoice position */
alter table emsadm.cor_real_invoice_positions add(
  opt_val_net NUMBER(20,5),
  opt_val_gross NUMBER(20,5)
);

COMMENT on COLUMN cor_real_invoice_positions.opt_val_net is 'Invoice position option value net';
COMMENT on COLUMN cor_real_invoice_positions.opt_val_gross is 'Invoice position option value gross';
/


