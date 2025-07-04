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

    @Column(name = "inv_val_net")
    private BigDecimal invoiceValueNet;

    @Column(name = "inv_val_gross")
    private BigDecimal invoiceValueGross;

    @Column(name = "opt_val_net")
    private BigDecimal optionValueNet;

    @Column(name = "opt_val_gross")
    private BigDecimal optionValueGross;

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

}
