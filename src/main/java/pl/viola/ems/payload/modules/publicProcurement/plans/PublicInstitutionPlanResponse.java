package pl.viola.ems.payload.modules.publicProcurement.plans;

import lombok.*;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlan;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;

import javax.persistence.*;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublicInstitutionPlanResponse {

    private Long id;

    @NonNull
    private int year;

    @NonNull
    @Enumerated(EnumType.STRING)
    private InstitutionPlan.InstitutionPlanStatus status;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type")
    private CoordinatorPlan.PlanType type;

    private BigDecimal amountRequestedNet;

    private BigDecimal amountRealizedNet;

    private Boolean isCorrected;

    private User approveUser;

    private User chiefAcceptUser;

    private InstitutionPlan correctionPlan;

}
