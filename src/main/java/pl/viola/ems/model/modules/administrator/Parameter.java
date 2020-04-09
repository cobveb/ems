package pl.viola.ems.model.modules.administrator;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "parameters", schema = "emsarch", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "code"
        })
})
public class Parameter {
    @Id
    @NonNull
    @NotBlank(message = "{valid.notBlank}")
    @Size(max = 20, message = "{valid.maxSize}")
    private String code;
    @NonNull
    @Column(name="value_type")
    @NotBlank(message = "{valid.notBlank}")
    private String valueType;
    @Enumerated(EnumType.STRING)
    @NonNull
	private ParameterCategory category;
    @NonNull
    @NotBlank(message = "{valid.notBlank}")
    @Size(max = 20, message = "{valid.maxSize}")
	private String section;
    @NonNull
    @NotBlank(message = "{valid.notBlank}")
    @Size(max = 120, message = "{valid.maxSize}")
	private String name;
    @NonNull
    @NotBlank(message = "{valid.notBlank}")
	private String description;

    @Size(max = 120, message = "{valid.maxSize}")
	private String value;
}
