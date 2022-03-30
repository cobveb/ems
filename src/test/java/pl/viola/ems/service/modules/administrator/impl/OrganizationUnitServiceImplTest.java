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
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.administrator.repository.OrganizationUnitRepository;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
public class OrganizationUnitServiceImplTest {


    @TestConfiguration
    static class OrganizationUnitServiceImplTestContextConfiguration{

        @Bean
        public OrganizationUnitService organizationUnitService(){
            return new OrganizationUnitServiceImpl();
        }
    }

    @Autowired
    private OrganizationUnitService organizationUnitService;

    @MockBean
    private OrganizationUnitRepository organizationUnitRepository;

    private Throwable thrown;

    private final OrganizationUnit it = new OrganizationUnit("it", "IT", "IT", "IT@uck.katowice.pl", true, OrganizationUnit.Role.COORDINATOR, null);

    private final OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true);
    private final OrganizationUnit activeOu = new OrganizationUnit("active", "UCK", "Uck", "uck@uck.katowice.pl", true);

    private final OrganizationUnit child = new OrganizationUnit(
            "test",
            "Uniwersyteckie Centrum",
            "UCK SUM",
            null,
            "1111111111",
            "123456789",
            "Katowice",
            "40 - 514",
            "Ceglana",
            "35",
            "+48 (32) 123 12 34",
            "+48 (32) 123 12 34",
            "uck@uck.it",
            null,
            true,
            ou.getCode(),
            null,
            new HashSet<>(),
            new HashSet<>(),
            new HashSet<>(),
            new HashSet<>(),
            new HashSet<>(),
            new HashSet<>()
    );
    private final OrganizationUnit subChild = new OrganizationUnit(
            "test",
            "Uniwersyteckie Centrum",
            "UCK SUM",
            null,
            "1111111111",
            "123456789",
            "Katowice",
            "40 - 514",
            "Ceglana",
            "35",
            "+48 (32) 123 12 34",
            "+48 (32) 123 12 34",
            "uck@uck.it",
            null,
            true,
            child.getCode(),
            null,
            new HashSet<>(),
            new HashSet<>(),
            new HashSet<>(),
            new HashSet<>(),
            new HashSet<>(),
            new HashSet<>()
    );

    private final List<OrganizationUnit> units = new ArrayList<>();
    private final List<OrganizationUnit> active = new ArrayList<>();
    private final List<OrganizationUnit> coordinators = new ArrayList<>();
    private final List<OrganizationUnit> childes = new ArrayList<>();

    @BeforeEach
    void setUp() {

        units.add(ou);
        units.add(it);

        active.add(activeOu);

        coordinators.add(it);

        childes.add(child);

        Mockito.when(organizationUnitRepository.findAll()).thenReturn(units);
        Mockito.when(organizationUnitRepository.findByActiveTrueAndParentIsNotNullOrderByName()).thenReturn(active);
        Mockito.when(organizationUnitRepository.findByActiveTrueAndRoleOrderByName(OrganizationUnit.Role.COORDINATOR)).thenReturn(coordinators);
        Mockito.when(organizationUnitRepository.findMainOu()).thenReturn(ou);
        Mockito.when(organizationUnitRepository.findById("it")).thenReturn(Optional.of(it));
        Mockito.when(organizationUnitRepository.findByCodeAndActiveTrueAndRole("it", OrganizationUnit.Role.COORDINATOR)).thenReturn(Optional.of(it));
        Mockito.when(organizationUnitRepository.findByParentAndActiveTrue("uck")).thenReturn(childes);
        Mockito.when(organizationUnitRepository.existsById("uck")).thenReturn(true);
    }

    @DisplayName("findAll")
    @Test
    void findAll() {
        List<OrganizationUnit> all = organizationUnitService.findAll();

        assertThat(all).isNotEmpty();
        assertThat(all.size()).isGreaterThanOrEqualTo(1);
        assertThat(all.get(1).getCode()).isEqualTo("it");
    }

    @DisplayName("findActive")
    @Test
    void findActive() {
        List<OrganizationUnit> active = organizationUnitService.findActive();

        assertThat(active).isNotEmpty();
        assertThat(active.size()).isGreaterThanOrEqualTo(1);
        assertThat(active.get(0).getCode()).isEqualTo("active");
    }

    @DisplayName("findCoordinators")
    @Test
    void findCoordinators() {
        List<OrganizationUnit> coordinators = organizationUnitService.findCoordinators();

        assertThat(coordinators).isNotEmpty();
        assertThat(coordinators.size()).isGreaterThanOrEqualTo(1);
        assertThat(coordinators.get(0).getCode()).isEqualTo("it");
    }

    @DisplayName("findAll - Exception NOT FOUND")
    @Test
    void findAllNotFoundException(){
        List<OrganizationUnit> findAll = new ArrayList<>();

        Mockito.when(organizationUnitRepository.findAll()).thenReturn(findAll);
        thrown = assertThrows(AppException.class, () -> organizationUnitService.findAll());

        assertEquals("Nie znaleziono jednostek organizacyjnych.", thrown.getMessage());
    }

    @DisplayName("findAllMain - Exception NOT FOUND MAIN")
    @Test
    void findAllMainNotFoundException(){

        Mockito.when(organizationUnitRepository.findMainOu()).thenReturn(null);
        thrown = assertThrows(AppException.class, () -> organizationUnitService.findAll());

        assertEquals("Nie znaleziono głównej jednostki organizacyjnej.", thrown.getMessage());
    }

    @DisplayName("findMainOu")
    @Test
    void findMainOu() {
        OrganizationUnit mainOu = organizationUnitService.findMainOu();

        assertThat(mainOu.getCode()).isEqualTo("uck");
    }

    @DisplayName("findAll - Exception")
    @Test
    void findMainOuNotFoundException(){


        Mockito.when(organizationUnitRepository.findMainOu()).thenReturn(null);
        Mockito.when(organizationUnitRepository.count()).thenReturn((long) 1);
        thrown = assertThrows(AppException.class, () -> organizationUnitService.findMainOu());

        assertEquals("Nie znaleziono głównej jednostki organizacyjnej.", thrown.getMessage());
    }

    @DisplayName("findCoordinatorByCode")
    @Test
    void findCoordinatorByCode() {
        Optional<OrganizationUnit> coordinator = organizationUnitService.findCoordinatorByCode("it");
        assertThat(coordinator.orElse(null)).isEqualTo(it);
    }


    @DisplayName("findByParent")
    @Test
    void findByParent() {
        List<OrganizationUnit> ous = organizationUnitService.findByParent("uck");

        assertThat(ous).isNotEmpty();
        assertThat(ous.size()).isGreaterThanOrEqualTo(1);
        assertThat(ous.size()).isEqualTo(childes.size());
        assertThat(ous.get(0).getCode()).isEqualTo("test");
    }

    @DisplayName("saveOuOnAdd")
    @Test
    void saveOrganizationUnitOnAdd() {
        OrganizationUnit ou = new OrganizationUnit(
                "test",
                "Uniwersyteckie Centrum",
                "UCK SUM",
                null,
                "1111111111",
                "123456789",
                "Katowice",
                "40 - 514",
                "Ceglana",
                "35",
                "+48 (32) 123 12 34",
                "+48 (32) 123 12 34",
                "uck@uck.it",
                null,
                true,
                null,
                null,
                new HashSet<>(),
                new HashSet<>(),
                new HashSet<>(),
                new HashSet<>(),
                new HashSet<>(),
                new HashSet<>()
        );

        organizationUnitService.saveOu("add", ou);

        verify(organizationUnitRepository, times(1)).saveAndFlush(ou);
    }

    @DisplayName("saveOuExistsException")
    @Test
    void saveOuExistsException(){
        OrganizationUnit ou = new OrganizationUnit(
                "uck",
                "Uniwersyteckie Centrum",
                "UCK SUM",
                null,
                "1111111111",
                "123456789",
                "Katowice",
                "40 - 514",
                "Ceglana",
                "35",
                "+48 (32) 123 12 34",
                "+48 (32) 123 12 34",
                "uck@uck.it",
                null,
                true,
                null,
                null,
                new HashSet<>(),
                new HashSet<>(),
                new HashSet<>(),
                new HashSet<>(),
                new HashSet<>(),
                new HashSet<>()
        );

        thrown = assertThrows(AppException.class, () -> organizationUnitService.saveOu("add", ou));

        assertEquals("Jednostka organizacyjna o podanym kodzie już istnieje.", thrown.getMessage());

    }

    @DisplayName("saveOuOnEdit")
    @Test
    void saveOrganizationUnitOnEdit(){
        OrganizationUnit ou = new OrganizationUnit(
                "uck",
                "Uniwersyteckie Centrum",
                "UCK SUM",
                null,
                "1111111111",
                "123456789",
                "Katowice",
                "40 - 514",
                "Ceglana",
                "35",
                "+48 (32) 123 12 34",
                "+48 (32) 123 12 34",
                "uck@uck.it",
                null,
                true,
                null,
                null,
                new HashSet<>(),
                new HashSet<>(),
                new HashSet<>(),
                new HashSet<>(),
                new HashSet<>(),
                new HashSet<>()

        );

        organizationUnitService.saveOu("edit", ou);

        verify(organizationUnitRepository, times(1)).saveAndFlush(ou);
    }

    @DisplayName("saveOuBadActionException")
    @Test
    void saveOuBadActionException(){
        OrganizationUnit ou = new OrganizationUnit();

        thrown = assertThrows(AppException.class, () -> organizationUnitService.saveOu("test", ou));

        assertEquals("Niepoprawna akcja. Dozwolone akcje to add lub edit.", thrown.getMessage());

    }

    @DisplayName("findByCode")
    @Test
    void findById() {
        Optional<OrganizationUnit> ou = organizationUnitService.findById("it");
        assertThat(ou.get().getName()).isEqualTo("IT");
    }

    @DisplayName("deleteOu")
    @Test
    void deleteOrganizationUnit() {
        organizationUnitService.deleteById("it");

        verify(organizationUnitRepository, times(1)).deleteById("it");

        assertThat(organizationUnitService.deleteById("it")).isEqualTo("Pomyslnie usunięto jednostkę organizacyjną.");
    }

    @DisplayName("deleteOu - Exception USER FIND")
    @Test
    void deleteOrganizationUnitException(){

        OrganizationUnit test = new OrganizationUnit("test", "IT", "IT", "IT@uck.katowice.pl", true);
        User user = new User("user", "passwd", "user", "user", true, false, false, false, test);

        Set<User> users = new HashSet<>();
        users.add(user);
        test.setUsers(users);
        Mockito.when(organizationUnitRepository.findById("test")).thenReturn(Optional.of(test));

        thrown = assertThrows(AppException.class, () -> organizationUnitService.deleteById("test"));

        assertEquals("Nie można usunąć jednostki organizacyjnej. Jednostka organizacyjna posiada przypisanych użytkowników.", thrown.getMessage());

    }

}