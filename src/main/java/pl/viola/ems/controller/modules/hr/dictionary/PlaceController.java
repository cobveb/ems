package pl.viola.ems.controller.modules.hr.dictionary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.hr.dictionary.AbstractPlace;
import pl.viola.ems.model.modules.hr.dictionary.Place;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.hr.dictionary.PlaceService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/hr/dict/place")
public class PlaceController {

    @Autowired
    PlaceService placeService;

    @GetMapping("/getAll")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1116')")
    public ApiResponse getPlaceAll() {
        return new ApiResponse(HttpStatus.FOUND, placeService.getAllPlaces(AbstractPlace.Type.PL));
    }

    @GetMapping("/getActivePlaces")
    @PreAuthorize("hasGroup('admin') or hasAnyPrivilege('1116', '1128')")
    public ApiResponse getActivePlace() {
        return new ApiResponse(HttpStatus.FOUND, placeService.getActivePlaces(AbstractPlace.Type.PL));
    }

    @PutMapping("/savePlace")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2116')")
    public ApiResponse savePlace(@RequestBody @Valid Place place) {
        return new ApiResponse(HttpStatus.CREATED, placeService.savePlace(place));
    }

    @DeleteMapping("/deletePlace/{placeId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3116')")
    public ApiResponse deletePlace(@PathVariable Long placeId) {
        return new ApiResponse(HttpStatus.ACCEPTED, placeService.deletePlace(placeId));
    }
}
