package pl.viola.ems.service.modules.administrator.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.administrator.repository.GroupRepository;
import pl.viola.ems.model.security.AcPrivilege;
import pl.viola.ems.payload.api.UserDetails;
import pl.viola.ems.service.modules.administrator.GroupService;
import pl.viola.ems.service.modules.administrator.UserService;
import pl.viola.ems.service.security.AcPermissionService;

import java.util.List;
import java.util.Optional;
import java.util.ResourceBundle;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GroupServiceImpl implements GroupService {
    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private AcPermissionService acPermissionService;

    private static final ResourceBundle bundle = ResourceBundle.getBundle("messages");

    @Override
    public List<Group> findAllGroups() {
        return groupRepository.findAll();
    }

    @Override
    public Optional<Group> findGroupByCode(String code) {
        return groupRepository.findByCode(code);
    }

    @Override
    public List<Group> findGroupsByUser(String username) {

        User user = userService.findByUsername(username)
                .orElseThrow(() ->  new AppException("Administrator.user.notFound", HttpStatus.BAD_REQUEST));

        return groupRepository.findByUsers(user);
    }

    @Override
    @Transactional
    public void saveGroup(Group group) {
        groupRepository.save(group);
    }

    @Override
    @Transactional
    public void saveGroupUsers(List<UserDetails> users, String groupCode) {
        List<String> usersNames = users.stream().map(user -> user.getUsername()).collect(Collectors.toList());
        List<User> newUsers = userService.findByUsernameIn(usersNames);
        Set<User> groupUsers = newUsers.stream().collect(Collectors.toSet());
        Optional<Group> group = Optional.ofNullable(groupRepository.findByCode(groupCode)
                .orElseThrow(() -> new AppException("Administrator.group.notFound", HttpStatus.BAD_REQUEST)));

        group.get().setUsers(groupUsers);
        groupRepository.save(group.get());
    }

    @Override
    @Transactional
    public void saveGroupPermissions(final List<AcPrivilege> privileges, final String groupCode, final Long acObjectId) {
        Optional<Group> group = Optional.ofNullable(groupRepository.findByCode(groupCode)
                .orElseThrow(() -> new AppException("Administrator.group.notFound", HttpStatus.BAD_REQUEST)));
        acPermissionService.saveObjectPermission(privileges, group.get(), acObjectId);
    }

    @Override
    @Transactional
    public String deleteGroup(String groupCode) {
        return groupRepository.findByCode(groupCode).map(group -> {
            groupRepository.deleteById(group.getId());
            return bundle.getString("Administrator.group.deleteGroup");
        }).orElseThrow(() ->new AppException("Administrator.group.notFound", HttpStatus.NOT_FOUND));
    }

}
