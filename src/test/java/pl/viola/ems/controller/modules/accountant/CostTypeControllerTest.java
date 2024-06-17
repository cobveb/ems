package pl.viola.ems.controller.modules.accountant;

import org.junit.jupiter.api.BeforeEach;
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
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.accountant.CostType;
import pl.viola.ems.model.modules.accountant.CostYear;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.modules.accountant.CostTypeResponse;
import pl.viola.ems.service.modules.accountant.CostTypeService;

import java.util.*;

import static groovy.json.JsonOutput.toJson;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CostTypeControllerTest {

    @Autowired
    WebApplicationContext context;

    @Autowired
    MessageSource messageSource;

    @MockBean
    CostTypeService costTypeService;

    private MockMvc mvc;

    private final OrganizationUnit coordinator = new OrganizationUnit("cor", "Coordinator", "Uck", "uck@uck.katowice.pl", true, OrganizationUnit.Role.COORDINATOR, null);


    private final CostType costType = new CostType((long) 1, "401-1-02-xxx", "Materiały do remontu i konserwacji budynków", true, new HashSet<>());
    private final CostType costType1 = new CostType((long) 1, "401-1-02-xxx", "Materiały do remontu i konserwacji budynków", true, new HashSet<>());

    private final CostTypeResponse cost = new CostTypeResponse((long) 1, "401-1-02-xxx", "Materiały do remontu i konserwacji budynków", "Materiały do remontu i konserwacji budynków", true, new HashSet<>());
    private final CostTypeResponse cost1 = new CostTypeResponse((long) 2, "401-1-07-002", "Papier ksero", "Papier ksero", true, new HashSet<>());
    private final CostTypeResponse cost2 = new CostTypeResponse((long) 3, "401-2-02-001", "Leki do programów lekowych", "Leki do programów lekowych", true, new HashSet<>());

    private final List<CostTypeResponse> all = Arrays.asList(cost, cost1, cost2);
    private final List<CostTypeResponse> byCoordinator = Arrays.asList(cost, cost1);

    private final CostYear year = new CostYear((long) 1, 2020, costType, Collections.singleton(coordinator));
    private final CostYear year1 = new CostYear((long) 2, 2019, costType, Collections.singleton(coordinator));

    private final Set<CostYear> years = new HashSet<>(Arrays.asList(year, year1));


    @BeforeEach
    public void setup() {
        mvc = MockMvcBuilders
                .webAppContextSetup(context)
                .build();

        costType.setYears(years);
        given(costTypeService.findAll()).willReturn(all);
        given(costTypeService.findByYearAndCoordinator(2020, "cor")).willReturn(byCoordinator);
        given(costTypeService.findYearsByCostType(1)).willReturn(costType.getYears());
        given(costTypeService.deleteCostType((long) 1)).willReturn(messageSource.getMessage("Accountant.costType.deleteMsg", null, Locale.getDefault()));
        given(costTypeService.deleteCostType((long) 2)).willThrow(new AppException("Accountant.costType.notFound", HttpStatus.BAD_REQUEST));

    }


    @Test
    @WithUserDetails
    void getCostTypeAll() throws Exception {
        mvc.perform(get("/api/accountant/costType/getAll")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("FOUND"))
                .andExpect(jsonPath("$.data", hasSize(3)))
                .andExpect(jsonPath("$.data[0].id").value(cost.getId()))
                .andExpect(jsonPath("$.data[0].code").value(cost.getCode()));
    }

    @Test
    @WithUserDetails
    void getCostTypeByCoordinator() throws Exception {
        mvc.perform(get("/api/accountant/costType/getByCoordinator/2020/cor")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("FOUND"))
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[1].id").value(cost1.getId()))
                .andExpect(jsonPath("$.data[1].code").value(cost1.getCode()));
    }

    @Test
    @WithUserDetails
    void getYearsByCostType() throws Exception {
        mvc.perform(get("/api/accountant/costType/getYears/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("FOUND"))
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[1].id").value(year1.getId()))
                .andExpect(jsonPath("$.data[1].year").value(year1.getYear()));
    }

    @Test
    @WithUserDetails
    void saveApplication() throws Exception {

        ApiResponse response = new ApiResponse(HttpStatus.CREATED, costTypeService.saveCostType(costType1));
        mvc.perform(put("/api/accountant/costType/saveCostType")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(costType1)))
                .andExpect((jsonPath("$.status").value("CREATED")))
                .andExpect((jsonPath("$.data").value(response.getData())));
    }

    @Test
    @WithUserDetails
    void deleteCostType() throws Exception {
        ApiResponse response = new ApiResponse(HttpStatus.ACCEPTED, costTypeService.deleteCostType((long) 1));
        mvc.perform(delete("/api/accountant/costType/deleteCostType/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect((jsonPath("$.status").value("ACCEPTED")))
                .andExpect((jsonPath("$.data").value(response.getData())));
    }

    @Test
    @WithUserDetails
    void deleteCostTypeNotFound() throws Exception {
        AppException exception = new AppException(HttpStatus.ACCEPTED, "Accountant.costType.notFound");
        mvc.perform(delete("/api/accountant/costType/deleteCostType/2")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect((jsonPath("$.status").value("BAD_REQUEST")))
                .andExpect((jsonPath("$.message").value(exception.getMessage())));
        ;
    }
}