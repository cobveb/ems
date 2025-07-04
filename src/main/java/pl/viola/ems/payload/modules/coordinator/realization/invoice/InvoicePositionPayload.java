package pl.viola.ems.payload.modules.coordinator.realization.invoice;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.viola.ems.model.common.Text;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoicePositionPayload {
    private Long id;

    private String invoiceNumber;

    private Date invoiceSellDate;

    private String invoiceContractorName;

    private Text name;

    private BigDecimal amountNet;

    private BigDecimal amountGross;

    private BigDecimal amountOptionNet;

    private BigDecimal amountOptionGross;

}
