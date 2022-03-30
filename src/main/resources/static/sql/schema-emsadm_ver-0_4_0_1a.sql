ALTER TABLE emsadm.organization_units ADD office_symbol varchar2(3);

COMMENT on COLUMN organization_units.office_symbol is 'Unit office symbol';
/

create or replace package cor_public_procurement_mgmt as
    procedure generate_application_number(p_coordinator in varchar2, p_mode in varchar2, p_estimation_type in varchar2, new_number out varchar2);
end cor_public_procurement_mgmt;
/
create or replace package body cor_public_procurement_mgmt as
    procedure generate_application_number(p_coordinator in varchar2, p_mode in varchar2, p_estimation_type in varchar2, new_number out varchar2)
        as
            last_application_number emsadm.cor_pub_proc_application.apl_number%type;
            symbol emsadm.organization_units.office_symbol%type;
            last_number number;
            first_day date;
            last_day date;
            year varchar2(4);
            code varchar2(10);
            estimation_type char(1);
        begin

            select trunc (sysdate , 'YEAR')
            into first_day
            from DUAL;

            select add_months(trunc (sysdate, 'YEAR'), 12) - 1
            into last_day
            from DUAL;

            begin
                select new_num, office_symbol
                    into last_number, symbol
                from (
                    select to_number(substr(apl.apl_number,  instr(apl.apl_number, '/',1,4)+1, instr(apl.apl_number, '/',1,5)-(instr(apl.apl_number, '/',1,4)+1)))+1 as new_num, ou.office_symbol
                        from emsadm.cor_pub_proc_application apl left join emsadm.organization_units ou on (apl.coordinator_id = ou.code)
                            where
                                apl.coordinator_id = p_coordinator and
                                apl.create_date between first_day and last_day and
                                apl.apl_mode = p_mode and
                                apl.estimation_type = p_estimation_type and
                                apl.apl_number is not null
                        order by to_number(substr(apl.apl_number,  instr(apl.apl_number, '/',1,4)+1, instr(apl.apl_number, '/',1,5)-(instr(apl.apl_number, '/',1,4)+1))) desc
                ) where rownum = 1;
                exception
                    when NO_DATA_FOUND then
                        last_number := null;
                        symbol := null;
            end;

            select extract(year from sysdate)
            into year
            from dual;

            if last_number is null then
                last_number := 1;
            end if;

            if symbol is null then
                begin
                    select upper(office_symbol)
                        into code
                    from emsadm.organization_units ou
                        where
                            ou.code = p_coordinator;
                    exception
                        when NO_DATA_FOUND then
                            code := upper(p_coordinator);
                end;
            else
                code := upper(symbol);
            end if;

            case p_estimation_type
                when 'DO50' then
                    estimation_type := 'D';
                when 'DO130' then
                    estimation_type := 'C';
                when 'PO130' then
                    estimation_type := 'B';
                when 'UE139' then
                    estimation_type := 'A';
            end case;

            new_number := code || '/381/' || p_mode || '/' || estimation_type || '/' || last_number || '/' || year;
        end;

end cor_public_procurement_mgmt;
/