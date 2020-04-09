package pl.viola.ems.controller.modules.administrator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.administrator.Parameter;
import pl.viola.ems.model.modules.administrator.ParameterCategory;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.administrator.ParameterService;

import javax.validation.Valid;
import java.util.ResourceBundle;

@RestController
@RequestMapping("/api/param")
public class ParameterController {

    private static final ResourceBundle bundle = ResourceBundle.getBundle("messages");

    @Autowired
    ParameterService parameterService;

    @GetMapping("getAll")
    public ApiResponse getAllParameters(){
        return new ApiResponse(HttpStatus.FOUND, parameterService.findAll());
    }

    @GetMapping("getParams/{category}")
    public ApiResponse getParameterByCategory(@PathVariable ParameterCategory category){
        return new ApiResponse(HttpStatus.FOUND, parameterService.findByCategory(category));
    }

    @GetMapping("getParam/{code}")
    public ApiResponse getParameterById(@PathVariable String code){
        return new ApiResponse(HttpStatus.FOUND, parameterService.findById(code));
    }

    @PutMapping("save")
    public ApiResponse saveParameter(@Valid @RequestBody Parameter parameter){
        parameterService.save(parameter);
        return new ApiResponse(HttpStatus.OK, bundle.getString("Administrator.parameter.changed"));
    }

    @GetMapping("getCategories")
    public ApiResponse getAllParameterCategory(){
        return new ApiResponse(HttpStatus.FOUND, parameterService.findAllCategory());
    }
}
