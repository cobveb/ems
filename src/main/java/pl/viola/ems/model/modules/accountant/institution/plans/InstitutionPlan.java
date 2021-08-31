package pl.viola.ems.model.modules.accountant.institution.plans;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Set;

@ToString(exclude = {"planPositions"})
@EqualsAndHashCode(exclude = {"planPositions"})
@Data
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "acc_institution_plans", schema = "emsadm")
@DynamicUpdate
public class InstitutionPlan {

    public enum InstitutionPlanStatus {
        UT, ZA, RE, ZR
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "institutionPlanSequence")
    @SequenceGenerator(name = "institutionPlanSequence", sequenceName = "acc_inst_plan_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    private int year;

    @NonNull
    @Enumerated(EnumType.STRING)
    private InstitutionPlanStatus status;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type")
    private CoordinatorPlan.PlanType type;

    @Transient
    private BigDecimal amountRequestedGross;

    @Transient
    private BigDecimal amountAwardedGross;

    @Transient
    private BigDecimal amountRealizedGross;

    @Transient
    @Setter
    private Boolean isCorrected;

    @ManyToOne
    @JoinColumn(name = "plan_approve_user_id")
    private User approveUser;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "plan", cascade = {CascadeType.ALL})
    private Set<InstitutionPlanPosition> planPositions;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "plan_correction_id", referencedColumnName = "id")
    private InstitutionPlan correctionPlan;

    public Boolean getIsCorrected() {
        return correctionPlan != null;
    }

}
