package pl.viola.ems.payload.modules.coordinator.application;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationProcurementPlanPosition {
    private Long id;

    private String code;

    private String name;

    private String itemName;

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
    private CoordinatorPlanPosition coordinatorPlanPosition;
}
