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
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.administrator.repository.OrganizationUnitRepository;
import pl.viola.ems.model.modules.administrator.repository.UserRepository;
import pl.viola.ems.model.security.AcObject;
import pl.viola.ems.model.security.AcPermission;
import pl.viola.ems.model.security.AcPrivilege;
import pl.viola.ems.payload.api.UserDetails;
import pl.viola.ems.service.modules.administrator.GroupService;
import pl.viola.ems.service.modules.administrator.UserService;
import pl.viola.ems.service.security.AcPermissionService;

import java.util.*;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
public class UserServiceImplTest {

    @TestConfiguration
    static class UserServiceImplTestContextConfiguration{

        @Bean
        public UserService userService(){
            return new UserServiceImpl();
        }
    }

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private OrganizationUnitRepository organizationUnitRepository;

    @MockBean
    private GroupService groupService;

    @MockBean
    private AcPermissionService acPermissionService;

    private Group test = new Group((long) 3, "test", "Testowa", new HashSet<AcPermission>(), new HashSet<User>());
    private OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", false);
    private Throwable thrown;

    @BeforeEach
    void Setup(){


        User user = new User(
                (long)0,
                "user",
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

        User admin = new User(
                (long)1,
                "UserAdmin",
                "admin",
                new Date(),
                "Admin",
                "Admin",
                true,
                false,
                false,
                false,
                ou,
                new HashSet<AcPermission>(),
                new HashSet<Group>()
        );
        List<User> repo = Arrays.asList(user, admin);
        List<String> usersName = Arrays.asList("user");

        Mockito.when(userRepository.existsByUsername("test")).thenReturn(true);
        Mockito.when(userRepository.findById((long)0)).thenReturn(Optional.of(user));
        Mockito.when(userRepository.findByUsernameIn(usersName)).thenReturn(Arrays.asList(repo.get(0)));
        Mockito.when(userRepository.findAll()).thenReturn(repo);
        Mockito.when(userRepository.findByUsername("user")).thenReturn(Optional.of(user));
        Mockito.when(userRepository.findByGroups(test)).thenReturn(repo);
        Mockito.when(groupService.findGroupByCode("test")).thenReturn(Optional.ofNullable(test));
        Mockito.when(organizationUnitRepository.findByCode("uck")).thenReturn(Optional.of(ou));

    }

    @DisplayName("findById")
    @Test
    void findById(){
        UserDetails user = new UserDetails(
                (long)0,
                "user",
                "Test",
                "User",
                "user",
                true,
                false,
                false,
                false,
                ou,
                new HashSet<AcPermission>(),
                new HashSet<Group>()
        );

        Optional<UserDetails> getUser = userService.findById((long)0);

        assertNotNull(getUser.get());
        assertEquals(getUser.get(), user);
    }

    @DisplayName("findByIdIn")
    @Test
    void findByIdIn() {
        OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", false);

        User user = new User(
                (long)0,
                "user",
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
        List<String> usersNames = Arrays.asList("user");
        List<User> byIdIn = userService.findByUsernameIn(usersNames);
        List<User> find = Arrays.asList(user);

        assertNotNull(byIdIn);
        assertEquals(byIdIn, find);
    }

    @DisplayName("findByUsername")
    @Test
    void findByUsername() {
        OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true);

        User user = new User(
                (long)0,
                "UserTest",
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

        Mockito.when(userRepository.findByUsername("UserTest")).thenReturn(java.util.Optional.of(user));

        Optional<User> newUser = userService.findByUsername("UserTest");

        assertNotNull(newUser);
        assertEquals(newUser.get(), new User( (long)0,"UserTest", "user", new Date(), "User", "Test", true, false, false, false, ou, new HashSet<AcPermission>(),new HashSet<Group>()));
        assertNotEquals(newUser.get().getUsername(), "UserBad");
    }

    @DisplayName("existByUsername")
    @Test
    void existsByUsername() {
        Mockito.when(userRepository.existsByUsername("user")).thenReturn(true);

        Boolean isExists = userService.existsByUsername("user");

        assertEquals(isExists, true);
        assertNotEquals(isExists, false);
    }

    @DisplayName("findAll")
    @Test
    void findAll() {
        UserDetails test = new UserDetails(
                (long)1,
                "UserAdmin",
                "Admin",
                "Admin",
                "admin",
                true,
                false,
                false,
                false,
                ou,
                new HashSet<AcPermission>(),
                new HashSet<Group>()
        );

        List<UserDetails> all = userService.findAll();

        assertThat(all).isNotEmpty();
        assertThat(all.size()).isGreaterThanOrEqualTo(1);
        assertThat(all.get(1)).isEqualTo(test);
    }

    @DisplayName("create user ")
    @Test
    void createUser(){
        UserDetails test = new UserDetails(
                "UserAdmin",
                "Admin",
                "Admin",
                "Passwd123!T!",
                true,
                false,
                false,
                false,
                ou
        );

        OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true);

        User userTest = new User(
                (long)0,
                "UserAdmin",
                "Passwd123!T!",
                new Date(),
                "Admin",
                "Admin",
                true,
                false,
                false,
                false,
                ou,
                new HashSet<AcPermission>(),
                new HashSet<Group>()
        );

        User user = new User(
                test.getUsername(),
                passwordEncoder.encode(test.getPassword()),
                test.getName(),
                test.getSurname(),
                test.getIsActive(),
                test.getIsLocked(),
                test.getIsExpired(),
                test.getIsCredentialsExpired(),
                organizationUnitRepository.findByCode(test.getUnit().getCode()).get()
        );
        Mockito.when(userRepository.saveAndFlush(user)).thenReturn(userTest);
        UserDetails newUserDetails = userService.saveUser(test);

        verify(userRepository, times(1)).saveAndFlush(userTest);
        assertThat(newUserDetails.getId()).isEqualTo(userTest.getId());
    }

    @DisplayName("create user - Exception password not set")
    @Test
    void createUserPasswordNotSetException(){
        UserDetails test = new UserDetails(
                null,
                "UserAdmin",
                "Admin",
                "Admin",
                null,
                true,
                false,
                false,
                false,
                ou,
                null,
                null
        );

        thrown = assertThrows(AppException.class, () -> {
            userService.saveUser(test);
        });

        assertEquals("Hasło użytkownika nie zostało ustawione", thrown.getMessage());
    }

    @DisplayName("create user - Exception user exist")
    @Test
    void createUserUserExistException(){
        UserDetails test = new UserDetails(
                null,
                "test",
                "Admin",
                "Admin",
                null,
                true,
                false,
                false,
                false,
                ou,
                null,
                null
        );

        thrown = assertThrows(AppException.class, () -> {
            userService.saveUser(test);
        });

        assertEquals("Użytkownik już istnieje", thrown.getMessage());
    }

    @DisplayName("update user")
    @Test
    void updateUser(){
        UserDetails test = new UserDetails(
                (long)0,
                "user",
                "Admin",
                "Admin",
                "User123!T!",
                true,
                false,
                false,
                false,
                ou,
                null,
                null
        );

        OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true);

        User user = new User(
                (long)0,
                "user",
                "$2a$10$kEEFdurxoJn3i74y9oxBZOEkJyxnLTgfpMb6mApbN15Um8I4RxlQ6",
                new Date(),
                "Admin",
                "Admin",
                true,
                false,
                false,
                false,
                ou,
                new HashSet<AcPermission>(),
                new HashSet<Group>()
        );

        userService.saveUser(test);

        verify(userRepository, times(1)).save(user);

    }

