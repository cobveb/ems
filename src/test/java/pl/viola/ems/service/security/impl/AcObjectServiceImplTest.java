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
import pl.viola.ems.model.security.AcObject;
import pl.viola.ems.model.security.AcPermission;
import pl.viola.ems.model.security.AcPrivilege;
import pl.viola.ems.model.security.repository.AcObjectRepository;
import pl.viola.ems.service.security.AcObjectService;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class AcObjectServiceImplTest {

    @TestConfiguration
    static class AcObjectServiceImplTestContextConfiguration{

        @Bean
        public AcObjectService acObjectService(){
            return new AcObjectServiceImpl();
        }
    }

    @Autowired
    private AcObjectService acObjectService;

    @MockBean
    private AcObjectRepository acObjectRepository;

    private AcObject acObjectKsie = new AcObject((long)1, (long)1, "Moduł Księgowy", "MODULE", new HashSet<AcPermission>(), new HashSet<AcPrivilege>());
    private AcObject acObjectKoor = new AcObject((long)2, (long)2, "Moduł Koordynator", "MODULE", new HashSet<AcPermission>(), new HashSet<AcPrivilege>());

    @BeforeEach
    void setUp() {

        List<AcObject> allAcObjects = Arrays.asList(acObjectKsie, acObjectKoor);

        Mockito.when(acObjectRepository.findAll()).thenReturn(allAcObjects);
        Mockito.when(acObjectRepository.findById((long)2)).thenReturn(java.util.Optional.ofNullable(acObjectKoor));

    }

    @DisplayName("Service - findAll")
    @Test
    void findAll() {
        List<AcObject> all = acObjectService.findAll();

        assertThat(all).isNotEmpty();
        assertThat(all.size()).isGreaterThanOrEqualTo(1);
        assertThat(all.get(1)).isEqualTo(acObjectKoor);
    }

    @DisplayName("Service - findById")
    @Test
    void findById(){
        Optional<AcObject> acObject = acObjectService.findById((long)2);

        assertThat(acObject).isNotNull();
        assertThat(acObject.get()).isEqualTo(acObjectKoor);

    }


}