package pl.viola.ems.controller.modules.administrator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.security.AcPrivilege;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.api.UserDetails;
import pl.viola.ems.payload.auth.UserSummary;
import pl.viola.ems.security.CurrentUser;
import pl.viola.ems.security.impl.UserPrincipal;
import pl.viola.ems.service.modules.administrator.UserService;
import pl.viola.ems.service.security.AcPermissionService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    private AcPermissionService acPermissionService;

    @GetMapping("/user")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        return new UserSummary(
                currentUser.getId(),
                currentUser.getName(),
                currentUser.getSurname(),
                currentUser.getUsername()
        );
    }

    @GetMapping("getAll")
    public ApiResponse getAllUsers(){
        return new ApiResponse(HttpStatus.ACCEPTED, userService.findAll());
    }

    @GetMapping("/getUser/{id}")
    public ApiResponse getUserById(@PathVariable Long id){
        return new ApiResponse(HttpStatus.ACCEPTED, userService.findById(id));
    }

    @GetMapping("/{groupCode}/getUsers")
    public ApiResponse getAllUsersByGroups(@PathVariable String groupCode){
        return new ApiResponse(HttpStatus.FOUND, userService.findUsersByGroup(groupCode));
    }

    @GetMapping("/{username}/{acObject}/getPermissions")
    public ApiResponse getUserObjectPermission(@PathVariable String username, @PathVariable Long acObject){
        return new ApiResponse(HttpStatus.ACCEPTED, acPermissionService.findByUserAndAcObject(username, acObject));
    }

    @PutMapping("/{username}/saveGroups")
    public ApiResponse saveGroupUsers(@RequestBody @Valid List<Group> groups, @PathVariable String username){
        userService.saveUserGroups(groups, username);
        return new ApiResponse(HttpStatus.CREATED, groups);
    }
    @Transactional
    @PutMapping("saveUser")
    public ApiResponse saveUser(@Valid @RequestBody UserDetails user){
        userService.saveUser(user);
        return new ApiResponse(HttpStatus.CREATED, user);
    }

    @PutMapping("/{username}/{acObjectId}/savePermission")
    public ApiResponse saveGroupPermissions(@RequestBody @Valid List<AcPrivilege> privileges, @PathVariable String username, @PathVariable Long acObjectId){
        userService.saveUserPermissions(privileges, username, acObjectId);
        return new ApiResponse(HttpStatus.CREATED, privileges);
    }

    @Transactional
    @DeleteMapping("/deleteUser/{code}")
    public ApiResponse deleteUser(@PathVariable Long code){
        return new ApiResponse(HttpStatus.ACCEPTED, userService.deleteUserById(code));
    }

}
