package pl.viola.ems.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.security.impl.UserPrincipal;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;
import pl.viola.ems.service.modules.administrator.UserService;

import java.util.ArrayList;
import java.util.List;

@Component
public class Utils {

    private static UserService userService;

    private static OrganizationUnitService organizationUnitService;

    @Autowired
    public Utils(UserService userService, OrganizationUnitService organizationUnitService) {
        Utils.userService = userService;
        Utils.organizationUnitService = organizationUnitService;
    }

    public static User getCurrentUser() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.findByUsername(principal.getUsername())
                .orElseThrow(() -> new AppException("Administrator.user.notFound", HttpStatus.NOT_FOUND));
    }

    //TODO: Zmienić ApplicantServiceImpl -> findChildOu na poniższą metodę
    public static List<OrganizationUnit> getChildesOu(final String parent) {

        List<OrganizationUnit> childesOU = new ArrayList<>(organizationUnitService.findByParent(parent));
        List<OrganizationUnit> tmp = new ArrayList<>();
        if (!childesOU.isEmpty()) {
            childesOU.forEach(ou -> {
                if (!getChildesOu(ou.getCode()).isEmpty()) {
                    tmp.addAll(getChildesOu(ou.getCode()));
                }
            });
            childesOU.addAll(tmp);
        }
        return childesOU;
    }
}
