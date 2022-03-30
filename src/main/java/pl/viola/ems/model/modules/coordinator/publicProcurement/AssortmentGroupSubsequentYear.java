package pl.viola.ems.model.modules.coordinator.publicProcurement;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@ToString(exclude = {"applicationAssortmentGroup", "applicationAssortmentGroupPlanPosition"})
@EqualsAndHashCode(exclude = {"applicationAssortmentGroup", "applicationAssortmentGroupPlanPosition"})
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Table(name = "cor_pub_proc_group_sub_year")
public class AssortmentGroupSubsequentYear {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "publicApplicationGroupSubsequentYearSequence")
    @SequenceGenerator(name = "publicApplicationGroupSubsequentYearSequence", sequenceName = "cor_pub_proc_gr_sub_year_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NotNull
    private int year;

    private BigDecimal vat;

    @NonNull
    @Column(name = "year_exp_value_net")
    private BigDecimal yearExpenditureNet;

    @NonNull
    @Column(name = "year_exp_value_gross")
    private BigDecimal yearExpenditureGross;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "apl_pub_proc_gr_id")
    private ApplicationAssortmentGroup applicationAssortmentGroup;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "apl_gr_pl_pos_id")
    private ApplicationAssortmentGroupPlanPosition applicationAssortmentGroupPlanPosition;
}
