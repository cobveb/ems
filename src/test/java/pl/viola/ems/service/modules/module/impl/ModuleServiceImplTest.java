package pl.viola.ems.service.modules.module.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.test.context.support.WithUserDetails;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.module.Module;
import pl.viola.ems.model.modules.module.repository.ModuleRepository;
import pl.viola.ems.service.modules.module.ModuleService;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
public class ModuleServiceImplTest {


    @TestConfiguration
    static class ModuleServiceImplTestContextConfiguration {

        @Bean
        public ModuleService moduleService(){
            return new ModuleServiceImpl();
        }
    }

    @Autowired
    private ModuleService moduleService;

    @MockBean
    private ModuleRepository moduleRepository;

    private Throwable thrown;

    @BeforeEach
    void setUp() {
        Module admin = new Module((long) 0,"adm", "Administrator");
        Module accountant = new Module((long) 1,"account", "Accountatnt");
        Module coordinator = new Module((long) 2,"coordinator", "Koordynator");

        //List<Module> modules = Arrays.asList(admin, accountant);
        List<Module> modules = new ArrayList<Module>();
        modules.add(admin);
        modules.add(accountant);
        modules.add(coordinator);
        Mockito.when(moduleRepository.findAll()).thenReturn(modules);

    }

    @WithUserDetails(value="user", userDetailsServiceBeanName="customUserDetailsServiceImpl")
    @DisplayName("findAll")
    @Test
    void findAll(){

        List<Module> all = moduleService.findAll();

        assertThat(all).isNotNull();
        assertThat(all.size()).isGreaterThanOrEqualTo(1);
        assertEquals(new Module((long) 2,"coordinator", "Koordynator"), all.get(2));
    }

    @WithUserDetails(value="user", userDetailsServiceBeanName="customUserDetailsServiceImpl")
    @DisplayName("findAll - Exception")
    @Test
    void findAllNotFoundException(){
        List<Module> findAll = new ArrayList<Module>();

        Mockito.when(moduleRepository.findAll()).thenReturn(findAll);
        thrown = assertThrows(AppException.class, () -> {
            moduleService.findAll();
        });

        assertEquals("Nie znaleziono modułów aplikacji", thrown.getMessage());
    }
}