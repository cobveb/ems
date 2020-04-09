package pl.viola.ems.payload.api;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
public class ApiResponse {

    private HttpStatus status;
    private Object data;

}