    @DisplayName("update user - Exception user not found")
    @Test
    void updateUserUserNotFoundExcepition(){
        UserDetails test = new UserDetails(
                (long)1,
                "UserAdmin",
                "Admin",
                "Admin",
                "passwd",
                true,
                false,
                false,
                false,
                ou,
                null,
                null
        );

        thrown = assertThrows(AppException.class, () -> {
            userService.saveUser(test);
        });

        assertEquals("Nie znaleziono użytkownika", thrown.getMessage());
    }

    @DisplayName("update user - Exception Ou not found")
    @Test
    void updateUserOuNotFoundException(){
        OrganizationUnit bad = new OrganizationUnit("bad", "UCK", "Uck", "uck@uck.katowice.pl", true);

        UserDetails test = new UserDetails(
                (long)0,
                "UserAdmin",
                "Admin",
                "Admin",
                "passwd",
                true,
                false,
                false,
                false,
                bad,
                null,
                null
        );

        thrown = assertThrows(AppException.class, () -> {
            userService.saveUser(test);
        });

        assertEquals("Nie znaleziono jednostki organizacyjnej użytkownika", thrown.getMessage());
    }

    @DisplayName("Service - saveUserPermissions")
    @Test
    void saveUserPermissions(){

        User user = new User(
                (long)0,
                "user",
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

        AcPrivilege privilege = new AcPrivilege((long)1, "0001", "Przywilej testowy", new HashSet<AcObject>(),new HashSet<AcPermission>());
        List<AcPrivilege> privileges = Arrays.asList(privilege);
        userService.saveUserPermissions(privileges, "user", (long) 1);
        verify(acPermissionService, times(1)).saveObjectPermission(privileges, user, (long) 1);
    }

    @DisplayName("Services - saveUserPermissions - Exception user not found")
    @Test
    void saveUserPermissionsNotFoundException(){
        List<AcPrivilege> privileges = new ArrayList<AcPrivilege>();
        thrown = assertThrows(AppException.class, () -> {
            userService.saveUserPermissions(privileges, "test", (long)1);
        });

        assertEquals("Nie znaleziono użytkownika", thrown.getMessage());
    }

    @DisplayName("Service - saveUserGroups")
    @Test
    void saveUserGroups(){
        User user = new User(
                (long)0,
                "user",
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

        Group newGroup = new Group((long)3, "test", "Testowa", new HashSet<AcPermission>(), new HashSet<User>());


        List<Group> groups = Arrays.asList(newGroup);
        Set<Group> userGroups = groups.stream().collect(Collectors.toSet());
        user.setGroups(userGroups);
        userService.saveUserGroups(groups, "user");

        verify(userRepository, times(1)).save(user);

    }

    @DisplayName("Services - saveUserGroups - Exception user not found")
    @Test
    void saveUserGroupsUserNotFoundException(){
        Group newGroup = new Group((long)3, "test", "Testowa", new HashSet<AcPermission>(), new HashSet<User>());


        List<Group> groups = Arrays.asList(newGroup);
        thrown = assertThrows(AppException.class, () -> {
            userService.saveUserGroups(groups, "test");
        });

        assertEquals("Nie znaleziono użytkownika", thrown.getMessage());
    }

    @DisplayName("deleteUser")
    @Test
    void deleteUser() {
        userRepository.deleteById((long)0);

        verify(userRepository, times(1)).deleteById((long)0);

        assertThat(userService.deleteUserById((long)0)).isEqualTo("Pomyslnie usunięto użytkownika.");
    }

    @DisplayName("deleteUserException")
    @Test
    void deleteUserException() {
        userRepository.deleteById((long)0);

        thrown = assertThrows(AppException.class, () -> {
            userService.deleteUserById((long)1);
        });

        assertEquals("Nie znaleziono użytkownika", thrown.getMessage());
    }

    @DisplayName("findUsersByGroup")
    @Test
    void findUsersByGroup(){

        UserDetails test = new UserDetails(
                (long)1,
                "UserAdmin",
                "Admin",
                "Admin",
                "admin",
                true,
                false,
                false,
                false,
                ou,
                new HashSet<AcPermission>(),
                new HashSet<Group>()
        );

        List<UserDetails> all = userService.findUsersByGroup("test");

        assertThat(all).isNotEmpty();
        assertThat(all.size()).isGreaterThanOrEqualTo(1);
        assertThat(all.get(1)).isEqualTo(test);
        assertThat(all.get(0)).isNotEqualTo(test);

    }

}