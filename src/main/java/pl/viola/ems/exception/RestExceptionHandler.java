package pl.viola.ems.exception;

import org.hibernate.JDBCException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.List;
import java.util.MissingResourceException;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(AppException.class)
    public final ResponseEntity<ErrorDetails> handleAppException(AppException ex, WebRequest request){
        ErrorDetails errorDetails = new ErrorDetails(ex.getStatus(), ex.getMessage(), ex, request.getDescription(false));
        return new ResponseEntity<>(errorDetails, errorDetails.getStatus());
    }

    @Override
    public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        String message = "";
        BindingResult result = ex.getBindingResult();
        List<FieldError> errors = result.getFieldErrors();
        for (FieldError error : errors ) {
            message+=error.getField() + ": " + error.getDefaultMessage() + System.lineSeparator();
        }
        ErrorDetails errorDetails = new ErrorDetails(HttpStatus.BAD_REQUEST, message, request.getDescription(false));
        return new ResponseEntity<>(errorDetails, errorDetails.getStatus());
    }

    @ExceptionHandler(EmptyResultDataAccessException.class)
    protected ResponseEntity<Object> handleEmptyResultDataAccessException(EmptyResultDataAccessException ex,  WebRequest request){
        String error = "No entity found";
        ErrorDetails errorDetails = new ErrorDetails(HttpStatus.BAD_REQUEST, error, ex, request.getDescription(false));
        return new ResponseEntity<>(errorDetails, errorDetails.getStatus());
    }

    @Override
    protected  ResponseEntity<Object> handleNoHandlerFoundException(NoHandlerFoundException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        String error = "No handler found";
        ErrorDetails errorDetails = new ErrorDetails(HttpStatus.BAD_REQUEST, error, ex, request.getDescription(false));
        return new ResponseEntity<>(errorDetails, errorDetails.getStatus());
    }

    @ExceptionHandler(MissingResourceException.class)
    public final ResponseEntity<ErrorDetails> handleOrganizationUnitsNotFoundException(MissingResourceException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(HttpStatus.NOT_FOUND, ex.getMessage(), ex, request.getDescription(false));
        return new ResponseEntity<>(errorDetails, errorDetails.getStatus());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public final ResponseEntity<ErrorDetails> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(HttpStatus.BAD_REQUEST, ex.getMessage(), ex, request.getDescription(false));
        return new ResponseEntity<>(errorDetails, errorDetails.getStatus());
    }

    @ExceptionHandler(JDBCException.class)
    public final ResponseEntity<ErrorDetails> handleOracleDatabaseException(JDBCException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(HttpStatus.BAD_REQUEST, ex.getMessage(), ex, request.getDescription(false));
        return new ResponseEntity<>(errorDetails, errorDetails.getStatus());
    }
}
