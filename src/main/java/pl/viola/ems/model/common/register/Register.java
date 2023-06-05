package pl.viola.ems.model.common.register;

import lombok.*;
import org.apache.commons.lang3.builder.EqualsExclude;
import org.apache.commons.lang3.builder.HashCodeExclude;
import org.apache.commons.lang3.builder.ToStringExclude;
import pl.viola.ems.model.modules.administrator.User;

import javax.persistence.*;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "registers", schema = "emsadm",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {
                        "code"
                }),
        })
public class Register {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "registerSequence")
    @SequenceGenerator(name = "registerSequence", sequenceName = "register_seq", schema = "emsadm", allocationSize = 1)
    private Long Id;

    @NonNull
    private String code;

    @NonNull
    private String name;

    @Column(name = "upd_date")
    private Date updateDate;

    @ToStringExclude
    @EqualsExclude
    @HashCodeExclude
    @OneToOne
    @JoinColumn(name = "upd_user_id")
    private User updateUser;
}
