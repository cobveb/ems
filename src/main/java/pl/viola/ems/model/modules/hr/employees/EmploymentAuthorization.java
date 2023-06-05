package pl.viola.ems.model.modules.hr.employees;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.common.Text;
import pl.viola.ems.model.modules.iod.register.RegisterCpdoPosition;

import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "hr_emp_eml_authorizations")
public class EmploymentAuthorization {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "emlAuthorizationSequence")
    @SequenceGenerator(name = "emlAuthorizationSequence", sequenceName = "hr_emp_eml_authorizations_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @Column(name = "is_active")
    private Boolean isActive;

    @NonNull
    @Column(name = "auth_date")
    private Date authorizationDate;

    @NonNull
    @Column(name = "date_from")
    private Date dateFrom;

    @Column(name = "date_to")
    private Date dateTo;

    @NonNull
    @Column(name = "verify_date")
    private Date verificationDate;

    @ManyToOne
    @JoinColumn(name = "proc_basis_id")
    private RegisterCpdoPosition processingBasis;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "comments_id", referencedColumnName = "id")
    private Text comments;

    @NonNull
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "employment_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Employment employment;
}
