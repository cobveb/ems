package pl.viola.ems.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import pl.viola.ems.exception.ErrorDetails;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
/**
 * The class responsible for handling Spring Security access denied exception.
 *
 * @author Grzegorz Viola (qweb)
 * @version 1.0
 * @since 2019-04-13
 */
@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    public void handle
            (HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDenied)
            throws IOException, ServletException {
        ErrorDetails errorDetails = new ErrorDetails(HttpStatus.FORBIDDEN, accessDenied.getMessage(),
                accessDenied, request.getRequestURI());
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        OutputStream out = response.getOutputStream();
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(out, errorDetails);
        out.flush();
    }
}
