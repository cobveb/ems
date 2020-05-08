package pl.viola.ems.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.auth.JwtAuthenticationResponse;
import pl.viola.ems.payload.auth.LoginRequest;
import pl.viola.ems.payload.auth.PasswordChangeRequest;
import pl.viola.ems.payload.auth.RefreshTokenRequest;
import pl.viola.ems.security.impl.JwtTokenProvider;
import pl.viola.ems.security.impl.UserPrincipal;
import pl.viola.ems.service.security.JwtTokenService;
import pl.viola.ems.service.security.PasswordService;

import javax.validation.Valid;
import java.util.ResourceBundle;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final ResourceBundle bundle = ResourceBundle.getBundle("messages");

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtTokenProvider tokenProvider;
	
	@Autowired
    JwtTokenService jwtTokenService;
	
	@Autowired
    PasswordService passwordService;

	@PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        String accessToken = tokenProvider.generateToken(userPrincipal);
        String refreshToken = tokenProvider.generateRefreshToken();
        
        jwtTokenService.saveRefreshToken(userPrincipal, refreshToken);
        
        return ResponseEntity.ok(new JwtAuthenticationResponse(accessToken, refreshToken));
    }
	
	@PostMapping("/token/refresh")
	public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest){
		
		UserPrincipal userPrincipal = UserPrincipal.create(jwtTokenService.findById(refreshTokenRequest.getRefreshToken()));
        String accessToken = tokenProvider.generateToken(userPrincipal);
        String refreshToken = tokenProvider.generateRefreshToken();
        
        jwtTokenService.deleteRefreshToken(refreshTokenRequest.getRefreshToken());
        jwtTokenService.saveRefreshToken(userPrincipal, refreshToken);
            
        return ResponseEntity.ok(new JwtAuthenticationResponse(accessToken, refreshToken));
	}

    @DeleteMapping("/token/delete/{token}")
    public ResponseEntity<?> deleteRefreshToken(@PathVariable String token){

        jwtTokenService.deleteRefreshToken(token);

        return ResponseEntity.accepted().body("Successfully removed token: " + token);
    }

    @PostMapping("/changePassword")
    public ApiResponse changePassword(@Valid @RequestBody PasswordChangeRequest passwordChangeRequest) {
	    passwordService.changePassword(passwordChangeRequest);
	    return new ApiResponse(HttpStatus.ACCEPTED, bundle.getString("Security.password.changed"));
    }
}
