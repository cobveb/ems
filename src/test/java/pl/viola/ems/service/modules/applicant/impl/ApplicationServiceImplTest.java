package pl.viola.ems.service.modules.applicant.impl;

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
import pl.viola.ems.model.common.Dictionary;
import pl.viola.ems.model.common.DictionaryItem;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.applicant.Application;
import pl.viola.ems.model.modules.applicant.ApplicationPosition;
import pl.viola.ems.model.modules.applicant.repository.ApplicationPositionRepository;
import pl.viola.ems.model.modules.applicant.repository.ApplicationRepository;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;
import pl.viola.ems.service.modules.applicant.ApplicationService;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
class ApplicationServiceImplTest {


    @TestConfiguration
    static class ApplicationServiceImplTestContextConfiguration {

        @Bean
        public ApplicationService applicationService() {
            return new ApplicationServiceImpl();
        }

    }

    @Autowired
    ApplicationService applicationService;

    @Autowired
    MessageSource messageSource;

    @MockBean
    ApplicationRepository applicationRepository;

    @MockBean

    OrganizationUnitService organizationUnitService;

    @MockBean
    ApplicationPositionRepository applicationPositionRepository;

    private Throwable thrown;

    private final OrganizationUnit applicant = new OrganizationUnit("uck", "applicant", "Uck", "uck@uck.katowice.pl", true, false);

    private final OrganizationUnit child = new OrganizationUnit(
            "test",
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
            applicant.getCode(),
            new HashSet<>(),
            new HashSet<>(),
            new HashSet<>(),
            new HashSet<>(),
            new HashSet<>()
    );

    private final OrganizationUnit coordinator = new OrganizationUnit("coor", "coordinator", "Uck", "uck@uck.katowice.pl", true, true);

    private final List<OrganizationUnit> organizationUnits = Arrays.asList(applicant, child);
    private final List<OrganizationUnit> coordinatorUnits = Collections.singletonList(coordinator);

    private final Application application = new Application((long) 1, "01/app/2020", applicant, coordinator, "ZA", new Date(), null, new HashSet<>());

    private final Application application1 = new Application((long) 2, "01/app/2020", coordinator, applicant, "ZA", new Date(), null, new HashSet<>());

    private final List<Application> applicants = Collections.singletonList(application);
    private final List<Application> coordinators = Collections.singletonList(application1);

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

    private final User coordinatorUser = new User(
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
            coordinator,
            new HashSet<>(),
            new HashSet<>()
    );

    private final pl.viola.ems.model.common.Dictionary test = new Dictionary("test", "Test", 'U', new HashSet<>());
    private final DictionaryItem item = new DictionaryItem((long) 1, "test", "test item", true, test, new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>());

    private final ApplicationPosition position1 = new ApplicationPosition((long) 1, "Test", (long) 5, item, "ZA", null, null, application);
    private final ApplicationPosition position2 = new ApplicationPosition((long) 2, "Test2", (long) 4, item, "ZA", null, null, application);

    private final List<ApplicationPosition> positions = Arrays.asList(position1, position2);

    @BeforeEach
    void setUp() {
        application.setPositions(new HashSet<>(Arrays.asList(position1, position2)));
        List<OrganizationUnit> childes = Collections.singletonList(child);
        List<OrganizationUnit> childesCoor = new ArrayList<>();

        Mockito.when(organizationUnitService.findByParent("uck")).thenReturn(childes);
        Mockito.when(organizationUnitService.findByParent("coor")).thenReturn(childesCoor);
        Mockito.when(organizationUnitService.findCoordinatorByCode("coor")).thenReturn(Optional.of(coordinator));
        Mockito.when(applicationRepository.findByApplicantIn(organizationUnits)).thenReturn(applicants);
        Mockito.when(applicationRepository.findById((long) 1)).thenReturn(Optional.of(application));
        Mockito.when(applicationRepository.findByCoordinatorIn(coordinatorUnits)).thenReturn(coordinators);
        Mockito.when(applicationPositionRepository.findByApplication(Optional.of(application))).thenReturn(positions);
        Mockito.when(applicationRepository.generateApplicationNumber("uck")).thenReturn("01/app/2020");
        Mockito.when(applicationRepository.save(application)).thenReturn(application);
        Mockito.when(applicationRepository.existsById((long) 1)).thenReturn(true);
    }

