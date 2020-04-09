package pl.viola.ems.service.security.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.security.AcObject;
import pl.viola.ems.model.security.AcPermission;
import pl.viola.ems.model.security.AcPrivilege;
import pl.viola.ems.model.security.repository.AcPermissionRepository;
import pl.viola.ems.payload.security.AcPermissionDetails;
import pl.viola.ems.service.modules.administrator.GroupService;
import pl.viola.ems.service.modules.administrator.UserService;
import pl.viola.ems.service.security.AcObjectService;
import pl.viola.ems.service.security.AcPermissionService;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
class AcPermissionServiceImplTest {

    @TestConfiguration
    static class AcPermissionServiceImplTestContextConfiguration{

        @Bean
        public AcPermissionService acPermissionService(){
            return new AcPermissionServiceImpl();
        }
    }

    @Autowired
    private AcPermissionService acPermissionService;

    @MockBean
    private AcPermissionRepository acPermissionRepository;

    @MockBean
    private GroupService groupService;

    @MockBean
    private AcObjectService acObjectService;

    @MockBean
    private UserService userService;

    private Throwable thrown;

    private Group test = new Group((long)3, "test", "Testowa",  new HashSet<AcPermission>(), new HashSet<User>());

    private AcObject acObjectKsie = new AcObject((long)1, (long)1, "Moduł Księgowy", "MODULE", new HashSet<AcPermission>(), new HashSet<AcPrivilege>());

    private AcPrivilege privilege = new AcPrivilege((long)1, "0001", "Przywilej testowy", new HashSet<AcObject>(),new HashSet<AcPermission>());

    private AcPrivilege privilege2 = new AcPrivilege((long)1, "0002", "Przywilej testowy 2", new HashSet<AcObject>(),new HashSet<AcPermission>());

    private List<AcPrivilege> privileges = Arrays.asList(privilege, privilege2);

