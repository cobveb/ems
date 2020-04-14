package pl.viola.ems.controller.modules.administrator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.security.AcPrivilege;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.api.UserDetails;
import pl.viola.ems.service.modules.administrator.GroupService;
import pl.viola.ems.service.security.AcPermissionService;

import javax.validation.Valid;
import java.util.List;
@Validated
@RestController
@RequestMapping("/api/usersGroups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @Autowired
    private AcPermissionService acPermissionService;

    @GetMapping("getAll")
    public ApiResponse getAllUsersGroups(){
        return new ApiResponse(HttpStatus.FOUND, groupService.findAllGroups());
    }

    @GetMapping("/{username}")
    public ApiResponse getGroupsByUser(@PathVariable String username){
        return new ApiResponse(HttpStatus.FOUND, groupService.findGroupsByUser(username));
    }

    @GetMapping("/{group}/{acObject}/getPermissions")
    public ApiResponse getGroupObjectPermission(@PathVariable String group, @PathVariable Long acObject){
        return new ApiResponse(HttpStatus.ACCEPTED, acPermissionService.findByGroupAndAcObject(group, acObject));
    }

    @PutMapping("saveGroupBasic")
    public ApiResponse saveGroupBasic(@Valid @RequestBody Group group){
        System.out.println(group);
        groupService.saveGroup(group);
        return new ApiResponse(HttpStatus.CREATED, group);
    }

    @PutMapping("/{groupCode}/saveGroupUsers")
    public ApiResponse saveGroupUsers(@RequestBody @Valid List<UserDetails> users, @PathVariable String groupCode){
        groupService.saveGroupUsers(users, groupCode);
        return new ApiResponse(HttpStatus.CREATED, users);
    }

    @PutMapping("/{groupCode}/{acObjectId}/savePermission")
    public ApiResponse saveGroupPermissions(@RequestBody @Valid List<AcPrivilege> privileges, @PathVariable String groupCode, @PathVariable Long acObjectId){
        groupService.saveGroupPermissions(privileges, groupCode, acObjectId);
        return new ApiResponse(HttpStatus.CREATED, privileges);
    }

    @DeleteMapping("/deleteGroup/{groupCode}")
    public ApiResponse deleteGroup(@PathVariable String groupCode){
        return new ApiResponse(HttpStatus.ACCEPTED, groupService.deleteGroup(groupCode));
    }

}
