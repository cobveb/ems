package pl.viola.ems.service.security.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.auth.JwtRefreshToken;
import pl.viola.ems.model.auth.repository.JwtRefreshTokenRepository;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.administrator.repository.UserRepository;
import pl.viola.ems.security.impl.UserPrincipal;
import pl.viola.ems.service.security.JwtTokenService;

import java.util.Date;

@Service
public class JwtTokenServiceImpl implements JwtTokenService {
	
	@Autowired
	JwtRefreshTokenRepository jwtRefreshTokenRepository;
	
	@Autowired
	UserRepository userRepository;
	
	@Value("${app.jwtExpirationInMs}")
    private int jwtExpirationInMs;
	
	@Value("${app.jwtExpirationRefreshInMs}")
    private int jwtExpirationRefreshInMs;
	
	@Transactional
	public void saveRefreshToken(UserPrincipal userPrincipal, String refreshToken) {
		
		Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs + jwtExpirationRefreshInMs);
        
		
        JwtRefreshToken jwtRefreshToken = new JwtRefreshToken(refreshToken);
        jwtRefreshToken.setUser(userRepository.getOne(userPrincipal.getId()));

        Date expirationDateTime = expiryDate; 
        jwtRefreshToken.setExpirationDateTime(expirationDateTime);

        jwtRefreshTokenRepository.save(jwtRefreshToken);
    }
	
	@Transactional
	public void deleteRefreshToken(String refreshToken) {
		
		jwtRefreshTokenRepository.deleteById(refreshToken);
	}
	
	@Transactional
	public User findById(String refreshToken) {
		
		JwtRefreshToken jwtRefreshToken = jwtRefreshTokenRepository.findById(refreshToken)
				.orElseThrow(() -> new AppException("Security.invalidRefreshToken", HttpStatus.BAD_REQUEST));
		
		return jwtRefreshToken.getUser();
	}
}