    private OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true, false);

    private User user = new User(
            (long)0,
            "test",
            "user",
            new Date(),
            "User",
            "Test",
            true,
            false,
            false,
            false,
            ou,
            new HashSet<AcPermission>(),
            new HashSet<Group>()
    );

    @BeforeEach
    void setUp() {

        AcPermission permissionGroup = new AcPermission((long)1, acObjectKsie, privilege, null, test);
        AcPermission permissionUser = new AcPermission((long)2, acObjectKsie, privilege2, user, null);
        List<AcPermission> permissionsGroup = Arrays.asList(permissionGroup);
        List<AcPermission> permissionsUser = Arrays.asList(permissionUser);

        Mockito.when(userService.findByUsername("test")).thenReturn(Optional.of(user));
        Mockito.when(groupService.findGroupByCode("test")).thenReturn(Optional.ofNullable(test));
        Mockito.when(acObjectService.findById((long)1)).thenReturn(Optional.of(acObjectKsie));
        Mockito.when(acPermissionRepository.findByUserAndAcObject(user, acObjectKsie)).thenReturn(permissionsUser);
        Mockito.when(acPermissionRepository.findByGroupAndAcObject(test, acObjectKsie)).thenReturn(permissionsGroup);

    }

    @DisplayName("Service - findByUserAndAcObject")
    @Test
    void findByUserAndAcObject() {

        List<AcPermissionDetails> permissionDetails = acPermissionService.findByUserAndAcObject("test", (long)1);

        AcPermissionDetails permissionDetail = new AcPermissionDetails(privilege2.getId(), privilege2.getCode(), privilege2.getName());

        assertThat(permissionDetails).isNotEmpty();
        assertThat(permissionDetails.size()).isGreaterThanOrEqualTo(1);
        assertThat(permissionDetails.get(0)).isEqualTo(permissionDetail);
    }

    @DisplayName("Service - findByUserAndAcObjectNotFoundUserException")
    @Test
    void findByUserAndAcObjectNotFoundUserException(){
        thrown = assertThrows(AppException.class, () -> {
            acPermissionService.findByUserAndAcObject("nowy", (long)1);
        });

        assertEquals("Nie znaleziono użytkownika", thrown.getMessage());
    }

    @DisplayName("Service - findByUserAndAcObjectNotFoundAcObjectException")
    @Test
    void findByUserAndAcObjectNotFoundAcObjectException(){
        thrown = assertThrows(AppException.class, () -> {
            acPermissionService.findByUserAndAcObject("test", (long)2);
        });

        assertEquals("Kontrola dostępu - nie znaleziono obiektu.", thrown.getMessage());
    }

    @DisplayName("Service - findByGroupAndAcObject")
    @Test
    void findByGroupAndAcObject() {
        List<AcPermissionDetails> permissionDetails = acPermissionService.findByGroupAndAcObject("test", (long)1);

        AcPermissionDetails permissionDetail = new AcPermissionDetails(privilege.getId(), privilege.getCode(), privilege.getName());

        assertThat(permissionDetails).isNotEmpty();
        assertThat(permissionDetails.size()).isGreaterThanOrEqualTo(1);
        assertThat(permissionDetails.get(0)).isEqualTo(permissionDetail);
    }

    @DisplayName("Service - findByGroupAndAcObjectNotFoundGroupException")
    @Test
    void findByGroupAndAcObjectNotFoundGroupException(){
        thrown = assertThrows(AppException.class, () -> {
            acPermissionService.findByGroupAndAcObject("nowy", (long)1);
        });

        assertEquals("Nie znaleziono grupy.", thrown.getMessage());
    }

    @DisplayName("Service - findByGroupAndAcObjectNotFoundAcObjectException")
    @Test
    void findByGroupAndAcObjectNotFoundAcObjectException(){
        thrown = assertThrows(AppException.class, () -> {
            acPermissionService.findByGroupAndAcObject("test", (long)2);
        });

        assertEquals("Kontrola dostępu - nie znaleziono obiektu.", thrown.getMessage());
    }

    @DisplayName("Service - saveGroupObjectPermission")
    @Test
    void saveGroupObjectPermission() {
        AcPermission permissionGroup = new AcPermission((long)1, acObjectKsie, privilege, null, test);
        AcPermission newPermissionGroup = new AcPermission(null, acObjectKsie, privilege, null, test);
        AcPermission newPermissionGroup2 = new AcPermission(null, acObjectKsie, privilege2, null, test);
        Set<AcPermission> oldPermissions = new HashSet<AcPermission>();
        Set<AcPermission> newPermissions = new HashSet<AcPermission>();

        oldPermissions.add(permissionGroup);
        newPermissions.add(newPermissionGroup);
        newPermissions.add(newPermissionGroup2);
        test.setAcPermissions(oldPermissions);
        acObjectKsie.setAcPermissions(oldPermissions);
        acPermissionService.saveObjectPermission(privileges, test, (long)1);

        verify(acPermissionRepository, times(1)).deleteInBatch(oldPermissions);
        verify(acPermissionRepository, times(1)).saveAll(newPermissions);

    }

    @DisplayName("Service - saveUserObjectPermission")
    @Test
    void saveUserObjectPermission(){
        AcPermission permissionUser = new AcPermission((long)1, acObjectKsie, privilege2, user, null);
        AcPermission newPermissionUser = new AcPermission(null, acObjectKsie, privilege, user, null);
        AcPermission newPermissionUser2 = new AcPermission(null, acObjectKsie, privilege2, user, null);
        Set<AcPermission> oldPermissions = new HashSet<AcPermission>();
        Set<AcPermission> newPermissions = new HashSet<AcPermission>();

        oldPermissions.add(permissionUser);
        newPermissions.add(newPermissionUser);
        newPermissions.add(newPermissionUser2);
        user.setAcPermissions(oldPermissions);
        acObjectKsie.setAcPermissions(oldPermissions);
        acPermissionService.saveObjectPermission(privileges, user, (long)1);

        verify(acPermissionRepository, times(1)).deleteInBatch(oldPermissions);
        verify(acPermissionRepository, times(1)).saveAll(newPermissions);
    }

    @DisplayName("Service - saveObjectPermissionNotFoundAcObjectException")
    @Test
    void saveObjectPermissionNotFoundAcObjectException(){
        thrown = assertThrows(AppException.class, () -> {
            acPermissionService.saveObjectPermission(privileges, test, (long)2);
        });

        assertEquals("Kontrola dostępu - nie znaleziono obiektu.", thrown.getMessage());
    }

    @DisplayName("Service - saveObjectPermissionsInvalidDomainObjectEcxeption")
    @Test
    void saveObjectPermissionsInvalidDomainObjectEcxeption(){
        thrown = assertThrows(AppException.class, () -> {
            acPermissionService.saveObjectPermission(privileges, "test", (long)1);
        });

        assertEquals("Niepoprawny obiekt domeny. Tylko użytkownik lub grupa jest prawidłowym obiektem.", thrown.getMessage());

    }
}