package pl.viola.ems.model.modules.coordinator.plans;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import javax.persistence.Entity;
import javax.persistence.Table;

@ToString(exclude = {"mode"})
@EqualsAndHashCode(exclude = {"mode"}, callSuper = true)
@NoArgsConstructor
@SuperBuilder
@Data
@Entity
@Table(name = "cor_pub_sub_proc_positions", schema = "emsadm")
public class PublicProcurementSubPosition extends CoordinatorPlanSubPosition {
}
