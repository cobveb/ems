package pl.viola.ems.model.common;

import lombok.*;

import javax.persistence.*;
import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "texts", schema = "emsadm")
public class Text {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "textSequence")
    @SequenceGenerator(name = "textSequence", sequenceName = "text_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @Lob
    private String content;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Text text = (Text) o;
        return Objects.equals(id, text.id) && content.equals(text.content);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, content);
    }

    @Override
    public String toString() {
        return "Text{" +
                "id=" + id +
                ", content='" + content + '\'' +
                '}';
    }
}
