package pl.viola.ems.service.security.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.security.AcObject;
import pl.viola.ems.model.security.AcPermission;
import pl.viola.ems.model.security.AcPrivilege;
import pl.viola.ems.model.security.repository.AcPermissionRepository;
import pl.viola.ems.payload.security.AcPermissionDetails;
import pl.viola.ems.service.modules.administrator.GroupService;
import pl.viola.ems.service.modules.administrator.UserService;
import pl.viola.ems.service.security.AcObjectService;
import pl.viola.ems.service.security.AcPermissionService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AcPermissionServiceImpl implements AcPermissionService {

    @Autowired
    private AcPermissionRepository acPermissionRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private AcObjectService acObjectService;

    private AcPermissionDetails acPermissionDetails;
    private AcPermission acPermission;
    private List<AcPermissionDetails> acPermissions;


    @Override
    public List<AcPermissionDetails> findByUserAndAcObject(final String username, final Long acObject) {
        acPermissions = new ArrayList<AcPermissionDetails>();

        User user = userService.findByUsername(username)
                .orElseThrow(() ->  new AppException("Administrator.user.notFound", HttpStatus.BAD_REQUEST));

        Optional<AcObject> acObject1 = Optional.ofNullable(acObjectService.findById(acObject)
                .orElseThrow(() -> new AppException("Administrator.accessControl.AcObjectNotFound", HttpStatus.BAD_REQUEST)));

        acPermissionRepository.findByUserAndAcObject(user, acObject1.get()).forEach((permission) -> {
            acPermissionDetails= new AcPermissionDetails(
                    permission.getAcPrivilege().getId(),
                    permission.getAcPrivilege().getCode(),
                    permission.getAcPrivilege().getName()
            );
            acPermissions.add(acPermissionDetails);
        });

        return acPermissions;
    }

    @Override
    public List<AcPermissionDetails> findByGroupAndAcObject(final String groupCode, final Long acObject) {
        acPermissions = new ArrayList<AcPermissionDetails>();

        Group group = groupService.findGroupByCode(groupCode)
                .orElseThrow(() -> new AppException("Administrator.group.notFound", HttpStatus.BAD_REQUEST));

        Optional<AcObject> acObject1 = Optional.ofNullable(acObjectService.findById(acObject)
                .orElseThrow(() -> new AppException("Administrator.accessControl.AcObjectNotFound", HttpStatus.BAD_REQUEST)));

        acPermissionRepository.findByGroupAndAcObject(group, acObject1.get()).forEach((permission) -> {

            acPermissionDetails= new AcPermissionDetails(
                    permission.getAcPrivilege().getId(),
                    permission.getAcPrivilege().getCode(),
                    permission.getAcPrivilege().getName()
            );

            acPermissions.add(acPermissionDetails);
        });
        return acPermissions;
    }

    @Override
    @Transactional
    public void saveObjectPermission(final List<AcPrivilege> privileges, final Object domainObject, final Long acObjectId) {

        Optional<AcObject> acObject = Optional.ofNullable(acObjectService.findById(acObjectId)
                .orElseThrow(() -> new AppException("Administrator.accessControl.AcObjectNotFound", HttpStatus.BAD_REQUEST)));

        saveAcObjectPermissions(privileges, domainObject, acObject.get());
    }


    private void saveAcObjectPermissions(List<AcPrivilege> privileges, Object domainObject, AcObject acObject){
        Set<AcPermission> domainObjectPermissions;
        if(domainObject instanceof Group){
            domainObjectPermissions = ((Group) domainObject).getAcPermissions();
        } else if (domainObject instanceof User){
            domainObjectPermissions = ((User) domainObject).getAcPermissions();
        } else {
            throw new AppException("Administrator.permission.saveObjectPermissions", HttpStatus.BAD_REQUEST);
        }

        domainObjectPermissions.removeIf((AcPermission permission) -> !permission.getAcObject().equals(acObject));
        acPermissionRepository.deleteInBatch(domainObjectPermissions);
        domainObjectPermissions.clear();
        privileges.forEach(privilege -> {
            acPermission = new AcPermission();
            acPermission.setAcObject(acObject);
            acPermission.setAcPrivilege(privilege);
            if(domainObject instanceof Group){
                acPermission.setGroup(((Group) domainObject));
            } else if (domainObject instanceof User){
                acPermission.setUser(((User) domainObject));
            }
            domainObjectPermissions.add(acPermission);
        });

        acPermissionRepository.saveAll(domainObjectPermissions);
    }
}
