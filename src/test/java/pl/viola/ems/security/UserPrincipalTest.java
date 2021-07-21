package pl.viola.ems.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.security.AcObject;
import pl.viola.ems.model.security.AcPermission;
import pl.viola.ems.model.security.AcPrivilege;
import pl.viola.ems.security.impl.UserPrincipal;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

class UserPrincipalTest {

    @DisplayName("getAuthorities")
    @Test
    void getAuthorities() {

        OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true);
        AcObject acObjectKsie = new AcObject((long) 1, (long) 1, "Moduł Księgowy", "MODULE", new HashSet<AcPermission>(), new HashSet<AcPrivilege>());
        AcObject acObjectGroup = new AcObject((long)2, (long)2, "Moduł Księgowy", "MODULE", new HashSet<AcPermission>(), new HashSet<AcPrivilege>());
        AcPrivilege privilege = new AcPrivilege((long)1, "0001", "Przywilej testowy", new HashSet<AcObject>(),new HashSet<AcPermission>());
        Set<AcPermission> permissionsUser = new HashSet<AcPermission>();
        Set<AcPermission> permissionsGroup = new HashSet<AcPermission>();
        Set<User> users = new HashSet<User>();
        Set<Group> groups = new HashSet<Group>();

        Group group = new Group((long) 1, "test", "GR_TEST", permissionsGroup, users );
        AcPermission acPermissionGroup = new AcPermission((long)1, acObjectGroup, privilege, null, group);
        permissionsGroup.add(acPermissionGroup);
        groups.add(group);



        User user = new User((long)1,"user", "userPass", new Date(), "UserName", "UserSurname",true,false,false,false, ou, permissionsUser, new HashSet<Group>());
        AcPermission acPermissionUser = new AcPermission((long)1, acObjectKsie, privilege, user, null);
        permissionsUser.add(acPermissionUser);
        user.setGroups(groups);
        user.setAcPermissions(permissionsUser);

        users.add(user);





        SimpleGrantedAuthority simpleGrantedAuthorityUser = new SimpleGrantedAuthority("0001_1_MODULE");
        SimpleGrantedAuthority simpleGrantedAuthorityGroup = new SimpleGrantedAuthority("0001_2_MODULE");
        List<GrantedAuthority> authorities = Arrays.asList(simpleGrantedAuthorityUser, simpleGrantedAuthorityGroup);

        UserPrincipal userPrincipal = UserPrincipal.create(user);

        assertEquals(authorities, userPrincipal.getAuthorities());
        assertEquals(true, userPrincipal.isEnabled());
        assertEquals(true, userPrincipal.isAccountNonExpired());
        assertEquals(true, userPrincipal.isCredentialsNonExpired());
        assertEquals(true, userPrincipal.isAccountNonLocked());
        assertNotEquals(false, userPrincipal.getIsActive());


    }
}