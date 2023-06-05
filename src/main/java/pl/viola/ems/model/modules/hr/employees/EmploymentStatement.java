package pl.viola.ems.model.modules.hr.employees;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.common.Text;

import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "hr_emp_eml_statements")
public class EmploymentStatement {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "emlStatementSequence")
    @SequenceGenerator(name = "emlStatementSequence", sequenceName = "hr_emp_eml_statements_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @Column(name = "is_active")
    private Boolean isActive;

    @NonNull
    @Column(name = "sta_date")
    private Date statementDate;

    @NonNull
    @Column(name = "date_from")
    private Date dateFrom;

    @Column(name = "date_to")
    private Date dateTo;

    @NonNull
    @Column(name = "verify_date")
    private Date verificationDate;

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
