package pl.viola.ems.model.modules.applicant;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.common.dictionary.DictionaryItem;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "application_positions", schema = "emsadm")
public class ApplicationPosition {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "applicationPositionsSequence")
    @SequenceGenerator(name = "applicationPositionsSequence", sequenceName = "application_pos_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @NotBlank
    private String name;

    @NonNull
    private Long quantity;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "unit_id")
    private DictionaryItem unit;

    @NonNull
    @NotBlank
    private String status;

    private String description;

    private String rejectionReason;

    @JsonIgnore
    @NonNull
    @ManyToOne
    @JoinColumn(name = "application_id")
    private ApplicantApplication application;
}
