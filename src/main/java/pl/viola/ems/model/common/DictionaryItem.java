package pl.viola.ems.model.common;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@ToString(exclude = {"dictionary"})
@EqualsAndHashCode(exclude = {"dictionary"})
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "dictionary_items", schema = "emsarch")
public class DictionaryItem {
    @Id
    @NonNull
    @NotBlank(message = "{valid.notBlank}")
    @Size(max = 10, message = "{valid.maxSize}")
    private String code;
    @NonNull
    @NotBlank(message = "{valid.notBlank}")
    @Size(max = 120, message = "{valid.maxSize}")
    private String name;
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="dictionary_code")
    private Dictionary dictionary;
}
