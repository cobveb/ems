package pl.viola.ems.controller.modules.administrator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/ou")
public class OrganizationUnitController {
	
	@Autowired
	private OrganizationUnitService organizationUnitService;
	
	@GetMapping("getAll")
	public ApiResponse getAllOrganizationUnits() {

		return new ApiResponse(HttpStatus.FOUND, organizationUnitService.findAll());
	}

	@GetMapping("getActive")
	public ApiResponse getActiveOrganizationUnits() {

		return new ApiResponse(HttpStatus.FOUND, organizationUnitService.findActive());
	}

	@GetMapping("getMainOu")
	public ApiResponse getMainOrganizationUnit(){

		return new ApiResponse(HttpStatus.FOUND, organizationUnitService.findMainOu());
	}

	@GetMapping("/getOu/{code}")
	public ApiResponse getOrganizationUnit(@PathVariable String code){
		return new ApiResponse(HttpStatus.FOUND, organizationUnitService.findById(code));
	}

	@GetMapping("getCoordinators")
	public ApiResponse getCoordinator(){

		return new ApiResponse(HttpStatus.FOUND, organizationUnitService.findCoordinators());
	}

	@PutMapping("/{action}")
	public ApiResponse saveOrganizationUnit(@Valid @RequestBody OrganizationUnit ou, @PathVariable String action){
		return new ApiResponse(HttpStatus.CREATED, organizationUnitService.saveOu(action, ou));
	}

	@DeleteMapping("/deleteOu/{code}")
	public ApiResponse deleteOrganizationUnit(@PathVariable String code){
		return  new ApiResponse(HttpStatus.ACCEPTED, organizationUnitService.deleteById(code));
	}
}
