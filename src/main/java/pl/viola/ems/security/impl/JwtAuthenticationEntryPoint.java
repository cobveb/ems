package pl.viola.ems.security.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import pl.viola.ems.exception.ErrorDetails;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;

/**
 * The class responsible for handling Spring Security authorization exception.
 *
 * @author Grzegorz Viola (qweb)
 * @version 1.0
 * @since 2019-04-13
 */

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

	public void commence(HttpServletRequest request, HttpServletResponse response,
						 AuthenticationException authException) throws IOException {
		ErrorDetails errorDetails = new ErrorDetails(HttpStatus.UNAUTHORIZED, authException.getMessage(),
				authException, request.getRequestURI());
		//TODO: return when path unauthorized
//		response.sendRedirect("/");
		//TODO: Return if token expire
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		response.setContentType("application/json");
		OutputStream out = response.getOutputStream();
		ObjectMapper mapper = new ObjectMapper();
		mapper.writeValue(out, errorDetails);
		out.flush();
	}
}
