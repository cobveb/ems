package pl.viola.ems.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.security.AcObjectService;

@RestController
@RequestMapping("/api/ac/objects")
public class AcObjectController {

    @Autowired
    private AcObjectService acObjectService;

    @GetMapping("getAll")
    public ApiResponse getAllAcObjects(){
        return new ApiResponse(HttpStatus.FOUND, acObjectService.findAll());
    }
}
