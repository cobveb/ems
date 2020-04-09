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
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import pl.viola.ems.model.modules.administrator.Parameter;
import pl.viola.ems.model.modules.administrator.ParameterCategory;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.administrator.ParameterService;

import java.util.Arrays;
import java.util.List;

import static groovy.json.JsonOutput.toJson;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ParameterControllerTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private FilterChainProxy springSecurityFilterChain;

    @MockBean
    private ParameterService parameterService;

    private MockMvc mvc;

    private Parameter dig;

    private Parameter upper;

    private Parameter spec;

    private List<Parameter> parameters;

    private List<ParameterCategory> categories = Arrays.asList(ParameterCategory.values());

    @BeforeEach
    public void setup() {
        mvc = MockMvcBuilders
            .webAppContextSetup(context)
            .addFilter(springSecurityFilterChain)
            .apply(springSecurity())
            .build();

        dig = new Parameter("dig", "N", ParameterCategory.System, "Passwd", "Digits", "Digits");
        upper = new Parameter("upper", "N", ParameterCategory.System, "Passwd", "Upper", "Upper", "1");
        spec = new Parameter("spec", "N", ParameterCategory.System, "Passwd", "Spec", "Spec");

        parameters = Arrays.asList(dig, upper, spec);

    }

    @WithMockUser("user")
    @DisplayName("Controller - getAllParameter")
    @Test
    void getAllParameters() throws Exception {
        given(parameterService.findAll()).willReturn(parameters);

        mvc.perform(get("/api/param/getAll")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("FOUND"))
            .andExpect(jsonPath("$.data", hasSize(3)))
            .andExpect(jsonPath("$.data[0].code").value("dig"));

    }

    @WithMockUser("user")
    @DisplayName("Controller - getParameterById")
    @Test
    void getParameterById() throws Exception {
        given(parameterService.findById("upper")).willReturn(java.util.Optional.ofNullable(upper));

        mvc.perform(get("/api/param/getParam/upper")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("FOUND"))
            .andExpect(jsonPath("$.data.value").value("1"));
    }

    @WithMockUser("user")
    @DisplayName("Controller - getParameterByCategory")
    @Test
    void getParameterByCategory() throws Exception {
        given(parameterService.findByCategory(ParameterCategory.System)).willReturn(parameters);

        mvc.perform(get("/api/param/getParams/System")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("FOUND"))
            .andExpect(jsonPath("$.data", hasSize(3)))
            .andExpect(jsonPath("$.data[0].code").value("dig"));
    }

    @WithMockUser("user")
    @DisplayName("Controller - saveParameter")
    @Test
    void saveParameter() throws Exception {

        ApiResponse response = new ApiResponse(HttpStatus.OK, "Parametr został pomyślnie zmieniony.");

        mvc.perform(put("/api/param/save")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(dig)))
                .andExpect((jsonPath("$.status").value("OK")))
                .andExpect((jsonPath("$.data").value(response.getData())));
    }

    @WithMockUser("user")
    @DisplayName("Controller - getCategories")
    @Test
    void getCategories() throws Exception {
        given(parameterService.findAllCategory()).willReturn(categories);

        mvc.perform(get("/api/param/getCategories")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("FOUND"))
                .andExpect(jsonPath("$.data", hasSize(3)))
                .andExpect(jsonPath("$.data[0]").value("System"));
    }
}