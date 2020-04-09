package pl.viola.ems.security.impl;

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
import pl.viola.ems.security.PasswordValidator;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
class PasswordValidatorImplTest {

    @TestConfiguration
    static class PasswordValidatorImplTestContextConfiguration{
        @Bean
        public PasswordValidator passwordValidator(){return new PasswordValidatorImpl();}
    }

    @Autowired
    PasswordValidator passwordValidator;

    @MockBean
    private ParameterRepository parameterRepository;

    private List<String> validPassword;
    private List<String> invalidPassword;

    private Throwable thrown;

    @BeforeEach
    void setUp() {

        Parameter minDigits = new Parameter("minDigits", "N", ParameterCategory.System, "Password", "minDigits", "minDigits", null);
        Parameter minLowercase = new Parameter("minLowercase", "N", ParameterCategory.System, "Password", "minLowercase", "minLowercase", "1");
        Parameter minUppercase = new Parameter("minUppercase", "N", ParameterCategory.System, "Password", "minUppercase", "minUppercase", "1");
        Parameter minSpecialChar = new Parameter("minSpecialChar", "N", ParameterCategory.System, "Password", "minSpecialChar", "minSpecialChar", "2");
        Parameter minCharLength = new Parameter("minCharLength", "N", ParameterCategory.System, "Password", "minCharLength", "minCharLength", null);
        Parameter test = new Parameter("test", "N", ParameterCategory.System, "Password", "test", "test", "1");

        List<Parameter> passwordParams = Arrays.asList(minDigits, minLowercase, minUppercase, minSpecialChar, minCharLength, test);
        Mockito.when(parameterRepository.findByCodeIn(Arrays.asList("minDigits","minLowercase","minUppercase", "minSpecialChar", "minCharLength"))).thenReturn(passwordParams);

        validPassword = Arrays.asList("T@st123!", "T@st1234@");
        invalidPassword = Arrays.asList("test12A", "testowehaslo", "test123!", "Test1234", "Testowe!");
    }

    @DisplayName("Security - Password Validator - Valid Password")
    @Test
    public void ValidPassword(){

        validPassword.forEach(password->{
            assertEquals(true, passwordValidator.validate(password));
        });
    }

    @DisplayName("Security - Password Validator - Invalid Password")
    @Test
    public void InvalidPassword(){
        String error = "Nowe hasło nie spełnia wymagań systemowych:\r\n" +
                "- Minimalna liczba małych liter: 1\r\n" +
                "- Minimalna liczba dużych liter: 1\r\n" +
                "- Minimalna liczba cyfr: 1\r\n" +
                "- Minimalna liczba znaków specjalnych: 2\r\n" +
                "- Minimalna ilość znaków: 8";

        invalidPassword.forEach(password->{
            thrown = assertThrows(AppException.class, () -> {
                 passwordValidator.validate(password);
            });

            assertEquals(error, thrown.getMessage());
        });
    }

}