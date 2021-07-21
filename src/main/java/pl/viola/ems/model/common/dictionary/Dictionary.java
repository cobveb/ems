package pl.viola.ems.model.common.dictionary;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "dictionaries", schema = "emsarch")
public class Dictionary {
    @Id
    @NotNull
    @NotBlank(message = "{valid.notBlank}")
    @Size(max = 10, message = "{valid.maxSize}")
    private String code;
    @NonNull
    @NotBlank(message = "{valid.notBlank}")
    @Size(max = 120, message = "{valid.maxSize}")
    private String name;
    @NonNull
    @NotBlank(message = "{valid.notBlank}")
    @Pattern(regexp="^$|[ASU]$", message="{valid.dictionaryType}")
    private char type;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "dictionary")
    private Set<DictionaryItem> items = new HashSet<DictionaryItem>();
}
