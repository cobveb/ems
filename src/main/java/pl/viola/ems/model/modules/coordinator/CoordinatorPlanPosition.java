package pl.viola.ems.model.modules.coordinator;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.Set;

@ToString(exclude = {"plan", "subPositions"})
@EqualsAndHashCode(exclude = {"plan", "subPositions"})
@Data

@NoArgsConstructor
@SuperBuilder
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "cor_plan_positions", schema = "emsadm")
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        property = "type",
        visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = FinancialPosition.class, name = "fin"),
        @JsonSubTypes.Type(value = PublicProcurementPosition.class, name = "pzp"),
})
@DynamicUpdate
public abstract class CoordinatorPlanPosition implements Serializable {

    public enum PlanPositionStatus {
        ZP, WY, ZA, PR, RE, ZR
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "coordinatorPlanPositionSequence")
    @SequenceGenerator(name = "coordinatorPlanPositionSequence", sequenceName = "cor_plan_pos_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @Enumerated(EnumType.STRING)
    private PlanPositionStatus status;

    @NonNull
    @Column(name = "am_req_net")
    private BigDecimal amountRequestedNet;

    @Transient
    @Setter
    private BigDecimal amountRequestedGross;

    @Column(name = "am_awa_net")
    private BigDecimal amountAwardedNet;

    @Transient
    private BigDecimal amountAwardedGross;

    @Column(name = "am_rea_net")
    private BigDecimal amountRealizedNet;

    @Transient
    private BigDecimal amountRealizedGross;

    @NonNull
    private BigDecimal vat;


    @NonNull
    @ManyToOne
    @JoinColumn(name = "plan_id")
    private CoordinatorPlan plan;


    @OneToMany(fetch = FetchType.LAZY, mappedBy = "planPosition", cascade = {CascadeType.ALL})
    private Set<CoordinatorPlanSubPosition> subPositions = new HashSet<>();

    public BigDecimal getAmountRequestedGross() {
        if (amountRequestedNet != null) {
            this.amountRequestedGross = this.amountRequestedNet.multiply(this.vat).setScale(2, RoundingMode.CEILING);
        }
        return this.amountRequestedGross;
    }

    public BigDecimal getAmountAwardedGross() {
        if (amountAwardedNet != null) {
            this.amountAwardedGross = amountAwardedNet.multiply(vat).setScale(2, RoundingMode.CEILING);
        }
        return this.amountAwardedGross;
    }

    public BigDecimal getAmountRealizedGross() {
        if (amountRealizedNet != null) {
            this.amountRealizedGross = amountRealizedNet.multiply(vat).setScale(2, RoundingMode.CEILING);
        }
        return this.amountRealizedGross;
    }
}
