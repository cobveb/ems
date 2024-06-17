package pl.viola.ems.service.modules.accountant.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.accountant.CostType;
import pl.viola.ems.model.modules.accountant.CostYear;
import pl.viola.ems.model.modules.accountant.repository.CostTypeRepository;
import pl.viola.ems.model.modules.accountant.repository.CostYearRepository;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.payload.modules.accountant.CostTypeResponse;
import pl.viola.ems.service.modules.accountant.CostTypeService;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
class CostTypeServiceImplTest {

    @TestConfiguration
    static class CostTypeServiceImplTestContextConfiguration {

        @Bean
        public CostTypeService costTypeService() {
            return new CostTypeServiceImpl();
        }
    }

    @Autowired
    MessageSource messageSource;

    @Autowired
    CostTypeService costTypeService;

    @MockBean
    CostTypeRepository costTypeRepository;

    @MockBean
    CostYearRepository costYearRepository;

    @MockBean
    OrganizationUnitService organizationUnitService;

    private final OrganizationUnit coordinator = new OrganizationUnit("cor", "Coordinator", "Uck", "uck@uck.katowice.pl", true, OrganizationUnit.Role.COORDINATOR, null);
    private final OrganizationUnit coordinator1 = new OrganizationUnit("cor1", "Coordinator1", "Uck", "uck@uck.katowice.pl", true, OrganizationUnit.Role.COORDINATOR, null);
    private final OrganizationUnit coordinator2 = new OrganizationUnit("cor2", "Coordinator2", "Uck", "uck@uck.katowice.pl", true, OrganizationUnit.Role.COORDINATOR, null);


    private final Set<OrganizationUnit> coordinatorsTwo = new HashSet<>(Arrays.asList(coordinator, coordinator1));
    private final Set<OrganizationUnit> coordinatorsOne = new HashSet<>(Collections.singletonList(coordinator));

    private final CostType costType = new CostType((long) 1, "401-1-02-xxx", "Materiały do remontu i konserwacji budynków", true, new HashSet<>());
    private final CostType costType1 = new CostType((long) 2, "401-1-07-002", "Papier ksero", true, new HashSet<>());
    private final CostType costType2 = new CostType((long) 3, "401-2-02-001", "Leki do programów lekowych", true, new HashSet<>());

    private final CostTypeResponse cost = new CostTypeResponse((long) 1, "401-1-02-xxx", "Materiały do remontu i konserwacji budynków", "Materiały do remontu i konserwacji budynków", true, new HashSet<>());
    private final CostTypeResponse cost1 = new CostTypeResponse((long) 2, "401-1-07-002", "Papier ksero", "Papier ksero", true, new HashSet<>());
    private final CostTypeResponse cost2 = new CostTypeResponse((long) 3, "401-2-02-001", "Leki do programów lekowych", "Leki do programów lekowych", true, new HashSet<>());

    private final CostYear year = new CostYear((long) 1, 2020, costType, coordinatorsTwo);
    private final CostYear year1 = new CostYear((long) 2, 2019, costType, coordinatorsOne);
    private final CostYear year2 = new CostYear((long) 2, 2020, costType1, coordinatorsOne);

    private final List<CostYear> yearsByCoordinator = Arrays.asList(year, year1);

    private final Set<CostYear> years = new HashSet<>(Arrays.asList(year, year1));

    private final List<CostType> all = Arrays.asList(costType, costType1, costType2);
    private final List<CostType> byCoordinator = Arrays.asList(costType, costType1);

    @BeforeEach
    void setUp() {

        Mockito.when(organizationUnitService.findCoordinatorByCode("cor")).thenReturn(Optional.of(coordinator));
        Mockito.when(organizationUnitService.findCoordinatorByCode("cor2")).thenReturn(Optional.of(coordinator2));
        Mockito.when(costTypeRepository.findAll()).thenReturn(all);
        Mockito.when(costTypeRepository.findByActiveTrueAndYearsIn(yearsByCoordinator)).thenReturn(byCoordinator);
        Mockito.when(costYearRepository.findByYearAndCoordinatorsIn(2020, coordinator)).thenReturn(yearsByCoordinator);
        Mockito.when(costTypeRepository.findById((long) 1)).thenReturn(Optional.of(costType));
        Mockito.when(costYearRepository.findByCostType(costType)).thenReturn(years);
        Mockito.when(costTypeRepository.save(costType)).thenReturn(costType);
        Mockito.when(costTypeRepository.existsById((long) 1)).thenReturn(true);
    }


    @Test
    void findAll() {
        List<CostTypeResponse> all = costTypeService.findAll();

        assertThat(all).isNotEmpty();
        assertThat(all.size()).isGreaterThanOrEqualTo(1);
        assertThat(all.get(0)).isEqualTo(cost);
        assertThat(all.get(0)).isNotEqualTo(cost1);
    }

    @Test
    void findByYearAndCoordinator() {
        List<CostTypeResponse> coordinatorCosts = costTypeService.findByYearAndCoordinator(2020, "cor");

        assertThat(coordinatorCosts).isNotEmpty();
        assertThat(coordinatorCosts.size()).isGreaterThanOrEqualTo(1);
        assertThat(coordinatorCosts).contains(cost, cost1);
        assertThat(coordinatorCosts).doesNotContain(cost2);

    }

    @Test
    void findByYearAndCoordinatorNotFoundCoordinatorException() {
        Throwable thrown = assertThrows(AppException.class, () -> costTypeService.findByYearAndCoordinator(2020, "it"));
        assertEquals("Koordynator nie istnieje.", thrown.getMessage());
    }

    @Test
    void findYearsByCostType() {
        Set<CostYear> years = costTypeService.findYearsByCostType(1);

        assertThat(years).isNotEmpty();
        assertThat(years.size()).isGreaterThanOrEqualTo(1);
        assertThat(years).contains(year, year1);
        assertThat(years).doesNotContain(year2);
    }

    @Test
    void findYearsByCostTypeNotFoundCostException() {
        Throwable thrown = assertThrows(AppException.class, () -> costTypeService.findYearsByCostType(2));
        assertEquals("Nie znaleziono rodzaju kosztów.", thrown.getMessage());
    }

    @Test
    void saveCostType() {
        costType.setYears(years);
        CostType savedCost = costTypeService.saveCostType(costType);
        verify(costTypeRepository, times(1)).save(costType);
        assertThat(savedCost.getCode()).isEqualTo("401-1-02-xxx");
        assertThat(savedCost.getYears()).contains(year1);
        assertThat(savedCost.getYears()).doesNotContain(year2);
    }

    @Test
    void deleteCostsType() {
        String msg = costTypeService.deleteCostType((long) 1);

        verify(costTypeRepository, times(1)).deleteById((long) 1);
        assertThat(msg).isEqualTo(messageSource.getMessage("Accountant.costType.deleteMsg", null, Locale.getDefault()));
    }

    @Test
    void deleteCostTypeNotFoundException() {
        Throwable thrown = assertThrows(AppException.class, () -> this.costTypeService.deleteCostType((long) 2));

        assertEquals(messageSource.getMessage("Accountant.costType.notFound", null, Locale.getDefault()), thrown.getMessage());

    }

}