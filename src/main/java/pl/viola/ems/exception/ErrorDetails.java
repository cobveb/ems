package pl.viola.ems.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.util.Date;

@Data
public class ErrorDetails {
    private HttpStatus status;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
    private Date timestamp = new Date();
    private String message;
    private String debugMessage;
    private String path;

    public ErrorDetails(HttpStatus status, String message, Throwable ex, String path) {
        super();
        this.status = status;
        this.message = message;
        this.debugMessage = ex.getLocalizedMessage();
        this.path = path.substring(path.lastIndexOf("=") + 1);
    }

    public ErrorDetails(HttpStatus status, String message, String path) {
        super();
        this.status = status;
        this.message = message;
        this.debugMessage = message;
        this.path = path.substring(path.lastIndexOf("=") + 1);
    }
}
