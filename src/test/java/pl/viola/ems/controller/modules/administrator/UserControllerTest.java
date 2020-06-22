package pl.viola.ems.controller.modules.administrator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.security.AcObject;
import pl.viola.ems.model.security.AcPermission;
import pl.viola.ems.model.security.AcPrivilege;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.api.UserDetails;
import pl.viola.ems.payload.auth.UserSummary;
import pl.viola.ems.payload.security.AcPermissionDetails;
import pl.viola.ems.security.impl.JwtTokenProvider;
import pl.viola.ems.security.impl.UserPrincipal;
import pl.viola.ems.service.modules.administrator.UserService;
import pl.viola.ems.service.security.AcPermissionService;
import pl.viola.ems.service.security.impl.CustomUserDetailsServiceImpl;

import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;

import static groovy.json.JsonOutput.toJson;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserControllerTest {
    @Autowired
    private WebApplicationContext context;

    private MockMvc mvc;
    private OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true, false);

    private User user = new User(
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

    private User fakeUser = new User(
            (long)0,
            "Mockuser",
            "user",
            new Date(),
            "User",
            "Mockuser",
            true,
            false,
            false,
            false,
            ou,
            new HashSet<AcPermission>(),
            new HashSet<Group>()
    );

    private UserDetails userD = new UserDetails(
            (long)0,
            "UserTest",
            "user",
            "User",
            "passwd",
            true,
            false,
            false,
            false,
            ou,
            new HashSet<AcPermission>(),
            new HashSet<Group>()
    );

    private UserDetails fakeUserD = new UserDetails(
            (long)1,
            "Mockuser",
            "user",
            "User",
            "passwd",
            true,
            false,
            false,
            false,
            ou,
            new HashSet<AcPermission>(),
            new HashSet<Group>()
    );

    private List<UserDetails> userDetailsAll = Arrays.asList(userD, fakeUserD);
    private List<UserDetails> groups = Arrays.asList(fakeUserD, userD);

    private List<User> all = Arrays.asList(user, fakeUser);



    @Autowired
    private FilterChainProxy springSecurityFilterChain;

    @MockBean
    UserService userService;

    @MockBean
    private JwtTokenProvider tokenProvider;

    @MockBean
    private CustomUserDetailsServiceImpl customUserDetailsServiceImpl;

    @MockBean
    AcPermissionService acPermissionService;

    private UserPrincipal curentUser = UserPrincipal.create(user);

    private UserSummary mockUser = new UserSummary((long)0, "User", " Test", "UserTest");

    private AcObject acObject = new AcObject((long)1, (long)1, "Moduł testowy", "MODULE", new HashSet<AcPermission>(), new HashSet<AcPrivilege>());
    private AcPrivilege privilege = new AcPrivilege((long)1, "0001", "Przywilej testowy", new HashSet<AcObject>(),new HashSet<AcPermission>());
    private AcPermissionDetails permissionDetails = new AcPermissionDetails(privilege.getId(), privilege.getCode(), privilege.getName());
    private AcPermission permission = new AcPermission((long)1, acObject, privilege, user, null);

    @BeforeEach
    public void setup() {
        mvc = MockMvcBuilders
                .webAppContextSetup(context)
                .addFilter(springSecurityFilterChain)
                .apply(springSecurity())
                .build();

        List<AcPermissionDetails> permissions = Arrays.asList(permissionDetails);

        Mockito.when(customUserDetailsServiceImpl.loadUserById((long)0)).thenReturn(curentUser);
        Mockito.when(tokenProvider.validateToken("token")).thenReturn(true);
        Mockito.when(tokenProvider.getUserIdFromJWT("token")).thenReturn((long)0);
        given(userService.findAll()).willReturn(userDetailsAll);
        given(userService.findById((long)1)).willReturn(java.util.Optional.of(fakeUserD));
        given(userService.findByUsername("user")).willReturn(java.util.Optional.of(user));
        given(userService.findUsersByGroup("test")).willReturn(groups);
        given(acPermissionService.findByUserAndAcObject("user", (long)1)).willReturn(permissions);
    }

    @DisplayName("User - Controller - getCurrentUser")
    @Test
    void getCurrentUser() throws Exception {

        mvc.perform(get("/api/users/user")
                .header("Authorization", "Bearer " + "token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("UserTest"));
    }

    @DisplayName("Controller - unauthorized")
    @Test
    void getCurrentUserUnauthorizedException() throws Exception {

        mvc.perform(get("/api/user")
                .header("Authorization", "Bearer " + "Token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Full authentication is required to access this resource"));
    }

    @WithMockUser("user")
    @DisplayName("Controller - getAllUsers")
    @Test
    void getAllUsers() throws Exception{

        mvc.perform(get("/api/users/getAll")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("ACCEPTED"))
                .andExpect(jsonPath("$.data[1].name").value(fakeUserD.getName()));
    }

    @WithMockUser("user")
    @DisplayName("Controller - getUserById")
    @Test
    void getUserById() throws Exception{

        mvc.perform(get("/api/users/getUser/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("ACCEPTED"))
                .andExpect(jsonPath("$.data.username").value(fakeUserD.getUsername()));
    }

    @WithMockUser
    @DisplayName("Controller - getAllUsersByGroups")
    @Test
    void getAllUsersByGroups() throws Exception {

        mvc.perform(get("/api/users/test/getUsers")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect((jsonPath("$.status").value("FOUND")))
                .andExpect((jsonPath("$.data").isArray()))
                .andExpect(jsonPath("$.data", hasSize(groups.size())))
                .andExpect((jsonPath("$.data[0].username").value(fakeUserD.getUsername())))
                .andExpect((jsonPath("$.data[1].username").value(userD.getUsername())));
    }
    @WithMockUser
    @DisplayName("Controller - getUserObjectPermission")
    @Test
    void getUserObjectPermission() throws Exception{

        mvc.perform(get("/api/users/user/1/getPermissions")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0]").value(permissionDetails));
    }

    @WithMockUser("user")
    @DisplayName("Controller - save user")
    @Test
    void saveUser() throws Exception{

        UserDetails user = new UserDetails(
                "UserTest",
                "user",
                "User",
                ou
        );

        ApiResponse response = new ApiResponse(HttpStatus.CREATED, user);

        mvc.perform(put("/api/users/saveUser")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(user)))
                .andExpect((jsonPath("$.status").value("CREATED")))
                .andExpect((jsonPath("$.data").value(response.getData())));
    }

    @WithMockUser
    @DisplayName("Controller - saveUserGroups")
    @Test
    void saveUserGroups() throws Exception {

        Group newGroup = new Group((long)3, "test", "Testowa", new HashSet<AcPermission>(), new HashSet<User>());


        List<Group> groups = Arrays.asList(newGroup);

        mvc.perform(put("/api/users/test/saveGroups")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(groups)))
                .andExpect((jsonPath("$.status").value("CREATED")))
                .andExpect((jsonPath("$.data").isArray()))
                .andExpect(jsonPath("$.data", hasSize(groups.size())))
                .andExpect((jsonPath("$.data[0]").value(groups.get(0))));
    }

    @WithMockUser
    @DisplayName("saveUserPermissions")
    @Test
    void saveUserPermissions() throws Exception {
        permission.setAcPrivilege(privilege);
        List<AcPrivilege> permissions = Arrays.asList(permission.getAcPrivilege());
        mvc.perform(put("/api/users/test/1/savePermission")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(permissions)))
                .andExpect((jsonPath("$.status").value("CREATED")))
                .andExpect((jsonPath("$.data").isArray()))
                .andExpect(jsonPath("$.data", hasSize(permissions.size())))
                .andExpect((jsonPath("$.data[0]").value(permissions.get(0))));
    }

    @WithMockUser
    @DisplayName("Controller - deleteUser")
    @Test
    void deleteUser() throws Exception {
        ApiResponse response = new ApiResponse(HttpStatus.ACCEPTED, "Pomyslnie usunięto jednostkę organizacyjną.");

        given(userService.deleteUserById((long)0)).willReturn("Pomyslnie usunięto jednostkę organizacyjną.");

        mvc.perform(delete("/api/users/deleteUser/0"))
                .andExpect((jsonPath("$.status").value("ACCEPTED")))
                .andExpect((jsonPath("$.data").value(response.getData())));
    }


}