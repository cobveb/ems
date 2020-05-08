package pl.viola.ems.config;

import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import pl.viola.ems.security.AcObject;

import java.io.Serializable;

public class CustomPermissionEvaluatorConfig implements PermissionEvaluator {
    @Override
    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        if ((authentication == null) || (targetDomainObject == null) || !(permission instanceof String)){
            return false;
        }

        String targetType = targetDomainObject.getClass().getSimpleName().toUpperCase();
        Long acObjectId = ((AcObject) targetDomainObject).getAcObjectId();
        return hasPrivilege(authentication, targetType, acObjectId, permission.toString().toUpperCase());
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        if ((authentication == null) || (targetType == null) || !(permission instanceof String)) {
            return false;
        }
        return hasPrivilege(authentication, targetType.toUpperCase(), null, permission.toString().toUpperCase());
    }

    private boolean hasPrivilege(Authentication auth, String targetType, Long acObjectId, String permission) {

        for (GrantedAuthority grantedAuth : auth.getAuthorities()) {
            if (grantedAuth.getAuthority().startsWith(permission) &&
                acObjectId == Long.parseLong(grantedAuth.getAuthority().substring(grantedAuth.getAuthority().indexOf("_") + 1, grantedAuth.getAuthority().lastIndexOf("_"))) &&
                grantedAuth.getAuthority().substring(grantedAuth.getAuthority().lastIndexOf("_") + 1).equals(targetType))
            {
                return true;
            }
        }
        return false;
    }
}
