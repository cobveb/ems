package pl.viola.ems.model.modules.asi.employee;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import pl.viola.ems.model.audit.UserDateAudit;
import pl.viola.ems.model.common.Text;
import pl.viola.ems.model.modules.asi.dictionary.employee.EntitlementSystem;
import pl.viola.ems.model.modules.hr.employees.Employee;
import pl.viola.ems.model.modules.hr.employees.Employment;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "asi_emp_entitlement", schema = "emsadm")
@EqualsAndHashCode
@DynamicUpdate()
public class Entitlement extends UserDateAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entitlementSequence")
    @SequenceGenerator(name = "entitlementSequence", sequenceName = "asi_emp_entitlement_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NotBlank
    @NonNull
    @Size(max = 50)
    private String username;

    @NonNull
    @Column(name = "date_from")
    private Date dateFrom;

    @Column(name = "date_to")
    private Date dateTo;

    @Column(name = "date_withdrawal")
    private Date dateWithdrawal;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "comments_id", referencedColumnName = "id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Text comments;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "employment_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Employment employment;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "ent_sys_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private EntitlementSystem entitlementSystem;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "employee_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonIgnore
    private Employee employee;

}
