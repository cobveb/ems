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
import pl.viola.ems.model.modules.administrator.Parameter;
import pl.viola.ems.model.modules.administrator.ParameterCategory;
import pl.viola.ems.model.modules.administrator.repository.ParameterRepository;
import pl.viola.ems.service.modules.administrator.ParameterService;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
class ParameterServiceImplTest {

    @TestConfiguration
    static class ParameterServiceImplTestContextConfiguration{

        @Bean
        public ParameterService parameterService(){
            return new ParameterServiceImpl();
        }
    }

    @Autowired
    ParameterService parameterService;

    @MockBean
    ParameterRepository parameterRepository;

    private List<Parameter> parameters ;

    private List<String> params;

    private Throwable thrown;

    @BeforeEach
    void Setup(){
        Parameter dig = new Parameter("dig", "N", ParameterCategory.System, "Passwd", "Digits", "Digits");
        Parameter upper = new Parameter("upper", "N", ParameterCategory.System, "Passwd", "Upper", "Upper", "1");
        Parameter spec = new Parameter("spec", "N", ParameterCategory.System, "Passwd", "Spec", "Spec");
        parameters = Arrays.asList(dig, upper, spec);

        params = Arrays.asList("dig", "upper", "spec");

        Mockito.when(parameterRepository.findByCodeIn(params)).thenReturn(parameters);
        Mockito.when(parameterRepository.findAll()).thenReturn(parameters);
        Mockito.when(parameterRepository.findByCategory(ParameterCategory.System)).thenReturn(parameters);
        Mockito.when(parameterRepository.findById("dig")).thenReturn(java.util.Optional.of(dig));
    }

    @DisplayName("findByCodeIn")
    @Test
    void findByCodeIn() {
        Parameter param = new Parameter("upper", "N", ParameterCategory.System, "Passwd", "Upper", "Upper", "1");
        List<Parameter> byCodeIn = parameterService.findByCodeIn(params);

        assertThat(byCodeIn).isNotEmpty();
        assertEquals(byCodeIn.size(),3);
        assertEquals(byCodeIn.indexOf(param),1);
        assertNotEquals(byCodeIn.get(2), param.getCode());

    }

    @DisplayName("findById")
    @Test
    void findById() {
        Optional<Parameter> param = parameterService.findById("dig");

        assertNotNull(param.get());
        assertEquals(param.get(), new Parameter("dig", "N", ParameterCategory.System, "Passwd", "Digits", "Digits"));
        assertNotEquals(param.get().getName(), "Test");
    }
    @DisplayName("findByCategory")
    @Test
    void findByCategory() {
        Parameter param = new Parameter("upper", "N", ParameterCategory.System, "Passwd", "Upper", "Upper", "1");
        List<Parameter> byCategory = parameterService.findByCategory(ParameterCategory.System);

        assertThat(byCategory).isNotEmpty();
        assertEquals(byCategory.indexOf(param),1);
        assertNotEquals(byCategory.get(2).getCode(), param.getCode());
    }


    @DisplayName("findById - Exception parameter not found")
    @Test
    void findByIdException() {

        thrown = assertThrows(AppException.class, () -> {
            Optional<Parameter> param = parameterService.findById("notFound");
        });

        assertEquals("Nie znaleziono paramteru", thrown.getMessage());
    }

    @DisplayName("findAll")
    @Test
    void findAll(){
        List<Parameter> all = parameterService.findAll();
        assertThat(all).isNotEmpty();
        assertThat(all.size()).isGreaterThan(0);
        assertEquals(all.get(2).getCode(), "spec");
    }

    @DisplayName("save")
    @Test
    void save() {

        Parameter param = new Parameter("param", "N", ParameterCategory.System, "Passwd", "Digits", "Digits");

        parameterService.save(param);

        verify(parameterRepository, times(1)).save(param);
    }
    @DisplayName("findAllCategory")
    @Test
    void findAllCategory() {
        ParameterCategory category = ParameterCategory.System;
        List<ParameterCategory> categories = parameterService.findAllCategory();

        assertThat(categories).isNotEmpty();
        assertEquals(categories.get(0), category);
        assertNotEquals(categories.get(0).name(), "Test");
    }

}