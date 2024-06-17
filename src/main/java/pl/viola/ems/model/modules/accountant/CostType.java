package pl.viola.ems.model.modules.accountant;

import lombok.*;
import pl.viola.ems.model.common.dictionary.DictItem;

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
@NamedStoredProcedureQueries({
        @NamedStoredProcedureQuery(
                name = "generateCostsType",
                procedureName = "emsadm.cor_plans_util.generate_costs_type",
                parameters = {
                        @StoredProcedureParameter(name = "p_source_year", type = Integer.class, mode = ParameterMode.IN),
                        @StoredProcedureParameter(name = "p_target_year", type = Integer.class, mode = ParameterMode.IN),
                        @StoredProcedureParameter(name = "o_msg", type = String.class, mode = ParameterMode.OUT)
                }
        )
})

public class CostType implements DictItem {
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


    @OneToMany(fetch = FetchType.LAZY, mappedBy = "costType", cascade = {CascadeType.ALL})
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<CostYear> years = new HashSet<>();

    @Override
    public String getItemName() {
        return this.name;
    }
}
