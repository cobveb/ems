package pl.viola.ems.model.modules.coordinator;

import lombok.*;
import lombok.experimental.SuperBuilder;
import pl.viola.ems.model.modules.accountant.CostType;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@ToString(exclude = {"costType"})
@EqualsAndHashCode(exclude = {"costType"}, callSuper = true)
@Data
@AllArgsConstructor
@RequiredArgsConstructor
@SuperBuilder
@Entity
@Table(name = "cor_financial_positions", schema = "emsadm")
public class FinancialPosition extends CoordinatorPlanPosition {

    @ManyToOne
    @JoinColumn(name = "cost_type_id")
    private CostType costType;
}
