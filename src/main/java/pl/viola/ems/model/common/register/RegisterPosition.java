package pl.viola.ems.model.common.register;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.*;
import org.apache.commons.lang3.builder.EqualsExclude;
import org.apache.commons.lang3.builder.HashCodeExclude;
import org.apache.commons.lang3.builder.ToStringExclude;
import pl.viola.ems.model.common.dictionary.DictItem;
import pl.viola.ems.model.modules.iod.register.RegisterCpdoPosition;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@Entity
@Table(name = "register_positions", schema = "emsadm")
@JsonDeserialize(as = RegisterCpdoPosition.class)
public abstract class RegisterPosition implements DictItem, Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "registerPositionSequence")
    @SequenceGenerator(name = "registerPositionSequence", sequenceName = "reg_pos_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @Size(max = 100)
    @NonNull
    private String name;

    @NonNull
    @Column(name = "is_active")
    private Boolean isActive;

    @ToStringExclude
    @EqualsExclude
    @HashCodeExclude
    @ManyToOne
    @JoinColumn(name = "register_id")
    private Register register;

}
