package pl.viola.ems.model.modules.accountant;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "acc_costs_type", schema = "emsadm", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "cost_number"
        })
})
@DynamicUpdate()
public class CostType {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "costTypeSequence")
    @SequenceGenerator(name = "costTypeSequence", sequenceName = "acc_costs_type_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @NotBlank
    @Column(name = "cost_number")
    private String code;

    @NonNull
    @NotBlank
    private String name;

    @NonNull
    private Boolean active;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "costType", cascade = {CascadeType.ALL})
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<CostYear> years = new HashSet<>();

}
