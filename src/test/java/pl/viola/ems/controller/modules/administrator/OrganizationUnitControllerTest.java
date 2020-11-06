package pl.viola.ems.controller.modules.administrator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.applicant.Application;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import static groovy.json.JsonOutput.toJson;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class OrganizationUnitControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mvc;

    private OrganizationUnit main = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true, false);
    private OrganizationUnit it = new OrganizationUnit("it", "IT", "It", "it@uck.katowice.pl", true, true);
    private OrganizationUnit activeOu = new OrganizationUnit("active", "IT", "It", "it@uck.katowice.pl", true, false);

    private List<OrganizationUnit> all = Arrays.asList(main, it);
    private List<OrganizationUnit> active = Arrays.asList(activeOu);
    private List<OrganizationUnit> coordinators = Arrays.asList(it);

    @MockBean
    private OrganizationUnitService organizationUnitService;

    @BeforeEach
    public void setup() {
        mvc = MockMvcBuilders
                .webAppContextSetup(context)
                .build();

        given(organizationUnitService.saveOu("add", main)).willReturn(main);
        given(organizationUnitService.saveOu("edit", main)).willReturn(main);
        when(organizationUnitService.saveOu("save", main)).thenThrow(new AppException("Administrator.organizationUnit.invalidAction", HttpStatus.BAD_REQUEST));
    }

    @WithMockUser("user")
    @DisplayName("Controller - getAllOrganizationUnits")
    @Test
    void getAllOrganizationUnits() throws Exception{

        given(organizationUnitService.findAll()).willReturn(all);

        mvc.perform(get("/api/ou/getAll")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[1]").value(it));

    }

    @WithMockUser("user")
    @DisplayName("Controller - getActiveOrganizationUnits")
    @Test
    void getActiveOrganizationUnits() throws Exception{

        given(organizationUnitService.findActive()).willReturn(active);

        mvc.perform(get("/api/ou/getActive")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0]").value(activeOu));

    }

    @WithMockUser("user")
    @DisplayName("Controller - getCoordinators")
    @Test
    void getCoordinators() throws Exception{

        given(organizationUnitService.findCoordinators()).willReturn(coordinators);

        mvc.perform(get("/api/ou/getCoordinators")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0]").value(it));
    }

    @WithMockUser("user")
    @DisplayName("Controller - getMainOrganizationUnit")
    @Test
    void getMainOrganizationUnit() throws Exception{

        given(organizationUnitService.findMainOu()).willReturn(main);

        mvc.perform(get("/api/ou/getMainOu")
            .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value(main));
    }

    @WithMockUser("user")
    @DisplayName("Controller - getOrganizationUnitById")
    @Test
    void getOrganizationUnitById() throws Exception{

        given(organizationUnitService.findById("uck")).willReturn(java.util.Optional.ofNullable(main));

        mvc.perform(get("/api/ou/getOu/uck")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value(main));
    }

    @WithMockUser("user")
    @DisplayName("Controller - getOrganizationIsNull")
    @Test
    void getOrganizationUnitIsNull() throws Exception{

        mvc.perform(get("/api/ou/getOu/ou")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").doesNotExist());
    }

    @WithMockUser("user")
    @DisplayName("Controller - saveOrganizationUnitOnAdd")
    @Test()
    void saveOrganizationUnitOnAdd() throws Exception {

        OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true, false);


        ApiResponse response = new ApiResponse(HttpStatus.CREATED, ou);

        mvc.perform(put("/api/ou/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(ou)))
                .andExpect((jsonPath("$.status").value("CREATED")))
                .andExpect((jsonPath("$.data").value(response.getData())));
    }

    @WithMockUser("user")
    @DisplayName("Controller - saveOrganizationUnitBadActionException")
    @Test()
    void saveOrganizationUnitBadActionException() throws Exception {

        mvc.perform(put("/api/ou/save")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(main)))
                .andExpect(status().isBadRequest())
                .andExpect((jsonPath("$.message").isNotEmpty()))
                .andExpect((jsonPath("$.message").value("Niepoprawna akcja. Dozwolone akcje to add lub edit.")));
    }

    @WithMockUser("user")
    @DisplayName("Controller - saveOrganizationUnitOnEdit")
    @Test()
    void saveOrganizationUnitOnEdit() throws Exception {

        OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true, false);


        ApiResponse response = new ApiResponse(HttpStatus.CREATED, ou);

        mvc.perform(put("/api/ou/edit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(ou)))
                .andExpect((jsonPath("$.status").value("CREATED")))
                .andExpect((jsonPath("$.data").value(response.getData())));
    }

    @WithMockUser
    @DisplayName("Controller - saveOUArgumentNotValidException")
    @Test
    void saveOrganizationUnitException() throws Exception{
        OrganizationUnit ou = new OrganizationUnit(
                "uck",
                "uck",
                "uck",
                "1111111111",
                "123456789",
                "Katowice",
                "40 - 514",
                "Ceglana",
                "35",
                "+48 (32) 123 12 34",
                "+48 (32) 123 12 34",
                "uckuck.it",
                true,
                false,
                null,
                new HashSet<User>(),
                new HashSet<Application>(),
                new HashSet<Application>()
        );

        mvc.perform(put("/api/ou/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(ou)))
                .andExpect(status().isBadRequest())
                .andExpect((jsonPath("$.message").isNotEmpty())); //email: Nieprawidłowy adres email.
    }

    @WithMockUser
    @DisplayName("Controller - deleteOrganizationUnit")
    @Test
    void deleteOrganizationUnit() throws Exception {
        ApiResponse response = new ApiResponse(HttpStatus.CREATED, "Pomyslnie usunięto jednostkę organizacyjną.");

        given(organizationUnitService.deleteById("uck")).willReturn("Pomyslnie usunięto jednostkę organizacyjną.");

        mvc.perform(delete("/api/ou/deleteOu/uck"))
                .andExpect((jsonPath("$.status").value("ACCEPTED")))
                .andExpect((jsonPath("$.data").value(response.getData())));
    }
}