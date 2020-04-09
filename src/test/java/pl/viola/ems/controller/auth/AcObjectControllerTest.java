package pl.viola.ems.controller.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import pl.viola.ems.model.security.AcObject;
import pl.viola.ems.service.security.AcObjectService;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AcObjectControllerTest {
    @Autowired
    private WebApplicationContext context;

    private MockMvc mvc;

    @MockBean
    AcObjectService acObjectService;

    private AcObject acObjectKsie = new AcObject((long)1, (long)1, "Moduł Księgowy", "MODULE", null, null);
    private AcObject acObjectKoor = new AcObject((long)2, (long)2, "Moduł Koordynator", "MODULE", null, null);

    @BeforeEach
    public void setup() {
        mvc = MockMvcBuilders
                .webAppContextSetup(context)
                .build();
        List<AcObject> acObjects = Arrays.asList(acObjectKsie, acObjectKoor);

        given(acObjectService.findAll()).willReturn(acObjects);
    }
    @DisplayName("getAllAcObjects")
    @Test
    void getAllAcObjects() throws Exception {

        mvc.perform(get("/api/ac/objects/getAll")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("FOUND"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0]").value(acObjectKsie));
    }
}