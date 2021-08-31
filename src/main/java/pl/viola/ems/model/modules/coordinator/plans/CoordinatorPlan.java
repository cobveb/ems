package pl.viola.ems.model.modules.coordinator.plans;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@ToString(exclude = {"coordinator", "positions"})
@EqualsAndHashCode(exclude = {"coordinator", "positions"})
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
public class CoordinatorPlan {

    public enum PlanStatus {
        ZP, WY, RO, AK, AD, AZ, ZA, SK, RE, ZR
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
    @JoinColumn(name = "director_accept_user_id")
    private User directorAcceptUser;

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

    public void removePosition(CoordinatorPlanPosition position) {
        positions.remove(position);
    }
}
