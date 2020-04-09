package pl.viola.ems.model.modules.administrator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.security.AcPermission;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@ToString(exclude = {"users"})
@EqualsAndHashCode(exclude = {"users"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "groups", schema = "emsarch", uniqueConstraints = {
    @UniqueConstraint(columnNames = {
        "code"
    })
})
public class Group {
    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator = "groupSequence")
    @SequenceGenerator(name = "groupSequence", sequenceName = "groups_seq", schema = "emsarch", allocationSize = 1)
    private Long id;

    @NonNull
    @Size(max = 20)
    private String code;

    @NonNull
    @Size(max = 30)
    private String name;

    /* Po uruchomieniu repo i serwisu ac  sprawdzić czy możliwy zapis do właściwch pól bazy
     *  uprawnień dla usera i grupy jak nie wrócić  wrócić do table ac_group_permision
     */

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY,  mappedBy = "group")
    private Set<AcPermission> acPermissions = new HashSet<AcPermission>();

    @JsonIgnore
    @ManyToMany(fetch=FetchType.LAZY)
    @JoinTable(name = "user_groups", schema = "emsarch",
            joinColumns = @JoinColumn (name = "group_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn (name = "user_id", referencedColumnName = "id"))
    private Set<User> users = new HashSet<User>();

}
