package pl.viola.ems.service.security.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import pl.viola.ems.model.security.AcPrivilege;
import pl.viola.ems.model.security.repository.AcPrivilegeRepository;
import pl.viola.ems.service.security.AcPrivilegeService;

import java.util.HashSet;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class AcPrivilegeServiceImplTest {
    @TestConfiguration
    static class AcPrivilegeServiceImplTestContextConfiguration{

        @Bean
        public AcPrivilegeService acPrivilegeService(){
            return new AcPrivilegeServiceImpl();
        }
    }
    @Autowired
    AcPrivilegeService acPrivilegeService;

    @MockBean
    AcPrivilegeRepository acPrivilegeRepository;

    private final AcPrivilege privilege = new AcPrivilege((long)1, "0001", "Przywilej testowy", new HashSet<>(), new HashSet<>());

    private final AcPrivilege privilege2 = new AcPrivilege((long)1, "0002", "Przywilej testowy 2", new HashSet<>(), new HashSet<>());

    @BeforeEach
    void setUp() {
        Mockito.when(acPrivilegeRepository.findByCode("0001")).thenReturn(privilege);
    }

    @DisplayName("findByCode")
    @Test
    void findByCode() {

        AcPrivilege newPrivilege = new AcPrivilege((long)1, "0001", "Przywilej testowy", new HashSet<>(), new HashSet<>());

        assertThat(newPrivilege).isEqualTo(acPrivilegeService.findByCode("0001"));
        assertThat(newPrivilege).isNotEqualTo(privilege2);

    }
}