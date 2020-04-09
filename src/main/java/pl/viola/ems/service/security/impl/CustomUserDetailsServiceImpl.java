package pl.viola.ems.service.security.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.administrator.repository.UserRepository;
import pl.viola.ems.security.UserPrincipal;
import pl.viola.ems.service.security.PasswordService;

@Service
public class CustomUserDetailsServiceImpl implements UserDetailsService {
	
	@Autowired
    UserRepository userRepository;

	@Autowired
	PasswordService passwordService;
	
	@Transactional
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> 
                	new UsernameNotFoundException("User not found with username : " + username)
                );
		if(!user.getIsCredentialsExpired()){
			user.setIsCredentialsExpired(passwordService.isCredentialExpired(user.getLastPasswordChange()));
		}

		return UserPrincipal.create(user);
	}
	
	// This method is used by JWTAuthenticationFilter
    @Transactional
    public UserDetails loadUserById(Long id) {
        
    	User user = userRepository.findById(id).orElseThrow(
            () -> new UsernameNotFoundException("User not found with id : " + id)
        );

		if(!user.getIsCredentialsExpired()){
			user.setIsCredentialsExpired(passwordService.isCredentialExpired(user.getLastPasswordChange()));
		}

        return UserPrincipal.create(user);
    }


}
