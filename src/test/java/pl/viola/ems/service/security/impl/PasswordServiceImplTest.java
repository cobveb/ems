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
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.*;
import pl.viola.ems.model.modules.administrator.repository.ParameterRepository;
import pl.viola.ems.model.modules.administrator.repository.UserRepository;
import pl.viola.ems.model.security.AcPermission;
import pl.viola.ems.payload.auth.PasswordChangeRequest;
import pl.viola.ems.security.PasswordValidator;
import pl.viola.ems.service.modules.administrator.ParameterService;
import pl.viola.ems.service.security.PasswordService;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
class PasswordServiceImplTest {

    @TestConfiguration
    static class PasswordServiceImplTestContextConfiguration{
        @Bean
        public PasswordService passwordService(){return new PasswordServiceImpl();}
    }

    @Autowired
    private PasswordService passwordService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ParameterService parameterService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private ParameterRepository parameterRepository;

    @MockBean
    private PasswordValidator passwordValidator;

    private OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true);

    private Throwable thrown;

    @BeforeEach
    void Setup(){
        User user = new User(
            (long)0,
            "user",
            passwordEncoder.encode("Passwd123!T"),
            new Date(),
            "User",
            "Test",
            true,
            false,
            false,
            false,
            ou,
            new HashSet<AcPermission>(),
            new HashSet<Group>()
        );

        Mockito.when(userRepository.findByUsername("user")).thenReturn(java.util.Optional.of(user));
        Mockito.when(passwordValidator.validate("NewPass123!")).thenReturn(true);
        Mockito.when(passwordValidator.validate("Passwd123!T")).thenReturn(true);
    }

    @DisplayName("changePassword")
    @Test
    void changePassword() {

        PasswordChangeRequest request = new PasswordChangeRequest("user", "Passwd123!T", "NewPass123!");

        User newUser = new User(
                (long)0,
                "user",
                passwordEncoder.encode(request.getNewPassword()),
                new Date(),
                "User",
                "Test",
                true,
                false,
                false,
                false,
                ou,
                new HashSet<AcPermission>(),
                new HashSet<Group>());

        passwordService.changePassword(request);

        verify(userRepository, times(1)).save(newUser);
    }

    @DisplayName("change password - Exception User not found")
    @Test
    void changePasswordUserNotFoundException(){
        PasswordChangeRequest request = new PasswordChangeRequest("usert", "oldPasswd", "newPasswd");

        thrown = assertThrows(AppException.class, () -> {
            passwordService.changePassword(request);
        });

        assertEquals("Nie znaleziono użytkownika", thrown.getMessage());
    }

    @DisplayName("change password - Exception incorrect old password")
    @Test
    void changePasswordIncorrectOldPasswordException(){
        PasswordChangeRequest request = new PasswordChangeRequest("user", "passwd", "newPasswd");

        thrown = assertThrows(AppException.class, () -> {
            passwordService.changePassword(request);
        });

        assertEquals("Niepoprawne stare hasło", thrown.getMessage());
    }

    @DisplayName("change password - Exception new password equal")
    @Test
    void changePasswordNewPasswordEqualException(){
        PasswordChangeRequest request = new PasswordChangeRequest("user", "Passwd123!T", "Passwd123!T");

        thrown = assertThrows(AppException.class, () -> {
            passwordService.changePassword(request);
        });

        assertEquals("Nowe hasło jest takie same jak stare hasło.", thrown.getMessage());
    }

    @DisplayName("change password - Exception incorrect strength")
    @Test
    void changePasswordNewPasswordIncorrectStrengthException(){
        PasswordChangeRequest request = new PasswordChangeRequest("user", "Passwd123!T", "passwd123!");

        thrown = assertThrows(AppException.class, () -> {
            passwordService.changePassword(request);
        });

        String error = "Nowe hasło nie spełnia wymagań systemowych:\r\n" +
            "- Minimalna liczba małych liter: {0}\r\n" +
            "- Minimalna liczba dużych liter: {1}\r\n" +
            "- Minimalna liczba cyfr: {2}\r\n" +
            "- Minimalna liczba znaków specjalnych: {3}\r\n" +
            "- Minimalna ilość znaków: {4}";

        assertEquals(error, thrown.getMessage());
    }

    @DisplayName("isCredentialExpired")
    @Test
    void isCredentialExpired() {

        Parameter param = new Parameter("passValidPeriod", "N", ParameterCategory.System, "Password", "Okres", "Okres", "1");
        Mockito.when(parameterRepository.findById("passValidPeriod")).thenReturn(java.util.Optional.of(param));
        Date date = new Date();
        LocalDateTime invalidPeriod = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        invalidPeriod = invalidPeriod.minusDays(2);
        Date newDate = Date.from(invalidPeriod.atZone(ZoneId.systemDefault()).toInstant());
        boolean isCredentialExpired = passwordService.isCredentialExpired(newDate);

        assertEquals(true, isCredentialExpired);

        assertEquals(false, passwordService.isCredentialExpired(new Date()));

    }

    @DisplayName("isCredentialExpired - passValidPeriod is null")
    @Test
    void isCredentialExpiredPeriodNull() {

        Parameter param = new Parameter("passValidPeriod", "N", ParameterCategory.System, "Password", "Okres", "Okres", null);
        Mockito.when(parameterRepository.findById("passValidPeriod")).thenReturn(java.util.Optional.of(param));

        assertEquals(false, passwordService.isCredentialExpired(new Date()));

    }
}