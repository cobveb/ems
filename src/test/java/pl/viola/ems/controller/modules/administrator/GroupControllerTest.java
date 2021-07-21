package pl.viola.ems.controller.modules.administrator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import pl.viola.ems.payload.security.AcPermissionDetails;
import pl.viola.ems.service.modules.administrator.GroupService;
import pl.viola.ems.service.security.AcPermissionService;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import static groovy.json.JsonOutput.toJson;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class GroupControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mvc;

    @MockBean
    GroupService groupService;

    @MockBean
    AcPermissionService acPermissionService;

    private OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true);

    private Group adm = new Group((long)1, "adm", "Administratorzy", new HashSet<AcPermission>(), new HashSet<User>());
    private Group user = new Group((long)2, "user", "Użytkownicy", new HashSet<AcPermission>(), new HashSet<User>());
    private Group test = new Group((long)3, "test", "Testowa",  new HashSet<AcPermission>(), new HashSet<User>());

    private AcObject acObject = new AcObject((long)1, (long)1, "Moduł testowy", "MODULE", new HashSet<AcPermission>(), new HashSet<AcPrivilege>());
    private AcPrivilege privilege = new AcPrivilege((long)1, "0001", "Przywilej testowy", new HashSet<AcObject>(),new HashSet<AcPermission>());
    private AcPermission permission = new AcPermission((long)1, acObject, privilege, null, test);
    private AcPermissionDetails permissionDetails = new AcPermissionDetails(privilege.getId(), privilege.getCode(), privilege.getName());

    @BeforeEach
    public void setup() {
        mvc = MockMvcBuilders
                .webAppContextSetup(context)
                .build();


        List<Group> groups = Arrays.asList(adm, user, test);
        List<Group> userGroups = Arrays.asList(adm, user);
        List<AcPermissionDetails> permissions = Arrays.asList(permissionDetails);

        given(groupService.findAllGroups()).willReturn(groups);
        given(groupService.findGroupsByUser("user")).willReturn(userGroups);
        given(groupService.findGroupByCode("test")).willReturn(java.util.Optional.ofNullable(test));
        given(groupService.deleteGroup("test")).willReturn("Pomyslnie usunięto grupę użytkowników.");
        given(acPermissionService.findByGroupAndAcObject("test", (long)1)).willReturn(permissions);

    }

    @DisplayName("getAllUsersGroups")
    @Test
    void getAllUsersGroups() throws Exception {

        mvc.perform(get("/api/usersGroups/getAll")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(3)))
                .andExpect(jsonPath("$.data[0]").value(adm));
    }

    @DisplayName("getGroupsByUser")
    @Test
    void getGroupsByUser() throws Exception {
        mvc.perform(get("/api/usersGroups/user")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[1]").value(user));
    }

    @DisplayName("getGroupsByUser - no group")
    @Test
    void getGroupsByUserNoGroup() throws Exception {
        mvc.perform(get("/api/usersGroups/test")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(0)));
    }

    @DisplayName("getGroupObjectPermission")
    @Test
    void getGroupObjectPermission() throws Exception{
        mvc.perform(get("/api/usersGroups/test/1/getPermissions")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0]").value(permissionDetails));
    }

    @DisplayName("saveGroupBasic")
    @Test
    void saveGroupBasic() throws Exception {

        ApiResponse response = new ApiResponse(HttpStatus.CREATED, test);

        mvc.perform(put("/api/usersGroups/saveGroupBasic")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(test)))
                .andExpect((jsonPath("$.status").value("CREATED")))
                .andExpect((jsonPath("$.data").value(response.getData())));
    }

    @DisplayName("saveGroupUsers")
    @Test
    void saveGroupUsers() throws Exception {

        UserDetails userDetails = new UserDetails(
                "UserTest",
                "user",
                "User",
                ou
        );
        UserDetails test = new UserDetails(
                "test",
                "test",
                "test",
                ou
        );

        List<UserDetails> groupUsers = Arrays.asList(userDetails, test);

        mvc.perform(put("/api/usersGroups/test/saveGroupUsers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(groupUsers)))
                .andExpect((jsonPath("$.status").value("CREATED")))
                .andExpect((jsonPath("$.data").isArray()))
                .andExpect(jsonPath("$.data", hasSize(groupUsers.size())))
                .andExpect((jsonPath("$.data[1]").value(groupUsers.get(1))));
    }

    @DisplayName("saveGroupPermissions")
    @Test
    void saveGroupPermissions() throws Exception {
        permission.setAcPrivilege(privilege);
        List<AcPrivilege> permissions = Arrays.asList(permission.getAcPrivilege());
        mvc.perform(put("/api/usersGroups/test/1/savePermission")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(permissions)))
                .andExpect((jsonPath("$.status").value("CREATED")))
                .andExpect((jsonPath("$.data").isArray()))
                .andExpect(jsonPath("$.data", hasSize(permissions.size())))
                .andExpect((jsonPath("$.data[0]").value(permissions.get(0))));
    }

    @DisplayName("deleteGroup")
    @Test
    void deleteGroup() throws Exception {

        ApiResponse response = new ApiResponse(HttpStatus.CREATED, "Pomyslnie usunięto grupę użytkowników.");

        mvc.perform(delete("/api/usersGroups/deleteGroup/test"))
                .andExpect((jsonPath("$.status").value("ACCEPTED")))
                .andExpect((jsonPath("$.data").value(response.getData())));
    }
}