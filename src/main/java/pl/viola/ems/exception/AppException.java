package pl.viola.ems.exception;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.text.MessageFormat;
import java.util.ResourceBundle;

@Data
public class AppException extends RuntimeException {
	
	private static final long serialVersionUID = -5056098946249161494L;
	private HttpStatus status;
	private Throwable throwable;
    private static final ResourceBundle bundle = ResourceBundle.getBundle("messages");

	public AppException(String message, HttpStatus status) {
        super(bundle.getString(message));
        this.status = status;
        this.throwable = new Throwable(bundle.getString(message));
    }

    public AppException(HttpStatus status, String pattern, Object... params){
	    super(MessageFormat.format(bundle.getString(pattern), params));
	    this.status = status;
        this.throwable = new Throwable(MessageFormat.format(bundle.getString(pattern), params));
    }

}
