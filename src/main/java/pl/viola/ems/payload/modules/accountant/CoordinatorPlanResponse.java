package pl.viola.ems.payload.modules.accountant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;
import pl.viola.ems.payload.auth.UserSummary;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.math.BigDecimal;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CoordinatorPlanResponse {

    private Long id;

    private int year;

    @Enumerated(EnumType.STRING)
    private CoordinatorPlan.PlanStatus status;

    @Enumerated(EnumType.STRING)
    private CoordinatorPlan.PlanType type;

    private OrganizationUnit coordinator;

    private UserSummary sendUser;

    private UserSummary planAcceptUser;

    private UserSummary directorAcceptUser;

    private UserSummary chiefAcceptUser;

    private BigDecimal planAmountRequestedNet;

    private BigDecimal planAmountRequestedGross;

    private BigDecimal planAmountAwardedNet;

    private BigDecimal planAmountAwardedGross;

    private BigDecimal planAmountRealizedNet;

    private BigDecimal planAmountRealizedGross;

    private Set<CoordinatorPlanPosition> positions;

}
