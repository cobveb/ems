package pl.viola.ems.model.modules.accountant;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "acc_cost_years", schema = "emsadm", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "year", "cost_type_id"
        })
})
@DynamicUpdate()
public class CostYear {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "costYearSequence")
    @SequenceGenerator(name = "costYearSequence", sequenceName = "acc_cost_years_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NotNull
    private int year;

    @JsonIgnore
    @NonNull
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cost_type_id")
    private CostType costType;

    @ManyToMany(fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JoinTable(name = "acc_cost_years_coordinators", schema = "emsadm",
            joinColumns = @JoinColumn(name = "cost_year_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "coordinator_id", referencedColumnName = "code"))
    private Set<OrganizationUnit> coordinators = new HashSet<>();
}
