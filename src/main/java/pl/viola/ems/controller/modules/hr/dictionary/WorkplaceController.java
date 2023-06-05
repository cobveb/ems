package pl.viola.ems.controller.modules.hr.dictionary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.hr.dictionary.AbstractPlace;
import pl.viola.ems.model.modules.hr.dictionary.Workplace;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.hr.dictionary.PlaceService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/hr/dict/workplace")
public class WorkplaceController {

    @Autowired
    PlaceService workplaceService;

    @GetMapping("/getAllWorkplaces")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1116')")
    public ApiResponse getWorkplaceAll() {
        return new ApiResponse(HttpStatus.FOUND, workplaceService.getAllPlaces(AbstractPlace.Type.WP));
    }

    @GetMapping("/getActiveWorkplaces")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1116')")
    public ApiResponse getActiveWorkplace() {
        return new ApiResponse(HttpStatus.FOUND, workplaceService.getActivePlaces(AbstractPlace.Type.WP));
    }

    @PutMapping("/saveWorkplace")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2116')")
    public ApiResponse saveWorkplace(@RequestBody @Valid Workplace workplace) {
        return new ApiResponse(HttpStatus.CREATED, workplaceService.savePlace(workplace));
    }

    @DeleteMapping("/{workplaceId}/deleteWorkplace")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3116')")
    public ApiResponse deleteWorkplace(@PathVariable Long workplaceId) {
        return new ApiResponse(HttpStatus.ACCEPTED, workplaceService.deletePlace(workplaceId));
    }
}
