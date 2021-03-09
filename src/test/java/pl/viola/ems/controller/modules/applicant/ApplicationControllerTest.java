package pl.viola.ems.controller.modules.applicant;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import pl.viola.ems.model.common.Dictionary;
import pl.viola.ems.model.common.DictionaryItem;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.applicant.Application;
import pl.viola.ems.model.modules.applicant.ApplicationPosition;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.administrator.UserService;
import pl.viola.ems.service.modules.applicant.ApplicationService;

import java.util.*;

import static groovy.json.JsonOutput.toJson;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApplicationControllerTest {
    @Autowired
    WebApplicationContext context;

    @Autowired
    MessageSource messageSource;

    private MockMvc mvc;

    @MockBean
    ApplicationService applicationService;


    @MockBean
    UserService userService;

    private final OrganizationUnit applicant = new OrganizationUnit("app", "Applicant", "Uck", "uck@uck.katowice.pl", true, false);
    private final OrganizationUnit coordinator = new OrganizationUnit("cor", "Coordinator", "Uck", "uck@uck.katowice.pl", true, false);

    private final Application application = new Application((long) 1, "01/app/2020", applicant, coordinator, "ZA", new Date(), null, new HashSet<>());
    private final Application send = new Application((long) 1, "01/app/2020", applicant, coordinator, "WY", new Date(), null, new HashSet<>());
    private final Application withdraw = new Application((long) 1, "01/app/2020", applicant, coordinator, "ZA", new Date(), null, new HashSet<>());
    private final Application application1 = new Application((long) 2, "01/app/2020", coordinator, applicant, "ZA", new Date(), null, new HashSet<>());

    private final Dictionary test = new Dictionary("test", "Test", 'U', new HashSet<>());
    private final DictionaryItem item = new DictionaryItem((long) 1, "test", "test item", true, test, new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>());

    private final ApplicationPosition position1 = new ApplicationPosition((long) 1, "Test", (long) 5, item, "ZA", null, null, application);
    private final ApplicationPosition posSend = new ApplicationPosition((long) 1, "Test", (long) 5, item, "WY", null, null, application);
    private final ApplicationPosition posWithdraw = new ApplicationPosition((long) 1, "Test", (long) 5, item, "ZA", null, null, application);
    private final ApplicationPosition position2 = new ApplicationPosition((long) 2, "Test2", (long) 4, item, "ZA", null, null, application);

    private final Set<ApplicationPosition> positions = new HashSet<>(Arrays.asList(position1, position2));

    private final List<ApplicationPosition> list = new ArrayList<>(positions);

    private final User user = new User(
            (long) 0,
            "applicant",
            "user",
            new Date(),
            "User",
            "Test",
            true,
            false,
            false,
            false,
            applicant,
            new HashSet<>(),
            new HashSet<>()
    );

    @BeforeEach
    public void setup() {

        mvc = MockMvcBuilders
                .webAppContextSetup(context)
                .build();
        application.setPositions(positions);
        withdraw.setPositions(new HashSet<>(Collections.singletonList(posWithdraw)));
        send.setPositions(new HashSet<>(Collections.singletonList(posSend)));

        List<Application> applicants = Arrays.asList(application, application1);
        List<Application> coordinators = Collections.singletonList(application1);

        given(userService.findByUsername("user")).willReturn(Optional.of(user));
        given(applicationService.findByApplicant(user)).willReturn(applicants);
        given(applicationService.findByCoordinator(user)).willReturn(coordinators);
        given(applicationService.findPositionsByApplication((long) 1)).willReturn(list);
        given(applicationService.updateApplicationStatus((long) 1, "WY")).willReturn(send);
        given(applicationService.updateApplicationStatus((long) 1, "ZA")).willReturn(withdraw);
        given(applicationService.deleteApplication((long) 1)).willReturn(messageSource.getMessage("Applicant.application.notFound", null, Locale.getDefault()));

    }

    @DisplayName("getApplicationsByApplicant")
    @Test
    @WithUserDetails
    void getApplicationsByApplicant() throws Exception {
        mvc.perform(get("/api/application/applicant/getApplications")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("FOUND"))
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].id").value(application.getId()))
                .andExpect(jsonPath("$.data[0].number").value(application.getNumber()))
                .andExpect(jsonPath("$.data[0].applicant").value(application.getApplicant()));
    }

    @DisplayName("getApplicationsByCoordinator")
    @Test
    @WithUserDetails
    void getApplicationsByCoordinator() throws Exception {
        mvc.perform(get("/api/application/coordinator/getApplications")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("FOUND"))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].id").value(application1.getId()))
                .andExpect(jsonPath("$.data[0].number").value(application1.getNumber()))
                .andExpect(jsonPath("$.data[0].coordinator").value(application1.getCoordinator()));
    }

    @Test
    @WithUserDetails
    void getApplicationPositions() throws Exception {

        mvc.perform(get("/api/application/1/getPositions")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("FOUND"))
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].name").value(list.get(0).getName()));
    }

    @Test
    @WithUserDetails
    void saveApplication() throws Exception {

        ApiResponse response = new ApiResponse(HttpStatus.CREATED, applicationService.saveApplication(application1, "add", user));
        mvc.perform(put("/api/application/add/saveApplication")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(application1)))
                .andExpect((jsonPath("$.status").value("CREATED")))
                .andExpect((jsonPath("$.data").value(response.getData())));
    }

    @Test
    @WithUserDetails
    void sendApplication() throws Exception {
        mvc.perform(put("/api/application/applicant/send/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect((jsonPath("$.status").value("ACCEPTED")))
                .andExpect((jsonPath("$.data.status").value(send.getStatus())))
                .andExpect((jsonPath("$.data.positions", hasSize(1))))
                .andExpect((jsonPath("$.data.positions[0].status").value("WY")));
    }

    @Test
    @WithUserDetails
    void withdrawApplication() throws Exception {
        mvc.perform(put("/api/application/applicant/withdraw/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect((jsonPath("$.status").value("ACCEPTED")))
                .andExpect((jsonPath("$.data.status").value(withdraw.getStatus())))
                .andExpect((jsonPath("$.data.positions", hasSize(1))))
                .andExpect((jsonPath("$.data.positions[0].status").value("ZA")));
    }

    @Test
    @WithUserDetails
    void deleteApplication() throws Exception {
        ApiResponse response = new ApiResponse(HttpStatus.ACCEPTED, applicationService.deleteApplication((long) 1));
        mvc.perform(delete("/api/application/applicant/deleteApplication/2")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect((jsonPath("$.status").value("ACCEPTED")))
                .andExpect((jsonPath("$.data").value(response.getData())));
    }

}