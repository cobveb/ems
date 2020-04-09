package pl.viola.ems.payload.auth;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class RefreshTokenRequest {
	
	@NotBlank
	private String refreshToken;

}
