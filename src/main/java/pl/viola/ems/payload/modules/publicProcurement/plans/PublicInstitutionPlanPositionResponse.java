package pl.viola.ems.payload.modules.publicProcurement.plans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.viola.ems.model.common.dictionary.DictionaryItem;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublicInstitutionPlanPositionResponse {

    private Long id;

    private DictionaryItem assortmentGroup;

    private PublicProcurementPosition.OrderType orderType;

    private PublicProcurementPosition.EstimationType estimationType;

    private OrganizationUnit coordinator;

    private BigDecimal amountRequestedNet;

    private CoordinatorPlanPosition.PlanPositionStatus status;

}
