package pl.viola.ems.config;

import lombok.Data;
import org.springframework.security.access.expression.SecurityExpressionRoot;
import org.springframework.security.access.expression.method.MethodSecurityExpressionOperations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import pl.viola.ems.security.UserPrincipal;

import java.util.Collection;

@Data
public class CustomMethodSecurityExpressionRoot  extends SecurityExpressionRoot implements MethodSecurityExpressionOperations {

    private Object filterObject;
    private Object returnObject;

    public CustomMethodSecurityExpressionRoot(Authentication authentication) {
        super(authentication);
    }

    public boolean hasGroup(Object group) {
        if ((authentication == null) || !(group instanceof String)){
            return false;
        }
        final Collection<String> groups = ((UserPrincipal) authentication.getPrincipal()).getGroups();

        return groups.stream().filter(s->s.toUpperCase().contains(((String) group).toUpperCase())).count()>0;
    }

    public boolean hasPrivilege(Object permission) {
        if ((authentication == null)  || !(permission instanceof String)){
            return false;
        }

        for (GrantedAuthority grantedAuth : authentication.getAuthorities()) {
            if (grantedAuth.getAuthority().startsWith(permission.toString())) {
                return true;
            }
        }
        return false;
    }

    @Override
    public Object getThis() {
        return this;
    }
}
