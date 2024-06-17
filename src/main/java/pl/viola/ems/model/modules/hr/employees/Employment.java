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
@Table(name = "hr_emp_employments", schema = "emsadm")
public class Employment {

    public enum EmploymentType {
        UPR, KON, STC, STP, UPO, CYW, CYR, WOL
    }

    private enum EmploymentStatus {
        NW, RE, ZW
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employmentSequence")
    @SequenceGenerator(name = "employmentSequence", sequenceName = "hr_emp_employment_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @Enumerated(EnumType.STRING)
    @NonNull
    @Column(name = "emp_type")
    private EmploymentType employmentType;

    @NonNull
    @Column(name = "emp_number")
    private String number;

    @Column(name = "emp_date")
    private Date employmentDate;

    @NonNull
    @Column(name = "date_from")
    private Date dateFrom;

    @Column(name = "date_to")
    private Date dateTo;

    @Enumerated(EnumType.STRING)
    private EmploymentStatus status;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "is_process")
    private Boolean isProcess;

    @Column(name = "is_statement")
    private Boolean isStatement;

    @Column(name = "is_authorization")
    private Boolean isAuthorization;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "comments_id", referencedColumnName = "id")
    private Text comments;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "employee_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Employee employee;
}
