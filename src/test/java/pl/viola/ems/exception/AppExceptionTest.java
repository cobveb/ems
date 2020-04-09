package pl.viola.ems.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.*;

class AppExceptionTest {

    @Test
    void appExceptionMessageParam(){
        AppException appException = new AppException(HttpStatus.BAD_REQUEST, "Security.password.incorrectStrength", 1,2,3,4,5 );

        String error = "Nowe hasło nie spełnia wymagań systemowych:\r\n" +
            "- Minimalna liczba małych liter: 1\r\n" +
            "- Minimalna liczba dużych liter: 2\r\n" +
            "- Minimalna liczba cyfr: 3\r\n" +
            "- Minimalna liczba znaków specjalnych: 4\r\n" +
            "- Minimalna ilość znaków: 5";
        assertEquals(error, appException.getMessage());
    }

}