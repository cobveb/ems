package pl.viola.ems.model.modules.coordinator.realization.contracts;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.common.Text;
import pl.viola.ems.model.common.dictionary.DictItem;
import pl.viola.ems.model.modules.accountant.dictionary.Contractor;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.realization.invoice.Invoice;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "cor_real_contracts", schema = "emsadm")
public class Contract implements DictItem {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "contractSequence")
    @SequenceGenerator(name = "contractSequence", sequenceName = "cor_real_ctr_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @Size(max = 26)
    @Column(name = "ctr_number")
    private String number;

    @NonNull
    @Column(name = "sig_date")
    private Date signingDate;

    @NonNull
    @Column(name = "sig_place")
    private String signingPlace;

    @NonNull
    @Column(name = "period_from")
    private Date periodFrom;

    @NonNull
    @Column(name = "period_to")
    private Date periodTo;

    @NonNull
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ctr_object_id", referencedColumnName = "id")
    private Text contractObject;

    @ManyToOne
    @JoinColumn(name = "contractor_id")
    private Contractor contractor;

    @NonNull
    private String representative;

    @NonNull
    @Column(name = "ctr_val_net")
    private BigDecimal contractValueNet;

    @NonNull
    @Column(name = "ctr_val_gross")
    private BigDecimal contractValueGross;

    @Column(name = "rel_prev_val_net")
    private BigDecimal realPrevYearsValueNet;

    @Column(name = "rel_prev_val_gross")
    private BigDecimal realPrevYearsValueGross;

    @Transient
    @ToString.Exclude
    private BigDecimal invoicesValueNet;

    @Transient
    @ToString.Exclude
    private BigDecimal invoicesValueGross;

    @Transient
    @ToString.Exclude
    private BigDecimal realizedValueNet;

    @Transient
    @ToString.Exclude
    private BigDecimal realizedValueGross;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "coordinator_id")
    @ToString.Exclude
    private OrganizationUnit coordinator;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "changes_id", referencedColumnName = "id")
    private Text changes;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "contract", cascade = {CascadeType.ALL})
    @ToString.Exclude
    private Set<Invoice> invoices = new HashSet<>();

    public BigDecimal getInvoicesValueNet() {
        if (!invoices.isEmpty()) {
            invoicesValueNet = invoices.stream().map(Invoice::getInvoiceValueNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        }
        return invoicesValueNet;
    }

    public BigDecimal getInvoicesValueGross() {
        if (!invoices.isEmpty()) {
            invoicesValueGross = invoices.stream().map(Invoice::getInvoiceValueGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        }
        return invoicesValueGross;
    }

    public BigDecimal getRealizedValueNet() {
        if (invoicesValueNet != null) {
            realizedValueNet = invoicesValueNet;
            if (realPrevYearsValueNet != null) {
                return realizedValueNet.add(realPrevYearsValueNet);
            }
        } else if (realPrevYearsValueNet != null) {
            return realizedValueNet = realPrevYearsValueNet;
        }
        return realizedValueNet;
    }

    public BigDecimal getRealizedValueGross() {
        if (invoicesValueGross != null) {
            this.realizedValueGross = invoicesValueGross;
            if (realPrevYearsValueGross != null) {
                return realizedValueGross.add(realPrevYearsValueGross);
            }
        } else if (realPrevYearsValueGross != null) {
            return realizedValueGross = realPrevYearsValueGross;
        }
        return realizedValueGross;
    }

    public BigDecimal getValueToRealizeNet() {
        if (this.getRealizedValueNet() != null) {
            return contractValueNet.subtract(this.getRealizedValueNet());
        }
        return contractValueNet;
    }

    public BigDecimal getValueToRealizeGross() {
        if (this.getRealizedValueGross() != null) {
            return contractValueGross.subtract(this.getRealizedValueGross());
        }
        return contractValueGross;
    }

    @Override
    public String getCode() {
        return this.number;
    }

    @Override
    public String getName() {
        return this.contractObject.getContent();
    }
}
