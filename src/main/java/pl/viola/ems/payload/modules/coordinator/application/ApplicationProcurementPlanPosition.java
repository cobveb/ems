package pl.viola.ems.payload.modules.coordinator.application;

import lombok.*;

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

//    private String initiationTerm;

    private BigDecimal amountRequestedNet;

    private BigDecimal amountRealizedNet;

    private BigDecimal amountInferredNet;

    private BigDecimal percentArt30;

    private BigDecimal amountArt30Net;

    private BigDecimal amountArt30Gross;

//    private BigDecimal vat;
}
