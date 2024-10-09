package pl.viola.ems.model.modules.coordinator.realization.invoice;

import lombok.*;
import pl.viola.ems.model.common.Text;
import pl.viola.ems.model.modules.accountant.dictionary.Contractor;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;
import pl.viola.ems.model.modules.coordinator.realization.contracts.Contract;

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
@Table(name = "cor_real_invoices", schema = "emsadm")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "invoiceSequence")
    @SequenceGenerator(name = "invoiceSequence", sequenceName = "cor_real_inv_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @Size(max = 26)
    @Column(name = "inv_number")
    private String number;

    @NonNull
    @Column(name = "sell_date")
    private Date sellDate;

    @Transient
    private BigDecimal invoiceValueNet;

    @Transient
    private BigDecimal invoiceValueGross;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "coordinator_id")
    private OrganizationUnit coordinator;

    @ManyToOne
    @JoinColumn(name = "contractor_id")
    private Contractor contractor;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "desc_id", referencedColumnName = "id")
    private Text description;


    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "pub_proc_app_id", referencedColumnName = "id")
    private Application publicProcurementApplication;

    @ManyToOne
    @JoinColumn(name = "contract_id")
    @ToString.Exclude
    private Contract contract;


//    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "invoice", cascade = {CascadeType.ALL})
    @ToString.Exclude
    private Set<InvoicePosition> invoicePositions = new HashSet<>();


    public BigDecimal getInvoiceValueNet() {
        if (!invoicePositions.isEmpty()) {
            invoiceValueNet = invoicePositions.stream().map(InvoicePosition::getAmountNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        }
        return invoiceValueNet;
    }

    public BigDecimal getInvoiceValueGross() {
        if (!invoicePositions.isEmpty()) {
            invoiceValueGross = invoicePositions.stream().map(InvoicePosition::getAmountGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        }
        return invoiceValueGross;
    }

}
