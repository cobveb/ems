package pl.viola.ems.model.modules.administrator.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.TestPropertySource;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;

import java.util.HashSet;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@TestPropertySource(properties={"spring.jpa.hibernate.ddl-auto=create"})
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class OrganizationUnitRepositoryTest {
    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private OrganizationUnitRepository organizationUnitRepository;

    @DisplayName("Test Organization Units - Repository - findMainOu")
    @Test
    public void findMainOu(){
        OrganizationUnit ou = new OrganizationUnit(
                "uck",
                "UCK",
                "UCK",
                null,
                "1234567891",
                "123456789",
                "Katowice",
                "40 - 514",
                "Ceglana",
                "35",
                "+48 (32) 123 12 12",
                "+48 (32) 123 12 12",
                "uck@uck.katowice.pl",
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
        entityManager.persist(ou);
        OrganizationUnit it = new OrganizationUnit(
                "it",
                "IT",
                "It",
                "it@uck.katowice.pl",
                true,
                null,
                "uck"
        );
        entityManager.persist(it);
        entityManager.flush();

        OrganizationUnit mainOu = organizationUnitRepository.findMainOu();

        assertThat(mainOu).isNotNull();
        assertThat(mainOu).isEqualTo(new OrganizationUnit("uck",
                "UCK",
                "UCK",
                null,
                "1234567891",
                "123456789",
                "Katowice",
                "40 - 514",
                "Ceglana",
                "35",
                "+48 (32) 123 12 12",
                "+48 (32) 123 12 12",
                "uck@uck.katowice.pl",
                true,
                null,
                null,
                new HashSet<>(),
                new HashSet<>(),
                new HashSet<>(),
                new HashSet<>(),
                new HashSet<>(),
                new HashSet<>()
        ));
    }
}