package pl.viola.ems.model.modules.coordinator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;

import javax.persistence.*;
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
        ZP, WY, ZA, SK, RE, ZR
    }

    public enum PlanType {
        FIN, INW, PZP
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "coordinatorPlanSequence")
    @SequenceGenerator(name = "coordinatorPlanSequence", sequenceName = "cor_plan_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
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

    @NonNull
    @ManyToOne
    @JoinColumn(name = "coordinator_id")
    private OrganizationUnit coordinator;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "plan", cascade = {CascadeType.MERGE})
    private Set<CoordinatorPlanPosition> positions = new HashSet<>();
}
