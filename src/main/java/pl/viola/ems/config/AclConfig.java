package pl.viola.ems.config;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;

@Configuration
@EnableAutoConfiguration
public class AclConfig {

    @Bean
    public MethodSecurityExpressionHandler createExpressionHandler() {

        CustomMethodSecurityExpressionHandlerConfig expressionHandler =
                new CustomMethodSecurityExpressionHandlerConfig();
        expressionHandler.setPermissionEvaluator(new CustomPermissionEvaluatorConfig());
        return expressionHandler;
    }
}
