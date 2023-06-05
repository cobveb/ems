package pl.viola.ems.model.modules.hr.dictionary;

import lombok.*;

import javax.persistence.*;

@MappedSuperclass
@AllArgsConstructor
@RequiredArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AbstractPlace {

    public enum Type {
        PL, WP
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "placeSequence")
    @SequenceGenerator(name = "placeSequence", sequenceName = "hr_place_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    private String name;

    private Boolean active;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(name = "place_type")
    private Type type;

}
