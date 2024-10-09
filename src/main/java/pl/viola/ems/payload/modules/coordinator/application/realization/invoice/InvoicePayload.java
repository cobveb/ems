package pl.viola.ems.payload.modules.coordinator.application.realization.invoice;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.viola.ems.model.modules.accountant.dictionary.Contractor;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoicePayload {
    private Long id;

    private String number;

    private Date sellDate;

    private BigDecimal invoiceValueGross;

    private OrganizationUnit coordinator;

    private Contractor contractor;

}
