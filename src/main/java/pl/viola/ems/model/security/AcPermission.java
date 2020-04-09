package pl.viola.ems.model.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.modules.administrator.User;

import javax.persistence.*;
import java.io.Serializable;

@ToString(exclude = {"user", "group"})
@EqualsAndHashCode(exclude = {"user", "group"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ac_permissions", schema = "emsarch", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "ac_object_id", "ac_privilege_id", "user_id", "group_id"
        })
})
public class AcPermission implements Serializable {
    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator = "acPermissionSequence")
    @SequenceGenerator(name = "acPermissionSequence", sequenceName = "ac_permissions_seq", schema = "emsarch", allocationSize = 1)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ac_object_id")
    private AcObject acObject;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ac_privilege_id")
    private AcPrivilege acPrivilege;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private Group group;

}
