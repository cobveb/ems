package pl.viola.ems.model.auth;

import lombok.*;
import pl.viola.ems.model.modules.administrator.User;

import javax.persistence.*;
import java.util.Date;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@ToString(exclude = {"expirationDateTime"})
@EqualsAndHashCode(exclude = {"expirationDateTime"})
@Entity
@Table(name = "tokens", schema = "emsarch")
public class JwtRefreshToken {
	
	@Id
	@NonNull
	private String token;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(name = "expiration_date_time")
	private Date expirationDateTime;

}
