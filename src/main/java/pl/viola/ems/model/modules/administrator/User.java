package pl.viola.ems.model.modules.administrator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.NaturalId;
import pl.viola.ems.model.audit.UserDateAudit;
import pl.viola.ems.model.security.AcPermission;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@ToString(exclude = {"organizationUnit", "password", "lastPasswordChange"})
@EqualsAndHashCode(exclude = {"organizationUnit", "password", "lastPasswordChange"})
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users", schema = "emsarch", uniqueConstraints = {
	@UniqueConstraint(columnNames = {
		"username"
	})
})
@DynamicUpdate(true)
public class User extends UserDateAudit {

	private static final long serialVersionUID = -2080521702805522153L;

	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator = "userSequence")
	@SequenceGenerator(name = "userSequence", sequenceName = "user_seq", schema = "emsarch", allocationSize = 1)
	private Long id;
	
	@NonNull
	@NaturalId
	@NotBlank
    @Size(max = 20)
    private String username;

	@JsonIgnore
	@NonNull
	@NotBlank
    @Size(max = 100)
    private String password;

	@JsonIgnore
	@Column(name="last_password_change")
	private Date lastPasswordChange;

	@NonNull
	@NotBlank
    @Size(max = 20)
    private String name;
	
	@NonNull
	@NotBlank
    @Size(max = 30)
    private String surname;

	@NonNull
	@Column(name = "is_active")
	private Boolean isActive;

	@NonNull
	@Column(name = "is_locked")
	private Boolean isLocked;

	@NonNull
	@Column(name = "is_expired")
	private Boolean isExpired;

	@NonNull
	@Column(name = "is_credentials_expired")
	private Boolean isCredentialsExpired;

	@NonNull
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name="ou")
	private OrganizationUnit organizationUnit;

	/* Po uruchomieniu repo i serwisu ac  sprawdzić czy możliwy zapis do właściwch pól bazy
	*  uprawnień dla usera i grupy jak nie wrócić  do table ac_user_permision
	*/

	@OneToMany(fetch = FetchType.LAZY,  mappedBy = "user")
	private Set<AcPermission> acPermissions = new HashSet<AcPermission>();


	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "user_groups", schema = "emsarch",
			joinColumns = @JoinColumn (name = "user_id", referencedColumnName = "id"),
			inverseJoinColumns = @JoinColumn (name = "group_id", referencedColumnName = "id"))
	private Set<Group> groups = new HashSet<Group>();

}
