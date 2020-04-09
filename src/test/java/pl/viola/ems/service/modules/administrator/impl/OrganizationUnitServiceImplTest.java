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

    @BeforeEach
    void setUp() {
        OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true, false);
        OrganizationUnit activeOu = new OrganizationUnit("active", "UCK", "Uck", "uck@uck.katowice.pl", true, false);
        OrganizationUnit it = new OrganizationUnit("it", "IT", "IT", "IT@uck.katowice.pl", true, false);

        List<OrganizationUnit> units = new ArrayList<OrganizationUnit>();
        units.add(ou);
        units.add(it);

        List<OrganizationUnit> active = new ArrayList<OrganizationUnit>();
        active.add(activeOu);

        Mockito.when(organizationUnitRepository.findAll()).thenReturn(units);
        Mockito.when(organizationUnitRepository.findByActiveTrueAndParentIsNotNullOrderByName()).thenReturn(active);
        Mockito.when(organizationUnitRepository.findMainOu()).thenReturn(ou);
        Mockito.when(organizationUnitRepository.findById("it")).thenReturn(Optional.of(it));
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

    @DisplayName("findAll - Exception NOT FOUND")
    @Test
    void findAllNotFoundException(){
        List<OrganizationUnit> findAll = new ArrayList<OrganizationUnit>();

        Mockito.when(organizationUnitRepository.findAll()).thenReturn(findAll);
        thrown = assertThrows(AppException.class, () -> {
            organizationUnitService.findAll();
        });

        assertEquals("Nie znaleziono jednostek organizacyjnych.", thrown.getMessage());
    }

    @DisplayName("findAllMain - Exception NOT FOUND MAIN")
    @Test
    void findAllMainNotFoundException(){

        Mockito.when(organizationUnitRepository.findMainOu()).thenReturn(null);
        thrown = assertThrows(AppException.class, () -> {
            organizationUnitService.findAll();
        });

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
        thrown = assertThrows(AppException.class, () -> {
            organizationUnitService.findMainOu();
        });

        assertEquals("Nie znaleziono głównej jednostki organizacyjnej.", thrown.getMessage());
    }

    @DisplayName("saveOU")
    @Test
    void saveOrganoztionUnit(){
        OrganizationUnit ou = new OrganizationUnit(
                "UCK",
                "Uniwersyteckie Centrum",
                "UCK SUM",
                "1111111111",
                "123456789",
                "Katowice",
                "40 - 514",
                "Ceglana",
                "35",
                "+48 (32) 123 12 34",
                "+48 (32) 123 12 34",
                "uck@uck.it",
                true,
                false,
                null,
                new HashSet<User>()
        );

        organizationUnitService.saveOu(ou);

        verify(organizationUnitRepository, times(1)).save(ou);
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

        OrganizationUnit test = new OrganizationUnit("test", "IT", "IT", "IT@uck.katowice.pl", true, false);
        User user =  new User("user", "passwd","user","user", true, false,false,false, test);

        Set<User> users = new HashSet<User>();
        users.add(user);
        test.setUsers(users);
        Mockito.when(organizationUnitRepository.findById("test")).thenReturn(Optional.of(test));

        thrown = assertThrows(AppException.class, () -> {
            organizationUnitService.deleteById("test");
        });

        assertEquals("Nie można usunąć jednostki organizacyjnej. Jednostka organizacyjna posiada przypisanych użytkowników.", thrown.getMessage());

    }

}