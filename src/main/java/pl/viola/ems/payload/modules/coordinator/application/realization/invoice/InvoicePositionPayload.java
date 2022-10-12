package pl.viola.ems.payload.modules.coordinator.application.realization.invoice;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.viola.ems.model.common.Text;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoicePositionPayload {
    private Long id;

    private String invoiceNumber;

    private Text name;

    private BigDecimal amountNet;

    private BigDecimal amountGross;

}
