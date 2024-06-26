package pl.viola.ems.model.modules.coordinator.plans;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlan;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@ToString(exclude = {"coordinator", "positions", "institutionPlan"})
@EqualsAndHashCode(exclude = {"coordinator", "positions", "institutionPlan"})
@Data
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cor_plans", schema = "emsadm", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "year", "plan_type", "coordinator_id"
        }),
})
@DynamicUpdate
public class CoordinatorPlan implements Comparable<CoordinatorPlan> {

    @Override
    public int compareTo(@org.jetbrains.annotations.NotNull final CoordinatorPlan o) {
        return id.compareTo(o.getId());
    }

    public enum PlanStatus {
        ZP, WY, RO, PK, UZ, AK, AD, AZ, AE, AN, ZA, RE, ZR, AA
    }

    public enum PlanType {
        FIN, INW, PZP
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "coordinatorPlanSequence")
    @SequenceGenerator(name = "coordinatorPlanSequence", sequenceName = "cor_plan_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NotNull
    private int year;

    @Enumerated(EnumType.STRING)
    @NonNull
    private PlanStatus status;

    @Enumerated(EnumType.STRING)
    @NonNull
    @Column(name = "plan_type")
    private PlanType type;

    @Column(name = "create_date")
    private Date createDate;

    @Column(name = "send_date")
    private Date sendDate;

    @Transient
    private BigDecimal planAmountRequestedNet;

    @Transient
    private BigDecimal planAmountRequestedGross;

    @Transient
    private BigDecimal planAmountAwardedNet;

    @Transient
    private BigDecimal planAmountAwardedGross;

    @Transient
    private BigDecimal planAmountRealizedNet;

    @Transient
    private BigDecimal planAmountRealizedGross;

    @ManyToOne
    @JoinColumn(name = "send_user_id")
    private User sendUser;

    @ManyToOne
    @JoinColumn(name = "plan_accept_user_id")
    private User planAcceptUser;

    @ManyToOne
    @JoinColumn(name = "public_accept_user_id")
    private User publicAcceptUser;

    @ManyToOne
    @JoinColumn(name = "director_accept_user_id")
    private User directorAcceptUser;

    @ManyToOne
    @JoinColumn(name = "economic_accept_user_id")
    private User economicAcceptUser;

    @ManyToOne
    @JoinColumn(name = "chief_accept_user_id")
    private User chiefAcceptUser;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "coordinator_id")
    private OrganizationUnit coordinator;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "plan", cascade = {CascadeType.REMOVE})
    private Set<CoordinatorPlanPosition> positions = new HashSet<>();

    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "plan_correction_id", referencedColumnName = "id")
    private CoordinatorPlan correctionPlan;

    @JoinColumn(name = "update_number")
    private Integer updateNumber;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "institution_plan_id")
    private InstitutionPlan institutionPlan;

    public void removePosition(CoordinatorPlanPosition position) {
        positions.remove(position);
    }
}
