package pl.viola.ems.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ApplicationInterceptorConfig implements WebMvcConfigurer {

    //Not used now but used in future. This is example use.
    /*@Autowired
    AuthoritiesReloadInterceptor authoritiesReloadInterceptor; //Interceptor not necessary.  Authorities reload in JwtAuthenticationFilter class, method doFilterInternal()

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry
            .addInterceptor(authoritiesReloadInterceptor)
                .excludePathPatterns("/api/auth/**")
                .addPathPatterns("/**");
    }*/
}