    @Test
    void findByApplicant() {


        List<Application> applications = applicationService.findByApplicant(user);

        assertThat(applications).isNotEmpty();
        assertThat(applications.size()).isGreaterThanOrEqualTo(1);
        assertThat(applications.get(0)).isEqualTo(application);
        assertThat(applications.get(0)).isNotEqualTo(application1);
    }

    @Test
    void findByCoordinator() {

        Application test = new Application((long) 2, "01/app/2020", coordinator, applicant, "ZA", new Date(), null, new HashSet<>());

        List<Application> applications = applicationService.findByCoordinator(coordinatorUser);

        assertThat(applications).isNotEmpty();
        assertThat(applications.size()).isGreaterThanOrEqualTo(1);
        assertThat(applications.get(0)).isEqualTo(test);
        assertThat(applications.get(0)).isNotEqualTo(application);

    }

    @Test
    void findByCoordinatorNotFoundException() {

        thrown = assertThrows(AppException.class, () -> applicationService.findByCoordinator(user));
        assertEquals("Koordynator nie istnieje.", thrown.getMessage());
    }

    @Test
    void findPositionsByApplication() {
        List<ApplicationPosition> positions = applicationService.findPositionsByApplication(application.getId());
        assertThat(positions).isNotEmpty();
        assertThat(positions.size()).isGreaterThanOrEqualTo(1);
        assertThat(positions.get(0)).isEqualTo(position1);
    }

    @Test
    void saveApplicationAdd() {
        Application appl = new Application((long) 1, null, applicant, coordinator, "ZA", new Date(), null, new HashSet<>());
        Application newAppl = applicationService.saveApplication(appl, "add", user);
        verify(applicationRepository, times(1)).save(application);
        assertThat(newAppl.getNumber()).isEqualTo("01/app/2020");
    }

    @Test
    void saveApplicationInvalidActionException() {

        thrown = assertThrows(AppException.class, () -> applicationService.saveApplication(application, "diff", user));

        assertEquals("Nieprawidłowa akcja podczas zapisywania aplikacji. Dozwolone działania to „add” lub „edit”.", thrown.getMessage());
    }

    @Test
    void saveApplicationEdit() {
        Application editedApplication = applicationService.saveApplication(application, "edit", user);
        verify(applicationRepository, times(1)).save(application);
        verify(applicationPositionRepository, times(1)).deleteAll(positions);
        assertThat(editedApplication).isEqualTo(application);
    }

    @Test
    void updateApplicationStatusInvalidStatusException() {
        thrown = assertThrows(AppException.class, () -> this.applicationService.updateApplicationStatus((long) 1, "TEST"));

        assertEquals(messageSource.getMessage("Applicant.application.invalidStatus", null, Locale.getDefault()), thrown.getMessage());
    }

    @Test
    void updateApplicationStatus() {
        Application application = new Application((long) 1, "01/app/2020", applicant, coordinator, "WY", new Date(), null, new HashSet<>());

        Application updated = applicationService.updateApplicationStatus((long) 1, "WY");

        verify(applicationRepository, times(1)).save(updated);
        assertThat(application.getStatus()).isEqualTo(updated.getStatus());
    }

    @Test
    void updateApplicationStatusApplicationNotFoundException() {
        thrown = assertThrows(AppException.class, () -> this.applicationService.updateApplicationStatus((long) 2, "WY"));

        assertEquals(messageSource.getMessage("Applicant.application.notFound", null, Locale.getDefault()), thrown.getMessage());
    }

    @Test
    void deleteApplication() {
        String msg = applicationService.deleteApplication((long) 1);

        verify(applicationRepository, times(1)).deleteById((long) 1);
        assertThat(msg).isEqualTo(messageSource.getMessage("Applicant.application.deleteMsg", null, Locale.getDefault()));
    }

    @Test
    void deleteApplicationNotFoundException() {
        thrown = assertThrows(AppException.class, () -> this.applicationService.deleteApplication((long) 2));

        assertEquals(messageSource.getMessage("Applicant.application.notFound", null, Locale.getDefault()), thrown.getMessage());

    }
}
