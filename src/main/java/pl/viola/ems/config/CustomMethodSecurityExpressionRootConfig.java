package pl.viola.ems.config;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.expression.SecurityExpressionRoot;
import org.springframework.security.access.expression.method.MethodSecurityExpressionOperations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.security.AcPrivilege;
import pl.viola.ems.security.impl.UserPrincipal;
import pl.viola.ems.service.security.AcPrivilegeService;

import java.util.Collection;


public class CustomMethodSecurityExpressionRootConfig extends SecurityExpressionRoot implements MethodSecurityExpressionOperations {

    private AcPrivilegeService acPrivilegeService;
    private Object filterObject;
    private Object returnObject;

    public CustomMethodSecurityExpressionRootConfig(Authentication authentication) {
        super(authentication);
    }

    public boolean hasGroup(Object group) {
        if ((authentication == null) || !(group instanceof String)){
            return false;
        }
        final Collection<String> groups = ((UserPrincipal) authentication.getPrincipal()).getGroups();

        return groups.stream().anyMatch(s -> s.toUpperCase().contains(((String) group).toUpperCase()));
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

        AcPrivilege acPrivilege = acPrivilegeService.findByCode(permission.toString());
        throw new AppException(HttpStatus.FORBIDDEN,
            "Security.accessDenied.hasPrivilege",
                acPrivilege.getCode() + " - " + acPrivilege.getName()
        );
    }

    @Override
    public void setFilterObject(Object filterObject) {
        this.filterObject = filterObject;
    }

    @Override
    public Object getFilterObject() {
        return filterObject;
    }

    @Override
    public void setReturnObject(Object returnObject) {
        this.returnObject = returnObject;
    }

    @Override
    public Object getReturnObject() {
        return returnObject;
    }

    @Override
    public Object getThis() {
        return this;
    }

    public void setAcPrivilegeService(AcPrivilegeService acPrivilegeService){
        this.acPrivilegeService = acPrivilegeService;
    }
}
