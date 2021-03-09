package pl.viola.ems.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import pl.viola.ems.security.impl.JwtAccessDeniedHandler;
import pl.viola.ems.security.impl.JwtAuthenticationEntryPoint;
import pl.viola.ems.security.impl.JwtAuthenticationFilter;

/**
 * The class responsible for launching Spring Web Security in the application,
 * based on the authorization method of user details services.
 *
 * @author Grzegorz Viola (qweb)
 * @version 1.1
 * @since 2019-05-12
 */

@Configuration
@EnableWebSecurity
/* securedEnabled: It enables the @Secured annotation
 * jsr250Enabled: It enables the @RolesAllowed annotation
 * prePostEnabled: It enables more complex expression based 
 * access control syntax with @PreAuthorize and @PostAuthorize annotations
 */
@EnableGlobalMethodSecurity(
        securedEnabled = true,
        jsr250Enabled = true,
        prePostEnabled = true
)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	
	@Autowired
	UserDetailsService userDetailsService;

	@Autowired
	JwtAuthenticationEntryPoint unauthorizedHandler;

	@Autowired
	JwtAccessDeniedHandler accessDeniedHandler;

	@Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }
	
	@Override
	public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
		authenticationManagerBuilder
	    	.userDetailsService(userDetailsService)
	        .passwordEncoder(passwordEncoder());
	}
	
	@Bean(BeanIds.AUTHENTICATION_MANAGER)
	@Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	 
	@Override
	protected void configure(final HttpSecurity http) throws Exception {
		http
	    	.cors()
	     		.and()
	     	.csrf()
	     		.disable()
	     	.exceptionHandling()
				.accessDeniedHandler(accessDeniedHandler)
                .authenticationEntryPoint(unauthorizedHandler)
                .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
	      	.authorizeRequests()
	      		.antMatchers("/",
						"/favicon.ico",
						"/**/*.png",
						"/**/*.gif",
						"/**/*.svg",
						"/**/*.jpg",
						"/**/*.html",
						"/**/*.css",
						"/**/*.woff2",
						"/**/*.woff",
						"/**/*.js")
	      			.permitAll()
	      		.antMatchers("/api/auth/login",
					"/api/auth/token/refresh",
					"/api/auth/changePassword")
	      			.permitAll()
	      		.anyRequest()
	      			.authenticated();
		
		// Add our custom JWT security filter
	    http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
	}
}
