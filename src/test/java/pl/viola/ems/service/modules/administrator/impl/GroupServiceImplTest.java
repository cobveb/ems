package pl.viola.ems.service.modules.administrator.impl;

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
import pl.viola.ems.model.modules.administrator.repository.GroupRepository;
import pl.viola.ems.model.security.AcObject;
import pl.viola.ems.model.security.AcPermission;
import pl.viola.ems.model.security.AcPrivilege;
import pl.viola.ems.payload.api.UserDetails;
import pl.viola.ems.service.modules.administrator.GroupService;
import pl.viola.ems.service.modules.administrator.UserService;
import pl.viola.ems.service.security.AcPermissionService;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
class GroupServiceImplTest {

    @TestConfiguration
    static class GroupServiceImplTestContextConfiguration{

        @Bean
        public GroupService groupService(){
            return new GroupServiceImpl();
        }
    }

    @Autowired
    private GroupService groupService;

    @MockBean
    private GroupRepository groupRepository;

    @MockBean
    private UserService userService;

    @MockBean
    private AcPermissionService acPermissionService;

    private Throwable thrown;

    @BeforeEach
    void setUp() {
        OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true, false);

        Group adm = new Group((long)1, "adm", "Administratorzy", new HashSet<AcPermission>(), new HashSet<User>());
        Group user = new Group((long)2, "user", "Użytkownicy", new HashSet<AcPermission>(), new HashSet<User>());
        Group test = new Group((long)3, "test", "Testowa",  new HashSet<AcPermission>(), new HashSet<User>());

        User userG = new User(
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

        List<Group> allGroups = Arrays.asList(adm,user,test);

        Mockito.when(userService.findByUsername("test")).thenReturn(Optional.of(userG));
        Mockito.when(groupRepository.findAll()).thenReturn(allGroups);
        Mockito.when(groupRepository.findByCode("test")).thenReturn(Optional.of(test));
        Mockito.when(groupRepository.findByUsers(userG)).thenReturn(allGroups);

    }

    @DisplayName("Service - findAll")
    @Test
    void findAll(){

        Group test = new Group((long)3, "test", "Testowa", new HashSet<AcPermission>(), new HashSet<User>());

        List<Group> all = groupService.findAllGroups();

        assertThat(all).isNotEmpty();
        assertThat(all.size()).isGreaterThanOrEqualTo(1);
        assertThat(all.get(2)).isEqualTo(test);
    }

    @DisplayName("Service - findByCode")
    @Test
    void findByCode(){
        Group test = new Group((long)3, "test", "Testowa", new HashSet<AcPermission>(), new HashSet<User>());

        Optional<Group> findingGroup = groupService.findGroupByCode("test");

        assertNotNull(findingGroup);
        assertEquals(findingGroup.get(), test);
        assertNotEquals("adm", findingGroup.get().getCode());
    }

    @DisplayName("Service - findGroupsByUser")
    @Test
    void findGroupsByUser(){
        List<Group> groups = groupService.findGroupsByUser("test");

        assertNotNull(groups);
        assertEquals(3, groups.size());
    }

    @DisplayName("Services - findGroupsByUser - Exception user not found")
    @Test
    void findGroupsByUserNotFoundUserException(){
        thrown = assertThrows(AppException.class, () -> {
            groupService.findGroupsByUser("nowy");
        });

        assertEquals("Nie znaleziono użytkownika", thrown.getMessage());
    }

    @DisplayName("Service - saveGroup")
    @Test
    void saveGroup(){
        Group newGroup = new Group((long)3, "newTest", "newTestowa", new HashSet<AcPermission>(), new HashSet<User>());

        groupService.saveGroup(newGroup);

        verify(groupRepository, times(1)).save(newGroup);

    }

    @DisplayName("Service - saveGroupUsers")
    @Test
    void saveGroupUsers(){
        UserDetails userDetails = new UserDetails();
        Group newGroup = new Group((long)3, "test", "Testowa", new HashSet<AcPermission>(), new HashSet<User>());

        List<UserDetails> groupUsers = Arrays.asList(userDetails);
        groupService.saveGroupUsers(groupUsers, "test");

        verify(groupRepository, times(1)).save(newGroup);

    }

    @DisplayName("Services - saveGroupUsers - Exception group not found")
    @Test
    void saveGroupUsersGroupNotFoundException(){
        List<UserDetails> groupUsers = new ArrayList<UserDetails>();
        thrown = assertThrows(AppException.class, () -> {
            groupService.saveGroupUsers(groupUsers, "nowa");
        });

        assertEquals("Nie znaleziono grupy.", thrown.getMessage());
    }

    @DisplayName("Services - saveGroupPermissions")
    @Test
    void saveGroupPermissions(){
        AcPrivilege privilege = new AcPrivilege((long)1, "0001", "Przywilej testowy", new HashSet<AcObject>(),new HashSet<AcPermission>());
        List<AcPrivilege> privileges = Arrays.asList(privilege);
        Group test = new Group((long)3, "test", "Testowa",  new HashSet<AcPermission>(), new HashSet<User>());
        groupService.saveGroupPermissions(privileges, "test", (long) 1);
        verify(acPermissionService, times(1)).saveObjectPermission(privileges, test, (long) 1);
    }

    @DisplayName("Services - saveGroupPermissions - Exception group not found")
    @Test
    void saveGroupPermissionsNotFoundException(){
        List<AcPrivilege> privileges = new ArrayList<AcPrivilege>();
        thrown = assertThrows(AppException.class, () -> {
            groupService.saveGroupPermissions(privileges, "nowa", (long)1);
        });

        assertEquals("Nie znaleziono grupy.", thrown.getMessage());
    }

    @DisplayName("Service - deleteByCode")
    @Test
    void deleteByCode(){
        groupService.deleteGroup("test");

        verify(groupRepository, times(1)).deleteById((long)3);

    }

}