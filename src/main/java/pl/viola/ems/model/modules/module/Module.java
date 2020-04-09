package pl.viola.ems.model.modules.module;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.security.AcObject;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "modules", schema = "emsarch", uniqueConstraints = {
	@UniqueConstraint(columnNames = {
		"code"
	})
})
public class Module implements AcObject {
	
	@Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator = "moduleSequence")
	@SequenceGenerator(name = "moduleSequence", sequenceName = "module_seq", schema = "emsarch")
    private Long id;


	@NonNull
	@NotNull
	@Size(max = 20)
	private String code;
	
	@NonNull
	@NotNull
	@Size(max = 60)
	private String name;
	
	
	public static Module create(String code, String name) {
		Module module = new Module(code, name);
		return module;
	}

	@Override
	@JsonIgnore
	public Long getAcObjectId() {
		return getId();
	}
}
