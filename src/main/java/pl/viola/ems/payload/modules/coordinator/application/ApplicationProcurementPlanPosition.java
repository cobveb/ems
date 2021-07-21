package pl.viola.ems.payload.modules.coordinator.application;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationProcurementPlanPosition {
    private Long id;

    private String code;

    private String name;

    private String estimationType;

    private String orderType;

    private String initiationTerm;

    private BigDecimal amountRequestedNet;

    private BigDecimal amountRealizedNet;

    private BigDecimal amountInferredNet;

    private BigDecimal vat;

//    private String mode;

}
