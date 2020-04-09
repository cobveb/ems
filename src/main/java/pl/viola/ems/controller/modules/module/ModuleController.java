package pl.viola.ems.controller.modules.module;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.viola.ems.model.modules.module.Module;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.module.ModuleService;

import java.util.List;


@RestController
@RequestMapping("/api/modules")
public class ModuleController {
	
	@Autowired
	private ModuleService moduleService;
	
	@GetMapping
	public ApiResponse getAllModules() {
		List<Module> modules = moduleService.findAll();
		modules.sort((o1, o2) -> o1.getId().compareTo(o2.getId()));
		return new ApiResponse(HttpStatus.FOUND, modules);
	}

}
