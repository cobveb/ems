package pl.viola.ems.model.modules.administrator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.modules.applicant.Application;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "organization_units", uniqueConstraints = {
		@UniqueConstraint(columnNames = {
				"code"
		})
})
public class OrganizationUnit {
	@Id
	@NonNull
	@NotBlank(message = "{valid.notBlank}")
	@Size(max = 10, message = "{valid.maxSize}")
	private String code;
	@NonNull
	@NotBlank(message = "{valid.notBlank}")
	@Size(max = 120, message = "{valid.maxSize}")
	private String name;
	@NonNull
	@NotBlank(message = "{valid.notBlank}")
	@Size(max = 80, message = "{valid.maxSize}")
	private String shortName;
	@Pattern(regexp="^$|[0-9]{10}$", message="{valid.nip}")
	private String nip;
	@Pattern(regexp="^$|^\\d{9}|\\d{14}$", message="{valid.regon}")
	private String regon;
	@Size(max = 30, message = "{valid.maxSize}")
	private String city;
	@Pattern(regexp="^$|^\\d{2}\\s-\\s\\d{3}$", message="{valid.zipCode}")
	private String zipCode;
	@Size(max = 50, message = "{valid.maxSize}")
	private String street;
	@Size(max = 5, message = "{valid.maxSize}")
	private String building;
	@Pattern(regexp="^$|^\\+48\\s\\(\\d{2}\\)\\s\\d{3}\\s\\d{2}\\s\\d{2}$", message="{valid.phone}")
	private String phone;
	@Pattern(regexp="^$|^\\+48\\s\\(\\d{2}\\)\\s\\d{3}\\s\\d{2}\\s\\d{2}$", message="{valid.fax}")
	private String fax;
	@NonNull
	@NotBlank(message = "{valid.notBlank}")
	@Email(message="{valid.email}")
	@Size(max = 50, message = "{valid.maxSize}")
	private String email;
	@NotNull
	@NonNull
    private Boolean active;
    @NotNull
    @NonNull
    private Boolean coordinator;
    @Size(max = 10, message = "{valid.maxSize}")
    private String parent;
    @JsonIgnore
    @OneToMany(mappedBy = "organizationUnit", cascade = CascadeType.PERSIST)
    private Set<User> users = new HashSet<User>();

    @JsonIgnore
    @OneToMany(mappedBy = "coordinator", cascade = CascadeType.ALL)
    private Set<Application> coordinators = new HashSet<Application>();

    @JsonIgnore
    @OneToMany(mappedBy = "applicant", cascade = CascadeType.ALL)
    private Set<Application> applicants = new HashSet<Application>();

    public OrganizationUnit(String code) {
        this.code = code;
    }

    public OrganizationUnit(String code, String name, String shortName, String email, Boolean active, Boolean coordinator, String parent) {
        this.code = code;
        this.name = name;
        this.shortName = shortName;
        this.email = email;
		this.active = active;
		this.coordinator = coordinator;
		this.parent = parent;
	}
}
